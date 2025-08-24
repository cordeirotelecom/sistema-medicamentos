'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Brain,
  Target,
  LineChart,
  PieChart,
  Calendar,
  Bell,
  Heart,
  Stethoscope,
  Pill,
  Building2,
  MessageSquare,
  Video,
  MapPin,
  Star,
  Smartphone
} from 'lucide-react';

interface DashboardProps {
  medicationName?: string;
  analysisData?: any;
}

export default function AdvancedDashboard({ medicationName = "Dipirona 500mg", analysisData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [blockchainData, setBlockchainData] = useState<any>({});
  const [aiPredictions, setAiPredictions] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeAdvancedIntegrations = async () => {
    try {
      setLoading(true);
      
      // Simular conexão em tempo real
      setIsConnected(true);
      
      // Carregar dados da blockchain
      // Simular status do blockchain
      const blockchainStatus = { connected: true, verified: true };
      setBlockchainData(blockchainStatus);
      
      // Obter predições de IA - simulado
      const predictions = {
        shortage: false,
        demand: 'medium',
        price_trend: 'stable'
      };
      setAiPredictions(predictions);
      
      // Dados avançados em tempo real
      setRealTimeData({
        analysis: {
          confidence: 0.95,
          riskLevel: 'baixo',
          recommendation: 'aprovado',
          legalFramework: 'Lei 13.021/2014',
          urgencyLevel: 'normal'
        },
        pricing: {
          currentPrice: 45.30 + Math.random() * 10,
          historicalTrend: 'estável',
          marketComparison: 'competitivo',
          governmentSubsidy: 0.15
        },
        availability: {
          inStock: Math.random() > 0.3,
          nearbyPharmacies: Math.floor(Math.random() * 20) + 5,
          estimatedDelivery: '2-4 horas',
          alternativesAvailable: Math.floor(Math.random() * 5) + 2
        },
        predictions: {
          successProbability: 0.87,
          timeToResolution: 12,
          alternativeScenarios: [
            { name: 'Cenário Otimista', probability: 0.35, days: 5 },
            { name: 'Cenário Realista', probability: 0.50, days: 12 },
            { name: 'Cenário Pessimista', probability: 0.15, days: 25 }
          ]
        },
        marketData: {
          avgPrice: 45.30,
          priceRange: { min: 32.50, max: 67.80 },
          availability: 0.78,
          alternatives: 5
        }
      });
      
    } catch (error) {
      console.error('Erro ao inicializar integrações avançadas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAdvancedIntegrations();
    
    // Atualiza dados a cada 30 segundos
    const interval = setInterval(initializeAdvancedIntegrations, 30000);
    
    return () => clearInterval(interval);
  }, [medicationName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-6 border-4 border-purple-400 rounded-full animate-spin animate-reverse border-b-transparent"></div>
            <Brain className="absolute inset-0 m-auto h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Análise Avançada em Progresso</h2>
          <p className="text-gray-600">Processando dados de múltiplas fontes com IA...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'realtime', label: 'Tempo Real', icon: Activity },
    { id: 'blockchain', label: 'Blockchain', icon: Shield },
    { id: 'ai', label: 'IA & Predições', icon: Brain },
    { id: 'communication', label: 'Comunicação', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: LineChart }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status da Análise</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(realTimeData?.analysis?.confidence * 100)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conexões Ativas</p>
                    <p className="text-2xl font-bold text-blue-600">{isConnected ? '5' : '0'}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Farmácias Próximas</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {realTimeData?.availability?.nearbyPharmacies || 0}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {realTimeData?.pricing?.currentPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Análise Jurídica */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                Análise Jurídica Avançada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Marco Legal</h4>
                  <p className="text-gray-600">{realTimeData?.analysis?.legalFramework}</p>
                  
                  <h4 className="font-semibold text-gray-700 mb-2 mt-4">Recomendação</h4>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {realTimeData?.analysis?.recommendation?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Nível de Risco</h4>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {realTimeData?.analysis?.riskLevel?.toUpperCase()}
                  </span>
                  
                  <h4 className="font-semibold text-gray-700 mb-2 mt-4">Urgência</h4>
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {realTimeData?.analysis?.urgencyLevel?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'realtime':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="h-6 w-6 text-green-500 mr-2" />
                Monitoramento em Tempo Real
                <span className={`ml-auto inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Disponibilidade</span>
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-800">
                    {realTimeData?.availability?.inStock ? 'Em Estoque' : 'Indisponível'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Entrega</span>
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {realTimeData?.availability?.estimatedDelivery}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Alternativas</span>
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-800">
                    {realTimeData?.availability?.alternativesAvailable}
                  </div>
                </div>
              </div>
            </div>

            {/* WebRTC Communication */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Video className="h-6 w-6 text-blue-500 mr-2" />
                Comunicação Avançada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                  <Video className="h-5 w-5 mr-2" />
                  Videochamada com Farmacêutico
                </button>
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Localizar Farmácias
                </button>
              </div>
            </div>
          </div>
        );

      case 'blockchain':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                Verificação Blockchain
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Autenticidade do Medicamento
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">✓ Verificado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash:</span>
                      <span className="font-mono text-xs text-gray-500">0x8a2f...d9e1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificação NFT:</span>
                      <span className="font-semibold text-blue-600">Ativo</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Cadeia de Distribuição
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">Fabricante → Distribuidor</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">Distribuidor → Farmácia</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm">Farmácia → Paciente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="h-6 w-6 text-purple-500 mr-2" />
                Inteligência Artificial & Predições
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {realTimeData?.predictions?.alternativeScenarios?.map((scenario: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">{scenario.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Probabilidade:</span>
                        <span className="font-semibold">{Math.round(scenario.probability * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Prazo:</span>
                        <span className="font-semibold">{scenario.days} dias</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-indigo-800 mb-4">Análise Preditiva Avançada</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Probabilidade de Sucesso:</span>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${realTimeData?.predictions?.successProbability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(realTimeData?.predictions?.successProbability * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tempo Estimado:</span>
                    <p className="text-lg font-semibold text-indigo-700">
                      {realTimeData?.predictions?.timeToResolution} dias
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="h-6 w-6 text-green-500 mr-2" />
                Central de Comunicação
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Notificações Push Ativas
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Video className="h-5 w-5 mr-2" />
                    Consulta por Vídeo
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Geolocalização Avançada
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Status das Conexões</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">WebSocket</span>
                      <span className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">WebRTC</span>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Push Notifications</span>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Geolocation</span>
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <LineChart className="h-6 w-6 text-orange-500 mr-2" />
                Analytics Avançados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-800 mb-4">Dados de Mercado</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço Médio:</span>
                      <span className="font-semibold">R$ {realTimeData?.marketData?.avgPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faixa de Preço:</span>
                      <span className="font-semibold">
                        R$ {realTimeData?.marketData?.priceRange?.min} - R$ {realTimeData?.marketData?.priceRange?.max}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disponibilidade:</span>
                      <span className="font-semibold">{Math.round(realTimeData?.marketData?.availability * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alternativas:</span>
                      <span className="font-semibold">{realTimeData?.marketData?.alternatives}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Métricas de Performance</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Eficiência do Sistema</span>
                        <span className="text-sm font-semibold">94%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Precisão da IA</span>
                        <span className="text-sm font-semibold">97%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Satisfação do Usuário</span>
                        <span className="text-sm font-semibold">96%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating System */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h4 className="font-semibold text-gray-800 mb-4">Avalie sua Experiência</h4>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-8 w-8 text-yellow-400 fill-current cursor-pointer hover:scale-110 transform transition-transform" 
                  />
                ))}
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200">
                Enviar Avaliação
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard Avançado de Orientação Medicamentosa
          </h1>
          <p className="text-gray-600 text-lg">
            Sistema Integrado com IA, Blockchain e Comunicação em Tempo Real
          </p>
          <div className="mt-4 inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-700">Medicamento: {medicationName}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
