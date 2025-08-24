export interface MedicationRequest {
  medicationName: string;
  issueType: 'shortage' | 'quality' | 'adverse_reaction' | 'registration' | 'price' | 'accessibility' | 'import' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  patientInfo?: {
    age?: number;
    hasChronicCondition: boolean;
    isPregnant: boolean;
    isBrazilianCitizen: boolean;
  };
  location: {
    state: string;
    city: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface GovernmentAgency {
  id: string;
  name: string;
  acronym: string;
  description: string;
  responsibilities: string[];
  contactInfo: {
    website: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  onlineServices: ServiceLink[];
  applicableIssues: string[];
  processingTime: string;
  documentsRequired: string[];
}

export interface ServiceLink {
  name: string;
  url: string;
  description: string;
  isMainService: boolean;
}

export interface Recommendation {
  primaryAgency: GovernmentAgency;
  secondaryAgencies: GovernmentAgency[];
  steps: RecommendationStep[];
  estimatedTime: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  additionalInfo: string;
}

export interface LegalAnalysis {
  hasRight: boolean;
  confidence: 'high' | 'medium' | 'low';
  legalBasis: string[];
  reasoning: string;
  requiredDocuments: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  } | null;
  urgencyJustification?: string;
}

export interface MPERecommendation {
  recommended: boolean;
  reason: string;
  stateAgency: GovernmentAgency | null;
}

export interface RecommendationStep {
  order: number;
  title: string;
  description: string;
  agency: string;
  documents?: string[];
  links?: ServiceLink[];
  estimatedTime?: string;
}

export interface BrazilianState {
  code: string;
  name: string;
}

export interface City {
  name: string;
  state: string;
}
