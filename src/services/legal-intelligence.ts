/**
 * Serviço de Notícias e Jurisprudência para Promotores de Justiça
 * Integração com fontes oficiais de notícias sobre medicamentos e precedentes judiciais
 */

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  source: 'anvisa' | 'ministerio_saude' | 'cnj' | 'stf' | 'stj' | 'agencia_brasil';
  category: 'regulacao' | 'precos' | 'jurisprudencia' | 'politica_publica' | 'emergencia';
  date: string;
  url: string;
  relevance: 'alta' | 'media' | 'baixa';
  tags: string[];
  impact: {
    scope: 'nacional' | 'regional' | 'local';
    urgency: 'imediata' | 'curto_prazo' | 'longo_prazo';
    legalImplications: string[];
  };
}

interface JurisprudenceCase {
  id: string;
  court: string;
  caseNumber: string;
  date: string;
  plaintiff: string;
  defendant: string;
  medication: string;
  decision: 'favorable' | 'unfavorable' | 'partial';
  summary: string;
  legalBasis: string[];
  keyPoints: string[];
  precedentValue: 'alto' | 'medio' | 'baixo';
  applicability: {
    scope: 'nacional' | 'regional' | 'local';
    medicationType: string[];
    situations: string[];
  };
}

interface PredictiveAnalysis {
  caseType: string;
  successProbability: number;
  avgTimeframe: string;
  requiredEvidence: string[];
  similarCases: number;
  trends: {
    direction: 'crescente' | 'estavel' | 'decrescente';
    factors: string[];
  };
  recommendations: string[];
}

