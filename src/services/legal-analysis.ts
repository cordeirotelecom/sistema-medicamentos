import { MedicationRequest } from '@/types';

export interface LegalAnalysis {
  hasRight: boolean;
  confidence: 'high' | 'medium' | 'low';
  legalBasis: string[];
  reasoning: string;
  requiredDocuments: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  } | null;
  urgencyJustification?: string;
}

export class LegalAnalysisService {
  // Base legal atualizada (2024-2025)
  private static readonly LEGAL_FRAMEWORK = {
    constitution: {
      article196: 'CF/88, Art. 196 - A saúde é direito de todos e dever do Estado',
      article197: 'CF/88, Art. 197 - Ações e serviços públicos de saúde integram rede regionalizada'
    },
    laws: {
      sus: 'Lei 8.080/90 - Lei Orgânica da Saúde (SUS)',
      rename: 'Portaria GM/MS nº 3.916/98 - Política Nacional de Medicamentos',
      ceaf: 'Portaria GM/MS nº 2.981/09 - Componente Especializado da Assistência Farmacêutica',
      farmaciaPopular: 'Lei 10.858/04 - Programa Farmácia Popular do Brasil',
      judicializacao: 'STF - Tema 793 - Direito à saúde e fornecimento de medicamentos'
    },
    recent: {
      marco2024: 'Lei 14.821/24 - Marco Legal da Assistência Farmacêutica',
      resolucao2024: 'Resolução CIT nº 07/24 - Atualização de protocolos de acesso',
      portaria2025: 'Portaria SCTIE/MS nº 15/25 - Novos critérios de incorporação'
    }
  };

  static async analyzeRights(request: MedicationRequest): Promise<LegalAnalysis> {
    const analysis: LegalAnalysis = {
      hasRight: false,
      confidence: 'medium',
      legalBasis: [],
      reasoning: '',
      requiredDocuments: [],
      estimatedCost: null
    };

    // Análise baseada no tipo de problema
    switch (request.issueType) {
      case 'shortage':
        return this.analyzeShortageRights(request);
      case 'accessibility':
        return this.analyzeAccessibilityRights(request);
      case 'price':
        return this.analyzePriceRights(request);
      case 'quality':
        return this.analyzeQualityRights(request);
      case 'adverse_reaction':
        return this.analyzeAdverseReactionRights(request);
      case 'registration':
        return this.analyzeRegistrationRights(request);
      case 'import':
        return this.analyzeImportRights(request);
      default:
        return this.analyzeGeneralRights(request);
    }
  }

  private static analyzeShortageRights(request: MedicationRequest): LegalAnalysis {
    const isCitizen = request.patientInfo?.isBrazilianCitizen ?? true;
    const hasChronicCondition = request.patientInfo?.hasChronicCondition ?? false;
    const isPregnant = request.patientInfo?.isPregnant ?? false;
    const isUrgent = request.urgency === 'emergency' || request.urgency === 'high';

    return {
      hasRight: isCitizen || isUrgent, // Estrangeiros têm direito em emergências
      confidence: isCitizen ? 'high' : 'medium',
      legalBasis: [
        this.LEGAL_FRAMEWORK.constitution.article196,
        this.LEGAL_FRAMEWORK.laws.sus,
        this.LEGAL_FRAMEWORK.laws.rename,
        this.LEGAL_FRAMEWORK.recent.marco2024
      ],
      reasoning: `${isCitizen ? 'Como cidadão brasileiro, você' : 'Mesmo sendo estrangeiro, você'} tem direito constitucional à saúde. ${hasChronicCondition ? 'Sua condição crônica' : 'A falta do medicamento'} ${isPregnant ? 'e sua gravidez garantem' : 'garante'} prioridade no atendimento. O SUS deve fornecer medicamentos essenciais gratuitamente. ${isUrgent ? 'A urgência do caso justifica ação judicial imediata se necessário.' : 'Caso o medicamento não esteja disponível, você pode solicitar através do Componente Especializado da Assistência Farmacêutica (CEAF).'}`,
      requiredDocuments: [
        'Documento de identificação (RG, CPF ou passaporte)',
        'Cartão SUS ou comprovante de cadastro',
        'Prescrição médica com CID-10',
        'Relatório médico justificando a necessidade',
        'Comprovante de residência',
        ...(hasChronicCondition ? ['Laudos comprovando condição crônica'] : []),
        ...(isPregnant ? ['Cartão pré-natal ou atestado médico de gravidez'] : [])
      ],
      estimatedCost: null, // Gratuito pelo SUS
      urgencyJustification: isUrgent ? 'Casos urgentes podem ter tramitação judicial acelerada conforme jurisprudência do STF.' : undefined
    };
  }

