'use client';

import { useState } from 'react';
import Link from 'next/link';
import LegislationBrowser from '@/components/LegislationBrowser';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Eye,
  Filter,
  BarChart3,
  Download,
  DollarSign,
  Scale,
  Building2,
  Calendar,
  Target,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  BookOpen
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { brazilianHealthLaws, governmentAgencies, caseStatistics, medicationCategories } from '../../data/simple-legal-data';

// Dados simulados para Defensoria Pública
const defensoriaCases = [
  {
    id: 'DEF-2025-001',
    citizen: 'Ana Silva Santos',
    cpf: '***.***.***-12',
    medication: 'Insulina Regular',
    issueType: 'access_denial',
    status: 'in_progress',
    createdAt: '2025-01-10',
    value: 'R$ 89,50',
    urgency: 'high',
    agency: 'SUS',
    legalBasis: 'Lei 8.080/90, Art. 6º',
    confidence: 'alta',
    estimatedTime: '15-30 dias',
    description: 'Negativa de fornecimento de insulina pelo SUS',
    category: 'Diabetes',
    lastUpdate: '2025-01-22',
    attachments: 4,
    interactions: 12,
    socialProfile: 'Renda familiar até 3 salários mínimos'
  },
  {
    id: 'DEF-2025-002',
    citizen: 'José Carlos Lima',
    cpf: '***.***.***-34',
    medication: 'Levodopa + Carbidopa',
    issueType: 'unavailable',
    status: 'resolved',
    createdAt: '2025-01-08',
    value: 'R$ 245,80',
    urgency: 'medium',
    agency: 'ANVISA',
    legalBasis: 'Lei 9.313/96',
    confidence: 'alta',
    estimatedTime: '30-45 dias',
    description: 'Falta de medicamento para Parkinson na farmácia popular',
    category: 'Neurológicos',
    lastUpdate: '2025-01-25',
    attachments: 3,
    interactions: 8,
    resolution: 'Fornecimento garantido via programa estadual',
    socialProfile: 'Aposentado, renda de 1 salário mínimo'
  },
  {
    id: 'DEF-2025-003',
    citizen: 'Maria Oliveira Costa',
    cpf: '***.***.***-56',
    medication: 'Metotrexato',
    issueType: 'high_price',
    status: 'under_review',
    createdAt: '2025-01-15',
    value: 'R$ 450,00',
    urgency: 'high',
    agency: 'PROCON',
    legalBasis: 'CDC, Art. 39',
    confidence: 'média',
    estimatedTime: '20-40 dias',
    description: 'Preço abusivo em medicamento para artrite reumatoide',
    category: 'Reumatológicos',
    lastUpdate: '2025-01-23',
    attachments: 5,
    interactions: 15,
    socialProfile: 'Desempregada, cadastro único'
  }
];