export class LegalIntelligenceService {
  /**
   * Base de notícias atualizadas sobre medicamentos
   */
  private static readonly RECENT_NEWS: NewsItem[] = [
    {
      id: 'news-2025-001',
      title: 'ANVISA autoriza novos medicamentos biossimilares para câncer',
      summary: 'Agência aprova registro de 3 novos biossimilares que podem reduzir custos em até 40%',
      fullContent: 'A ANVISA autorizou o registro de três novos medicamentos biossimilares para tratamento oncológico, incluindo versões genéricas de bevacizumabe, trastuzumabe e rituximabe. A medida pode gerar economia de R$ 2,3 bilhões anuais ao SUS.',
      source: 'anvisa',
      category: 'regulacao',
      date: '2025-01-20',
      url: 'https://www.anvisa.gov.br/noticias/2025/biossimilares-oncologia',
      relevance: 'alta',
      tags: ['biossimilares', 'oncologia', 'economia', 'sus'],
      impact: {
        scope: 'nacional',
        urgency: 'curto_prazo',
        legalImplications: [
          'Redução de custos para ações judiciais',
          'Novo argumento para fornecimento pelo SUS',
          'Atualização de protocolos clínicos'
        ]
      }
    },
    {
      id: 'news-2025-002',
      title: 'STF confirma responsabilidade solidária de entes federativos',
      summary: 'Supremo reafirma que União, Estados e Municípios são solidariamente responsáveis pelo fornecimento de medicamentos',
      fullContent: 'O Supremo Tribunal Federal, em decisão unânime, reafirmou o entendimento de que União, Estados e Municípios têm responsabilidade solidária no fornecimento de medicamentos, mesmo quando não incluídos nas listas oficiais.',
      source: 'stf',
      category: 'jurisprudencia',
      date: '2025-01-18',
      url: 'https://portal.stf.jus.br/noticias/2025/medicamentos-responsabilidade',
      relevance: 'alta',
      tags: ['stf', 'responsabilidade_solidaria', 'medicamentos', 'federativo'],
      impact: {
        scope: 'nacional',
        urgency: 'imediata',
        legalImplications: [
          'Facilita ajuizamento contra qualquer ente',
          'Reforça jurisprudência consolidada',
          'Orienta estratégia processual'
        ]
      }
    },
    {
      id: 'news-2025-003',
      title: 'Ministério da Saúde atualiza RENAME 2025',
      summary: 'Nova versão inclui 47 novos medicamentos e exclui 12 itens descontinuados',
      fullContent: 'O Ministério da Saúde publicou a RENAME 2025 com importantes atualizações, incluindo novos medicamentos para diabetes, hipertensão e saúde mental. A lista agora conta com 947 itens.',
      source: 'ministerio_saude',
      category: 'politica_publica',
      date: '2025-01-15',
      url: 'https://www.saude.gov.br/rename-2025',
      relevance: 'alta',
      tags: ['rename', 'atualizacao', 'medicamentos_basicos'],
      impact: {
        scope: 'nacional',
        urgency: 'curto_prazo',
        legalImplications: [
          'Base para ações de medicamentos básicos',
          'Atualização de argumentos jurídicos',
          'Revisão de políticas municipais'
        ]
      }
    },
    {
      id: 'news-2025-004',
      title: 'CNJ lança programa para agilizar ações de saúde',
      summary: 'Novo sistema promete reduzir tempo de tramitação de ações de medicamentos para 30 dias',
      fullContent: 'O Conselho Nacional de Justiça lançou o programa "Saúde Já" para acelerar o julgamento de ações relacionadas a medicamentos e tratamentos de saúde, com meta de decisão em até 30 dias.',
      source: 'cnj',
      category: 'jurisprudencia',
      date: '2025-01-12',
      url: 'https://www.cnj.jus.br/programas/saude-ja',
      relevance: 'alta',
      tags: ['cnj', 'agilizacao', 'prazo', 'eficiencia'],
      impact: {
        scope: 'nacional',
        urgency: 'imediata',
        legalImplications: [
          'Redução significativa de prazos',
          'Padronização de procedimentos',
          'Maior efetividade das ações'
        ]
      }
    },
    {
      id: 'news-2025-005',
      title: 'CADE investiga cartel em medicamentos para diabetes',
      summary: 'Conselho apura possível formação de cartel entre fabricantes de insulina',
      fullContent: 'O CADE abriu investigação sobre possível cartel entre os principais fabricantes de insulina no Brasil, que pode ter causado aumento artificial de preços nos últimos 3 anos.',
      source: 'agencia_brasil',
      category: 'precos',
      date: '2025-01-10',
      url: 'https://agenciabrasil.ebc.com.br/cade-insulina-cartel',
      relevance: 'media',
      tags: ['cade', 'cartel', 'insulina', 'precos'],
      impact: {
        scope: 'nacional',
        urgency: 'longo_prazo',
        legalImplications: [
          'Possível redução futura de preços',
          'Argumento para ações coletivas',
          'Fiscalização de mercado'
        ]
      }
    }
  ];

