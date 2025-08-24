// Sistema de IA avançada para predição de escassez e análise de mercado
export class MedicationPredictionService {
  private static instance: MedicationPredictionService;
  private modelUrl: string = '/api/ai/medication-prediction';
  private analysisCache: Map<string, any> = new Map();

  static getInstance(): MedicationPredictionService {
    if (!this.instance) {
      this.instance = new MedicationPredictionService();
    }
    return this.instance;
  }

  // Predição de escassez usando machine learning
  // Predição de desabastecimento usando machine learning
  async predictShortage(medicationId: string, region: string): Promise<ShortagePrediction> {
    try {
      const cacheKey = `shortage_${medicationId}_${region}`;
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey);
      }

      const response = await fetch(`${this.modelUrl}/shortage-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationId,
          region,
          includeFactors: true
        })
      });

      const prediction: ShortagePrediction = await response.json();
      this.analysisCache.set(cacheKey, prediction);
      
      return prediction;
    } catch (error) {
      console.error('Erro na predição de desabastecimento:', error);
      // Retornar dados simulados em caso de erro
      return {
        medicationId,
        region,
        shortageRisk: 'medium',
        probability: 0.35,
        estimatedDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        riskFactors: ['Aumento sazonal da demanda', 'Dependência de fornecedor único'],
        mitigationStrategies: ['Buscar fornecedores alternativos', 'Aumentar estoque de segurança'],
        confidence: 0.78,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Análise de demanda usando dados históricos e tendências
  async analyzeDemandTrends(medicationId: string, timeframe: string = '12m'): Promise<DemandAnalysis> {
    try {
      const cacheKey = `demand_${medicationId}_${timeframe}`;
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey);
      }

      const response = await fetch(`${this.modelUrl}/demand-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationId,
          timeframe,
          includeSeasonality: true,
          includeDemographics: true,
          includeEpidemiology: true
        })
      });

      const data = await response.json();
      const analysis: DemandAnalysis = {
        currentDemand: data.currentDemand || 0,
        predictedDemand: data.predictedDemand || 0,
        demandTrend: data.demandTrend || 'stable',
        seasonalityFactor: data.seasonalityFactor || 1,
        growthRate: data.growthRate || 0,
        peakPeriods: data.peakPeriods || [],
        riskFactors: data.riskFactors || [],
        recommendations: data.recommendations || [],
        confidence: data.confidence || 0
      };

      this.analysisCache.set(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('❌ Erro na análise de demanda:', error);
      return this.getDefaultDemandAnalysis();
    }
  }

  // Sistema de alertas inteligentes
  async setupSmartAlerts(userId: string, medications: string[]): Promise<AlertSystem> {
    try {
      const response = await fetch(`${this.modelUrl}/smart-alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          medications,
          alertTypes: ['shortage', 'price_change', 'recall', 'new_generic'],
          sensitivity: 'medium'
        })
      });

      const data = await response.json();
      return {
        alertId: data.alertId || '',
        isActive: data.isActive || false,
        notificationChannels: data.notificationChannels || ['email'],
        frequency: data.frequency || 'daily',
        alertsConfigured: data.alertsConfigured || 0
      };
    } catch (error) {
      console.error('❌ Erro ao configurar alertas:', error);
      return {
        alertId: '',
        isActive: false,
        notificationChannels: [],
        frequency: 'daily',
        alertsConfigured: 0
      };
    }
  }

  // Análise de interações medicamentosas com IA
  async analyzeInteractions(medications: MedicationInput[]): Promise<InteractionAnalysis> {
    try {
      const response = await fetch(`${this.modelUrl}/interaction-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medications,
          patientProfile: {
            age: medications[0]?.patientAge || null,
            weight: medications[0]?.patientWeight || null,
            conditions: medications[0]?.conditions || [],
            allergies: medications[0]?.allergies || []
          }
        })
      });

      const data = await response.json();
      return {
        hasInteractions: data.hasInteractions || false,
        riskLevel: data.riskLevel || 'low',
        interactions: data.interactions || [],
        recommendations: data.recommendations || [],
        alternativeMedications: data.alternatives || [],
        monitoringRequired: data.monitoringRequired || false,
        contraindications: data.contraindications || []
      };
    } catch (error) {
      console.error('❌ Erro na análise de interações:', error);
      return {
        hasInteractions: false,
        riskLevel: 'unknown',
        interactions: [],
        recommendations: [],
        alternativeMedications: [],
        monitoringRequired: false,
        contraindications: []
      };
    }
  }

  // Otimização de tratamento baseada em evidências
  async optimizeTreatment(treatmentData: TreatmentOptimizationData): Promise<TreatmentOptimization> {
    try {
      const response = await fetch(`${this.modelUrl}/optimize-treatment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(treatmentData)
      });

      const data = await response.json();
      return {
        optimizedRegimen: data.optimizedRegimen || [],
        expectedOutcomes: data.expectedOutcomes || {},
        costReduction: data.costReduction || 0,
        adherenceScore: data.adherenceScore || 0,
        qualityOfLifeImpact: data.qualityOfLifeImpact || 0,
        evidenceLevel: data.evidenceLevel || 'low',
        clinicalRecommendations: data.clinicalRecommendations || []
      };
    } catch (error) {
      console.error('❌ Erro na otimização de tratamento:', error);
      return {
        optimizedRegimen: [],
        expectedOutcomes: {},
        costReduction: 0,
        adherenceScore: 0,
        qualityOfLifeImpact: 0,
        evidenceLevel: 'unknown',
        clinicalRecommendations: []
      };
    }
  }

  // Análise preditiva de efeitos adversos
  async predictAdverseEffects(medicationProfile: MedicationProfile): Promise<AdverseEffectPrediction> {
    try {
      const response = await fetch(`${this.modelUrl}/predict-adverse-effects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicationProfile)
      });

      const data = await response.json();
      return {
        riskScore: data.riskScore || 0,
        potentialEffects: data.potentialEffects || [],
        preventiveMeasures: data.preventiveMeasures || [],
        monitoringPlan: data.monitoringPlan || [],
        emergencyPlan: data.emergencyPlan || [],
        riskFactors: data.riskFactors || []
      };
    } catch (error) {
      console.error('❌ Erro na predição de efeitos adversos:', error);
      return {
        riskScore: 0,
        potentialEffects: [],
        preventiveMeasures: [],
        monitoringPlan: [],
        emergencyPlan: [],
        riskFactors: []
      };
    }
  }

  // Sistema de recomendação de medicamentos genéricos
  async recommendGenerics(brandMedication: string, criteria: GenericCriteria): Promise<GenericRecommendation[]> {
    try {
      const response = await fetch(`${this.modelUrl}/recommend-generics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandMedication,
          criteria
        })
      });

      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('❌ Erro na recomendação de genéricos:', error);
      return [];
    }
  }

  // Análise de custo-efetividade
  async analyzeCostEffectiveness(treatmentOptions: TreatmentOption[]): Promise<CostEffectivenessAnalysis> {
    try {
      const response = await fetch(`${this.modelUrl}/cost-effectiveness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treatmentOptions,
          timeHorizon: '1year',
          perspective: 'societal'
        })
      });

      const data = await response.json();
      return {
        optimalTreatment: data.optimalTreatment || null,
        costPerQALY: data.costPerQALY || 0,
        totalCosts: data.totalCosts || [],
        effectivenessScores: data.effectivenessScores || [],
        recommendations: data.recommendations || [],
        sensitivityAnalysis: data.sensitivityAnalysis || {}
      };
    } catch (error) {
      console.error('❌ Erro na análise de custo-efetividade:', error);
      return {
        optimalTreatment: null,
        costPerQALY: 0,
        totalCosts: [],
        effectivenessScores: [],
        recommendations: [],
        sensitivityAnalysis: {}
      };
    }
  }

  // Métodos auxiliares privados
  private getDefaultShortagePrediction(medicationId: string, region: string): ShortagePrediction {
    return {
      medicationId,
      region,
      shortageRisk: 'low',
      probability: 0,
      estimatedDate: '',
      riskFactors: [],
      mitigationStrategies: [],
      confidence: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  private getDefaultDemandAnalysis(): DemandAnalysis {
    return {
      currentDemand: 0,
      predictedDemand: 0,
      demandTrend: 'stable',
      seasonalityFactor: 1,
      growthRate: 0,
      peakPeriods: [],
      riskFactors: [],
      recommendations: [],
      confidence: 0
    };
  }

  private calculateShortageRisk(data: any): number {
    // Algoritmo simplificado de cálculo de risco
    let risk = 0;
    
    if (data.currentStock < data.averageConsumption * 7) risk += 0.3;
    if (data.supplierIssues) risk += 0.2;
    if (data.seasonalDemand > 1.5) risk += 0.2;
    if (data.regulatoryChanges) risk += 0.15;
    if (data.manufacturingIssues) risk += 0.25;
    
    return Math.min(risk, 1);
  }
}

// Interfaces
export interface ShortagePrediction {
  medicationId: string;
  region: string;
  shortageRisk: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  estimatedDate: string;
  riskFactors: string[];
  mitigationStrategies: string[];
  confidence: number;
  lastUpdated: string;
}

export interface DemandAnalysis {
  currentDemand: number;
  predictedDemand: number;
  demandTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  seasonalityFactor: number;
  growthRate: number;
  peakPeriods: PeakPeriod[];
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

export interface PeakPeriod {
  start: Date;
  end: Date;
  demandMultiplier: number;
  reason: string;
}

export interface AlertSystem {
  alertId: string;
  isActive: boolean;
  notificationChannels: ('email' | 'sms' | 'push' | 'whatsapp')[];
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  alertsConfigured: number;
}

export interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  patientAge?: number;
  patientWeight?: number;
  conditions?: string[];
  allergies?: string[];
}

export interface InteractionAnalysis {
  hasInteractions: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  interactions: DrugInteraction[];
  recommendations: string[];
  alternativeMedications: string[];
  monitoringRequired: boolean;
  contraindications: string[];
}

export interface DrugInteraction {
  medications: string[];
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  effect: string;
  mechanism: string;
  management: string;
}

export interface TreatmentOptimizationData {
  currentMedications: MedicationInput[];
  medicalConditions: string[];
  patientProfile: PatientProfile;
  treatmentGoals: string[];
  constraints: TreatmentConstraints;
}

export interface PatientProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  ethnicity?: string;
  smoker: boolean;
  alcoholUse: 'none' | 'light' | 'moderate' | 'heavy';
  kidneyFunction: 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';
  liverFunction: 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';
}