export default function DefensoriaPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const reportData = {
        summary: {
          totalCases: defensoriaCases.length,
          resolved: defensoriaCases.filter(c => c.status === 'resolved').length,
          inProgress: defensoriaCases.filter(c => c.status === 'in_progress').length,
          pending: defensoriaCases.filter(c => c.status === 'under_review').length
        },
        cases: defensoriaCases.map(case_ => ({
          id: case_.id,
          citizen: case_.citizen,
          medication: case_.medication,
          issueType: case_.issueType,
          status: case_.status,
          value: case_.value,
          agency: case_.agency,
          createdAt: case_.createdAt,
          socialProfile: case_.socialProfile
        }))
      };

      // Gerar HTML do relatório
      const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Casos - Defensoria Pública</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            color: #333; 
            background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
            min-height: 100vh;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            opacity: 0.3;
        }
        .header-content { position: relative; z-index: 1; }
        .title { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 10px; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .timestamp {
            font-size: 14px;
            opacity: 0.8;
        }
        .content-wrapper {
            padding: 40px;
        }
        .summary { 
            background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
            padding: 30px; 
            border-radius: 15px; 
            margin-bottom: 40px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .summary h2 {
            color: #1A202C;
            font-size: 24px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 600;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .metric { 
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #E2E8F0;
            transition: transform 0.2s ease;
        }
        .metric:hover {
            transform: translateY(-2px);
        }
        .metric-value { 
            font-size: 32px; 
            font-weight: 700; 
            color: #b91c1c; 
            display: block;
            margin-bottom: 5px;
        }
        .metric-label { 
            font-size: 14px; 
            color: #64748B; 
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .cases-section {
            margin-top: 40px;
        }
        .cases-section h2 {
            color: #1A202C;
            font-size: 24px;
            margin-bottom: 25px;
            font-weight: 600;
            border-bottom: 2px solid #b91c1c;
            padding-bottom: 10px;
        }
        .cases-table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .cases-table th, .cases-table td { 
            padding: 15px 12px; 
            text-align: left; 
            border-bottom: 1px solid #E2E8F0;
        }
        .cases-table th { 
            background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
            color: white; 
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        .cases-table tbody tr:hover {
            background-color: #F8FAFC;
        }
        .cases-table tbody tr:last-child td {
            border-bottom: none;
        }
        .status { 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-size: 11px; 
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-resolved { background: #D1FAE5; color: #065F46; }
        .status-pending { background: #FEF3C7; color: #92400E; }
        .status-in_progress { background: #DBEAFE; color: #1E40AF; }
        .status-under_review { background: #FDE2E7; color: #B91C1C; }
        .status-escalated { background: #EDE9FE; color: #6B21A8; }
        .footer {
            margin-top: 40px;
            padding: 30px;
            background: #F8FAFC;
            border-radius: 10px;
            text-align: center;
            color: #64748B;
            font-size: 14px;
        }
        @media print {
            body { background: white; padding: 20px; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <div class="title">DEFENSORIA PÚBLICA ESTADUAL</div>
                <div class="subtitle">Relatório de Casos - Sistema de Orientação Medicamentosa</div>
                <div class="timestamp">Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
            </div>
        </div>
        
        <div class="content-wrapper">
            <div class="summary">
                <h2>Resumo Executivo</h2>
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value">${reportData.summary.totalCases}</div>
                        <div class="metric-label">Total de Casos</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${reportData.summary.resolved}</div>
                        <div class="metric-label">Resolvidos</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${reportData.summary.inProgress}</div>
                        <div class="metric-label">Em Andamento</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${reportData.summary.pending}</div>
                        <div class="metric-label">Pendentes</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${Math.round((reportData.summary.resolved / reportData.summary.totalCases) * 100)}%</div>
                        <div class="metric-label">Taxa de Resolução</div>
                    </div>
                </div>
            </div>

            <div class="cases-section">
                <h2>Detalhamento dos Casos</h2>
                <table class="cases-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cidadão</th>
                            <th>Medicamento</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Valor</th>
                            <th>Órgão</th>
                            <th>Perfil Social</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.cases.map(case_ => `
                            <tr>
                                <td>${case_.id}</td>
                                <td>${case_.citizen}</td>
                                <td>${case_.medication}</td>
                                <td>${case_.issueType}</td>
                                <td><span class="status status-${case_.status}">${case_.status.toUpperCase()}</span></td>
                                <td>${case_.value}</td>
                                <td>${case_.agency}</td>
                                <td>${case_.socialProfile || 'N/A'}</td>
                                <td>${case_.createdAt}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p><strong>Defensoria Pública Estadual</strong> - Sistema de Orientação Medicamentosa</p>
                <p>Acesso à Justiça e Defesa dos Direitos dos Hipossuficientes</p>
                <p>Documento gerado automaticamente - ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        </div>
    </div>
</body>
</html>`;

      // Gerar e baixar o relatório
      const blob = new Blob([htmlContent], {
        type: 'text/html'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-defensoria-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Relatório HTML gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'resolved': 'Resolvido',
      'in_progress': 'Em Andamento',
      'under_review': 'Em Análise',
      'escalated': 'Escalado',
      'pending': 'Pendente'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    };
    return labels[urgency as keyof typeof labels] || urgency;
  };

  const filteredCases = defensoriaCases.filter(case_ => {
    const statusMatch = filterStatus === 'all' || case_.status === filterStatus;
    const urgencyMatch = filterUrgency === 'all' || case_.urgency === filterUrgency;
    const categoryMatch = filterCategory === 'all' || case_.category === filterCategory;
    return statusMatch && urgencyMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100 w-full">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-red-100 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard Defensoria Pública
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date().toLocaleDateString('pt-BR')}
              </div>
              <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'cases', label: 'Casos', icon: FileText },
              { id: 'laws', label: 'Legislação', icon: Scale },
              { id: 'agencies', label: 'Órgãos', icon: Building2 },
              { id: 'legislation', label: 'Bíblia da Legislação', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="max-w-full mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8 w-full">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Casos</p>
                    <p className="text-2xl font-bold text-gray-900">1,523</p>
                    <p className="text-sm text-green-600">+18% vs mês anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-gray-900">87%</p>
                    <p className="text-sm text-green-600">+5% vs mês anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Valor Assegurado</p>
                    <p className="text-2xl font-bold text-gray-900">R$ 890K</p>
                    <p className="text-sm text-green-600">+22% vs mês anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold text-gray-900">18 dias</p>
                    <p className="text-sm text-red-600">-3 dias vs anterior</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                  Evolução Mensal de Casos
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={caseStatistics.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cases" stroke="#DC2626" strokeWidth={3} />
                    <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Taxa de Sucesso por Órgão
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caseStatistics.byAgency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agency" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="#DC2626" name="Taxa de Sucesso %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Categorias de Medicamentos */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Análise por Categoria de Medicamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicationCategories.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{category.category}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' : 
                        category.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {category.urgencyLevel === 'high' ? 'Alta' : category.urgencyLevel === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <div className="text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Preço médio:</span>
                        <span className="font-medium">R$ {category.averagePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendente</option>
                    <option value="under_review">Em Análise</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="escalated">Escalado</option>
                    <option value="resolved">Resolvido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgência</label>
                  <select 
                    value={filterUrgency} 
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Neurológicos">Neurológicos</option>
                    <option value="Reumatológicos">Reumatológicos</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isGeneratingReport ? 'Gerando...' : 'Gerar Relatório'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cases Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Casos da Defensoria Pública</h3>
                <p className="text-sm text-gray-600">
                  {filteredCases.length} de {defensoriaCases.length} casos exibidos
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidadão</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgência</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil Social</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {case_.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{case_.citizen}</div>
                          <div className="text-sm text-gray-500">{case_.cpf}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{case_.medication}</div>
                          <div className="text-sm text-gray-500">{case_.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {getStatusLabel(case_.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getUrgencyColor(case_.urgency)}`}>
                            {getUrgencyLabel(case_.urgency)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {case_.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {case_.socialProfile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-red-600 hover:text-red-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'laws' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-red-600" />
              Base Legal - Defensoria Pública
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brazilianHealthLaws.map((law, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">{law.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{law.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Promulgada: {law.dateApproved}</p>
                    <p>Aplicabilidade: {law.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agencies' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Órgãos Competentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentAgencies.map((agency, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedAgency(agency)}
                >
                  <div className="flex items-center mb-3">
                    <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">{agency.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{agency.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">🏛️ {agency.level}</span>
                    <span>📍 {agency.contact.address.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal para detalhes do órgão */}
        {selectedAgency && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{selectedAgency.name}</h2>
                <button 
                  onClick={() => setSelectedAgency(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedAgency.description}</p>
                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      {selectedAgency.level}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Competências e Atribuições</h4>
                  <div className="space-y-2">
                    {selectedAgency.competencies.map((competency: string, idx: number) => (
                      <div key={idx} className="flex items-start bg-gray-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{competency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Informações de Contato</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedAgency.contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-green-700" />
                        <span>{selectedAgency.contact.phone}</span>
                      </div>
                    )}
                    {selectedAgency.contact.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-green-700" />
                        <span>{selectedAgency.contact.email}</span>
                      </div>
                    )}
                    {selectedAgency.contact.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-green-700" />
                        <span className="text-blue-600">{selectedAgency.contact.website}</span>
                      </div>
                    )}
                    {selectedAgency.contact.address && (
                      <div className="flex items-start col-span-full">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-700 flex-shrink-0" />
                        <span>{selectedAgency.contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nova Aba: Bíblia da Legislação */}
        {activeTab === 'legislation' && (
          <div className="bg-white rounded-lg shadow-sm">
            <LegislationBrowser userType="defensoria" />
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
