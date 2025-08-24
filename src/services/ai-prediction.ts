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
  async predictShortage(medicationId: string, region: string): Promise<ShortagePrediction> {
    try {
      const cacheKey = `shortage_${medicationId}_${region}`;
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey);
      }

      const response = await fetch(`${this.modelUrl}/predict-shortage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationId,
          region,
          timeHorizon: '90days',
          includeSupplyChain: true,
          includeSeasonality: true
        })
      });

      const data = await response.json();
      const prediction: ShortagePrediction = {
        medicationId,
        region,
        shortageRisk: data.shortageRisk || 0,
        confidence: data.confidence || 0,
        timeToShortage: data.timeToShortage || null,
        severity: data.severity || 'low',
        contributingFactors: data.contributingFactors || [],
        mitigation: data.mitigation || [],
        alternativeSources: data.alternativeSources || [],
        lastUpdated: new Date()
      };

      this.analysisCache.set(cacheKey, prediction);
      return prediction;
    } catch (error) {
      console.error('❌ Erro na predição de escassez:', error);
      return this.getDefaultShortagePrediction(medicationId, region);
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

  // Métodos auxiliares privados
  private getDefaultShortagePrediction(medicationId: string, region: string): ShortagePrediction {
    return {
      medicationId,
      region,
      shortageRisk: 0,
      confidence: 0,
      timeToShortage: null,
      severity: 'low',
      contributingFactors: [],
      mitigation: [],
      alternativeSources: [],
      lastUpdated: new Date()
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
}

// Interfaces
export interface ShortagePrediction {
  medicationId: string;
  region: string;
  shortageRisk: number; // 0-1
  confidence: number; // 0-1
  timeToShortage: Date | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  contributingFactors: string[];
  mitigation: string[];
  alternativeSources: string[];
  lastUpdated: Date;
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
      service.analyzeInteractions(medications)
  };
};
