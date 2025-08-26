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
  suggestions?: string[]; // Sugestões "Você quis dizer..."
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
    },
    // Medicamentos adicionais comuns
    {
      name: 'CAPTOPRIL 25MG',
      activeSubstance: 'Captopril',
      registrationNumber: '1.0068.0112',
      status: 'VÁLIDO',
      expiryDate: '2028-12-15',
      company: 'LABORATÓRIO FARMACÊUTICO DO ESTADO DE PERNAMBUCO',
      category: 'INIBIDOR DA ECA',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'METFORMINA 850MG',
      activeSubstance: 'Cloridrato de Metformina',
      registrationNumber: '1.0497.0234',
      status: 'VÁLIDO',
      expiryDate: '2030-06-30',
      company: 'LABORATÓRIO TEUTO BRASILEIRO S/A',
      category: 'ANTIDIABÉTICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'DIPIRONA 500MG',
      activeSubstance: 'Dipirona Sódica',
      registrationNumber: '1.0235.0345',
      status: 'VÁLIDO',
      expiryDate: '2029-09-20',
      company: 'FUNDAÇÃO PARA O REMÉDIO POPULAR - FURP',
      category: 'ANALGÉSICO/ANTITÉRMICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'SINVASTATINA 20MG',
      activeSubstance: 'Sinvastatina',
      registrationNumber: '1.0068.0567',
      status: 'VÁLIDO',
      expiryDate: '2028-03-10',
      company: 'LABORATÓRIO QUÍMICO FARMACÊUTICO BERGAMO LTDA',
      category: 'HIPOLIPEMIANTE',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'AMOXICILINA 500MG',
      activeSubstance: 'Amoxicilina',
      registrationNumber: '1.0497.0678',
      status: 'VÁLIDO',
      expiryDate: '2029-11-25',
      company: 'FUNDAÇÃO EZEQUIEL DIAS - FUNED',
      category: 'ANTIBIÓTICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'HIDROCLOROTIAZIDA 25MG',
      activeSubstance: 'Hidroclorotiazida',
      registrationNumber: '1.0235.0789',
      status: 'VÁLIDO',
      expiryDate: '2028-07-15',
      company: 'LABORATÓRIO FARMACÊUTICO DO ESTADO DE PERNAMBUCO',
      category: 'DIURÉTICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'PREDNISONA 20MG',
      activeSubstance: 'Prednisona',
      registrationNumber: '1.0068.0890',
      status: 'VÁLIDO',
      expiryDate: '2029-01-30',
      company: 'LABORATÓRIO TEUTO BRASILEIRO S/A',
      category: 'CORTICOSTEROIDE',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'LEVOTIROXINA 50MCG',
      activeSubstance: 'Levotiroxina Sódica',
      registrationNumber: '1.0497.0901',
      status: 'VÁLIDO',
      expiryDate: '2030-04-20',
      company: 'FUNDAÇÃO PARA O REMÉDIO POPULAR - FURP',
      category: 'HORMÔNIO TIREOIDIANO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    },
    {
      name: 'GLIBENCLAMIDA 5MG',
      activeSubstance: 'Glibenclamida',
      registrationNumber: '1.0235.1012',
      status: 'VÁLIDO',
      expiryDate: '2028-10-05',
      company: 'LABORATÓRIO QUÍMICO FARMACÊUTICO BERGAMO LTDA',
      category: 'ANTIDIABÉTICO',
      controlledSubstance: false,
      genericAvailable: true,
      susIncluded: true,
      coafIncluded: false
    }
  ];

  /**
   * Calcula similaridade entre duas strings (algoritmo de Levenshtein simplificado)
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;
    
    // Verifica se uma string contém a outra
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Verifica prefixos comuns
    let commonPrefix = 0;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      if (s1[i] === s2[i]) commonPrefix++;
      else break;
    }
    
    const prefixSimilarity = commonPrefix / Math.max(s1.length, s2.length);
    
    // Algoritmo simples baseado em caracteres comuns
    const chars1 = new Set(s1);
    const chars2 = new Set(s2);
    const intersection = new Set([...chars1].filter(x => chars2.has(x)));
    const union = new Set([...chars1, ...chars2]);
    
    const jaccardSimilarity = intersection.size / union.size;
    
    return Math.max(prefixSimilarity, jaccardSimilarity);
  }

  /**
   * Gera sugestões baseadas em similaridade de nomes
   */
  private static generateSuggestions(searchTerm: string): string[] {
    const similarities = this.MEDICATION_DATABASE.map(med => ({
      name: med.name,
      similarity: Math.max(
        this.calculateSimilarity(searchTerm, med.name),
        this.calculateSimilarity(searchTerm, med.activeSubstance)
      )
    }));

    return similarities
      .filter(item => item.similarity > 0.3 && item.similarity < 1) // Não incluir matches exatos
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => item.name);
  }

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
        suggestions: [], // Não precisa de sugestões quando encontra
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

    // Gera sugestões "Você quis dizer..."
    const suggestions = this.generateSuggestions(searchTerm);

    return {
      found: false,
      alternatives: similar,
      suggestions: suggestions,
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
