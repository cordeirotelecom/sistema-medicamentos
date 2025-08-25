import { MedicationRequest, Recommendation, GovernmentAgency, RecommendationStep } from '@/types';
import { governmentAgencies } from '@/data/agencies';
import { GovernmentAPIService } from './government-api';
import { LegalAnalysisService, type LegalAnalysis } from './legal-analysis';

export class RecommendationService {
  static async generateRecommendation(request: MedicationRequest): Promise<Recommendation & {
    legalAnalysis: LegalAnalysis;
    mpeRecommendation?: {
      recommended: boolean;
      reason: string;
      stateAgency: GovernmentAgency | null;
    }
  }> {
    // Determina o órgão principal baseado no tipo de problema
    const primaryAgency = this.getPrimaryAgencyByIssue(request.issueType);
    
    // Determina órgãos secundários que podem ajudar
    const secondaryAgencies = this.getSecondaryAgencies(request, primaryAgency);
    
    // Análise de direitos baseada na legislação
    const legalAnalysis = await LegalAnalysisService.analyzeRights(request);
    
    // Análise de recomendação do MPE
    const mpeRecommendation = this.analyzeMPERecommendation(request, legalAnalysis);
    
    // Adiciona MPE aos órgãos secundários se recomendado
    const finalSecondaryAgencies = mpeRecommendation.recommended 
      ? [...secondaryAgencies, mpeRecommendation.stateAgency!].filter(Boolean)
      : secondaryAgencies;
    
    // Gera os passos de recomendação
    const steps = await this.generateSteps(request, primaryAgency, finalSecondaryAgencies, mpeRecommendation);
    
    // Estima o tempo de resolução
    const estimatedTime = this.estimateResolutionTime(request, primaryAgency);
    
    // Informações adicionais baseadas no contexto
    const additionalInfo = this.generateAdditionalInfo(request, legalAnalysis);

    return {
      primaryAgency,
      secondaryAgencies: finalSecondaryAgencies,
      steps,
      estimatedTime,
      urgencyLevel: request.urgency,
      additionalInfo,
      legalAnalysis,
      mpeRecommendation
    };
  }

  private static analyzeMPERecommendation(request: MedicationRequest, legalAnalysis: LegalAnalysis): {
    recommended: boolean;
    reason: string;
    stateAgency: GovernmentAgency | null;
  } {
    const mpe = governmentAgencies.find(agency => agency.id === 'mpe');
    
    // Critérios para recomendar MPE
    const shouldRecommendMPE = 
      // Casos onde há direito confirmado mas possível resistência dos órgãos
      legalAnalysis.hasRight ||
      // Casos de emergência ou alta urgência
      request.urgency === 'emergency' || request.urgency === 'high' ||
      // Problemas de acesso para condições crônicas
      (request.issueType === 'accessibility' && request.patientInfo?.hasChronicCondition) ||
      // Problemas de falta de medicamento para gestantes
      (request.issueType === 'shortage' && request.patientInfo?.isPregnant) ||
      // Questões de direito à saúde negado
      ['shortage', 'accessibility'].includes(request.issueType);

    let reason = '';
    if (shouldRecommendMPE) {
      if (legalAnalysis.hasRight) {
        reason = 'O MPE pode ajudar a garantir seus direitos constitucionais à saúde quando outros órgãos não respondem adequadamente.';
      } else if (request.urgency === 'emergency') {
        reason = 'Em casos de emergência, o MPE pode atuar rapidamente para garantir o acesso ao medicamento.';
      } else if (request.patientInfo?.hasChronicCondition || request.patientInfo?.isPregnant) {
        reason = 'O MPE tem competência especial para defender direitos de grupos vulneráveis como pacientes crônicos e gestantes.';
      } else {
        reason = 'O MPE pode auxiliar na defesa dos seus direitos à saúde e acesso a medicamentos.';
      }
    }

    return {
      recommended: shouldRecommendMPE,
      reason,
      stateAgency: shouldRecommendMPE ? mpe || null : null
    };
  }

  private static getPrimaryAgencyByIssue(issueType: string): GovernmentAgency {
    const agencyMap: { [key: string]: string } = {
      'quality': 'anvisa',
      'adverse_reaction': 'anvisa',
      'registration': 'anvisa',
      'import': 'anvisa',
      'shortage': 'ms',
      'accessibility': 'ms',
      'price': 'cade'
    };

    const agencyId = agencyMap[issueType] || 'anvisa';
    return governmentAgencies.find(agency => agency.id === agencyId) || governmentAgencies[0];
  }

