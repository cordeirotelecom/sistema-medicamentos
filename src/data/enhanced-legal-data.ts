// Dados expandidos de legislações brasileiras para saúde e direitos do consumidor

export const brazilianHealthLaws = [
  {
    id: 'lei-8080-90',
    title: 'Lei 8.080/90',
    name: 'Lei Orgânica da Saúde',
    description: 'Dispõe sobre as condições para a promoção, proteção e recuperação da saúde',
    articles: [
      { number: '2º', text: 'A saúde é um direito fundamental do ser humano' },
      { number: '6º', text: 'Estão incluídas no campo de atuação do SUS a assistência terapêutica integral, inclusive farmacêutica' },
      { number: '19-M', text: 'A assistência farmacêutica no SUS compreende todo medicamento' }
    ],
    applicableScenarios: ['medicamento_sus', 'negativa_cobertura_sus', 'acesso_medicamento'],
    successRate: 89,
    cases: 445
  },
  {
    id: 'lei-9656-98',
    title: 'Lei 9.656/98',
    name: 'Lei dos Planos de Saúde',
    description: 'Dispõe sobre os planos e seguros privados de assistência à saúde',
    articles: [
      { number: '12', text: 'São facultativas as seguintes coberturas' },
      { number: '35-C', text: 'É obrigatória a cobertura do atendimento nos casos de emergência' },
      { number: '35-F', text: 'A cobertura das doenças listadas na Classificação Internacional de Doenças da OMS é obrigatória' }
    ],
    applicableScenarios: ['plano_saude_negativa', 'cobertura_medicamento', 'procedimento_negado'],
    successRate: 85,
    cases: 389
  },
  {
    id: 'lei-9782-99',
    title: 'Lei 9.782/99',
    name: 'Lei da ANVISA',
    description: 'Define o Sistema Nacional de Vigilância Sanitária e cria a ANVISA',
    articles: [
      { number: '8º', text: 'Incumbe à Agência promover a proteção da saúde da população' },
      { number: '8º, §1º', text: 'Regulamentar, controlar e fiscalizar os produtos de interesse da saúde' }
    ],
    applicableScenarios: ['medicamento_falsificado', 'irregularidade_sanitaria', 'qualidade_medicamento'],
    successRate: 78,
    cases: 298
  },
  {
    id: 'lei-8078-90',
    title: 'Lei 8.078/90',
    name: 'Código de Defesa do Consumidor',
    description: 'Dispõe sobre a proteção do consumidor',
    articles: [
      { number: '6º', text: 'São direitos básicos do consumidor a proteção da vida, saúde e segurança' },
      { number: '14', text: 'O fornecedor de serviços responde independentemente da existência de culpa' },
      { number: '39', text: 'É vedado ao fornecedor recusar atendimento às demandas dos consumidores' }
    ],
    applicableScenarios: ['preco_abusivo', 'servico_defeituoso', 'propaganda_enganosa'],
    successRate: 82,
    cases: 356
  },
  {
    id: 'lei-12529-11',
    title: 'Lei 12.529/11',
    name: 'Lei de Defesa da Concorrência',
    description: 'Estrutura o Sistema Brasileiro de Defesa da Concorrência',
    articles: [
      { number: '36', text: 'Constituem infração da ordem econômica os atos que tenham por objeto ou possam produzir efeitos de dominar mercado' },
      { number: '36, §3º', text: 'As seguintes condutas constituem infração: fixar ou praticar preços excessivos' }
    ],
    applicableScenarios: ['monopolio_medicamento', 'preco_abusivo_mercado', 'cartel_farmaceutico'],
    successRate: 73,
    cases: 189
  }
];

export const governmentAgencies = [
  {
    id: 'anvisa',
    name: 'ANVISA',
    fullName: 'Agência Nacional de Vigilância Sanitária',
    description: 'Responsável pela regulamentação e controle sanitário de medicamentos',
    competencies: [
      'Registro de medicamentos',
      'Fiscalização sanitária',
      'Controle de qualidade',
      'Vigilância pós-comercialização'
    ],
    contact: {
      phone: '0800 642 9782',
      email: 'ouvidoria@anvisa.gov.br',
      website: 'https://www.gov.br/anvisa',
      address: 'SIA Trecho 5, Área Especial 57, Brasília-DF'
    },
    caseTypes: ['medicamento_falsificado', 'irregularidade_sanitaria', 'qualidade_medicamento'],
    averageResponseTime: '15-30 dias',
    successRate: 78
  },
  {
    id: 'procon',
    name: 'PROCON',
    fullName: 'Programa de Proteção e Defesa do Consumidor',
    description: 'Proteção dos direitos do consumidor em relações de consumo',
    competencies: [
      'Mediação de conflitos',
      'Fiscalização de preços',
      'Aplicação de sanções',
      'Orientação ao consumidor'
    ],
    contact: {
      phone: '151',
      email: 'atendimento@procon.sp.gov.br',
      website: 'https://www.procon.sp.gov.br',
      address: 'Varia por estado'
    },
    caseTypes: ['preco_abusivo', 'servico_defeituoso', 'propaganda_enganosa'],
    averageResponseTime: '30-45 dias',
    successRate: 82
  },
  {
    id: 'ms',
    name: 'MS',
    fullName: 'Ministério da Saúde',
    description: 'Formulação e implementação de políticas públicas de saúde',
    competencies: [
      'Políticas de saúde',
      'SUS',
      'Assistência farmacêutica',
      'Protocolos clínicos'
    ],
    contact: {
      phone: '136',
      email: 'ouvidoria@saude.gov.br',
      website: 'https://www.gov.br/saude',
      address: 'Esplanada dos Ministérios, Bloco G, Brasília-DF'
    },
    caseTypes: ['medicamento_sus', 'negativa_cobertura_sus', 'acesso_medicamento'],
    averageResponseTime: '45-60 dias',
    successRate: 75
  },
  {
    id: 'cade',
    name: 'CADE',
    fullName: 'Conselho Administrativo de Defesa Econômica',
    description: 'Prevenção e repressão às infrações contra a ordem econômica',
    competencies: [
      'Análise de atos de concentração',
      'Investigação de cartéis',
      'Controle de preços abusivos',
      'Análise de práticas anticompetitivas'
    ],
    contact: {
      phone: '(61) 3221-8555',
      email: 'sei@cade.gov.br',
      website: 'https://www.gov.br/cade',
      address: 'SAS Quadra 3, Bloco B, Brasília-DF'
    },
    caseTypes: ['monopolio_medicamento', 'preco_abusivo_mercado', 'cartel_farmaceutico'],
    averageResponseTime: '60-90 dias',
    successRate: 73
  },
  {
    id: 'mpe',
    name: 'MPE',
    fullName: 'Ministério Público Estadual',
    description: 'Defesa dos direitos coletivos e difusos da sociedade',
    competencies: [
      'Ações civis públicas',
      'Termos de ajustamento de conduta',
      'Investigações',
      'Mediação extrajudicial'
    ],
    contact: {
      phone: 'Varia por estado',
      email: 'Varia por estado',
      website: 'Varia por estado',
      address: 'Varia por estado'
    },
    caseTypes: ['violacao_direitos_coletivos', 'dano_moral_coletivo', 'interesse_social'],
    averageResponseTime: '30-60 dias',
    successRate: 88
  }
];

