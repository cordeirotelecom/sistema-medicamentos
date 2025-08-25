/**
 * Serviço de Consulta ANVISA - Desenvolvimento Harmônico Sustentável
 * Sistema público para consulta de medicamentos registrados na ANVISA
 */

export interface MedicationInfo {
  name: string;
  activeSubstance: string;
  registrationNumber: string;
  status: 'VÁLIDO' | 'VENCIDO' | 'CANCELADO' | 'SUSPENSO';
  expiryDate: string;
  company: string;
  category: string;
  controlledSubstance: boolean;
  genericAvailable: boolean;
  susIncluded: boolean;
  coafIncluded: boolean; // Componente Especializado da Assistência Farmacêutica
}

export interface AnvisaConsultationResult {
  found: boolean;
  medication?: MedicationInfo;
  alternatives?: MedicationInfo[];
  publicAccessInfo: {
    susAvailable: boolean;
    farmaciaPopularAvailable: boolean;
    requiresSpecialPrescription: boolean;
    estimatedPublicPrice?: string;
  };
  legalFramework: string[];
  nextSteps: string[];
}

export class AnvisaConsultationService {
  // Base de dados simulada baseada em medicamentos comuns do SUS
  private static readonly MEDICATION_DATABASE: MedicationInfo[] = [
    {
      name: 'PARACETAMOL 500MG',
      activeSubstance: 'Paracetamol',
      registrationNumber: '1.0235.0080',
      status: 'VÁLIDO',
      expiryDate: '2029-12-31',
      company: 'LABORATÓRIO FARMACÊUTICO DO ESTADO DE PERNAMBUCO',
      category: 'ANALGÉSICO/ANTITÉRMICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'LOSARTANA POTÁSSICA 50MG',
      activeSubstance: 'Losartana Potássica',
      registrationNumber: '1.0068.0456',
      status: 'VÁLIDO',
      expiryDate: '2028-08-15',
      company: 'LABORATÓRIO QUÍMICO FARMACÊUTICO BERGAMO LTDA',
      category: 'ANTI-HIPERTENSIVO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'INSULINA HUMANA NPH',
      activeSubstance: 'Insulina Humana NPH',
      registrationNumber: '1.0497.0123',
      status: 'VÁLIDO',
      expiryDate: '2030-03-20',
      company: 'FUNDAÇÃO EZEQUIEL DIAS - FUNED',
      category: 'ANTIDIABÉTICO',
      controlledSubstance: false,
      genericAvailable: false,
      susIncluded: true,
      coafIncluded: true
    },
    {
      name: 'OMEPRAZOL 20MG',
      activeSubstance: 'Omeprazol',
      registrationNumber: '1.0068.0789',
      status: 'VÁLIDO',
      expiryDate: '2027-11-10',
      company: 'LABORATÓRIO TEUTO BRASILEIRO S/A',
      category: 'ANTIÁCIDO/ANTIULCEROSO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'ATENOLOL 25MG',
      activeSubstance: 'Atenolol',
      registrationNumber: '1.0235.0234',
      status: 'VÁLIDO',
      expiryDate: '2029-05-30',
      company: 'FUNDAÇÃO PARA O REMÉDIO POPULAR - FURP',
      category: 'BETA-BLOQUEADOR',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    }
  ];

