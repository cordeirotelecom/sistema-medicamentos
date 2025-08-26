'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import MedicationForm from '@/components/MedicationForm';
import RecommendationDisplay from '@/components/RecommendationDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import UnsavedChangesIndicator from '@/components/UnsavedChangesIndicator';
import EmergencyContacts from '@/components/EmergencyContacts';
import { RecommendationService } from '@/services/recommendation';

export default function CidadaoPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'result'>('form');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    console.log('🚀 handleFormSubmit iniciado com dados:', formData);
    setIsLoading(true);
    setCurrentStep('loading');
    setHasUnsavedChanges(false); // Resetar ao enviar
    
    try {
      console.log('📞 Chamando RecommendationService.generateRecommendation...');
      const result = await RecommendationService.generateRecommendation(formData);
      console.log('✅ Resultado obtido:', result);
      setRecommendation(result);
      setCurrentStep('result');
    } catch (error) {
      console.error('❌ Erro ao obter recomendação:', error);
      alert('Erro ao processar consulta. Verifique o console para mais detalhes.');
      setCurrentStep('form'); // Voltar ao formulário em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setRecommendation(null);
    setHasUnsavedChanges(false); // Resetar ao voltar
  };

  const handleFormChange = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Portal do Cidadão
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Consulta Medicamentosa
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto w-full">
        {currentStep === 'form' && (
          <div className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Consulta de Medicamentos
              </h2>
              <p className="text-lg text-gray-600">
                Verifique seus direitos e receba orientações baseadas na legislação brasileira
              </p>
            </div>

            {/* Contatos de Emergência - Antes do Formulário */}
            <EmergencyContacts />
            
            {/* Links Úteis para Cidadãos */}
            <div className="mt-8 mb-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                🔗 Links Diretos - Serviços Essenciais
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://bulas.anvisa.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">🏥</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-blue-900 text-sm">Bulas ANVISA</div>
                    <div className="text-xs text-blue-700">Consultar bulas oficiais</div>
                  </div>
                  <span className="text-blue-400 group-hover:text-blue-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-green-900 text-sm">Farmácia Popular</div>
                    <div className="text-xs text-green-700">Medicamentos gratuitos</div>
                  </div>
                  <span className="text-green-400 group-hover:text-green-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.procon.rs.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">⚖️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-orange-900 text-sm">PROCON/RS</div>
                    <div className="text-xs text-orange-700">Defender seus direitos</div>
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.defensoria.rs.def.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">🛡️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-purple-900 text-sm">Defensoria/RS</div>
                    <div className="text-xs text-purple-700">Assistência gratuita</div>
                  </div>
                  <span className="text-purple-400 group-hover:text-purple-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.gov.br/pt-br/servicos/obter-medicamentos-do-componente-especializado" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">🏛️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-red-900 text-sm">Med. Especializados</div>
                    <div className="text-xs text-red-700">Alto custo/SUS</div>
                  </div>
                  <span className="text-red-400 group-hover:text-red-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.mprs.mp.br/cidadao/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-indigo-900 text-sm">MP/RS Cidadão</div>
                    <div className="text-xs text-indigo-700">Denúncias e ouvidoria</div>
                  </div>
                  <span className="text-indigo-400 group-hover:text-indigo-600 text-sm">→</span>
                </a>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-600 text-sm mt-0.5">💡</span>
                  <p className="text-xs text-yellow-800">
                    <strong>Dica:</strong> Use estes links para acessar diretamente os serviços oficiais. 
                    O sistema abaixo oferece orientações personalizadas baseadas em sua situação específica.
                  </p>
                </div>
              </div>
            </div>
            
            <MedicationForm 
              onSubmit={handleFormSubmit} 
              isLoading={isLoading}
              onFormChange={handleFormChange}
            />
          </div>
        )}
        
        {currentStep === 'loading' && (
          <LoadingSpinner />
        )}
        
        {currentStep === 'result' && recommendation && (
          <RecommendationDisplay 
            recommendation={recommendation}
            onNewSearch={handleBackToForm}
          />
        )}
        </div>
      </main>
    </div>
  );
}
