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
      {/* Header Melhorado */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-200 sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar</span>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Portal do Cidadão
                </h1>
                <p className="text-sm text-gray-600">Sistema de Orientação Medicamentosa</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-blue-600">Atendimento Digital</div>
              <div className="text-xs text-gray-500">Baseado na legislação brasileira</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto w-full">
        {currentStep === 'form' && (
          <div className="w-full space-y-8">
            {/* Hero Section Melhorada */}
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-200">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Consulta de Medicamentos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Obtenha orientações personalizadas sobre seus direitos relacionados a medicamentos, 
                baseadas na legislação brasileira vigente
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Análise Jurídica com IA
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Legislação Atualizada 2024-2025
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Recomendações Personalizadas
                </span>
              </div>
            </div>

            {/* Contatos de Emergência */}
            <EmergencyContacts />
            
            {/* Links Úteis Melhorados */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Acesso Rápido - Serviços Oficiais
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://bulas.anvisa.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-blue-900 text-sm">Bulas ANVISA</div>
                    <div className="text-xs text-blue-700">Consultar bulas oficiais de medicamentos</div>
                  </div>
                  <span className="text-blue-400 group-hover:text-blue-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">Rx</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-green-900 text-sm">Farmácia Popular</div>
                    <div className="text-xs text-green-700">Medicamentos com desconto e gratuitos</div>
                  </div>
                  <span className="text-green-400 group-hover:text-green-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.procon.rs.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">⚖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-orange-900 text-sm">PROCON/RS</div>
                    <div className="text-xs text-orange-700">Defesa dos direitos do consumidor</div>
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.defensoria.rs.def.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">DP</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-purple-900 text-sm">Defensoria Pública/RS</div>
                    <div className="text-xs text-purple-700">Assistência jurídica gratuita</div>
                  </div>
                  <span className="text-purple-400 group-hover:text-purple-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.gov.br/pt-br/servicos/obter-medicamentos-do-componente-especializado" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">SUS</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-red-900 text-sm">Medicamentos Especializados</div>
                    <div className="text-xs text-red-700">Alto custo pelo SUS</div>
                  </div>
                  <span className="text-red-400 group-hover:text-red-600 text-sm">→</span>
                </a>

                <a 
                  href="https://www.mprs.mp.br/cidadao/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">MP</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-indigo-900 text-sm">Ministério Público/RS</div>
                    <div className="text-xs text-indigo-700">Canal do cidadão - denúncias</div>
                  </div>
                  <span className="text-indigo-400 group-hover:text-indigo-600 text-sm">→</span>
                </a>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Informação Importante</h4>
                    <p className="text-sm text-blue-800">
                      Use estes links para acessar diretamente os serviços oficiais. 
                      O formulário abaixo oferece orientações personalizadas baseadas em sua situação específica.
                    </p>
                  </div>
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
