'use client';

import { Recommendation, LegalAnalysis, MPERecommendation } from '@/types';
import { Building2, Clock, AlertTriangle, ExternalLink, FileText, Phone, Mail, MapPin, CheckCircle, Pill, Scale, AlertCircle, Shield, BarChart3, Brain, TrendingUp, MessageCircle, Bell, Zap } from 'lucide-react';
import Feedback from './Feedback';
// import AdvancedDashboard from './AdvancedDashboard';
import IntelligentChatWidget from './IntelligentChatWidget';
import { GovernmentIntegrationService } from '../services/government-integration';
import { AdvancedNotificationService } from '../services/advanced-notifications';
import { useState, useEffect, useCallback } from 'react';

interface RecommendationDisplayProps {
  recommendation: Recommendation & {
    legalAnalysis: LegalAnalysis;
    mpeRecommendation?: MPERecommendation;
  };
  onNewSearch: () => void;
}

export default function RecommendationDisplay({ recommendation, onNewSearch }: RecommendationDisplayProps) {
  type ViewType = 'standard' | 'dashboard' | 'chat' | 'notifications';
  const [activeView, setActiveView] = useState<ViewType>('standard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [governmentData, setGovernmentData] = useState<any>(null);

  const initializeAdvancedServices = useCallback(async () => {
    try {
      // Inicializar notificações
      const notificationService = AdvancedNotificationService.getInstance();
      await notificationService.initialize();

      // Buscar dados governamentais integrados
      const govService = GovernmentIntegrationService.getInstance();
      const integratedData = await govService.getIntegratedAnalysis({
        medicationName: 'Medicamento Solicitado', // placeholder
        location: 'São Paulo, SP',
        state: 'SP',
        city: 'São Paulo'
      });
      
      setGovernmentData(integratedData);

      // Configurar notificações baseadas na recomendação
      if (recommendation.urgencyLevel === 'high') {
        await notificationService.notifyMedicationCritical({
          medicationId: '1',
          medicationName: 'Medicamento Solicitado',
          criticalReason: 'Alta prioridade médica detectada',
          severity: 'high',
          recommendedAction: 'Procure atendimento médico imediatamente'
        });
      }

    } catch (error) {
      console.error('Erro ao inicializar serviços avançados:', error);
    }
  }, [recommendation.urgencyLevel]);

  useEffect(() => {
    // Inicializar serviços avançados
    initializeAdvancedServices();
  }, [initializeAdvancedServices]);
  
  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50',
      'medium': 'text-yellow-600 bg-yellow-50',
      'high': 'text-orange-600 bg-orange-50',
      'emergency': 'text-red-600 bg-red-50'
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      'low': 'Baixa Urgência',
      'medium': 'Urgência Média',
      'high': 'Alta Urgência',
      'emergency': 'Emergencial'
    };
    return labels[urgency as keyof typeof labels] || 'Urgência Média';
  };

  // Se o dashboard estiver ativo, renderizar apenas o dashboard
  if (activeView === 'dashboard') {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-none max-h-[95vh] overflow-y-auto mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Dashboard Avançado</h2>
              <button 
                onClick={() => setActiveView('standard')}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 w-full">
              <p className="text-gray-600">Dashboard em desenvolvimento...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header aprimorado */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full">
        <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                Recomendação Gerada com Sucesso
              </h1>
              <p className="mt-3 text-lg opacity-90 max-w-2xl">
                Analisamos sua situação e preparamos orientações personalizadas para resolver seu problema
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
            <div className="flex items-center gap-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getUrgencyColor(recommendation.urgencyLevel)}`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                {getUrgencyLabel(recommendation.urgencyLevel)}
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Tempo estimado: {recommendation.estimatedTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('standard')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'standard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📋 Orientações
              </button>
              <button
                onClick={() => setActiveView('dashboard' as ViewType)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === ('dashboard' as ViewType)
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📊 Dashboard Avançado
              </button>
              <button
                onClick={() => {
                  setActiveView('chat');
                  setIsChatOpen(true);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'chat'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Chat Inteligente
              </button>
              <button
                onClick={() => setActiveView('notifications')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'notifications'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Notificações
              </button>
            </div>
          </div>

          {recommendation.additionalInfo && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-xl w-full">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Informação Importante</h3>
                  <p className="text-blue-800 leading-relaxed">{recommendation.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Análise Legal */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className={`text-white p-6 ${recommendation.legalAnalysis.hasRight 
          ? 'bg-gradient-to-r from-red-600 to-red-700' 
          : 'bg-gradient-to-r from-amber-600 to-orange-600'}`}>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Scale className="h-6 w-6" />
            </div>
            Análise de Direitos - Jurídica Especializada
          </h2>
          <p className="mt-2 opacity-90">Análise baseada na legislação brasileira atual (2024-2025)</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status do Direito */}
          <div className={`p-4 rounded-lg border-l-4 ${recommendation.legalAnalysis.hasRight 
            ? 'bg-green-50 border-green-500' 
            : 'bg-amber-50 border-amber-500'}`}>
            <div className="flex items-start gap-3">
              {recommendation.legalAnalysis.hasRight ? (
                <Shield className="h-6 w-6 text-green-600 mt-1" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${recommendation.legalAnalysis.hasRight 
                  ? 'text-green-800' 
                  : 'text-amber-800'}`}>
                  {recommendation.legalAnalysis.hasRight ? '✅ Você TEM direito' : '⚠️ Direito não confirmado'}
                </h3>
                <p className={`mt-1 ${recommendation.legalAnalysis.hasRight 
                  ? 'text-green-700' 
                  : 'text-amber-700'}`}>
                  {recommendation.legalAnalysis.hasRight 
                    ? 'Análise baseada na legislação brasileira atual' 
                    : 'Consulte órgãos competentes para mais informações'}
                </p>
              </div>
            </div>
          </div>

          {/* Justificativa */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">📋 Fundamentação Legal</h4>
            <p className="text-gray-700 leading-relaxed">{recommendation.legalAnalysis.reasoning}</p>
          </div>

          {/* Base Legal */}
          {recommendation.legalAnalysis.legalBasis.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">⚖️ Legislação Aplicável</h4>
              <ul className="space-y-1">
                {recommendation.legalAnalysis.legalBasis.map((law, index) => (
                  <li key={index} className="text-blue-700 text-sm">• {law}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Informação sobre Gratuidade do SUS */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">💰 Informação sobre Custos</h4>
            <p className="text-purple-700">
              Os serviços de saúde pública no Brasil são gratuitos através do SUS (Sistema Único de Saúde).
            </p>
          </div>

          {/* MPE Recomendação */}
          {recommendation.mpeRecommendation?.recommended && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                🏛️ Recomendação Especial: Ministério Público Estadual
              </h4>
              <p className="text-red-700">{recommendation.mpeRecommendation.reason}</p>
            </div>
          )}

          {/* Urgência */}
          {recommendation.legalAnalysis.urgencyJustification && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">⚡ Tramitação de Urgência</h4>
              <p className="text-orange-700">{recommendation.legalAnalysis.urgencyJustification}</p>
            </div>
          )}
        </div>
      </div>

      {/* Órgão Principal */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            Órgão Principal Recomendado
          </h2>
          <p className="mt-2 opacity-90">Este é o órgão mais adequado para resolver seu problema</p>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Informações principais */}
            <div className="xl:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {recommendation.primaryAgency.name}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold">
                      ({recommendation.primaryAgency.acronym})
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {recommendation.primaryAgency.description}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Principais Responsabilidades:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendation.primaryAgency.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-800">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Informações de contato */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informações de Contato
                </h4>
                <div className="space-y-4">
                  <a 
                    href={recommendation.primaryAgency.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <ExternalLink className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">Website Oficial</span>
                  </a>
                  
                  {recommendation.primaryAgency.contactInfo.phone && (
                    <div className="flex items-center text-gray-700 p-3 bg-white rounded-lg shadow-sm">
                      <Phone className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{recommendation.primaryAgency.contactInfo.phone}</span>
                    </div>
                  )}
                  
                  {recommendation.primaryAgency.contactInfo.email && (
                    <div className="flex items-center text-gray-700 p-3 bg-white rounded-lg shadow-sm">
                      <Mail className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                      <span className="font-medium break-all">{recommendation.primaryAgency.contactInfo.email}</span>
                    </div>
                  )}
                  
                  {recommendation.primaryAgency.contactInfo.address && (
                    <div className="flex items-start text-gray-700 p-3 bg-white rounded-lg shadow-sm">
                      <MapPin className="h-5 w-5 mr-3 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{recommendation.primaryAgency.contactInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Serviços Online
                </h4>
                <div className="space-y-3">
                  {recommendation.primaryAgency.onlineServices.map((service, index) => (
                    <a
                      key={index}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className="font-semibold text-green-800 group-hover:text-green-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            {service.description}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passos Recomendados */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-purple-600 text-white p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Passos Recomendados
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {recommendation.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    {step.order}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {step.agency}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.documents && step.documents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Documentos necessários:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {step.documents.map((doc, docIndex) => (
                            <li key={docIndex} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.links && step.links.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Links úteis:</h4>
                        <div className="space-y-2">
                          {step.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {step.estimatedTime && (
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Tempo estimado: {step.estimatedTime}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Órgãos Secundários */}
      {recommendation.secondaryAgencies.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-600 text-white p-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Órgãos Complementares
            </h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Estes órgãos também podem ajudar com seu problema ou oferecer suporte adicional:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendation.secondaryAgencies.map((agency, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {agency.name} ({agency.acronym})
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{agency.description}</p>
                  
                  <div className="space-y-2">
                    <a 
                      href={agency.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Website Oficial
                    </a>
                    
                    {agency.contactInfo.phone && (
                      <div className="text-sm text-gray-600 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {agency.contactInfo.phone}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      <Feedback onSubmit={(feedback) => console.log('Feedback recebido:', feedback)} />

      {/* Botão para Nova Busca */}
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Precisa de uma nova consulta?</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Se você tem outro problema com medicamentos ou precisa de orientação adicional, 
            faça uma nova consulta.
          </p>
          <button
            onClick={onNewSearch}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Pill className="h-5 w-5" />
            Fazer Nova Consulta
          </button>
        </div>
      </div>

      {/* Chat Widget Inteligente */}
      <IntelligentChatWidget 
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setActiveView('standard');
        }}
        medicationContext={recommendation}
      />

      {/* Botão Flutuante de Chat */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Notificações flutuantes */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