  private static analyzeAccessibilityRights(request: MedicationRequest): LegalAnalysis {
    const isCitizen = request.patientInfo?.isBrazilianCitizen ?? true;
    const hasChronicCondition = request.patientInfo?.hasChronicCondition ?? false;

    return {
      hasRight: true, // Todos têm direito ao acesso
      confidence: 'high',
      legalBasis: [
        this.LEGAL_FRAMEWORK.constitution.article196,
        this.LEGAL_FRAMEWORK.laws.sus,
        this.LEGAL_FRAMEWORK.laws.ceaf,
        this.LEGAL_FRAMEWORK.laws.farmaciaPopular,
        this.LEGAL_FRAMEWORK.recent.resolucao2024
      ],
      reasoning: `O acesso a medicamentos é direito fundamental garantido pela Constituição Federal. Você tem direito a: 1) Medicamentos básicos gratuitos pelo SUS; 2) Medicamentos especializados pelo CEAF; 3) Medicamentos do Programa Farmácia Popular com desconto; 4) Medicamentos de alto custo através de processos administrativos ou judiciais. ${hasChronicCondition ? 'Sua condição crônica garante prioridade e acesso facilitado.' : ''} ${!isCitizen ? 'Estrangeiros residentes também têm direito ao SUS.' : ''}`,
      requiredDocuments: [
        'Documento de identificação',
        'Cartão SUS',
        'Prescrição médica atualizada',
        'Exames que comprovem a necessidade',
        'Comprovante de renda (para alguns programas)',
        'Relatório de tentativa de acesso prévia'
      ],
      estimatedCost: {
        min: 0,
        max: 100,
        currency: 'BRL'
      }
    };
  }

  private static analyzePriceRights(request: MedicationRequest): LegalAnalysis {
    return {
      hasRight: true,
      confidence: 'high',
      legalBasis: [
        'CDC - Código de Defesa do Consumidor',
        'Lei 8.137/90 - Crimes contra a ordem econômica',
        'CMED - Câmara de Regulação do Mercado de Medicamentos',
        this.LEGAL_FRAMEWORK.laws.farmaciaPopular
      ],
      reasoning: 'Você tem direito a medicamentos com preços justos e regulamentados. A CMED estabelece preços máximos para medicamentos. Práticas abusivas como cartel ou preços excessivos são crime. Você pode: 1) Denunciar ao PROCON; 2) Buscar alternativas no Farmácia Popular; 3) Solicitar medicamento genérico mais barato; 4) Recorrer ao SUS se elegível.',
      requiredDocuments: [
        'Comprovantes de preços em diferentes farmácias',
        'Nota fiscal da compra',
        'Prescrição médica',
        'Pesquisa de preços online (print de sites)'
      ],
      estimatedCost: {
        min: 0,
        max: 50,
        currency: 'BRL'
      }
    };
  }

  private static analyzeQualityRights(request: MedicationRequest): LegalAnalysis {
    return {
      hasRight: true,
      confidence: 'high',
      legalBasis: [
        'Lei 6.360/76 - Vigilância Sanitária',
        'CDC - Direito à segurança e qualidade',
        'RDC ANVISA nº 301/19 - Boas práticas de fabricação',
        this.LEGAL_FRAMEWORK.recent.marco2024
      ],
      reasoning: 'Você tem direito a medicamentos seguros e de qualidade. Problemas de qualidade devem ser reportados imediatamente à ANVISA. Você tem direito a: 1) Troca imediata do produto; 2) Reembolso integral; 3) Indenização por danos; 4) Atendimento médico em caso de reação adversa. A empresa é responsável pelos danos causados.',
      requiredDocuments: [
        'Medicamento com defeito (se possível)',
        'Embalagem original com lote e validade',
        'Nota fiscal de compra',
        'Fotos do problema',
        'Relatório médico se houve consequências'
      ],
      estimatedCost: null
    };
  }