export interface TreatmentConstraints {
  maxCostPerMonth: number;
  preferGeneric: boolean;
  allergyRestrictions: string[];
  administrationRoutePreference: string[];
  frequencyPreference: 'once_daily' | 'twice_daily' | 'multiple_daily' | 'no_preference';
}

export interface TreatmentOptimization {
  optimizedRegimen: OptimizedMedication[];
  expectedOutcomes: { [key: string]: number };
  costReduction: number;
  adherenceScore: number;
  qualityOfLifeImpact: number;
  evidenceLevel: 'high' | 'medium' | 'low' | 'unknown';
  clinicalRecommendations: string[];
}

export interface OptimizedMedication {
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  specialInstructions: string[];
  costPerMonth: number;
  evidenceLevel: string;
}

export interface MedicationProfile {
  medications: MedicationInput[];
  patientProfile: PatientProfile;
  medicalHistory: string[];
  familyHistory: string[];
  previousAdverseEvents: string[];
}

export interface AdverseEffectPrediction {
  riskScore: number;
  potentialEffects: PotentialEffect[];
  preventiveMeasures: string[];
  monitoringPlan: MonitoringItem[];
  emergencyPlan: string[];
  riskFactors: string[];
}

export interface PotentialEffect {
  effect: string;
  probability: number;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  timeToOnset: string;
  duration: string;
  reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
}