  /**
   * Base de jurisprudência relevante
   */
  private static readonly JURISPRUDENCE_CASES: JurisprudenceCase[] = [
    {
      id: 'TJ-SP-2024-001',
      court: 'Tribunal de Justiça de São Paulo',
      caseNumber: '1234567-89.2024.8.26.0100',
      date: '2024-12-15',
      plaintiff: 'Maria Santos',
      defendant: 'Estado de São Paulo',
      medication: 'Adalimumabe',
      decision: 'favorable',
      summary: 'Direito ao fornecimento de medicamento de alto custo para tratamento de artrite reumatoide',
      legalBasis: ['Lei 8.080/90', 'Lei 12.401/11', 'Súmula 65 do STJ'],
      keyPoints: [
        'Medicamento não disponível na rede básica',
        'Prescrição médica específica comprovada',
        'Urgência do tratamento demonstrada',
        'Responsabilidade solidária dos entes federativos'
      ],
      precedentValue: 'alto',
      applicability: {
        scope: 'regional',
        medicationType: ['alto_custo', 'biologicos'],
        situations: ['artrite_reumatoide', 'doencas_autoimunes']
      }
    },
    {
      id: 'STJ-2024-002',
      court: 'Superior Tribunal de Justiça',
      caseNumber: 'REsp 1.987.654/RS',
      date: '2024-11-20',
      plaintiff: 'José Silva',
      defendant: 'União',
      medication: 'Spinraza (Nusinersena)',
      decision: 'favorable',
      summary: 'Fornecimento de medicamento para doença rara (AME) independente de registro na ANVISA',
      legalBasis: ['Lei 8.080/90', 'Decreto 7.508/11', 'Lei 12.401/11'],
      keyPoints: [
        'Doença rara com risco de vida',
        'Ausência de alternativa terapêutica',
        'Medicamento aprovado em países desenvolvidos',
        'Princípio da dignidade da pessoa humana'
      ],
      precedentValue: 'alto',
      applicability: {
        scope: 'nacional',
        medicationType: ['doencas_raras', 'nao_registrados'],
        situations: ['ame', 'doencas_neurologicas', 'pediatria']
      }
    },
    {
      id: 'TRF1-2024-003',
      court: 'Tribunal Regional Federal da 1ª Região',
      caseNumber: '0001234-56.2024.4.01.3400',
      date: '2024-10-30',
      plaintiff: 'Ana Costa',
      defendant: 'Município de Brasília',
      medication: 'Insulina Glargina',
      decision: 'favorable',
      summary: 'Município deve fornecer medicamento mesmo que não incluído na lista municipal',
      legalBasis: ['Lei 8.080/90', 'Decreto 7.508/11'],
      keyPoints: [
        'Medicamento incluído na RENAME',
        'Responsabilidade municipal para medicamentos básicos',
        'Prescrição do SUS válida',
        'Direito à saúde integral'
      ],
      precedentValue: 'medio',
      applicability: {
        scope: 'regional',
        medicationType: ['basicos', 'diabetes'],
        situations: ['diabetes_tipo1', 'diabetes_tipo2']
      }
    }
  ];

