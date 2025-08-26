/**
 * Serviço de Integração com APIs Governamentais para Legislação de Medicamentos
 * Integra com Senado Federal, Câmara dos Deputados, Planalto e outras fontes oficiais
 */

interface LegislationItem {
  id: string;
  title: string;
  number: string;
  year: string;
  type: 'lei' | 'decreto' | 'portaria' | 'resolucao' | 'instrucao_normativa';
  status: 'vigente' | 'revogada' | 'suspensa';
  description: string;
  fullText: string;
  url: string;
  source: 'senado' | 'camara' | 'planalto' | 'anvisa' | 'ministerio_saude';
  lastUpdate: string;
  tags: string[];
  applicableFor: ('cidadao' | 'mp' | 'defensoria' | 'prefeitura' | 'assistencia_social')[];
  priority: 'alta' | 'media' | 'baixa';
  summary: string;
  relatedAgencies: string[];
  requirements: string[];
  scope: 'federal' | 'estadual' | 'municipal';
}

interface RecommendedAgency {
  name: string;
  type: 'prefeitura' | 'assistencia_social' | 'sus' | 'anvisa' | 'ministerio_saude' | 'defensoria' | 'mp';
  contact: string;
  services: string[];
  requirements: string[];
  timeframe: string;
  priority: number;
}

interface LegislationSearchParams {
  query?: string;
  type?: string[];
  status?: string[];
  scope?: string[];
  userType: 'cidadao' | 'mp' | 'defensoria';
  state?: string;
  city?: string;
}

export class LegislationAPIService {
  private static readonly APIS = {
    SENADO: 'https://legis.senado.leg.br/dadosabertos',
    CAMARA: 'https://dadosabertos.camara.leg.br/api/v2',
    PLANALTO: 'https://www4.planalto.gov.br/legislacao',
    ANVISA: 'https://consultas.anvisa.gov.br/api',
    MINISTERIO_SAUDE: 'https://datasus.saude.gov.br/api'
  };

