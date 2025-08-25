import { MedicationRequest } from '@/types';

export interface LegalAnalysis {
  hasRight: boolean;
  legalBasis: string[];
  reasoning: string;
  requiredDocuments: string[];
  competentAgency: string;
  recommendedProcedure: string;
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
      legalBasis: [],
      reasoning: '',
      requiredDocuments: [],
      competentAgency: 'ANVISA',
      recommendedProcedure: 'Consulta aos órgãos competentes'
    };

    // Análise baseada no tipo de problema
    switch (request.issueType) {
      case 'shortage':
        return this.analyzeShortage(request, analysis);
      case 'price':
        return this.analyzeHighPrice(request, analysis);
      case 'accessibility':
        return this.analyzeAvailability(request, analysis);
      case 'registration':
        return this.analyzeInsuranceDenial(request, analysis);
      case 'quality':
        return this.analyzeQualityIssue(request, analysis);
      case 'adverse_reaction':
        return this.analyzeSideEffects(request, analysis);
      case 'import':
        return this.analyzePrescriptionIssue(request, analysis);
      case 'other':
        return this.analyzeOther(request, analysis);
      default:
        return analysis;
    }
  }

  private static analyzeShortage(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    const isCitizen = request.patientInfo?.isBrazilianCitizen ?? true;
    
    analysis.hasRight = isCitizen;
    analysis.legalBasis = [
      this.LEGAL_FRAMEWORK.constitution.article196,
      this.LEGAL_FRAMEWORK.laws.sus,
      this.LEGAL_FRAMEWORK.recent.marco2024
    ];
    analysis.reasoning = isCitizen 
      ? 'Todo cidadão brasileiro tem direito constitucional ao acesso a medicamentos essenciais. Em caso de desabastecimento, o Estado deve garantir alternativas ou suprimento adequado.'
      : 'Para não-cidadãos, verificar direitos através de tratados internacionais e legislação específica de saúde do estrangeiro.';
    
    analysis.requiredDocuments = isCitizen ? [
      'Documento de identificação',
      'Prescrição médica',
      'Comprovante de tentativa de aquisição',
      'Relatório médico justificando necessidade'
    ] : [
      'Documento de identificação',
      'Comprovante de residência ou situação migratória',
      'Prescrição médica',
      'Relatório médico'
    ];

    analysis.competentAgency = 'Ministério da Saúde';
    analysis.recommendedProcedure = 'Solicitação formal ao órgão gestor de saúde local, com possibilidade de acionamento da Defensoria Pública se necessário.';
    
    if (request.urgency === 'high') {
      analysis.urgencyJustification = 'Casos de urgência médica têm prioridade de tramitação conforme legislação de saúde pública.';
    }

    return analysis;
  }

  private static analyzeHighPrice(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      this.LEGAL_FRAMEWORK.laws.farmaciaPopular,
      this.LEGAL_FRAMEWORK.constitution.article196,
      'Lei 8.078/90 - Código de Defesa do Consumidor'
    ];
    analysis.reasoning = 'Existem programas governamentais para redução de custos de medicamentos, além de direitos do consumidor relacionados a preços abusivos.';
    analysis.requiredDocuments = [
      'Prescrição médica',
      'Comprovantes de preços em diferentes farmácias',
      'Documento de identificação',
      'Comprovante de renda'
    ];
    analysis.competentAgency = 'Ministério da Saúde / PROCON';
    analysis.recommendedProcedure = 'Verificar elegibilidade para Programa Farmácia Popular ou acionamento do PROCON para investigação de preços abusivos.';
    
    return analysis;
  }

  private static analyzeAvailability(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      this.LEGAL_FRAMEWORK.constitution.article196,
      this.LEGAL_FRAMEWORK.laws.ceaf,
      this.LEGAL_FRAMEWORK.recent.resolucao2024
    ];
    analysis.reasoning = 'O direito à saúde inclui o acesso a medicamentos. Quando não disponíveis na rede pública, há procedimentos para solicitação excepcional.';
    analysis.requiredDocuments = [
      'Prescrição médica atualizada',
      'Relatório médico detalhado',
      'Exames que comprovem a necessidade',
      'Formulário de solicitação excepcional'
    ];
    analysis.competentAgency = 'Secretaria de Saúde Estadual/Municipal';
    analysis.recommendedProcedure = 'Solicitação de medicamento excepcional através da Secretaria de Saúde competente.';
    
    return analysis;
  }

  private static analyzeInsuranceDenial(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      'Lei 9.656/98 - Lei dos Planos de Saúde',
      'Resolução ANS nº 465/21',
      'Lei 8.078/90 - Código de Defesa do Consumidor'
    ];
    analysis.reasoning = 'Planos de saúde têm obrigação de cobrir medicamentos conforme rol da ANS e prescrições médicas justificadas.';
    analysis.requiredDocuments = [
      'Contrato do plano de saúde',
      'Prescrição médica',
      'Negativa formal do plano',
      'Relatório médico justificando necessidade'
    ];
    analysis.competentAgency = 'ANS (Agência Nacional de Saúde Suplementar)';
    analysis.recommendedProcedure = 'Recurso administrativo junto à operadora do plano, com possibilidade de denúncia à ANS.';
    
    return analysis;
  }

  private static analyzeQualityIssue(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      'Lei 9.782/99 - Lei da ANVISA',
      'Lei 8.078/90 - Código de Defesa do Consumidor',
      'RDC ANVISA nº 216/06'
    ];
    analysis.reasoning = 'Problemas de qualidade em medicamentos são de competência da ANVISA e configuram violação dos direitos do consumidor.';
    analysis.requiredDocuments = [
      'Medicamento com problema (se possível)',
      'Nota fiscal de compra',
      'Relatório médico sobre efeitos adversos',
      'Fotos ou evidências do problema'
    ];
    analysis.competentAgency = 'ANVISA';
    analysis.recommendedProcedure = 'Notificação à ANVISA através do sistema de farmacovigilância e acionamento do PROCON para questões consumeristas.';
    
    return analysis;
  }

  private static analyzeSideEffects(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      'Lei 9.782/99 - Lei da ANVISA',
      'RDC ANVISA nº 4/09 - Farmacovigilância',
      this.LEGAL_FRAMEWORK.constitution.article196
    ];
    analysis.reasoning = 'Efeitos adversos de medicamentos devem ser notificados para garantir a segurança da população e o direito a tratamentos seguros.';
    analysis.requiredDocuments = [
      'Relatório médico sobre efeitos adversos',
      'Prescrição original',
      'Histórico médico relevante',
      'Informações sobre o medicamento (lote, validade)'
    ];
    analysis.competentAgency = 'ANVISA';
    analysis.recommendedProcedure = 'Notificação de evento adverso através do NOTIVISA (Sistema de Notificações em Vigilância Sanitária).';
    
    return analysis;
  }

  private static analyzePrescriptionIssue(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      'Lei 5.991/73 - Controle Sanitário do Comércio de Drogas',
      'Resolução CFM nº 1.246/88',
      'RDC ANVISA nº 20/11'
    ];
    analysis.reasoning = 'Prescrições médicas têm regulamentação específica e farmácias têm obrigações legais quanto à dispensação.';
    analysis.requiredDocuments = [
      'Prescrição médica original',
      'Documento de identificação',
      'Comprovante da recusa (se houver)',
      'Relatório médico adicional (se necessário)'
    ];
    analysis.competentAgency = 'Conselho Regional de Farmácia / ANVISA';
    analysis.recommendedProcedure = 'Verificação da prescrição junto ao médico prescritor e consulta ao Conselho Regional de Farmácia sobre irregularidades.';
    
    return analysis;
  }

  private static analyzeOther(request: MedicationRequest, analysis: LegalAnalysis): LegalAnalysis {
    analysis.hasRight = true;
    analysis.legalBasis = [
      this.LEGAL_FRAMEWORK.constitution.article196,
      'Lei 8.078/90 - Código de Defesa do Consumidor'
    ];
    analysis.reasoning = 'Para situações não especificadas, aplicam-se os direitos fundamentais à saúde e proteção do consumidor.';
    analysis.requiredDocuments = [
      'Documento de identificação',
      'Prescrição médica (se aplicável)',
      'Documentos relacionados ao problema específico',
      'Relatório médico (se necessário)'
    ];
    analysis.competentAgency = 'Órgão competente conforme natureza específica do problema';
    analysis.recommendedProcedure = 'Análise caso a caso para direcionamento ao órgão competente adequado.';
    
    return analysis;
  }
}