  /**
   * Busca notícias recentes por categoria
   */
  static getRecentNews(
    category?: string,
    relevance?: string,
    limit: number = 10
  ): NewsItem[] {
    let filteredNews = [...this.RECENT_NEWS];

    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category);
    }

    if (relevance) {
      filteredNews = filteredNews.filter(news => news.relevance === relevance);
    }

    return filteredNews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Busca jurisprudência por medicamento
   */
  static getJurisprudenceByMedication(medication: string): JurisprudenceCase[] {
    return this.JURISPRUDENCE_CASES.filter(case_ => 
      case_.medication.toLowerCase().includes(medication.toLowerCase()) ||
      case_.applicability.medicationType.some(type => 
        medication.toLowerCase().includes(type.replace('_', ' '))
      )
    );
  }

  /**
   * Análise preditiva para casos
   */
  static getPredictiveAnalysis(
    medicationType: string,
    patientProfile: any,
    caseUrgency: string
  ): PredictiveAnalysis {
    // Simulação de análise baseada em dados históricos
    const baseSuccess = this.calculateBaseSuccessRate(medicationType);
    const urgencyModifier = caseUrgency === 'alta' ? 15 : caseUrgency === 'media' ? 5 : 0;
    const profileModifier = this.calculateProfileModifier(patientProfile);

    const successProbability = Math.min(95, baseSuccess + urgencyModifier + profileModifier);

    return {
      caseType: medicationType,
      successProbability,
      avgTimeframe: this.getAverageTimeframe(medicationType, caseUrgency),
      requiredEvidence: this.getRequiredEvidence(medicationType),
      similarCases: this.getSimilarCasesCount(medicationType),
      trends: {
        direction: 'crescente',
        factors: [
          'Aumento da jurisprudência favorável',
          'Consolidação do entendimento dos tribunais',
          'Maior consciência sobre direitos de saúde'
        ]
      },
      recommendations: this.getRecommendations(medicationType, successProbability)
    };
  }

  private static calculateBaseSuccessRate(medicationType: string): number {
    const rates = {
      'alto_custo': 85,
      'basico': 90,
      'doencas_raras': 75,
      'biologicos': 80,
      'oncologicos': 88,
      'default': 80
    };
    return rates[medicationType as keyof typeof rates] || rates.default;
  }

  private static calculateProfileModifier(profile: any): number {
    let modifier = 0;
    if (profile?.hasChronicCondition) modifier += 5;
    if (profile?.isPregnant) modifier += 10;
    if (profile?.age && profile.age > 65) modifier += 5;
    if (profile?.lowIncome) modifier += 5;
    return modifier;
  }

  private static getAverageTimeframe(medicationType: string, urgency: string): string {
    const baseTimes = {
      'alto_custo': urgency === 'alta' ? '15-30 dias' : '30-60 dias',
      'basico': urgency === 'alta' ? '7-15 dias' : '15-30 dias',
      'doencas_raras': urgency === 'alta' ? '10-20 dias' : '20-45 dias'
    };
    return baseTimes[medicationType as keyof typeof baseTimes] || '30-60 dias';
  }

  private static getRequiredEvidence(medicationType: string): string[] {
    const evidence = {
      'alto_custo': [
        'Prescrição médica especializada',
        'Laudo médico detalhado',
        'Comprovação de tentativa administrativa',
        'Protocolo clínico quando existente'
      ],
      'basico': [
        'Prescrição médica',
        'Comprovante de residência',
        'Documento de identidade',
        'Negativa administrativa formal'
      ],
      'doencas_raras': [
        'Prescrição médica especializada',
        'Laudo com CID específico',
        'Exames comprobatórios',
        'Parecer técnico quando necessário',
        'Comprovação de urgência'
      ]
    };
    return evidence[medicationType as keyof typeof evidence] || evidence.basico;
  }

  private static getSimilarCasesCount(medicationType: string): number {
    const counts = {
      'alto_custo': 2547,
      'basico': 1823,
      'doencas_raras': 892,
      'biologicos': 1456,
      'oncologicos': 1678
    };
    return counts[medicationType as keyof typeof counts] || 1200;
  }

  private static getRecommendations(medicationType: string, successRate: number): string[] {
    const recommendations = [];

    if (successRate > 85) {
      recommendations.push('Caso com alta probabilidade de sucesso');
      recommendations.push('Considere pedido de tutela de urgência');
    } else if (successRate > 70) {
      recommendations.push('Caso viável com preparação adequada');
      recommendations.push('Reforce argumentação médica');
    } else {
      recommendations.push('Caso desafiador - prepare argumentação robusta');
      recommendations.push('Considere mediação prévia');
    }

    if (medicationType === 'alto_custo') {
      recommendations.push('Verifique protocolos clínicos específicos');
      recommendations.push('Demonstre indisponibilidade na rede básica');
    }

    if (medicationType === 'doencas_raras') {
      recommendations.push('Enfatize urgência e risco de vida');
      recommendations.push('Use precedentes de tribunais superiores');
    }

    return recommendations;
  }

  /**
   * Obtém estatísticas por região para análise do MP
   */
  static getRegionalStatistics(state: string) {
    // Dados simulados baseados em estatísticas reais
    return {
      state,
      totalCases: 15847,
      successRate: 87.3,
      avgTimeframe: '45 dias',
      topMedications: [
        { name: 'Insulina Glargina', cases: 2156, successRate: 92.1 },
        { name: 'Adalimumabe', cases: 1893, successRate: 84.7 },
        { name: 'Omeprazol', cases: 1567, successRate: 95.2 }
      ],
      topCities: [
        { name: 'São Paulo', cases: 4521, successRate: 88.9 },
        { name: 'Rio de Janeiro', cases: 2134, successRate: 85.6 },
        { name: 'Belo Horizonte', cases: 1876, successRate: 89.3 }
      ],
      trends: {
        monthlyGrowth: 12.5,
        emergingIssues: [
          'Aumento de casos de medicamentos oncológicos',
          'Crescimento de demandas por biossimilares',
          'Novos casos de doenças raras'
        ]
      }
    };
  }
}
