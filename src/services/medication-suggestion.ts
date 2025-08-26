/**
 * Serviço de Sugestão de Medicamentos
 * Fornece autocomplete e correções para nomes de medicamentos
 */

import { AnvisaConsultationService } from './anvisa-consultation';

export interface MedicationSuggestion {
  name: string;
  activeSubstance: string;
  category: string;
  similarity: number;
}

export class MedicationSuggestionService {
  /**
   * Gera sugestões baseadas no texto digitado
   */
  static async getSuggestions(query: string): Promise<MedicationSuggestion[]> {
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    
    // Busca na base de medicamentos ANVISA
    const medications = await AnvisaConsultationService.getSUSMedications();
    
    const suggestions = medications
      .map(med => ({
        name: med.name,
        activeSubstance: med.activeSubstance,
        category: med.category,
        similarity: this.calculateSimilarity(searchTerm, med.name, med.activeSubstance)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return suggestions;
  }

  /**
   * Calcula similaridade considerando nome e princípio ativo
   */
  private static calculateSimilarity(query: string, name: string, activeSubstance: string): number {
    const queryLower = query.toLowerCase();
    const nameLower = name.toLowerCase();
    const activeLower = activeSubstance.toLowerCase();

    // Match exato
    if (nameLower.includes(queryLower) || activeLower.includes(queryLower)) {
      return 1.0;
    }

    // Match por palavras
    const queryWords = queryLower.split(/\s+/);
    const nameWords = nameLower.split(/\s+/);
    const activeWords = activeLower.split(/\s+/);

    let matchCount = 0;
    let totalWords = queryWords.length;

    for (const qword of queryWords) {
      if (qword.length < 3) continue; // Ignora palavras muito pequenas
      
      const nameMatch = nameWords.some(nword => 
        nword.includes(qword) || qword.includes(nword)
      );
      const activeMatch = activeWords.some(aword => 
        aword.includes(qword) || qword.includes(aword)
      );

      if (nameMatch || activeMatch) {
        matchCount++;
      }
    }

    if (totalWords === 0) return 0;
    return matchCount / totalWords;
  }

  /**
   * Detecta possíveis erros de digitação e sugere correções
   */
  static async detectTypos(medicationName: string): Promise<string[]> {
    if (!medicationName || medicationName.length < 3) return [];

    const suggestions = await this.getSuggestions(medicationName);
    
    // Retorna apenas sugestões com alta similaridade (possíveis erros de digitação)
    return suggestions
      .filter(s => s.similarity > 0.6 && s.similarity < 1.0)
      .map(s => s.name)
      .slice(0, 3);
  }

  /**
   * Lista de medicamentos mais comuns para autocomplete
   */
  static getCommonMedications(): string[] {
    return [
      'PARACETAMOL 500MG',
      'DIPIRONA 500MG', 
      'LOSARTANA POTÁSSICA 50MG',
      'OMEPRAZOL 20MG',
      'METFORMINA 850MG',
      'CAPTOPRIL 25MG',
      'ATENOLOL 25MG',
      'SINVASTATINA 20MG',
      'AMOXICILINA 500MG',
      'HIDROCLOROTIAZIDA 25MG',
      'PREDNISONA 20MG',
      'LEVOTIROXINA 50MCG',
      'GLIBENCLAMIDA 5MG',
      'INSULINA HUMANA NPH'
    ];
  }

  /**
   * Valida se o nome do medicamento é válido
   */
  static async validateMedicationName(name: string): Promise<{
    isValid: boolean;
    suggestions: string[];
    message: string;
  }> {
    if (!name || name.trim().length < 2) {
      return {
        isValid: false,
        suggestions: this.getCommonMedications().slice(0, 3),
        message: 'Nome do medicamento deve ter pelo menos 2 caracteres'
      };
    }

    const result = await AnvisaConsultationService.consultMedication(name);
    
    if (result.found) {
      return {
        isValid: true,
        suggestions: [],
        message: '✅ Medicamento encontrado na base ANVISA'
      };
    }

    const typoSuggestions = await this.detectTypos(name);
    
    if (typoSuggestions.length > 0) {
      return {
        isValid: false,
        suggestions: typoSuggestions,
        message: 'Medicamento não encontrado. Você quis dizer...?'
      };
    }

    return {
      isValid: false,
      suggestions: this.getCommonMedications().slice(0, 3),
      message: 'Medicamento não encontrado. Verifique a grafia ou tente um destes:'
    };
  }
}