  /**
   * Base de dados local com legislações essenciais sobre medicamentos gratuitos
   */
  private static readonly ESSENTIAL_LEGISLATION: LegislationItem[] = [
    {
      id: 'lei-8080-1990',
      title: 'Lei Orgânica da Saúde - SUS',
      number: '8.080',
      year: '1990',
      type: 'lei',
      status: 'vigente',
      description: 'Dispõe sobre as condições para a promoção, proteção e recuperação da saúde',
      fullText: 'Lei que estabelece o direito universal à saúde e medicamentos gratuitos pelo SUS',
      url: 'http://www.planalto.gov.br/ccivil_03/leis/l8080.htm',
      source: 'planalto',
      lastUpdate: '2024-12-01',
      tags: ['sus', 'saude_publica', 'medicamentos_gratuitos', 'direito_saude'],
      applicableFor: ['cidadao', 'mp', 'defensoria'],
      priority: 'alta',
      summary: 'Garante acesso universal e gratuito a medicamentos através do Sistema Único de Saúde',
      relatedAgencies: ['Ministério da Saúde', 'Secretarias Estaduais', 'Secretarias Municipais'],
      requirements: ['Prescrição médica', 'Cadastro no SUS'],
      scope: 'federal'
    },
    {
      id: 'lei-8142-1990',
      title: 'Lei de Participação Social no SUS',
      number: '8.142',
      year: '1990',
      type: 'lei',
      status: 'vigente',
      description: 'Dispõe sobre a participação da comunidade na gestão do SUS',
      fullText: 'Estabelece controle social e participação popular no SUS',
      url: 'http://www.planalto.gov.br/ccivil_03/leis/l8142.htm',
      source: 'planalto',
      lastUpdate: '2024-12-01',
      tags: ['controle_social', 'participacao_popular', 'conselhos_saude'],
      applicableFor: ['cidadao', 'mp', 'defensoria'],
      priority: 'media',
      summary: 'Permite participação cidadã nas decisões sobre medicamentos e políticas de saúde',
      relatedAgencies: ['Conselhos de Saúde', 'Ministério da Saúde'],
      requirements: ['Participação em conselhos'],
      scope: 'federal'
    },
    {
      id: 'portaria-3916-1998',
      title: 'Política Nacional de Medicamentos',
      number: '3.916',
      year: '1998',
      type: 'portaria',
      status: 'vigente',
      description: 'Estabelece a Política Nacional de Medicamentos',
      fullText: 'Define diretrizes para garantir segurança, eficácia e qualidade dos medicamentos',
      url: 'https://bvsms.saude.gov.br/bvs/saudelegis/gm/1998/prt3916_30_10_1998.html',
      source: 'ministerio_saude',
      lastUpdate: '2024-12-01',
      tags: ['politica_medicamentos', 'assistencia_farmaceutica', 'rename'],
      applicableFor: ['cidadao', 'mp', 'defensoria'],
      priority: 'alta',
      summary: 'Base legal para acesso a medicamentos essenciais gratuitos',
      relatedAgencies: ['ANVISA', 'Ministério da Saúde', 'Farmácias do SUS'],
      requirements: ['Prescrição médica', 'Medicamento na RENAME'],
      scope: 'federal'
    },
    {
      id: 'decreto-7508-2011',
      title: 'Regulamentação da Lei 8.080/90',
      number: '7.508',
      year: '2011',
      type: 'decreto',
      status: 'vigente',
      description: 'Regulamenta a Lei 8.080/90 dispondo sobre organização do SUS',
      fullText: 'Define responsabilidades dos entes federativos na assistência farmacêutica',
      url: 'http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm',
      source: 'planalto',
      lastUpdate: '2024-12-01',
      tags: ['regulamentacao_sus', 'assistencia_farmaceutica', 'responsabilidades'],
      applicableFor: ['mp', 'defensoria', 'cidadao'],
      priority: 'alta',
      summary: 'Define quem deve fornecer cada tipo de medicamento (municipal, estadual, federal)',
      relatedAgencies: ['União', 'Estados', 'Municípios', 'SUS'],
      requirements: ['Identificação da responsabilidade do ente federativo'],
      scope: 'federal'
    },
    {
      id: 'lei-12401-2011',
      title: 'Assistência Terapêutica e Medicamentos de Alto Custo',
      number: '12.401',
      year: '2011',
      type: 'lei',
      status: 'vigente',
      description: 'Altera a Lei 8.080/90 para dispor sobre assistência terapêutica',
      fullText: 'Garante acesso a medicamentos de alto custo pelo SUS',
      url: 'http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12401.htm',
      source: 'planalto',
      lastUpdate: '2024-12-01',
      tags: ['alto_custo', 'medicamentos_especiais', 'assistencia_terapeutica'],
      applicableFor: ['cidadao', 'mp', 'defensoria'],
      priority: 'alta',
      summary: 'Garante fornecimento de medicamentos de alto custo não disponíveis na rede básica',
      relatedAgencies: ['Secretarias Estaduais', 'CEAF', 'Ministério da Saúde'],
      requirements: ['Prescrição especializada', 'Protocolo clínico', 'LME/APAC'],
      scope: 'federal'
    },
    {
      id: 'resolucao-338-2004',
      title: 'Política Nacional de Assistência Farmacêutica',
      number: '338',
      year: '2004',
      type: 'resolucao',
      status: 'vigente',
      description: 'Aprova a Política Nacional de Assistência Farmacêutica',
      fullText: 'Estabelece diretrizes para assistência farmacêutica no SUS',
      url: 'https://bvsms.saude.gov.br/bvs/saudelegis/cns/2004/res0338_06_05_2004.html',
      source: 'ministerio_saude',
      lastUpdate: '2024-12-01',
      tags: ['assistencia_farmaceutica', 'politica_nacional', 'medicamentos_basicos'],
      applicableFor: ['cidadao', 'mp', 'defensoria'],
      priority: 'media',
      summary: 'Define como deve funcionar a distribuição de medicamentos no SUS',
      relatedAgencies: ['Farmácias do SUS', 'UBS', 'Secretarias de Saúde'],
      requirements: ['Prescrição médica', 'Cadastro na unidade de saúde'],
      scope: 'federal'
    }
  ];

