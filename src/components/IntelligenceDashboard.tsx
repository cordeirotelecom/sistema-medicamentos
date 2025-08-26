/**
 * Dashboard de Inteligência Analítica para Promotores - Rio Grande do Sul
 * Sistema avançado com ML, detecção de anomalias e dados abertos
 */

'use client';

import { useState, useEffect } from 'react';
import { RSIntelligenceService } from '@/services/rs-intelligence';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Brain,
  Zap,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Newspaper,
  Target
} from 'lucide-react';

interface IntelligenceDashboardProps {
  municipality?: string;
}

export default function IntelligenceDashboard({ municipality }: IntelligenceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'expenses' | 'generics' | 'news'>('overview');
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [executiveReport, setExecutiveReport] = useState<any>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [municipality]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [anomaliesData, expensesData, reportData, newsData] = await Promise.all([
        RSIntelligenceService.detectAnomalies('90d', municipality),
        RSIntelligenceService.getSUSExpenseData(2024, municipality),
        RSIntelligenceService.generateExecutiveReport(municipality),
        RSIntelligenceService.getRelevantNews('all', true)
      ]);

      setAnomalies(anomaliesData);
      setExpenses(expensesData);
      setExecutiveReport(reportData);
      setNews(newsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
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

  const getSeverityIcon = (severity: string) => {
    const icons = {
      critica: AlertTriangle,
      alta: AlertCircle,
      media: Activity,
      baixa: CheckCircle
    };
    return icons[severity as keyof typeof icons] || CheckCircle;
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSeverity = filterSeverity === 'all' || anomaly.severity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      anomaly.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Analisando dados do SUS-RS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Resumo Executivo */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Inteligência Analítica - SUS/RS</h2>
              <p className="text-blue-100">Sistema de detecção de anomalias e análise preditiva</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Última atualização</div>
            <div className="font-medium">{new Date().toLocaleString('pt-BR')}</div>
          </div>
        </div>

        {executiveReport && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Anomalias Detectadas</span>
              </div>
              <div className="text-2xl font-bold">{executiveReport.summary.totalAnomalies}</div>
              <div className="text-sm text-blue-100">
                {executiveReport.summary.criticalAnomalies} críticas
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm">Gasto Total SUS</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(executiveReport.summary.totalSUSExpense)}
              </div>
              <div className="text-sm text-blue-100">Últimos 12 meses</div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm">Economia Potencial</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(executiveReport.summary.potentialSavings)}
              </div>
              <div className="text-sm text-blue-100">Com otimizações</div>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">Casos de Sucesso</span>
              </div>
              <div className="text-2xl font-bold">{executiveReport.summary.successCases}</div>
              <div className="text-sm text-blue-100">Este mês</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'anomalies', label: 'Anomalias Detectadas', icon: AlertTriangle },
              { id: 'expenses', label: 'Gastos SUS', icon: DollarSign },
              { id: 'generics', label: 'Medicamentos Genéricos', icon: Zap },
              { id: 'news', label: 'Notícias & Casos', icon: Newspaper }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && executiveReport && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recomendações Prioritárias */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Ações Prioritárias
                  </h3>
                  <div className="space-y-3">
                    {executiveReport.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-orange-700 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tendências */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tendências Identificadas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Custos de Medicamentos</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {executiveReport.trends.medicationCosts}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Frequência de Anomalias</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {executiveReport.trends.anomalyFrequency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 text-sm">Adoção de Genéricos</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {executiveReport.trends.genericAdoption}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues Críticas */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Questões Críticas Detectadas
                </h3>
                <div className="space-y-4">
                  {executiveReport.criticalIssues.map((issue: any, index: number) => (
                    <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{issue.medication}</h4>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span><MapPin className="w-3 h-3 inline mr-1" />{issue.municipality}</span>
                        <span><Clock className="w-3 h-3 inline mr-1" />Detectado: {new Date(issue.detectedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Anomalies Tab */}
          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por medicamento ou município..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="all">Todas as severidades</option>
                  <option value="critica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              {/* Lista de Anomalias */}
              <div className="space-y-4">
                {filteredAnomalies.map((anomaly) => {
                  const SeverityIcon = getSeverityIcon(anomaly.severity);
                  return (
                    <div
                      key={anomaly.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                          <SeverityIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-gray-800">{anomaly.medication}</h3>
                            <p className="text-gray-600 text-sm">{anomaly.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                          {anomaly.severity.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Município:</span>
                          <p className="font-medium">{anomaly.municipality}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <p className="font-medium capitalize">{anomaly.anomalyType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Desvio:</span>
                          <p className="font-medium text-red-600">+{anomaly.deviation.toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Confiança:</span>
                          <p className="font-medium">{(anomaly.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                          <strong>Recomendação:</strong> {anomaly.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{expense.municipality}</h3>
                        <p className="text-gray-600">{expense.medicationCategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(expense.totalExpense)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {expense.quantity.toLocaleString('pt-BR')} unidades
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
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
                          {expense.trend === 'estavel' && <Activity className="w-4 h-4" />}
                          {expense.trend}
                        </p>
                      </div>
                    </div>
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
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      <p>{item.source}</p>
                      <p>{new Date(item.publishedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
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
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
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