export const medicationCategories = [
  {
    category: 'Oncológicos',
    description: 'Medicamentos para tratamento de câncer',
    averagePrice: 15000,
    commonIssues: ['negativa_cobertura', 'alto_custo', 'acesso_limitado'],
    examples: ['Trastuzumab', 'Rituximab', 'Adalimumab', 'Bevacizumab'],
    legalFramework: ['lei-8080-90', 'lei-9656-98'],
    urgencyLevel: 'high'
  },
  {
    category: 'Diabetes',
    description: 'Medicamentos para controle de diabetes',
    averagePrice: 350,
    commonIssues: ['preco_abusivo', 'falta_farmacia', 'qualidade'],
    examples: ['Insulina Glargina', 'Metformina', 'Empagliflozina'],
    legalFramework: ['lei-8080-90', 'lei-8078-90'],
    urgencyLevel: 'medium'
  },
  {
    category: 'Hipertensão',
    description: 'Medicamentos para controle da pressão arterial',
    averagePrice: 180,
    commonIssues: ['disponibilidade', 'preco', 'interacao_medicamentosa'],
    examples: ['Losartana', 'Enalapril', 'Amlodipina'],
    legalFramework: ['lei-8080-90', 'lei-8078-90'],
    urgencyLevel: 'medium'
  },
  {
    category: 'Antidepressivos',
    description: 'Medicamentos para tratamento de depressão',
    averagePrice: 250,
    commonIssues: ['cobertura_plano', 'efeitos_colaterais', 'acesso'],
    examples: ['Sertralina', 'Fluoxetina', 'Venlafaxina'],
    legalFramework: ['lei-9656-98', 'lei-8080-90'],
    urgencyLevel: 'medium'
  },
  {
    category: 'Doenças Raras',
    description: 'Medicamentos para doenças raras',
    averagePrice: 25000,
    commonIssues: ['inexistencia_medicamento', 'custo_elevado', 'importacao'],
    examples: ['Enzyme Replacement Therapy', 'Medicamentos órfãos'],
    legalFramework: ['lei-8080-90', 'lei-9782-99'],
    urgencyLevel: 'high'
  }
];

export const caseStatistics = {
  monthly: [
    { month: 'Jul/24', total: 187, resolved: 145, pending: 42, urgent: 12 },
    { month: 'Ago/24', total: 234, resolved: 189, pending: 45, urgent: 15 },
    { month: 'Set/24', total: 289, resolved: 245, pending: 44, urgent: 18 },
    { month: 'Out/24', total: 356, resolved: 298, pending: 58, urgent: 22 },
    { month: 'Nov/24', total: 298, resolved: 267, pending: 31, urgent: 14 },
    { month: 'Dez/24', total: 387, resolved: 334, pending: 53, urgent: 19 },
    { month: 'Jan/25', total: 445, resolved: 398, pending: 47, urgent: 16 }
  ],
  byAgency: [
    { agency: 'ANVISA', cases: 298, resolved: 232, successRate: 78 },
    { agency: 'PROCON', cases: 356, resolved: 292, successRate: 82 },
    { agency: 'MS', cases: 445, resolved: 334, successRate: 75 },
    { agency: 'CADE', cases: 189, resolved: 138, successRate: 73 },
    { agency: 'MPE', cases: 167, resolved: 147, successRate: 88 }
  ],
  financialImpact: {
    totalRecovered: 2100000,
    averageRecoveryPerCase: 1250,
    byCategory: [
      { category: 'Oncológicos', recovered: 890000 },
      { category: 'Doenças Raras', recovered: 650000 },
      { category: 'Diabetes', recovered: 234000 },
      { category: 'Hipertensão', recovered: 123000 },
      { category: 'Antidepressivos', recovered: 156000 },
      { category: 'Outros', recovered: 47000 }
    ]
  }
};