  private static analyzeAdverseReactionRights(request: MedicationRequest): LegalAnalysis {
    const isUrgent = request.urgency === 'emergency' || request.urgency === 'high';

    return {
      hasRight: true,
      confidence: 'high',
      legalBasis: [
        'RDC ANVISA nº 4/09 - Farmacovigilância',
        'CDC - Responsabilidade por danos',
        'CF/88 - Direito à saúde e segurança',
        this.LEGAL_FRAMEWORK.recent.portaria2025
      ],
      reasoning: `Reações adversas graves devem ser notificadas obrigatoriamente. Você tem direito a: 1) Atendimento médico imediato e gratuito; 2) Medicamento alternativo; 3) Indenização se comprovado nexo causal; 4) Acompanhamento médico especializado. ${isUrgent ? 'Em casos graves, procure atendimento de emergência imediatamente.' : 'Notifique à ANVISA para proteger outros pacientes.'}`,
      requiredDocuments: [
        'Relatório médico detalhado da reação',
        'Medicamento que causou a reação',
        'Prescrição médica original',
        'Exames médicos relacionados',
        'Histórico médico do paciente'
      ],
      estimatedCost: null,
      urgencyJustification: isUrgent ? 'Reações adversas graves são emergência médica com direito a atendimento imediato pelo SUS.' : undefined
    };
  }

  private static analyzeRegistrationRights(request: MedicationRequest): LegalAnalysis {
    return {
      hasRight: false,
      confidence: 'high',
      legalBasis: [
        'Lei 6.360/76 - Controle sanitário',
        'RDC ANVISA nº 200/17 - Registro de medicamentos'
      ],
      reasoning: 'Medicamentos não registrados não podem ser comercializados no Brasil por questões de segurança. Porém, você pode: 1) Verificar se existe medicamento similar registrado; 2) Solicitar importação para uso pessoal via ANVISA; 3) Participar de programas de acesso expandido; 4) Buscar tratamento em centros de pesquisa autorizados.',
      requiredDocuments: [
        'Prescrição médica justificando a necessidade',
        'Relatório médico detalhado',
        'Comprovação de inexistência de alternativa registrada'
      ],
      estimatedCost: {
        min: 200,
        max: 2000,
        currency: 'BRL'
      }
    };
  }

  private static analyzeImportRights(request: MedicationRequest): LegalAnalysis {
    const isUrgent = request.urgency === 'emergency' || request.urgency === 'high';

    return {
      hasRight: true,
      confidence: 'medium',
      legalBasis: [
        'RDC ANVISA nº 81/08 - Importação para uso próprio',
        'Instrução Normativa RFB nº 1.059/10',
        this.LEGAL_FRAMEWORK.recent.marco2024
      ],
      reasoning: `Você pode importar medicamentos para uso pessoal seguindo regras específicas: 1) Prescrição médica obrigatória; 2) Quantidade limitada (até 6 meses de tratamento); 3) Medicamento deve ser para uso próprio; 4) Alguns medicamentos precisam autorização especial da ANVISA. ${isUrgent ? 'Casos urgentes podem ter tramitação prioritária.' : 'O processo normal demora 30-60 dias.'}`,
      requiredDocuments: [
        'Prescrição médica com justificativa',
        'Relatório médico detalhado',
        'CPF e documento de identidade',
        'Formulário de solicitação ANVISA',
        'Comprovante de inexistência no mercado nacional'
      ],
      estimatedCost: {
        min: 100,
        max: 1000,
        currency: 'BRL'
      },
      urgencyJustification: isUrgent ? 'Casos urgentes podem solicitar tramitação prioritária na ANVISA.' : undefined
    };
  }

  private static analyzeGeneralRights(request: MedicationRequest): LegalAnalysis {
    const isCitizen = request.patientInfo?.isBrazilianCitizen ?? true;

    return {
      hasRight: isCitizen,
      confidence: 'medium',
      legalBasis: [
        this.LEGAL_FRAMEWORK.constitution.article196,
        this.LEGAL_FRAMEWORK.laws.sus
      ],
      reasoning: isCitizen 
        ? 'Como cidadão brasileiro, você tem direito constitucional à saúde. Consulte os órgãos competentes para orientação específica sobre seu caso.'
        : 'Estrangeiros têm direito a atendimento de emergência pelo SUS. Para outros casos, consulte sua situação migratória.',
      requiredDocuments: [
        'Documento de identificação',
        'Prescrição médica',
        'Relatório médico'
      ],
      estimatedCost: null
    };
  }
}
