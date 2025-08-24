import { GovernmentAgency, BrazilianState } from '@/types';

export const governmentAgencies: GovernmentAgency[] = [
  {
    id: 'anvisa',
    name: 'Agência Nacional de Vigilância Sanitária',
    acronym: 'ANVISA',
    description: 'Agência reguladora responsável pela vigilância sanitária de medicamentos, alimentos, cosméticos e produtos para a saúde.',
    responsibilities: [
      'Registro de medicamentos',
      'Fiscalização da qualidade de medicamentos',
      'Controle de reações adversas',
      'Regulamentação de importação de medicamentos',
      'Inspeção de fábricas farmacêuticas'
    ],
    contactInfo: {
      website: 'https://www.gov.br/anvisa/pt-br',
      phone: '0800 642 9782',
      email: 'ouvidoria@anvisa.gov.br',
      address: 'SIA Trecho 5 - Área Especial 57 - Brasília/DF - CEP: 71205-050'
    },
    onlineServices: [
      {
        name: 'Peticionamento Eletrônico',
        url: 'https://www.gov.br/anvisa/pt-br/servicos/peticionamento',
        description: 'Sistema para abertura de processos eletrônicos',
        isMainService: true
      },
      {
        name: 'Consulta de Medicamentos Registrados',
        url: 'https://consultas.anvisa.gov.br/#/medicamentos/',
        description: 'Consulte medicamentos registrados na ANVISA',
        isMainService: true
      },
      {
        name: 'Notificação de Eventos Adversos',
        url: 'https://www.gov.br/anvisa/pt-br/assuntos/farmacovigilancia/notifique',
        description: 'Reporte reações adversas a medicamentos',
        isMainService: true
      }
    ],
    applicableIssues: ['quality', 'adverse_reaction', 'registration', 'import'],
    processingTime: '30 a 180 dias úteis (dependendo do tipo de processo)',
    documentsRequired: [
      'Documento de identificação',
      'Comprovante da ocorrência',
      'Documentação técnica (quando aplicável)',
      'Laudo técnico (se disponível)'
    ]
  },
  {
    id: 'ms',
    name: 'Ministério da Saúde',
    acronym: 'MS',
    description: 'Órgão responsável pela política nacional de saúde, incluindo o SUS e programas de assistência farmacêutica.',
    responsibilities: [
      'Políticas de assistência farmacêutica',
      'Programa Farmácia Popular',
      'Componente Especializado da Assistência Farmacêutica',
      'Regulamentação do SUS'
    ],
    contactInfo: {
      website: 'https://www.gov.br/saude/pt-br',
      phone: '136',
      email: 'ouvidoria@saude.gov.br',
      address: 'Esplanada dos Ministérios, Bloco G - Brasília/DF - CEP: 70058-900'
    },
    onlineServices: [
      {
        name: 'Portal do SUS',
        url: 'https://www.gov.br/saude/pt-br/acesso-a-informacao/participacao-social/ouvidoria-do-sus',
        description: 'Portal oficial do Sistema Único de Saúde',
        isMainService: true
      },
      {
        name: 'Farmácia Popular',
        url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/f/farmacia-popular',
        description: 'Programa de acesso a medicamentos',
        isMainService: true
      }
    ],
    applicableIssues: ['accessibility', 'shortage'],
    processingTime: '15 a 30 dias úteis',
    documentsRequired: [
      'CPF',
      'Cartão SUS',
      'Prescrição médica',
      'Comprovante de residência'
    ]
  },
  {
    id: 'cade',
    name: 'Conselho Administrativo de Defesa Econômica',
    acronym: 'CADE',
    description: 'Autarquia responsável por zelar pela livre concorrência e combater práticas anticompetitivas.',
    responsibilities: [
      'Controle de preços abusivos',
      'Investigação de cartéis',
      'Análise de concentrações empresariais',
      'Defesa da concorrência no setor farmacêutico'
    ],
    contactInfo: {
      website: 'https://www.gov.br/cade/pt-br',
      phone: '(61) 3221-8400',
      email: 'imprensa@cade.gov.br',
      address: 'SAS Quadra 03, Lote 6, Ed. João Carlos Saad - Brasília/DF - CEP: 70070-030'
    },
    onlineServices: [
      {
        name: 'SEI-CADE',
        url: 'https://sei.cade.gov.br/sei/',
        description: 'Sistema de denúncias e processos eletrônicos',
        isMainService: true
      }
    ],
    applicableIssues: ['price'],
    processingTime: '60 a 240 dias úteis',
    documentsRequired: [
      'Denúncia fundamentada',
      'Documentos comprobatórios',
      'Identificação do denunciante'
    ]
  },
  {
    id: 'procon',
    name: 'Programa de Proteção e Defesa do Consumidor',
    acronym: 'PROCON',
    description: 'Órgão de defesa do consumidor presente nos estados e municípios.',
    responsibilities: [
      'Defesa dos direitos do consumidor',
      'Mediação de conflitos',
      'Aplicação do Código de Defesa do Consumidor',
      'Fiscalização de estabelecimentos comerciais'
    ],
    contactInfo: {
      website: 'https://www.consumidor.gov.br/',
      phone: 'Varia por estado/município',
      email: 'Varia por estado/município'
    },
    onlineServices: [
      {
        name: 'Consumidor.gov.br',
        url: 'https://www.consumidor.gov.br/',
        description: 'Plataforma nacional de resolução de conflitos de consumo',
        isMainService: true
      }
    ],
    applicableIssues: ['price', 'quality', 'accessibility'],
    processingTime: '10 a 30 dias úteis',
    documentsRequired: [
      'CPF',
      'Comprovante de compra',
      'Documentos relacionados ao problema'
    ]
  },
  {
    id: 'mpe',
    name: 'Ministério Público Estadual',
    acronym: 'MPE',
    description: 'Órgão responsável pela defesa dos direitos fundamentais, incluindo o direito à saúde e acesso a medicamentos em âmbito estadual.',
    responsibilities: [
      'Defesa do direito constitucional à saúde',
      'Ações civis públicas para garantir acesso a medicamentos',
      'Fiscalização do cumprimento de políticas públicas de saúde',
      'Proteção de direitos de grupos vulneráveis',
      'Mediação em conflitos de saúde pública',
      'Acompanhamento de casos de alta complexidade'
    ],
    contactInfo: {
      website: 'https://www.cnmp.mp.br/portal/',
      phone: 'Varia por estado - consulte o MPE local',
      email: 'Varia por estado - consulte o MPE local',
      address: 'Endereços disponíveis no site do CNMP'
    },
    onlineServices: [
      {
        name: 'Portal do CNMP',
        url: 'https://www.cnmp.mp.br/portal/',
        description: 'Conselho Nacional do Ministério Público',
        isMainService: true
      },
      {
        name: 'Mapa do Ministério Público',
        url: 'https://www.cnmp.mp.br/portal/institucional/476-mapa-do-ministerio-publico',
        description: 'Encontre o MPE do seu estado',
        isMainService: true
      }
    ],
    applicableIssues: ['accessibility', 'shortage', 'emergency'],
    processingTime: '15 a 60 dias úteis',
    documentsRequired: [
      'Documento de identificação',
      'Comprovante de residência',
      'Relatório médico detalhado',
      'Prescrição médica',
      'Comprovante de tentativa de acesso pelo SUS',
      'Documentos que comprovem a negativa ou dificuldade'
    ]
  },
  {
    id: 'mpt',
    name: 'Ministério Público do Trabalho',
    acronym: 'MPT',
    description: 'Órgão responsável pela defesa dos direitos trabalhistas e sociais.',
    responsibilities: [
      'Defesa da saúde do trabalhador',
      'Ações de saúde pública',
      'Proteção de direitos coletivos'
    ],
    contactInfo: {
      website: 'https://www.prt.mpt.mp.br/',
      phone: 'Varia por região',
      email: 'Varia por região'
    },
    onlineServices: [
      {
        name: 'MPT Digital',
        url: 'https://mpt.mp.br/pgt/servicos/mpdigital',
        description: 'Plataforma de denúncias online',
        isMainService: true
      }
    ],
    applicableIssues: ['accessibility', 'shortage'],
    processingTime: '30 a 90 dias úteis',
    documentsRequired: [
      'Documento de identificação',
      'Relatório detalhado da situação',
      'Documentos comprobatórios'
    ]
  }
];

export const brazilianStates: BrazilianState[] = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];
