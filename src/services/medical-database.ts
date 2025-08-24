import { MedicationRequest } from '@/types';

// Interface para dados médicos avançados
export interface MedicalDataAnalysis {
  cid10Code?: string;
  drugInteractions: DrugInteraction[];
  alternativeMedications: AlternativeMedication[];
  therapeuticClass: string;
  administration: {
    route: string;
    frequency: string;
    duration: string;
  };
  contraindications: string[];
  sideEffects: string[];
  monitoring: string[];
}

export interface DrugInteraction {
  medication: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
  recommendation: string;
}

export interface AlternativeMedication {
  name: string;
  activeSubstance: string;
  availability: 'sus' | 'farmacia-popular' | 'private' | 'generic';
  averagePrice?: number;
  efficacyComparison: 'equivalent' | 'superior' | 'inferior';
}

// Base de dados expandida de medicamentos
export class MedicalDatabaseService {
  private static readonly MEDICATION_DATABASE = new Map([
    ['insulina', {
      cid10Code: 'E10-E14',
      therapeuticClass: 'Antidiabético',
      administration: {
        route: 'Subcutânea',
        frequency: '1-4x ao dia',
        duration: 'Contínuo'
      },
      contraindications: ['Hipoglicemia', 'Alergia à insulina'],
      sideEffects: ['Hipoglicemia', 'Reação no local da aplicação', 'Ganho de peso'],
      monitoring: ['Glicemia capilar', 'HbA1c trimestral', 'Função renal'],
      alternatives: [
        {
          name: 'Metformina',
          activeSubstance: 'Cloridrato de metformina',
          availability: 'sus',
          efficacyComparison: 'inferior'
        }
      ]
    }],
    ['omeprazol', {
      cid10Code: 'K25-K27',
      therapeuticClass: 'Inibidor de bomba de prótons',
      administration: {
        route: 'Oral',
        frequency: '1x ao dia',
        duration: '2-8 semanas'
      },
      contraindications: ['Hipersensibilidade ao omeprazol'],
      sideEffects: ['Cefaleia', 'Diarreia', 'Náusea'],
      monitoring: ['Sintomas gástricos', 'Função hepática'],
      alternatives: [
        {
          name: 'Pantoprazol',
          activeSubstance: 'Pantoprazol sódico',
          availability: 'sus',
          efficacyComparison: 'equivalent'
        }
      ]
    }],
    ['atorvastatina', {
      cid10Code: 'E78',
      therapeuticClass: 'Estatina',
      administration: {
        route: 'Oral',
        frequency: '1x ao dia (noite)',
        duration: 'Contínuo'
      },
      contraindications: ['Doença hepática ativa', 'Gravidez'],
      sideEffects: ['Mialgia', 'Elevação de enzimas hepáticas', 'Cefaleia'],
      monitoring: ['Perfil lipídico', 'Enzimas hepáticas', 'CK'],
      alternatives: [
        {
          name: 'Sinvastatina',
          activeSubstance: 'Sinvastatina',
          availability: 'sus',
          efficacyComparison: 'equivalent'
        }
      ]
    }]
  ]);

  static async analyzeMedication(medicationName: string): Promise<MedicalDataAnalysis | null> {
    const normalizedName = medicationName.toLowerCase().trim();
    
    // Busca exata
    const exactMatch = this.MEDICATION_DATABASE.get(normalizedName);
    if (exactMatch) {
      return this.formatMedicalData(exactMatch);
    }

    // Busca parcial
    for (const [key, data] of this.MEDICATION_DATABASE.entries()) {
      if (key.includes(normalizedName) || normalizedName.includes(key)) {
        return this.formatMedicalData(data);
      }
    }

    // Se não encontrar, retorna dados genéricos
    return this.getGenericMedicalData(medicationName);
  }

  private static formatMedicalData(data: any): MedicalDataAnalysis {
    return {
      cid10Code: data.cid10Code,
      drugInteractions: [],
      alternativeMedications: data.alternatives || [],
      therapeuticClass: data.therapeuticClass,
      administration: data.administration,
      contraindications: data.contraindications,
      sideEffects: data.sideEffects,
      monitoring: data.monitoring
    };
  }

  private static getGenericMedicalData(medicationName: string): MedicalDataAnalysis {
    return {
      drugInteractions: [],
      alternativeMedications: [],
      therapeuticClass: 'A ser determinado',
      administration: {
        route: 'Conforme prescrição médica',
        frequency: 'Conforme prescrição médica',
        duration: 'Conforme prescrição médica'
      },
      contraindications: ['Hipersensibilidade aos componentes da fórmula'],
      sideEffects: ['Consulte a bula para informações completas'],
      monitoring: ['Acompanhamento médico regular']
    };
  }

  // Simulação de integração com bases de dados reais
  static async checkAnvisaDatabase(medicationName: string): Promise<{
    isRegistered: boolean;
    registrationNumber?: string;
    manufacturer?: string;
    registrationDate?: string;
    expirationDate?: string;
    therapeuticIndications?: string[];
  }> {
    // Simula consulta à base da ANVISA
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      isRegistered: true,
      registrationNumber: `1.${Math.floor(Math.random() * 9999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 9)}`,
      manufacturer: this.getRandomManufacturer(),
      registrationDate: '2020-01-15',
      expirationDate: '2025-01-15',
      therapeuticIndications: this.getTherapeuticIndications(medicationName)
    };
  }

  private static getRandomManufacturer(): string {
    const manufacturers = [
      'EMS S.A.',
      'Eurofarma Laboratórios S.A.',
      'Sanofi-Aventis Farmacêutica Ltda.',
      'Novartis Biociências S.A.',
      'Roche Química e Farmacêutica S.A.',
      'Pfizer Brasil Ltda.',
      'Abbott Laboratórios do Brasil Ltda.'
    ];
    return manufacturers[Math.floor(Math.random() * manufacturers.length)];
  }

  private static getTherapeuticIndications(medicationName: string): string[] {
    const commonIndications = [
      'Tratamento de condições conforme prescrição médica',
      'Uso adulto e pediátrico conforme orientação',
      'Consulte o médico para indicações específicas'
    ];
    return commonIndications;
  }
}
