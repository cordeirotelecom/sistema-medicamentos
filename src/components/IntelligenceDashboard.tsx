/**
 * Dashboard Simplificado para Promotores - Rio Grande do Sul
 * Versão limpa e responsiva
 */

'use client';

import { useState, useEffect } from 'react';
import { RSIntelligenceService } from '@/services/rs-intelligence';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Eye,
  MapPin,
  Clock,
  ExternalLink,
  Newspaper
} from 'lucide-react';

interface IntelligenceDashboardProps {
  municipality?: string;
}

export default function IntelligenceDashboard({ municipality }: IntelligenceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'expenses' | 'generics' | 'news'>('overview');
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [generics, setGenerics] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genericSearch, setGenericSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [municipality]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anomaliesData, expensesData, newsData] = await Promise.all([
        RSIntelligenceService.detectAnomalies('90d', municipality),
        RSIntelligenceService.getSUSExpenseData(2024, municipality),
        RSIntelligenceService.getRelevantNews('all', true)
      ]);

      setAnomalies(anomaliesData);
      setExpenses(expensesData);
      setNews(newsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchGenerics = async () => {
    if (!genericSearch.trim()) return;
    
    setLoading(true);
    try {
      const data = await RSIntelligenceService.getGenericMedicationInfo(genericSearch);
      setGenerics(data);
    } catch (error) {
      console.error('Erro ao buscar genéricos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critica: 'bg-red-100 text-red-800 border-red-200',
      alta: 'bg-orange-100 text-orange-800 border-orange-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baixa: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity as keyof typeof colors] || colors.baixa;
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'anomalies', label: 'Suspeitas', icon: AlertTriangle },
    { id: 'expenses', label: 'Gastos', icon: DollarSign },
    { id: 'generics', label: 'Genéricos', icon: Search },
    { id: 'news', label: 'Notícias', icon: Newspaper }
  ];

  const filteredAnomalies = anomalies.filter(anomaly =>
    searchTerm === '' || 
    anomaly.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anomaly.municipality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && (anomalies.length === 0 && expenses.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Inteligência Analítica - MP-RS
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Sistema de análise e detecção de irregularidades em medicamentos
            {municipality && ` - ${municipality}`}
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Total de Suspeitas</h3>
                  <p className="text-2xl font-bold text-blue-600">{anomalies.length}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900">Casos Críticos</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {anomalies.filter(a => a.severity === 'critica').length}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900">Alta Prioridade</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {anomalies.filter(a => a.severity === 'alta').length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Municípios Monitorados</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(anomalies.map(a => a.municipality)).size}
                  </p>
                </div>
              </div>

              {/* Casos Mais Críticos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Casos Mais Críticos</h3>
                <div className="space-y-3">
                  {anomalies
                    .filter(a => a.severity === 'critica' || a.severity === 'alta')
                    .slice(0, 3)
                    .map((anomaly, index) => (
                      <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{anomaly.medication}</h4>
                            <p className="text-sm text-gray-600">{anomaly.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                              <span><MapPin className="w-3 h-3 inline mr-1" />{anomaly.municipality}</span>
                              <span><Clock className="w-3 h-3 inline mr-1" />
                                {new Date(anomaly.detectedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Anomalies Tab - DETALHADO */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por medicamento ou município..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Anomalies List */}
              <div className="space-y-4">
                {filteredAnomalies.map((anomaly, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <h4 className="font-bold text-gray-800">{anomaly.medication}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${getSeverityColor(anomaly.severity)}`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{anomaly.description}</p>
                        
                        {/* DETALHES DA ORIGEM DOS DADOS */}
                        <div className="bg-gray-50 p-3 rounded border mb-3">
                          <h5 className="font-semibold text-sm text-gray-800 mb-2">Origem dos Dados e Metodologia:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <div><span className="text-gray-600">Base de Dados:</span> <span className="font-medium">DATASUS-RS</span></div>
                              <div><span className="text-gray-600">Complemento:</span> <span className="font-medium">TCE-RS, Transparência-RS</span></div>
                              <div><span className="text-gray-600">Algoritmo:</span> <span className="font-medium">Machine Learning (Detecção de Anomalias)</span></div>
                            </div>
                            <div className="space-y-1">
                              <div><span className="text-gray-600">Período Analisado:</span> <span className="font-medium">Últimos 90 dias</span></div>
                              <div><span className="text-gray-600">Confiança Estatística:</span> <span className="font-medium">{(anomaly.confidence * 100).toFixed(0)}%</span></div>
                              <div><span className="text-gray-600">Desvio Detectado:</span> <span className="font-medium text-red-600">{anomaly.deviation.toFixed(1)}%</span></div>
                            </div>
                          </div>
                        </div>

                        {/* ANÁLISE COMPARATIVA DETALHADA */}
                        <div className="bg-blue-50 p-3 rounded border mb-3">
                          <h5 className="font-semibold text-sm text-blue-800 mb-2">Análise Comparativa:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600">Valor Esperado (Benchmark Regional):</div>
                              <div className="font-bold text-green-600">{formatCurrency(anomaly.expectedValue)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Valor Detectado ({anomaly.municipality}):</div>
                              <div className="font-bold text-red-600">{formatCurrency(anomaly.actualValue)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Diferença Absoluta:</div>
                              <div className="font-bold text-red-600">{formatCurrency(anomaly.actualValue - anomaly.expectedValue)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Tipo de Anomalia:</div>
                              <div className="font-medium capitalize">{anomaly.anomalyType}</div>
                            </div>
                          </div>
                        </div>

                        {/* EVIDÊNCIAS TÉCNICAS */}
                        <div className="bg-yellow-50 p-3 rounded border mb-3">
                          <h5 className="font-semibold text-sm text-yellow-800 mb-2">Evidências Técnicas Identificadas:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {anomaly.evidence.map((evidence: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-1 font-bold">•</span>
                                <span>{evidence}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* RECOMENDAÇÃO DE AÇÃO */}
                        <div className="bg-green-50 p-3 rounded border mb-3">
                          <h5 className="font-semibold text-sm text-green-800 mb-2">Recomendação de Ação:</h5>
                          <p className="text-sm text-gray-700">{anomaly.recommendation}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                          <div className="flex flex-wrap gap-4">
                            <span><MapPin className="w-3 h-3 inline mr-1" />{anomaly.municipality} - {anomaly.region}</span>
                            <span><Clock className="w-3 h-3 inline mr-1" />
                              Detectado em: {new Date(anomaly.detectedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>Status: <span className="font-medium capitalize">{anomaly.status.replace('_', ' ')}</span></span>
                            <span className="text-gray-400">|</span>
                            <span>ID: {anomaly.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{expense.municipality}</h3>
                      <p className="text-gray-600">{expense.medicationCategory}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {formatCurrency(expense.totalExpense)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.quantity.toLocaleString('pt-BR')} unidades
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Custo Unitário:</span>
                      <p className="font-medium">{formatCurrency(expense.unitCost)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fornecedor:</span>
                      <p className="font-medium">{expense.supplier}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tendência:</span>
                      <p className={`font-medium flex items-center gap-1 ${
                        expense.trend === 'crescente' ? 'text-red-600' : 
                        expense.trend === 'decrescente' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {expense.trend === 'crescente' && <TrendingUp className="w-4 h-4" />}
                        {expense.trend === 'decrescente' && <TrendingDown className="w-4 h-4" />}
                        {expense.trend}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generics Tab - FUNCIONAL */}
          {activeTab === 'generics' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Busca de Medicamentos Genéricos</h3>
                <p className="text-blue-700 text-sm">Digite o nome do medicamento de referência para encontrar opções genéricas disponíveis no SUS-RS</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ex: Losartana, Omeprazol, Sinvastatina..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={genericSearch}
                  onChange={(e) => setGenericSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchGenerics()}
                />
                <button
                  onClick={searchGenerics}
                  disabled={!genericSearch.trim() || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Buscando...' : 'Buscar Genéricos'}
                </button>
              </div>

              {generics.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">Nenhuma busca realizada</p>
                  <p className="text-sm">Digite o nome de um medicamento para buscar opções genéricas disponíveis</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {generics.map((generic, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{generic.brandName}</h3>
                        <p className="text-gray-600 font-medium">{generic.genericName}</p>
                        <p className="text-sm text-gray-500">{generic.activeIngredient}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 px-2 py-1 rounded">
                          <p className="text-lg font-bold text-green-600">
                            -{generic.savingsPercentage.toFixed(1)}%
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">economia</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Medicamento de Marca:</span>
                        <p className="font-medium text-red-600">{formatCurrency(generic.averagePrice)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Genérico:</span>
                        <p className="font-medium text-green-600">{formatCurrency(generic.genericPrice)}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-gray-500 text-sm">Economia por unidade:</span>
                      <p className="font-bold text-green-600">{formatCurrency(generic.savings)}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Disponibilidade:</div>
                      <div className="flex flex-wrap gap-2">
                        {generic.availability.publicNetwork && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            ✓ Rede Pública SUS
                          </span>
                        )}
                        {generic.availability.farmaciaPopular && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            ✓ Farmácia Popular
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {generic.availability.privatePharmacies} farmácias privadas
                        </span>
                      </div>
                    </div>

                    {generic.manufacturer && generic.manufacturer.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-600">Fabricantes:</div>
                        <div className="text-sm text-gray-800 font-medium">
                          {generic.manufacturer.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {item.isSuccessCase && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            CASO DE SUCESSO
                          </span>
                        )}
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {item.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.summary}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p className="font-medium">{item.source}</p>
                      <p>{new Date(item.publishedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-3">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm w-fit transition-colors"
                    >
                      Ler mais
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