  private static getSecondaryAgencies(request: MedicationRequest, primaryAgency: GovernmentAgency): GovernmentAgency[] {
    const secondaryAgencies: GovernmentAgency[] = [];

    // Adiciona PROCON para questões de consumo
    if (['price', 'quality', 'accessibility'].includes(request.issueType)) {
      const procon = governmentAgencies.find(agency => agency.id === 'procon');
      if (procon && procon.id !== primaryAgency.id) {
        secondaryAgencies.push(procon);
      }
    }

    // Adiciona Ministério da Saúde para questões de acesso
    if (['shortage', 'accessibility'].includes(request.issueType) && primaryAgency.id !== 'ms') {
      const ms = governmentAgencies.find(agency => agency.id === 'ms');
      if (ms) {
        secondaryAgencies.push(ms);
      }
    }

    // Adiciona MPT para questões de saúde pública grave
    if (request.urgency === 'emergency' || request.urgency === 'high') {
      const mpt = governmentAgencies.find(agency => agency.id === 'mpt');
      if (mpt && !secondaryAgencies.find(agency => agency.id === 'mpt')) {
        secondaryAgencies.push(mpt);
      }
    }

    return secondaryAgencies;
  }

  private static async generateSteps(
    request: MedicationRequest, 
    primaryAgency: GovernmentAgency, 
    secondaryAgencies: GovernmentAgency[],
    mpeRecommendation?: {
      recommended: boolean;
      reason: string;
      stateAgency: GovernmentAgency | null;
    }
  ): Promise<RecommendationStep[]> {
    const steps: RecommendationStep[] = [];

    // Passo 1: Coleta de informações
    steps.push({
      order: 1,
      title: 'Colete todas as informações necessárias',
      description: 'Reúna toda a documentação relacionada ao problema com o medicamento.',
      agency: 'Preparação',
      documents: this.getRequiredDocuments(request, primaryAgency),
      estimatedTime: '1-2 horas'
    });

    // Passo 2: Verificação de registro (se aplicável)
    if (['quality', 'adverse_reaction'].includes(request.issueType)) {
      steps.push({
        order: 2,
        title: 'Verifique o registro do medicamento',
        description: 'Confirme se o medicamento está registrado na ANVISA.',
        agency: 'ANVISA',
        links: [
          {
            name: 'Consulta de Medicamentos Registrados',
            url: 'https://consultas.anvisa.gov.br/#/medicamentos/',
            description: 'Verifique o registro do medicamento',
            isMainService: true
          }
        ],
        estimatedTime: '15-30 minutos'
      });
    }

    // Passo 3: Abertura do processo no órgão principal
    steps.push({
      order: steps.length + 1,
      title: `Abra um processo/denúncia na ${primaryAgency.acronym}`,
      description: this.getProcessDescription(request, primaryAgency),
      agency: primaryAgency.acronym,
      documents: primaryAgency.documentsRequired,
      links: primaryAgency.onlineServices.filter(service => service.isMainService),
      estimatedTime: primaryAgency.processingTime
    });

    // Passo 4: Processos em órgãos secundários (exceto MPE)
    secondaryAgencies.filter(agency => agency.id !== 'mpe').forEach((agency, index) => {
      steps.push({
        order: steps.length + 1,
        title: `Considere também procurar ${agency.acronym}`,
        description: `Para reforçar sua solicitação ou obter suporte adicional, você pode também procurar ${agency.name}.`,
        agency: agency.acronym,
        documents: agency.documentsRequired,
        links: agency.onlineServices.filter(service => service.isMainService),
        estimatedTime: agency.processingTime
      });
    });

    // Passo especial: MPE (se recomendado)
    if (mpeRecommendation?.recommended && mpeRecommendation.stateAgency) {
      steps.push({
        order: steps.length + 1,
        title: `Procure o Ministério Público Estadual (MPE)`,
        description: `${mpeRecommendation.reason} O MPE pode atuar para garantir seus direitos constitucionais à saúde.`,
        agency: 'MPE',
        documents: mpeRecommendation.stateAgency.documentsRequired,
        links: mpeRecommendation.stateAgency.onlineServices.filter(service => service.isMainService),
        estimatedTime: mpeRecommendation.stateAgency.processingTime
      });
    }

    // Passo final: Acompanhamento
    steps.push({
      order: steps.length + 1,
      title: 'Acompanhe o andamento',
      description: 'Mantenha-se informado sobre o status da sua solicitação e forneça informações adicionais se solicitado.',
      agency: 'Acompanhamento',
      estimatedTime: 'Contínuo'
    });

    return steps;
  }

