// Dados simplificados para resolução de problema de módulo

export const brazilianHealthLaws = [
  {
    id: 'lei-8080-90',
    title: 'Lei 8.080/90',
    number: 'Lei 8.080/90',
    name: 'Lei Orgânica da Saúde',
    description: 'Dispõe sobre as condições para a promoção, proteção e recuperação da saúde',
    scope: 'Federal',
    dateApproved: '19/09/1990',
    relatedCases: 445,
    articles: [
      { number: '2º', text: 'A saúde é um direito fundamental do ser humano' },
      { number: '6º', text: 'Estão incluídas no campo de atuação do SUS a assistência terapêutica integral, inclusive farmacêutica' }
    ],
    keyArticles: [
      { number: '2º', text: 'A saúde é um direito fundamental do ser humano' },
      { number: '6º', text: 'Estão incluídas no campo de atuação do SUS a assistência terapêutica integral, inclusive farmacêutica' },
      { number: '19-M', text: 'A assistência farmacêutica no SUS compreende todo medicamento' }
    ],
    protections: [
      { type: 'Direito à saúde', description: 'Garante o acesso universal à saúde' },
      { type: 'Assistência farmacêutica', description: 'Direito aos medicamentos essenciais' }
    ],
    applicableScenarios: ['medicamento_sus', 'negativa_cobertura_sus', 'acesso_medicamento'],
    successRate: 89,
    cases: 445
  },
  {
    id: 'lei-9656-98',
    title: 'Lei 9.656/98',
    number: 'Lei 9.656/98',
    name: 'Lei dos Planos de Saúde',
    description: 'Dispõe sobre os planos e seguros privados de assistência à saúde',
    scope: 'Federal',
    dateApproved: '03/06/1998',
    relatedCases: 892,
    articles: [
      { number: '10', text: 'É instituído o plano-referência de assistência à saúde' },
      { number: '12', text: 'São vedadas as seguintes práticas na contratação' }
    ],
    keyArticles: [
      { number: '10', text: 'É instituído o plano-referência de assistência à saúde' },
      { number: '12', text: 'São vedadas as seguintes práticas na contratação' },
      { number: '35-A', text: 'É obrigatória a cobertura de medicamentos oncológicos' }
    ],
    protections: [
      { type: 'Cobertura obrigatória', description: 'Define procedimentos que devem ser cobertos' },
      { type: 'Proteção ao consumidor', description: 'Veda práticas abusivas' }
    ],
    applicableScenarios: ['plano_saude', 'negativa_medicamento', 'cobertura_tratamento'],
    successRate: 76,
    cases: 892
  }
];

export const governmentAgencies = [
  {
    id: 'anvisa',
    name: 'ANVISA',
    acronym: 'ANVISA',
    fullName: 'Agência Nacional de Vigilância Sanitária',
    description: 'Controla medicamentos, alimentos e produtos para saúde',
    level: 'Federal',
    competencies: ['Registro de medicamentos', 'Controle sanitário', 'Fiscalização'],
    contact: {
      phone: '0800-642-9782',
      website: 'https://www.gov.br/anvisa',
      email: 'anvisa@anvisa.gov.br',
      address: 'SIA Trecho 5, Área Especial 57, Brasília-DF'
    }
  },
  {
    id: 'ms',
    name: 'Ministério da Saúde',
    acronym: 'MS',
    fullName: 'Ministério da Saúde',
    description: 'Política nacional de saúde e SUS',
    level: 'Federal',
    competencies: ['Políticas de saúde', 'SUS', 'Medicamentos essenciais'],
    contact: {
      phone: '136',
      website: 'https://www.gov.br/saude',
      email: 'ouvidoria@saude.gov.br',
      address: 'Esplanada dos Ministérios, Bloco G, Brasília-DF'
    }
  }
];

export const caseStatistics = {
  totalCases: 15847,
  resolvedCases: 13256,
  averageResolutionTime: 45,
  successRate: 83.6,
  byCategory: [
    { category: 'Medicamentos SUS', cases: 5234, success: 89 },
    { category: 'Planos de Saúde', cases: 4891, success: 76 },
    { category: 'ANVISA', cases: 3456, success: 92 },
    { category: 'Direito Consumidor', cases: 2266, success: 71 }
  ],
  monthly: [
    { month: 'Jan', cases: 1245, resolved: 1089, pending: 156, urgent: 45 },
    { month: 'Fev', cases: 1356, resolved: 1203, pending: 153, urgent: 38 },
    { month: 'Mar', cases: 1489, resolved: 1334, pending: 155, urgent: 42 },
    { month: 'Abr', cases: 1567, resolved: 1401, pending: 166, urgent: 51 },
    { month: 'Mai', cases: 1634, resolved: 1456, pending: 178, urgent: 49 },
    { month: 'Jun', cases: 1589, resolved: 1423, pending: 166, urgent: 34 }
  ],
  byAgency: [
    { agency: 'ANVISA', cases: 3456, resolved: 3180, successRate: 92 },
    { agency: 'Ministério da Saúde', cases: 5234, resolved: 4658, successRate: 89 },
    { agency: 'PROCON', cases: 2266, resolved: 1609, successRate: 71 },
    { agency: 'ANS', cases: 4891, resolved: 3717, successRate: 76 }
  ]
};

export const medicationCategories = [
  { 
    name: 'Antibióticos', 
    category: 'Antibióticos',
    count: 1234, 
    percentage: 23.4,
    urgencyLevel: 'high',
    description: 'Medicamentos para combate a infecções bacterianas',
    averagePrice: 45.50
  },
  { 
    name: 'Anti-hipertensivos', 
    category: 'Anti-hipertensivos',
    count: 987, 
    percentage: 18.7,
    urgencyLevel: 'medium',
    description: 'Medicamentos para controle da pressão arterial',
    averagePrice: 32.80
  },
  { 
    name: 'Diabetes', 
    category: 'Diabetes',
    count: 876, 
    percentage: 16.6,
    urgencyLevel: 'high',
    description: 'Medicamentos para controle glicêmico',
    averagePrice: 89.90
  },
  { 
    name: 'Analgésicos', 
    category: 'Analgésicos',
    count: 654, 
    percentage: 12.4,
    urgencyLevel: 'low',
    description: 'Medicamentos para alívio da dor',
    averagePrice: 15.20
  },
  { 
    name: 'Outros', 
    category: 'Outros',
    count: 1523, 
    percentage: 28.9,
    urgencyLevel: 'medium',
    description: 'Demais categorias de medicamentos',
    averagePrice: 67.40
  }
];
