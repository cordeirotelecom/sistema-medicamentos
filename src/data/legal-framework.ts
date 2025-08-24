// Base legal completa do sistema de saúde brasileiro
export const legalFramework = {
  // Constituição Federal
  constitution: {
    art196: {
      text: "A saúde é direito de todos e dever do Estado, garantido mediante políticas sociais e econômicas que visem à redução do risco de doença e de outros agravos e ao acesso universal e igualitário às ações e serviços para sua promoção, proteção e recuperação.",
      reference: "CF/88, Art. 196"
    },
    art197: {
      text: "São de relevância pública as ações e serviços de saúde, cabendo ao Poder Público dispor, nos termos da lei, sobre sua regulamentação, fiscalização e controle.",
      reference: "CF/88, Art. 197"
    }
  },

  // Leis específicas
  laws: {
    sus: {
      lei8080: {
        title: "Lei Orgânica da Saúde",
        number: "Lei 8.080/90",
        articles: {
          art2: "A saúde é um direito fundamental do ser humano, devendo o Estado prover as condições indispensáveis ao seu pleno exercício.",
          art6: "Estão incluídas ainda no campo de atuação do SUS: a execução de ações de assistência terapêutica integral, inclusive farmacêutica."
        }
      },
      lei8142: {
        title: "Participação da Comunidade",
        number: "Lei 8.142/90",
        focus: "Participação da comunidade na gestão do SUS e transferências financeiras"
      }
    },
    anvisa: {
      lei9782: {
        title: "Sistema Nacional de Vigilância Sanitária",
        number: "Lei 9.782/99",
        articles: {
          art7: "Compete à Agência proceder à regulamentação, controle e fiscalização de produtos e serviços que envolvam risco à saúde pública."
        }
      }
    },
    planosSaude: {
      lei9656: {
        title: "Planos e Seguros Privados de Saúde",
        number: "Lei 9.656/98",
        articles: {
          art10: "É vedada a cobrança de valor acrescido nos procedimentos cobertos pelo plano.",
          art12: "São facultadas a oferta, a contratação e a vigência dos produtos que atendam às exigências desta Lei."
        }
      }
    },
    cdc: {
      lei8078: {
        title: "Código de Defesa do Consumidor",
        number: "Lei 8.078/90",
        articles: {
          art6: "São direitos básicos do consumidor: a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços.",
          art39: "É vedado ao fornecedor de produtos ou serviços: elevar sem justa causa o preço de produtos ou serviços."
        }
      }
    },
    medicamentos: {
      lei10742: {
        title: "Regulação do Mercado de Medicamentos",
        number: "Lei 10.742/03",
        focus: "Regulação da comercialização de medicamentos e critérios de reajuste e revisão de preços"
      }
    }
  },

  // Portarias e Decretos
  portarias: {
    ms: {
      portaria2848: {
        title: "Política Nacional de Assistência Farmacêutica",
        number: "Portaria GM/MS 2.848/2007",
        focus: "Componente Especializado da Assistência Farmacêutica"
      },
      portaria3916: {
        title: "Política Nacional de Medicamentos",
        number: "Portaria 3.916/98",
        focus: "Diretrizes para formulação da Política Nacional de Medicamentos"
      }
    },
    anvisa: {
      resolucao328: {
        title: "Critérios de Registro de Medicamentos",
        number: "RDC 328/19",
        focus: "Critérios para concessão e renovação do registro de medicamentos"
      }
    }
  },

  // Súmulas e Jurisprudência
  jurisprudencia: {
    stj: {
      sumula302: "É abusiva a cláusula contratual de plano de saúde que limita no tempo a internação hospitalar do segurado.",
      sumula321: "O Código de Defesa do Consumidor é aplicável à relação jurídica entre a entidade de previdência privada e seus participantes.",
      sumula469: "Aplica-se o Código de Defesa do Consumidor aos contratos de plano de saúde."
    },
    stf: {
      tema793: "Direito à saúde. Fornecimento de medicamento de alto custo. Responsabilidade solidária dos entes federados.",
      tema855: "Obrigatoriedade do poder público de fornecer medicamentos não incorporados em atos normativos do SUS."
    }
  }
};