  private static getRequiredDocuments(request: MedicationRequest, primaryAgency: GovernmentAgency): string[] {
    const baseDocuments = [
      'Documento de identificação (RG ou CPF)',
      'Comprovante de residência'
    ];

    const issueSpecificDocs: { [key: string]: string[] } = {
      'quality': [
        'Embalagem original do medicamento',
        'Nota fiscal de compra',
        'Fotos do problema (se visível)',
        'Laudo técnico (se disponível)'
      ],
      'adverse_reaction': [
        'Prescrição médica',
        'Relatório médico sobre a reação',
        'Medicamento (se ainda houver)',
        'Exames médicos relacionados'
      ],
      'shortage': [
        'Prescrição médica',
        'Comprovante de tentativa de compra',
        'Relatório médico sobre necessidade'
      ],
      'price': [
        'Comprovantes de preços em diferentes estabelecimentos',
        'Nota fiscal',
        'Prescrição médica'
      ]
    };

    return [
      ...baseDocuments,
      ...(issueSpecificDocs[request.issueType] || [])
    ];
  }

  private static getProcessDescription(request: MedicationRequest, agency: GovernmentAgency): string {
    const descriptions: { [key: string]: string } = {
      'anvisa': `Abra um processo de ${this.getAnvisaProcessType(request.issueType)} através do sistema de peticionamento eletrônico da ANVISA.`,
      'ms': 'Entre em contato com o Ministério da Saúde através dos canais oficiais para relatar o problema de acesso ao medicamento.',
      'cade': 'Formalize uma denúncia junto ao CADE sobre práticas anticompetitivas ou preços abusivos.',
      'procon': 'Registre uma reclamação no PROCON sobre o problema de consumo relacionado ao medicamento.',
      'mpt': 'Comunique ao Ministério Público sobre a questão de saúde pública relacionada ao medicamento.',
      'mpe': 'Formalize uma representação junto ao Ministério Público Estadual sobre violação dos seus direitos à saúde.'
    };

    return descriptions[agency.id] || 'Siga os procedimentos padrão do órgão para abertura de processo.';
  }

  private static getAnvisaProcessType(issueType: string): string {
    const processTypes: { [key: string]: string } = {
      'quality': 'denúncia de qualidade',
      'adverse_reaction': 'notificação de evento adverso',
      'registration': 'consulta sobre registro',
      'import': 'solicitação de importação'
    };

    return processTypes[issueType] || 'solicitação';
  }

  private static estimateResolutionTime(request: MedicationRequest, primaryAgency: GovernmentAgency): string {
    const urgencyMultiplier: { [key: string]: number } = {
      'emergency': 0.25,
      'high': 0.5,
      'medium': 1,
      'low': 1.5
    };

    const baseTime = primaryAgency.processingTime;
    const multiplier = urgencyMultiplier[request.urgency] || 1;

    if (request.urgency === 'emergency') {
      return '1 a 5 dias úteis (urgência máxima)';
    } else if (request.urgency === 'high') {
      return '5 a 15 dias úteis (alta prioridade)';
    }

    return baseTime;
  }

  private static generateAdditionalInfo(request: MedicationRequest, legalAnalysis: LegalAnalysis): string {
    let info = '';

    // Informações sobre direitos legais
    if (legalAnalysis.hasRight) {
      info += `✅ SEUS DIREITOS: Você tem direito legal ao que está solicitando conforme a legislação brasileira. `;
      info += 'Os serviços de saúde pública são gratuitos conforme o SUS. ';
    } else {
      info += '⚠️ ATENÇÃO: Este caso pode não se enquadrar nos direitos garantidos, mas ainda vale buscar orientação. ';
    }

    // Informações específicas do paciente
    if (request.patientInfo?.hasChronicCondition) {
      info += 'Como se trata de um paciente com condição crônica, mencione isso na sua solicitação para dar maior prioridade ao caso. ';
    }

    if (request.patientInfo?.isPregnant) {
      info += 'Gestantes têm prioridade especial nos atendimentos de saúde - certifique-se de informar esta condição. ';
    }

    if (request.urgency === 'emergency') {
      info += 'Em casos de emergência, procure também atendimento médico imediato e mantenha todos os registros para a denúncia. ';
    }

    if (!request.patientInfo?.isBrazilianCitizen) {
      info += 'Estrangeiros também têm direito ao atendimento no SUS e podem fazer denúncias aos órgãos competentes. ';
    }

    // Base legal
    if (legalAnalysis.legalBasis.length > 0) {
      info += `\n\n📋 BASE LEGAL: ${legalAnalysis.legalBasis.slice(0, 2).join(', ')}.`;
    }

    return info || 'Mantenha sempre cópias de todos os documentos enviados e protocolos de atendimento.';
  }
}
