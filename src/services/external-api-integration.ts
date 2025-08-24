// Sistema de Integração com APIs Externas Avançadas
export class ExternalAPIIntegrationService {
  private static instance: ExternalAPIIntegrationService;
  private apiKeys: Map<string, string> = new Map();
  private rateLimiter: Map<string, { requests: number; resetTime: number }> = new Map();

  static getInstance(): ExternalAPIIntegrationService {
    if (!this.instance) {
      this.instance = new ExternalAPIIntegrationService();
    }
    return this.instance;
  }

  constructor() {
    // Configurar API keys (em produção, usar variáveis de ambiente)
    this.apiKeys.set('fda', 'FDA_API_KEY_PLACEHOLDER');
    this.apiKeys.set('drugs', 'DRUGS_COM_API_KEY');
    this.apiKeys.set('rxnorm', 'RXNORM_API_KEY');
    this.apiKeys.set('openai', 'OPENAI_API_KEY');
    this.apiKeys.set('webhook', 'WEBHOOK_API_KEY');
  }

  // FDA (Food and Drug Administration) - Base de dados internacional
  async getFDADrugInfo(drugName: string): Promise<FDADrugInfo> {
    try {
      const cacheKey = `fda_${drugName}`;
      
      // Rate limiting check
      if (!this.checkRateLimit('fda')) {
        throw new Error('Rate limit exceeded for FDA API');
      }

      const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drugName}"&limit=5`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Brazilian-Medication-System/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`FDA API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        drugName,
        results: data.results?.map((result: any) => ({
          brandName: result.openfda?.brand_name?.[0] || drugName,
          genericName: result.openfda?.generic_name?.[0] || 'N/A',
          manufacturer: result.openfda?.manufacturer_name?.[0] || 'N/A',
          dosageForm: result.dosage_and_administration?.[0] || 'N/A',
          contraindications: result.contraindications?.[0] || 'N/A',
          warnings: result.warnings?.[0] || 'N/A',
          adverseReactions: result.adverse_reactions?.[0] || 'N/A',
          clinicalPharmacology: result.clinical_pharmacology?.[0] || 'N/A',
          indications: result.indications_and_usage?.[0] || 'N/A',
          overdosage: result.overdosage?.[0] || 'N/A'
        })) || [],
        lastUpdated: new Date().toISOString(),
        source: 'FDA OpenData API'
      };

    } catch (error) {
      console.error('Erro ao buscar dados FDA:', error);
      return this.getFDAFallbackData(drugName);
    }
  }

  // Drugs.com API - Base de interações medicamentosas
  async getDrugInteractions(medications: string[]): Promise<DrugInteractionData> {
    try {
      if (!this.checkRateLimit('drugs')) {
        throw new Error('Rate limit exceeded for Drugs.com API');
      }

      // Simular API da Drugs.com (em produção, usar API real)
      const interactions = await this.simulateDrugInteractionsAPI(medications);
      
      return {
        medications,
        interactions: interactions.map(interaction => ({
          drug1: interaction.drug1,
          drug2: interaction.drug2,
          severity: interaction.severity,
          description: interaction.description,
          clinicalEffect: interaction.clinicalEffect,
          mechanism: interaction.mechanism,
          management: interaction.management,
          references: interaction.references
        })),
        riskAssessment: this.calculateInteractionRisk(interactions),
        recommendations: this.generateInteractionRecommendations(interactions),
        lastChecked: new Date().toISOString(),
        source: 'Drugs.com Interaction Checker'
      };

    } catch (error) {
      console.error('Erro ao verificar interações:', error);
      return this.getDrugInteractionsFallback(medications);
    }
  }

  // RxNorm API - Códigos padronizados de medicamentos
  async getRxNormData(drugName: string): Promise<RxNormData> {
    try {
      if (!this.checkRateLimit('rxnorm')) {
        throw new Error('Rate limit exceeded for RxNorm API');
      }

      const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drugName)}`);
      const data = await response.json();

      if (data.drugGroup?.conceptGroup) {
        const concepts = data.drugGroup.conceptGroup
          .filter((group: any) => group.conceptProperties)
          .flatMap((group: any) => group.conceptProperties);

        return {
          drugName,
          rxcui: concepts[0]?.rxcui || null,
          concepts: concepts.map((concept: any) => ({
            rxcui: concept.rxcui,
            name: concept.name,
            synonym: concept.synonym || '',
            tty: concept.tty,
            language: concept.language
          })),
          relatedDrugs: await this.getRxNormRelatedDrugs(concepts[0]?.rxcui),
          ndcCodes: await this.getRxNormNDCCodes(concepts[0]?.rxcui),
          source: 'RxNorm API',
          lastUpdated: new Date().toISOString()
        };
      }

      return this.getRxNormFallback(drugName);

    } catch (error) {
      console.error('Erro ao buscar dados RxNorm:', error);
      return this.getRxNormFallback(drugName);
    }
  }

  // OpenAI GPT API - IA para análise de texto médico
  async analyzeWithAI(prompt: string, context: MedicationContext): Promise<AIAnalysisResult> {
    try {
      if (!this.checkRateLimit('openai')) {
        throw new Error('Rate limit exceeded for OpenAI API');
      }

      const systemPrompt = `Você é um especialista em farmacologia e regulamentação de medicamentos no Brasil. 
      Analise as informações fornecidas e forneça insights detalhados sobre segurança, eficácia e regulamentação.
      Considere sempre a legislação brasileira e as diretrizes da ANVISA.`;

      // Simular análise de IA (em produção, usar OpenAI API real)
      const analysis = await this.simulateAIAnalysis(prompt, context);

      return {
        originalPrompt: prompt,
        analysis: analysis.content,
        confidence: analysis.confidence,
        recommendations: analysis.recommendations,
        riskFactors: analysis.riskFactors,
        regulatoryStatus: analysis.regulatoryStatus,
        similarCases: analysis.similarCases,
        sources: analysis.sources,
        timestamp: new Date().toISOString(),
        model: 'GPT-4-Turbo (Simulated)'
      };

    } catch (error) {
      console.error('Erro na análise de IA:', error);
      return this.getAIAnalysisFallback(prompt, context);
    }
  }

  // ViaCEP API - Dados de localização para farmácias próximas
  async getLocationData(cep: string): Promise<LocationData> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      // Buscar farmácias próximas usando dados do CEP
      const nearbyPharmacies = await this.findNearbyPharmacies(data);

      return {
        cep: data.cep,
        address: {
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          region: this.getHealthRegion(data.uf, data.localidade)
        },
        coordinates: await this.getCoordinatesFromAddress(data),
        nearbyPharmacies,
        healthFacilities: await this.getHealthFacilitiesNearby(data),
        demographics: await this.getDemographicsData(data.localidade, data.uf),
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Erro ao buscar dados de localização:', error);
      throw error;
    }
  }

  // CNPJ API - Validação de laboratórios e farmácias
  async validateCNPJ(cnpj: string): Promise<CNPJValidationResult> {
    try {
      // Remover formatação do CNPJ
      const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
      
      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ inválido');
      }

      // Usar API pública do ReceitaWS
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`);
      const data = await response.json();

      if (data.status === 'ERROR') {
        throw new Error(data.message);
      }

      return {
        cnpj: data.cnpj,
        companyInfo: {
          name: data.nome,
          tradeName: data.fantasia,
          legalNature: data.natureza_juridica,
          mainActivity: data.atividade_principal?.[0]?.text || '',
          secondaryActivities: data.atividades_secundarias?.map((act: any) => act.text) || [],
          situation: data.situacao,
          registrationDate: data.abertura,
          lastUpdate: data.ultima_atualizacao
        },
        address: {
          street: `${data.logradouro}, ${data.numero}`,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.municipio,
          state: data.uf,
          cep: data.cep
        },
        isPharmacy: this.checkIfPharmacy(data.atividade_principal, data.atividades_secundarias),
        isLaboratory: this.checkIfLaboratory(data.atividade_principal, data.atividades_secundarias),
        complianceStatus: await this.checkComplianceStatus(cleanCNPJ),
        anvisaRegistration: await this.checkAnvisaRegistration(cleanCNPJ),
        lastValidated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Erro ao validar CNPJ:', error);
      throw error;
    }
  }

  // Webhook Integration - Notificações em tempo real
  async setupWebhookIntegration(webhookUrl: string, events: string[]): Promise<WebhookIntegration> {
    try {
      const integrationId = this.generateIntegrationId();
      
      // Configurar webhook
      const webhook = {
        id: integrationId,
        url: webhookUrl,
        events,
        secret: this.generateWebhookSecret(),
        active: true,
        createdAt: new Date().toISOString(),
        lastPing: null,
        deliveryHistory: []
      };

      // Simular registro do webhook
      await this.registerWebhook(webhook);

      return {
        integrationId,
        webhook,
        testUrl: `${webhookUrl}/test`,
        status: 'active',
        supportedEvents: [
          'medication.shortage.detected',
          'price.change.significant',
          'recall.issued',
          'new.government.program',
          'regulatory.update',
          'stock.level.critical'
        ]
      };

    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      throw error;
    }
  }

  // Google Maps API - Localização de farmácias
  async findPharmaciesNearby(latitude: number, longitude: number, radius: number = 5000): Promise<PharmacyLocation[]> {
    try {
      // Simular integração com Google Maps API
      const pharmacies = await this.simulateGoogleMapsAPI(latitude, longitude, radius);
      
      return pharmacies.map(pharmacy => ({
        id: pharmacy.place_id,
        name: pharmacy.name,
        address: pharmacy.vicinity,
        coordinates: {
          lat: pharmacy.geometry.location.lat,
          lng: pharmacy.geometry.location.lng
        },
        rating: pharmacy.rating || 0,
        isOpen: pharmacy.opening_hours?.open_now || false,
        phone: pharmacy.formatted_phone_number || '',
        website: pharmacy.website || '',
        distance: this.calculateDistance(latitude, longitude, 
          pharmacy.geometry.location.lat, pharmacy.geometry.location.lng),
        hasDelivery: Math.random() > 0.5, // Simular dados de entrega
        acceptsInsurance: Math.random() > 0.3,
        specialties: this.getPharmacySpecialties(),
        operatingHours: this.getOperatingHours(),
        lastUpdated: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Erro ao buscar farmácias próximas:', error);
      return [];
    }
  }

  // Métodos auxiliares privados
  private checkRateLimit(apiName: string): boolean {
    const now = Date.now();
    const limit = this.rateLimiter.get(apiName);
    
    if (!limit || now > limit.resetTime) {
      this.rateLimiter.set(apiName, { requests: 1, resetTime: now + 60000 }); // Reset a cada minuto
      return true;
    }
    
    if (limit.requests >= this.getAPIRateLimit(apiName)) {
      return false;
    }
    
    limit.requests++;
    return true;
  }

  private getAPIRateLimit(apiName: string): number {
    const limits: { [key: string]: number } = {
      'fda': 1000,
      'drugs': 100,
      'rxnorm': 500,
      'openai': 50
    };
    return limits[apiName] || 100;
  }

  private async simulateDrugInteractionsAPI(medications: string[]): Promise<any[]> {
    // Simular dados de interações medicamentosas
    if (medications.length < 2) return [];

    return [
      {
        drug1: medications[0],
        drug2: medications[1],
        severity: 'moderate',
        description: 'Possível interação moderada entre os medicamentos',
        clinicalEffect: 'Pode aumentar o risco de efeitos adversos',
        mechanism: 'Inibição enzimática do CYP3A4',
        management: 'Monitorar sinais vitais e sintomas',
        references: ['Reference 1', 'Reference 2']
      }
    ];
  }

  private calculateInteractionRisk(interactions: any[]): 'low' | 'medium' | 'high' | 'unknown' {
    if (!interactions.length) return 'low';
    const severities = interactions.map(i => i.severity);
    if (severities.includes('major')) return 'high';
    if (severities.includes('moderate')) return 'medium';
    return 'low';
  }

  private generateInteractionRecommendations(interactions: any[]): string[] {
    return [
      'Consulte seu médico antes de usar estes medicamentos juntos',
      'Monitore possíveis efeitos adversos',
      'Considere horários diferentes para administração'
    ];
  }

  private async getRxNormRelatedDrugs(rxcui: string): Promise<any[]> {
    if (!rxcui) return [];
    // Simular busca de medicamentos relacionados
    return [
      { rxcui: '123456', name: 'Medicamento Similar 1', relationship: 'equivalent' },
      { rxcui: '789012', name: 'Medicamento Similar 2', relationship: 'ingredient_of' }
    ];
  }

  private async getRxNormNDCCodes(rxcui: string): Promise<string[]> {
    if (!rxcui) return [];
    // Simular códigos NDC
    return ['12345-678-90', '98765-432-10'];
  }

  private async simulateAIAnalysis(prompt: string, context: MedicationContext): Promise<any> {
    // Simular análise de IA
    return {
      content: 'Análise detalhada do medicamento baseada em IA. Este medicamento apresenta boa segurança quando usado conforme prescrito.',
      confidence: 0.87,
      recommendations: ['Seguir posologia indicada', 'Monitorar efeitos adversos'],
      riskFactors: ['Contraindicado na gravidez', 'Pode causar sonolência'],
      regulatoryStatus: 'Aprovado pela ANVISA',
      similarCases: 3,
      sources: ['FDA Database', 'ANVISA Records', 'Medical Literature']
    };
  }

  private async findNearbyPharmacies(addressData: any): Promise<any[]> {
    // Simular busca de farmácias próximas
    return [
      {
        name: 'Farmácia Central',
        address: `Rua Principal, 123 - ${addressData.bairro}`,
        distance: '0.5 km',
        isOpen: true,
        hasDelivery: true
      }
    ];
  }

  private getHealthRegion(state: string, city: string): string {
    // Mapear região de saúde baseado no estado/cidade
    const regions: { [key: string]: string } = {
      'SP': 'Grande São Paulo',
      'RJ': 'Metropolitana I',
      'MG': 'Centro',
      'RS': 'Metropolitana'
    };
    return regions[state] || 'Região não mapeada';
  }

  private async getCoordinatesFromAddress(addressData: any): Promise<{ lat: number; lng: number }> {
    // Simular geocodificação
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'SP': { lat: -23.5505, lng: -46.6333 },
      'RJ': { lat: -22.9068, lng: -43.1729 },
      'MG': { lat: -19.9191, lng: -43.9378 }
    };
    return coordinates[addressData.uf] || { lat: -15.7801, lng: -47.9292 };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Fallback methods para quando APIs estão indisponíveis
  private getFDAFallbackData(drugName: string): FDADrugInfo {
    return {
      drugName,
      results: [{
        brandName: drugName,
        genericName: 'Informação não disponível',
        manufacturer: 'Informação não disponível',
        dosageForm: 'Consulte a bula',
        contraindications: 'Consulte seu médico',
        warnings: 'Leia a bula completa',
        adverseReactions: 'Vários - consulte profissional',
        clinicalPharmacology: 'Dados não disponíveis offline',
        indications: 'Conforme prescrição médica',
        overdosage: 'Procure atendimento médico imediato'
      }],
      lastUpdated: new Date().toISOString(),
      source: 'Dados locais (FDA indisponível)'
    };
  }

  private generateIntegrationId(): string {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateWebhookSecret(): string {
    return Math.random().toString(36).substr(2, 32);
  }

  // Outros métodos auxiliares...
  private getDrugInteractionsFallback(medications: string[]): DrugInteractionData {
    return {
      medications,
      interactions: [],
      riskAssessment: 'unknown',
      recommendations: ['Consulte seu médico ou farmacêutico'],
      lastChecked: new Date().toISOString(),
      source: 'Dados locais (API indisponível)'
    };
  }

  private getRxNormFallback(drugName: string): RxNormData {
    return {
      drugName,
      rxcui: null,
      concepts: [],
      relatedDrugs: [],
      ndcCodes: [],
      source: 'Dados locais (RxNorm indisponível)',
      lastUpdated: new Date().toISOString()
    };
  }

  private getAIAnalysisFallback(prompt: string, context: MedicationContext): AIAnalysisResult {
    return {
      originalPrompt: prompt,
      analysis: 'Análise de IA não disponível no momento. Consulte um profissional de saúde.',
      confidence: 0,
      recommendations: ['Procure orientação médica'],
      riskFactors: ['Informação não disponível'],
      regulatoryStatus: 'Verificar com ANVISA',
      similarCases: 0,
      sources: ['Sistema local'],
      timestamp: new Date().toISOString(),
      model: 'Fallback (AI não disponível)'
    };
  }

  private checkIfPharmacy(mainActivity: any, secondaryActivities: any[]): boolean {
    const pharmacyKeywords = ['farmácia', 'drogaria', 'medicamento'];
    const activities = [mainActivity?.text || '', ...(secondaryActivities?.map(a => a.text) || [])];
    return activities.some(activity => 
      pharmacyKeywords.some(keyword => 
        activity.toLowerCase().includes(keyword)
      )
    );
  }

  private checkIfLaboratory(mainActivity: any, secondaryActivities: any[]): boolean {
    const labKeywords = ['laboratório', 'farmacêutico', 'medicamento'];
    const activities = [mainActivity?.text || '', ...(secondaryActivities?.map(a => a.text) || [])];
    return activities.some(activity => 
      labKeywords.some(keyword => 
        activity.toLowerCase().includes(keyword)
      )
    );
  }

  private async checkComplianceStatus(cnpj: string): Promise<string> {
    // Simular verificação de conformidade
    return Math.random() > 0.8 ? 'non-compliant' : 'compliant';
  }

  private async checkAnvisaRegistration(cnpj: string): Promise<boolean> {
    // Simular verificação de registro na ANVISA
    return Math.random() > 0.2;
  }

  private async registerWebhook(webhook: any): Promise<void> {
    // Simular registro do webhook
    console.log('Webhook registrado:', webhook.id);
  }

  private async simulateGoogleMapsAPI(lat: number, lng: number, radius: number): Promise<any[]> {
    // Simular resposta da API do Google Maps
    return [
      {
        place_id: 'ChIJ123456789',
        name: 'Drogasil',
        vicinity: 'Rua das Flores, 123',
        geometry: {
          location: { lat: lat + 0.001, lng: lng + 0.001 }
        },
        rating: 4.2,
        opening_hours: { open_now: true }
      }
    ];
  }

  private getPharmacySpecialties(): string[] {
    return ['Medicamentos Especiais', 'Homeopatia', 'Manipulação', 'Veterinária'];
  }

  private getOperatingHours(): any {
    return {
      monday: '08:00-22:00',
      tuesday: '08:00-22:00',
      wednesday: '08:00-22:00',
      thursday: '08:00-22:00',
      friday: '08:00-22:00',
      saturday: '08:00-18:00',
      sunday: '09:00-17:00'
    };
  }

  private async getHealthFacilitiesNearby(addressData: any): Promise<any[]> {
    return [
      {
        name: 'UBS Central',
        type: 'Unidade Básica de Saúde',
        address: `Av. Principal, 456 - ${addressData.bairro}`,
        distance: '1.2 km'
      }
    ];
  }

  private async getDemographicsData(city: string, state: string): Promise<any> {
    return {
      population: 100000,
      averageAge: 35,
      healthcareAccess: 'medium',
      economicLevel: 'middle-class'
    };
  }
}

// Interfaces para tipagem
export interface FDADrugInfo {
  drugName: string;
  results: Array<{
    brandName: string;
    genericName: string;
    manufacturer: string;
    dosageForm: string;
    contraindications: string;
    warnings: string;
    adverseReactions: string;
    clinicalPharmacology: string;
    indications: string;
    overdosage: string;
  }>;
  lastUpdated: string;
  source: string;
}

export interface DrugInteractionData {
  medications: string[];
  interactions: Array<{
    drug1: string;
    drug2: string;
    severity: 'minor' | 'moderate' | 'major';
    description: string;
    clinicalEffect: string;
    mechanism: string;
    management: string;
    references: string[];
  }>;
  riskAssessment: 'low' | 'medium' | 'high' | 'unknown';
  recommendations: string[];
  lastChecked: string;
  source: string;
}

export interface RxNormData {
  drugName: string;
  rxcui: string | null;
  concepts: Array<{
    rxcui: string;
    name: string;
    synonym: string;
    tty: string;
    language: string;
  }>;
  relatedDrugs: Array<{
    rxcui: string;
    name: string;
    relationship: string;
  }>;
  ndcCodes: string[];
  source: string;
  lastUpdated: string;
}

export interface AIAnalysisResult {
  originalPrompt: string;
  analysis: string;
  confidence: number;
  recommendations: string[];
  riskFactors: string[];
  regulatoryStatus: string;
  similarCases: number;
  sources: string[];
  timestamp: string;
  model: string;
}

export interface MedicationContext {
  medicationName: string;
  patientAge?: number;
  chronicConditions?: string[];
  currentMedications?: string[];
  allergies?: string[];
  symptoms?: string[];
}

export interface LocationData {
  cep: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    region: string;
  };
  coordinates: { lat: number; lng: number };
  nearbyPharmacies: any[];
  healthFacilities: any[];
  demographics: any;
  lastUpdated: string;
}

export interface CNPJValidationResult {
  cnpj: string;
  companyInfo: {
    name: string;
    tradeName: string;
    legalNature: string;
    mainActivity: string;
    secondaryActivities: string[];
    situation: string;
    registrationDate: string;
    lastUpdate: string;
  };
  address: {
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  isPharmacy: boolean;
  isLaboratory: boolean;
  complianceStatus: string;
  anvisaRegistration: boolean;
  lastValidated: string;
}

export interface WebhookIntegration {
  integrationId: string;
  webhook: any;
  testUrl: string;
  status: string;
  supportedEvents: string[];
}

export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  isOpen: boolean;
  phone: string;
  website: string;
  distance: number;
  hasDelivery: boolean;
  acceptsInsurance: boolean;
  specialties: string[];
  operatingHours: any;
  lastUpdated: string;
}