// Órgãos competentes expandidos
export const competentAgencies = {
  federal: {
    anvisa: {
      name: "Agência Nacional de Vigilância Sanitária",
      acronym: "ANVISA",
      competencies: [
        "Registro de medicamentos",
        "Controle de preços máximos",
        "Fiscalização de qualidade",
        "Regulamentação técnica",
        "Farmacovigilância"
      ],
      contact: {
        ouvidoria: "0800 642 9782",
        site: "www.anvisa.gov.br",
        email: "ouvidoria@anvisa.gov.br"
      },
      legalBasis: ["Lei 9.782/99", "Lei 6.360/76"]
    },
    ms: {
      name: "Ministério da Saúde",
      acronym: "MS",
      competencies: [
        "Política Nacional de Medicamentos",
        "Assistência Farmacêutica no SUS",
        "Programas especiais de medicamentos",
        "Protocolos clínicos",
        "Componente especializado"
      ],
      contact: {
        disqueSaude: "136",
        site: "www.saude.gov.br",
        email: "sctie@saude.gov.br"
      },
      legalBasis: ["Lei 8.080/90", "Portaria 3.916/98"]
    },
    ans: {
      name: "Agência Nacional de Saúde Suplementar",
      acronym: "ANS",
      competencies: [
        "Regulação de planos de saúde",
        "Cobertura obrigatória",
        "Fiscalização de operadoras",
        "Resolução de conflitos",
        "Rol de procedimentos"
      ],
      contact: {
        disque: "0800 701 9656",
        site: "www.ans.gov.br",
        email: "ans@ans.gov.br"
      },
      legalBasis: ["Lei 9.656/98", "Lei 9.961/00"]
    },
    cade: {
      name: "Conselho Administrativo de Defesa Econômica",
      acronym: "CADE",
      competencies: [
        "Prevenção e repressão de cartéis",
        "Controle de concentrações",
        "Análise de práticas anticoncorrenciais",
        "Investigação de monopolização",
        "Defesa da concorrência"
      ],
      contact: {
        seg: "0800 722 1227",
        site: "www.cade.gov.br",
        email: "seg@cade.gov.br"
      },
      legalBasis: ["Lei 12.529/11"]
    }
  },
  estadual: {
    procon: {
      name: "Programa de Proteção e Defesa do Consumidor",
      acronym: "PROCON",
      competencies: [
        "Defesa do consumidor",
        "Fiscalização de preços",
        "Mediação de conflitos",
        "Aplicação de sanções",
        "Educação para o consumo"
      ],
      contact: {
        telefone: "151",
        site: "www.procon.sp.gov.br",
        email: "atendimento@procon.sp.gov.br"
      },
      legalBasis: ["Lei 8.078/90", "Decreto 2.181/97"]
    },
    mpe: {
      name: "Ministério Público Estadual",
      acronym: "MPE",
      competencies: [
        "Defesa de direitos coletivos",
        "Ação civil pública",
        "Termo de Ajustamento de Conduta",
        "Investigação de irregularidades",
        "Proteção da saúde pública"
      ],
      contact: {
        ouvidoria: "127",
        site: "www.mpsp.mp.br",
        email: "ouvidoria@mpsp.mp.br"
      },
      legalBasis: ["CF/88, Art. 129", "Lei 8.625/93"]
    },
    ses: {
      name: "Secretaria Estadual de Saúde",
      acronym: "SES",
      competencies: [
        "Gestão do SUS estadual",
        "Distribuição de medicamentos",
        "Programas de saúde",
        "Vigilância sanitária estadual",
        "Regulação assistencial"
      ],
      contact: {
        cevs: "0800 555 0079",
        site: "www.saude.sp.gov.br",
        email: "gabinete@saude.sp.gov.br"
      },
      legalBasis: ["Lei 8.080/90", "NOB-SUS"]
    }
  },
  municipal: {
    sms: {
      name: "Secretaria Municipal de Saúde",
      acronym: "SMS",
      competencies: [
        "Atenção básica",
        "Farmácia básica municipal",
        "UBS e farmácias populares",
        "Vigilância sanitária local",
        "Programas municipais"
      ],
      contact: {
        samu: "192",
        site: "www.prefeitura.sp.gov.br/saude",
        email: "sms@prefeitura.sp.gov.br"
      },
      legalBasis: ["Lei 8.080/90", "NOB-SUS 01/96"]
    },
    visa: {
      name: "Vigilância Sanitária Municipal",
      acronym: "VISA",
      competencies: [
        "Inspeção de estabelecimentos",
        "Licenciamento sanitário",
        "Controle de qualidade local",
        "Fiscalização de farmácias",
        "Investigação de surtos"
      ],
      contact: {
        telefone: "(11) 3397-8900",
        site: "www.prefeitura.sp.gov.br/visa",
        email: "visa@prefeitura.sp.gov.br"
      },
      legalBasis: ["Lei 8.080/90", "Código Sanitário"]
    }
  }
};

// Tipos de problemas e competências
export const issueTypeMapping = {
  denied_coverage: {
    primary: "ans",
    secondary: ["mpe", "procon"],
    urgency: "high",
    legalBasis: ["Lei 9.656/98", "CDC Art. 6º", "Súmula STJ 469"],
    expectedTime: "15-30 dias"
  },
  high_price: {
    primary: "procon",
    secondary: ["anvisa", "cade"],
    urgency: "medium",
    legalBasis: ["CDC Art. 39", "Lei 10.742/03", "Lei 12.529/11"],
    expectedTime: "30-45 dias"
  },
  unavailable: {
    primary: "ms",
    secondary: ["ses", "sms", "mpe"],
    urgency: "high",
    legalBasis: ["Lei 8.080/90", "Portaria 2.848/2007", "CF Art. 196"],
    expectedTime: "7-15 dias"
  },
  access_difficulty: {
    primary: "ses",
    secondary: ["ms", "mpe", "procon"],
    urgency: "medium",
    legalBasis: ["Lei 8.080/90", "Lei 8.142/90"],
    expectedTime: "20-40 dias"
  },
  quality_issue: {
    primary: "anvisa",
    secondary: ["visa", "procon", "mpe"],
    urgency: "high",
    legalBasis: ["Lei 9.782/99", "Lei 6.360/76", "CDC"],
    expectedTime: "10-20 dias"
  },
  monopoly_abuse: {
    primary: "cade",
    secondary: ["procon", "mpe"],
    urgency: "low",
    legalBasis: ["Lei 12.529/11", "CF Art. 173"],
    expectedTime: "60-120 dias"
  }
};
