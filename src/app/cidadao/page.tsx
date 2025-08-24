'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import MedicationForm from '@/components/MedicationForm';
import RecommendationDisplay from '@/components/RecommendationDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { RecommendationService } from '@/services/recommendation';

export default function CidadaoPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'result'>('form');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setCurrentStep('loading');
    
    try {
      const result = await RecommendationService.generateRecommendation(formData);
      setRecommendation(result);
      setCurrentStep('result');
    } catch (error) {
      console.error('Erro ao obter recomendação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setRecommendation(null);
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
            <MedicationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
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