  /**
   * Agências e órgãos recomendados por tipo de situação
   */
  private static readonly RECOMMENDED_AGENCIES: RecommendedAgency[] = [
    {
      name: 'Farmácia do SUS / UBS',
      type: 'sus',
      contact: 'Unidade Básica de Saúde mais próxima',
      services: ['Medicamentos básicos', 'Medicamentos da RENAME', 'Programa Farmácia Popular'],
      requirements: ['Prescrição médica', 'Cartão SUS', 'Comprovante de residência'],
      timeframe: 'Imediato a 30 dias',
      priority: 1
    },
    {
      name: 'Secretaria Municipal de Saúde',
      type: 'prefeitura',
      contact: 'Prefeitura local - Departamento de Saúde',
      services: ['Medicamentos básicos', 'Programas municipais', 'Cadastro no SUS'],
      requirements: ['Prescrição médica', 'Comprovante de residência', 'RG/CPF'],
      timeframe: '15 a 30 dias',
      priority: 2
    },
    {
      name: 'Centro de Referência de Assistência Social (CRAS)',
      type: 'assistencia_social',
      contact: 'CRAS do seu bairro',
      services: ['Cadastro Único', 'Benefícios sociais', 'Orientação sobre direitos'],
      requirements: ['Documentos pessoais', 'Comprovante de renda', 'Comprovante de residência'],
      timeframe: '30 a 45 dias',
      priority: 3
    },
    {
      name: 'Secretaria Estadual de Saúde - CEAF',
      type: 'sus',
      contact: 'Central Estadual de Abastecimento Farmacêutico',
      services: ['Medicamentos de alto custo', 'Medicamentos especializados', 'Tratamentos raros'],
      requirements: ['LME/APAC', 'Prescrição especializada', 'Protocolo clínico'],
      timeframe: '30 a 90 dias',
      priority: 4
    },
    {
      name: 'Defensoria Pública',
      type: 'defensoria',
      contact: 'Defensoria Pública do Estado',
      services: ['Ação judicial', 'Orientação jurídica', 'Mediação extrajudicial'],
      requirements: ['Documentos médicos', 'Comprovação de hipossuficiência', 'Negativa administrativa'],
      timeframe: '60 a 180 dias',
      priority: 5
    },
    {
      name: 'Ministério Público',
      type: 'mp',
      contact: 'Promotoria de Saúde Pública',
      services: ['Inquérito civil', 'TAC', 'Ação civil pública', 'Fiscalização'],
      requirements: ['Denúncia fundamentada', 'Documentos comprobatórios', 'Interesse coletivo'],
      timeframe: '90 a 365 dias',
      priority: 6
    }
  ];