  /**
   * Consulta medicamento na base de dados ANVISA simulada
   */
  static async consultMedication(medicationName: string): Promise<AnvisaConsultationResult> {
    const searchTerm = medicationName.toLowerCase().trim();
    
    // Busca principal
    const found = this.MEDICATION_DATABASE.find(med => 
      med.name.toLowerCase().includes(searchTerm) ||
      med.activeSubstance.toLowerCase().includes(searchTerm)
    );

    if (found) {
      // Busca alternativas (mesmo princípio ativo)
      const alternatives = this.MEDICATION_DATABASE.filter(med => 
        med.activeSubstance === found.activeSubstance && 
        med.name !== found.name
      );

      return {
        found: true,
        medication: found,
        alternatives,
        publicAccessInfo: this.getPublicAccessInfo(found),
        legalFramework: this.getLegalFramework(found),
        nextSteps: this.getNextSteps(found)
      };
    }

    // Se não encontrou, busca por semelhança
    const similar = this.MEDICATION_DATABASE.filter(med => {
      const nameParts = searchTerm.split(' ');
      return nameParts.some(part => 
        part.length > 3 && (
          med.name.toLowerCase().includes(part) ||
          med.activeSubstance.toLowerCase().includes(part)
        )
      );
    });

    return {
      found: false,
      alternatives: similar,
      publicAccessInfo: {
        susAvailable: false,
        farmaciaPopularAvailable: false,
        requiresSpecialPrescription: false
      },
      legalFramework: [
        'CF/88, Art. 196 - Direito à saúde garantido pelo Estado',
        'Lei 8.080/90 - Lei Orgânica da Saúde (SUS)',
        'Lei 9.782/99 - Lei da ANVISA'
      ],
      nextSteps: [
        'Verificar se o medicamento possui registro na ANVISA',
        'Consultar médico sobre alternativas disponíveis no SUS',
        'Procurar Unidade Básica de Saúde para orientação',
        'Verificar programas governamentais (Farmácia Popular)'
      ]
    };
  }

  private static getPublicAccessInfo(medication: MedicationInfo) {
    return {
      susAvailable: medication.susIncluded,
      farmaciaPopularAvailable: medication.susIncluded && !medication.controlledSubstance,
      requiresSpecialPrescription: medication.controlledSubstance || medication.coafIncluded,
      estimatedPublicPrice: medication.susIncluded ? 'Gratuito no SUS' : 
                           medication.coafIncluded ? 'Gratuito via CEAF' : 'Consultar valores'
    };
  }

  private static getLegalFramework(medication: MedicationInfo): string[] {
    const framework = [
      'CF/88, Art. 196 - Direito universal à saúde',
      'Lei 8.080/90 - Lei Orgânica da Saúde (SUS)'
    ];

    if (medication.susIncluded) {
      framework.push('Portaria GM/MS nº 3.916/98 - Política Nacional de Medicamentos');
    }

    if (medication.coafIncluded) {
      framework.push('Portaria GM/MS nº 2.981/09 - Componente Especializado da Assistência Farmacêutica');
    }

    if (medication.controlledSubstance) {
      framework.push('Portaria SVS/MS nº 344/98 - Regulamento Técnico sobre substâncias controladas');
    }

    framework.push('Lei 14.821/24 - Marco Legal da Assistência Farmacêutica');

    return framework;
  }

  private static getNextSteps(medication: MedicationInfo): string[] {
    const steps = [];

    if (medication.susIncluded) {
      steps.push('✅ Procurar Unidade Básica de Saúde com prescrição médica');
      steps.push('✅ Medicamento disponível gratuitamente no SUS');
    }

    if (medication.coafIncluded) {
      steps.push('📋 Solicitar cadastro no CEAF (Componente Especializado)');
      steps.push('📄 Apresentar relatório médico detalhado');
    }

    if (medication.controlledSubstance) {
      steps.push('⚠️ Requer receita médica especial (amarela ou azul)');
      steps.push('🏥 Procurar farmácia autorizada para medicamentos controlados');
    }

    if (medication.genericAvailable) {
      steps.push('💡 Existem versões genéricas mais acessíveis');
    }

    steps.push('📞 Em caso de dificuldades, procurar Defensoria Pública');
    steps.push('🏛️ Para questões urgentes, contatar Ministério Público Estadual');

    return steps;
  }

  /**
   * Busca medicamentos por categoria terapêutica
   */
  static async searchByCategory(category: string): Promise<MedicationInfo[]> {
    const searchCategory = category.toLowerCase();
    
    return this.MEDICATION_DATABASE.filter(med => 
      med.category.toLowerCase().includes(searchCategory)
    );
  }

  /**
   * Lista medicamentos disponíveis no SUS
   */
  static async getSUSMedications(): Promise<MedicationInfo[]> {
    return this.MEDICATION_DATABASE.filter(med => med.susIncluded);
  }

  /**
   * Lista medicamentos do CEAF (Alto Custo)
   */
  static async getCEAFMedications(): Promise<MedicationInfo[]> {
    return this.MEDICATION_DATABASE.filter(med => med.coafIncluded);
  }
}