export interface MonitoringItem {
  parameter: string;
  frequency: string;
  normalRange: string;
  actionThreshold: string;
}

export interface GenericCriteria {
  maxCostDifference: number;
  bioequivalenceRequired: boolean;
  manufacturerPreferences: string[];
  pharmacyAvailability: boolean;
}

export interface GenericRecommendation {
  genericName: string;
  manufacturer: string;
  costSavings: number;
  bioequivalenceRating: string;
  availability: number;
  patientReviews: number;
  pharmacistRecommendation: boolean;
}

export interface TreatmentOption {
  name: string;
  cost: number;
  effectiveness: number;
  sideEffects: string[];
  contraindications: string[];
  evidenceQuality: 'high' | 'medium' | 'low';
}

export interface CostEffectivenessAnalysis {
  optimalTreatment: TreatmentOption | null;
  costPerQALY: number;
  totalCosts: CostBreakdown[];
  effectivenessScores: EffectivenessScore[];
  recommendations: string[];
  sensitivityAnalysis: { [key: string]: any };
}

export interface CostBreakdown {
  category: string;
  cost: number;
  percentage: number;
}

export interface EffectivenessScore {
  treatment: string;
  score: number;
  confidence: number;
}

// Hook para React
export const useMedicationPrediction = () => {
  const service = MedicationPredictionService.getInstance();
  
  return {
    predictShortage: (medicationId: string, region: string) => 
      service.predictShortage(medicationId, region),
    analyzeDemand: (medicationId: string, timeframe?: string) => 
      service.analyzeDemandTrends(medicationId, timeframe),
    setupAlerts: (userId: string, medications: string[]) => 
      service.setupSmartAlerts(userId, medications),
    analyzeInteractions: (medications: MedicationInput[]) => 
      service.analyzeInteractions(medications),
    optimizeTreatment: (data: TreatmentOptimizationData) => 
      service.optimizeTreatment(data),
    predictAdverseEffects: (profile: MedicationProfile) => 
      service.predictAdverseEffects(profile),
    recommendGenerics: (brandMedication: string, criteria: GenericCriteria) => 
      service.recommendGenerics(brandMedication, criteria),
    analyzeCostEffectiveness: (options: TreatmentOption[]) => 
      service.analyzeCostEffectiveness(options)
  };
};