  /**
   * Busca legislações específicas baseada nos parâmetros
   */
  static async searchLegislation(params: LegislationSearchParams): Promise<LegislationItem[]> {
    try {
      // Filtrar legislações essenciais baseado nos parâmetros
      let filteredLegislation = [...this.ESSENTIAL_LEGISLATION];

      // Filtrar por tipo de usuário
      filteredLegislation = filteredLegislation.filter(item => 
        item.applicableFor.includes(params.userType)
      );

      // Filtrar por query se fornecida
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredLegislation = filteredLegislation.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Filtrar por tipo se fornecido
      if (params.type && params.type.length > 0) {
        filteredLegislation = filteredLegislation.filter(item =>
          params.type!.includes(item.type)
        );
      }

      // Filtrar por status se fornecido
      if (params.status && params.status.length > 0) {
        filteredLegislation = filteredLegislation.filter(item =>
          params.status!.includes(item.status)
        );
      }

      // Ordenar por prioridade
      filteredLegislation.sort((a, b) => {
        const priorityOrder = { alta: 3, media: 2, baixa: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Tentar buscar dados atualizados das APIs externas (simulado)
      const externalData = await this.fetchExternalLegislation(params);
      
      return [...filteredLegislation, ...externalData];
    } catch (error) {
      console.error('Erro ao buscar legislação:', error);
      return this.ESSENTIAL_LEGISLATION;
    }
  }

  /**
   * Recomenda agências e órgãos baseado no perfil do usuário
   */
  static getRecommendedAgencies(
    userType: 'cidadao' | 'mp' | 'defensoria',
    medicationType: 'basico' | 'alto_custo' | 'especial' = 'basico',
    urgency: 'baixa' | 'media' | 'alta' = 'media'
  ): RecommendedAgency[] {
    let agencies = [...this.RECOMMENDED_AGENCIES];

    // Filtrar e priorizar baseado no tipo de usuário
    if (userType === 'cidadao') {
      // Para cidadãos, priorizar SUS e assistência social
      agencies = agencies.filter(agency => 
        ['sus', 'prefeitura', 'assistencia_social', 'defensoria'].includes(agency.type)
      );
    } else if (userType === 'mp') {
      // Para MP, mostrar todas as opções com foco em fiscalização
      agencies = agencies.map(agency => ({
        ...agency,
        priority: agency.type === 'mp' ? 1 : agency.priority + 1
      }));
    } else if (userType === 'defensoria') {
      // Para defensoria, priorizar caminhos administrativos antes do judicial
      agencies = agencies.map(agency => ({
        ...agency,
        priority: agency.type === 'defensoria' ? agency.priority + 2 : agency.priority
      }));
    }

    // Ajustar baseado no tipo de medicamento
    if (medicationType === 'alto_custo') {
      agencies = agencies.map(agency => ({
        ...agency,
        priority: agency.name.includes('CEAF') || agency.name.includes('Estadual') ? 
          Math.max(1, agency.priority - 2) : agency.priority
      }));
    }

    // Ajustar baseado na urgência
    if (urgency === 'alta') {
      agencies = agencies.map(agency => ({
        ...agency,
        priority: agency.type === 'defensoria' || agency.type === 'mp' ? 
          Math.max(1, agency.priority - 1) : agency.priority
      }));
    }

    return agencies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Busca dados atualizados de APIs externas (simulado para desenvolvimento)
   */
  private static async fetchExternalLegislation(params: LegislationSearchParams): Promise<LegislationItem[]> {
    // Em produção, aqui fariam as chamadas reais para as APIs
    // Por ora, retorna dados simulados baseados em legislações reais

    const externalMockData: LegislationItem[] = [
      {
        id: 'portaria-2084-2024',
        title: 'Atualização da RENAME 2024',
        number: '2.084',
        year: '2024',
        type: 'portaria',
        status: 'vigente',
        description: 'Atualiza a Relação Nacional de Medicamentos Essenciais',
        fullText: 'Lista atualizada dos medicamentos que devem ser fornecidos gratuitamente pelo SUS',
        url: 'https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt2084_15_08_2024.html',
        source: 'ministerio_saude',
        lastUpdate: '2024-08-15',
        tags: ['rename', 'medicamentos_essenciais', 'atualizacao_2024'],
        applicableFor: ['cidadao', 'mp', 'defensoria'],
        priority: 'alta',
        summary: 'Versão mais atual da lista de medicamentos que o SUS deve fornecer gratuitamente',
        relatedAgencies: ['Ministério da Saúde', 'ANVISA', 'Farmácias do SUS'],
        requirements: ['Prescrição médica', 'Medicamento listado na RENAME 2024'],
        scope: 'federal'
      }
    ];

    return externalMockData;
  }

  static generatePersonalizedReport(
    userType: 'cidadao' | 'mp' | 'defensoria',
    medicationInfo: {
      name?: string;
      condition?: string;
      urgency?: string;
      state?: string;
      city?: string;
    }
  ) {
    const legislation = this.ESSENTIAL_LEGISLATION.filter(item =>
      item.applicableFor.includes(userType)
    );

    const agencies = this.getRecommendedAgencies(userType);

    const report = {
      title: this.getReportTitle(userType),
      subtitle: this.getReportSubtitle(userType, medicationInfo),
      primaryLegislation: legislation.filter(item => item.priority === 'alta'),
      supportingLegislation: legislation.filter(item => item.priority === 'media'),
      recommendedAgencies: agencies.slice(0, 4), // Top 4 recomendações
      actionPlan: this.generateActionPlan(userType, agencies),
      legalTips: this.getLegalTips(userType),
      emergencyContacts: this.getEmergencyContacts(medicationInfo.state),
      generatedAt: new Date().toISOString(),
      disclaimer: this.getDisclaimer(userType)
    };

    return report;
  }

  private static getReportTitle(userType: string): string {
    const titles = {
      cidadao: '📋 Guia Completo: Seus Direitos a Medicamentos Gratuitos',
      mp: '⚖️ Relatório Jurídico: Base Legal para Ações de Medicamentos',
      defensoria: '🛡️ Manual de Atuação: Defesa do Direito à Saúde'
    };
    return titles[userType as keyof typeof titles];
  }

  private static getReportSubtitle(userType: string, medicationInfo: any): string {
    const base = medicationInfo.name ? 
      `Orientações específicas para: ${medicationInfo.name}` : 
      'Orientações gerais sobre acesso a medicamentos';

    return `${base} | Atualizado em ${new Date().toLocaleDateString('pt-BR')}`;
  }

  private static generateActionPlan(userType: string, agencies: RecommendedAgency[]): string[] {
    const plans = {
      cidadao: [
        '1. Tenha em mãos: receita médica, documentos pessoais e comprovante de residência',
        '2. Procure primeiro a UBS/Farmácia do SUS mais próxima',
        '3. Se não conseguir, vá à Secretaria Municipal de Saúde',
        '4. Para medicamentos de alto custo, procure a Secretaria Estadual (CEAF)',
        '5. Se negado administrativamente, procure a Defensoria Pública',
        '6. Mantenha registros de todas as tentativas e negativas'
      ],
      mp: [
        '1. Analise se há interesse coletivo ou individual homogêneo',
        '2. Verifique o cumprimento das políticas públicas pelo ente responsável',
        '3. Instaure inquérito civil se necessário',
        '4. Considere TAC antes de ação judicial',
        '5. Monitore o cumprimento das decisões judiciais',
        '6. Articule com outros MPs para casos similares'
      ],
      defensoria: [
        '1. Verifique a hipossuficiência do assistido',
        '2. Analise se houve tentativa administrativa prévia',
        '3. Identifique o ente responsável pelo fornecimento',
        '4. Tente solução extrajudicial primeiro',
        '5. Se necessário, ajuíze ação com pedido de tutela de urgência',
        '6. Acompanhe o cumprimento da decisão judicial'
      ]
    };
    return plans[userType as keyof typeof plans];
  }

  private static getLegalTips(userType: string): string[] {
    const tips = {
      cidadao: [
        '💡 O SUS deve fornecer TODOS os medicamentos da RENAME gratuitamente',
        '📋 Guarde sempre os comprovantes de tentativas de obtenção do medicamento',
        '⏰ Medicamentos de urgência podem ser obtidos via liminar judicial',
        '🏥 Conheça seus direitos: tratamento integral é garantido por lei',
        '📞 Use os canais de ouvidoria para reclamações sobre negativas'
      ],
      mp: [
        '⚖️ Lei 8.080/90 garante integralidade da assistência farmacêutica',
        '📊 Monitore indicadores de acesso a medicamentos em sua comarca',
        '🎯 Foque em políticas públicas estruturantes, não apenas casos individuais',
        '🤝 Articule com gestores para melhorar os fluxos de fornecimento',
        '📈 Acompanhe execução orçamentária da assistência farmacêutica'
      ],
      defensoria: [
        '⚡ Tutelas de urgência são cabíveis em casos de risco de vida',
        '📋 Comprove sempre a negativa administrativa prévia',
        '💰 Medicamentos de alto custo: responsabilidade primária dos estados',
        '🏛️ Medicamentos básicos: responsabilidade dos municípios',
        '📞 Use mediação antes do ajuizamento quando possível'
      ]
    };
    return tips[userType as keyof typeof tips];
  }

  private static getEmergencyContacts(state?: string): any {
    return {
      ouvidoriaSUS: '136',
      disqueSaude: '136',
      anvisa: '0800 642 9782',
      defensoriaPublica: '129',
      ministerioPublico: 'Varia por estado',
      note: 'Números válidos para todo território nacional'
    };
  }

  private static getDisclaimer(userType: string): string {
    const disclaimers = {
      cidadao: 'Este guia tem caráter informativo. Para orientação jurídica específica, procure a Defensoria Pública ou advogado.',
      mp: 'As informações apresentadas devem ser complementadas com análise do caso concreto e legislação local aplicável.',
      defensoria: 'Orientações gerais que devem ser adaptadas às especificidades de cada caso e jurisdição.'
    };
    return disclaimers[userType as keyof typeof disclaimers];
  }
}
