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

// Dados simulados expandidos para casos
const mockCases = [
  {
    id: 'CASE-2025-001',
    citizen: 'Maria Silva Santos',
    cpf: '***.***.***-45',
    medication: 'Adalimumab (Humira)',
    issueType: 'denied_coverage',
    status: 'under_review',
    createdAt: '2025-01-15',
    value: 'R$ 3.247,90',
    urgency: 'high',
    agency: 'ANVISA',
    legalBasis: 'Lei 9.656/98, Art. 12',
    confidence: 'alta',
    estimatedTime: '15-30 dias',
    description: 'Negativa de cobertura para medicamento oncológico pelo plano de saúde',
    category: 'Oncológicos',
    lastUpdate: '2025-01-20',
    attachments: 3,
    interactions: 8
  },
  {
    id: 'CASE-2025-002',
    citizen: 'João Carlos Oliveira',
    cpf: '***.***.***-78',
    medication: 'Insulina Glargina',
    issueType: 'high_price',
    status: 'resolved',
    createdAt: '2025-01-12',
    value: 'R$ 156,40',
    urgency: 'medium',
    agency: 'PROCON',
    legalBasis: 'CDC, Art. 39',
    confidence: 'média',
    estimatedTime: '30-45 dias',
    description: 'Preço abusivo em farmácia da rede privada',
    category: 'Diabetes',
    lastUpdate: '2025-01-22',
    attachments: 2,
    interactions: 5,
    resolution: 'Estabelecimento multado e preço ajustado'
  },
  {
    id: 'CASE-2025-003',
    citizen: 'Ana Paula Costa',
    cpf: '***.***.***-23',
    medication: 'Rituximabe',
    issueType: 'unavailable',
    status: 'in_progress',
    createdAt: '2025-01-18',
    value: 'R$ 4.890,00',
    urgency: 'high',
    agency: 'MS',
    legalBasis: 'Lei 8.080/90, Art. 6º',
    confidence: 'alta',
    estimatedTime: '7-15 dias',
    description: 'Medicamento indisponível no SUS para tratamento oncológico',
    category: 'Oncológicos',
    lastUpdate: '2025-01-24',
    attachments: 5,
    interactions: 12
  },
  {
    id: 'CASE-2025-004',
    citizen: 'Roberto Fernandes Lima',
    cpf: '***.***.***-91',
    medication: 'Sofosbuvir + Velpatasvir',
    issueType: 'access_difficulty',
    status: 'pending',
    createdAt: '2025-01-20',
    value: 'R$ 2.450,00',
    urgency: 'medium',
    agency: 'CADE',
    legalBasis: 'Lei 12.529/11, Art. 36',
    confidence: 'média',
    estimatedTime: '45-60 dias',
    description: 'Dificuldade de acesso por possível monopolização do mercado',
    category: 'Hepatite C',
    lastUpdate: '2025-01-23',
    attachments: 4,
    interactions: 6
  },
  {
    id: 'CASE-2025-005',
    citizen: 'Francisca de Assis',
    cpf: '***.***.***-34',
    medication: 'Pembrolizumab (Keytruda)',
    issueType: 'denied_coverage',
    status: 'escalated',
    createdAt: '2025-01-10',
    value: 'R$ 12.500,00',
    urgency: 'high',
    agency: 'MPE',
    legalBasis: 'Lei 9.656/98, Art. 35-F',
    confidence: 'alta',
    estimatedTime: '30-45 dias',
    description: 'Negativa de cobertura de imunoterapia para câncer de pulmão',
    category: 'Oncológicos',
    lastUpdate: '2025-01-24',
    attachments: 7,
    interactions: 15
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function PromotorPage() {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedLaw, setSelectedLaw] = useState<any>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showLegislation, setShowLegislation] = useState(false);

  // Função para gerar relatório
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar dados do relatório
      const reportData = {
        title: 'Relatório de Casos - Ministério Público',
        period: new Date().toLocaleDateString('pt-BR'),
        summary: {
          totalCases: filteredCases.length,
          resolved: filteredCases.filter(c => c.status === 'resolved').length,
          pending: filteredCases.filter(c => c.status === 'pending').length,
          inProgress: filteredCases.filter(c => c.status === 'in_progress').length,
        },
        filters: {
          status: filterStatus,
          urgency: filterUrgency, 
          category: filterCategory
        },
        cases: filteredCases
      };

      // Gerar HTML do relatório
      const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Casos - MPE</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            color: #333; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
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
            color: #8B5CF6; 
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
            border-bottom: 2px solid #8B5CF6;
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
            background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
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
                <div class="title">MINISTÉRIO PÚBLICO ESTADUAL</div>
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
                    <td>${case_.createdAt}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
            
            <div class="footer">
                <div style="margin-bottom: 10px; font-weight: 600; color: #374151;">
                    🏛️ Ministério Público Estadual - Sistema de Orientação Medicamentosa
                </div>
                <div style="margin-bottom: 10px;">
                    Relatório gerado automaticamente pelo sistema de monitoramento de casos médico-farmacológicos
                </div>
                <div style="font-size: 12px; color: #9CA3AF;">
                    Este documento contém informações confidenciais destinadas exclusivamente ao Ministério Público Estadual
                </div>
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
      a.download = `relatorio-casos-${new Date().toISOString().split('T')[0]}.html`;
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
      case 'escalated': return 'bg-purple-100 text-purple-800';
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

  const filteredCases = mockCases.filter(case_ => {
    const statusMatch = filterStatus === 'all' || case_.status === filterStatus;
    const urgencyMatch = filterUrgency === 'all' || case_.urgency === filterUrgency;
    const categoryMatch = filterCategory === 'all' || case_.category === filterCategory;
    return statusMatch && urgencyMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard Promotor MPE
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date().toLocaleDateString('pt-BR')}
              </div>
              <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    ? 'border-purple-500 text-purple-600'
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
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Casos</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                    <p className="text-sm text-green-600">+12% vs mês anterior</p>
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
                    <p className="text-2xl font-bold text-gray-900">84%</p>
                    <p className="text-sm text-green-600">+3% vs mês anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Valor Recuperado</p>
                    <p className="text-2xl font-bold text-gray-900">R$ 2.1M</p>
                    <p className="text-sm text-green-600">+18% vs mês anterior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-2xl font-bold text-gray-900">32 dias</p>
                    <p className="text-sm text-red-600">-8% vs mês anterior</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Evolução Mensal */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Evolução Mensal de Casos
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={caseStatistics.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" name="Resolvidos" />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Pendentes" />
                    <Area type="monotone" dataKey="urgent" stackId="1" stroke="#EF4444" fill="#EF4444" name="Urgentes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Eficácia por Órgão */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Eficácia por Órgão
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caseStatistics.byAgency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agency" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="#8B5CF6" name="Taxa de Sucesso %" />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Todas</option>
                    <option value="Oncológicos">Oncológicos</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Hepatite C">Hepatite C</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isGeneratingReport ? 'Gerando...' : 'Gerar Relatório'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cases List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Casos Ativos ({filteredCases.length})
                </h3>
              </div>

              <div className="space-y-4">
                {filteredCases.map((case_) => (
                  <div 
                    key={case_.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{case_.id}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                          {getStatusLabel(case_.status)}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(case_.urgency)}`}>
                          {getUrgencyLabel(case_.urgency)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {case_.createdAt}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Cidadão:</span>
                        <p className="font-medium">{case_.citizen}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Medicamento:</span>
                        <p className="font-medium">{case_.medication}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Valor:</span>
                        <p className="font-medium">{case_.value}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {case_.description}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          Órgão: <span className="font-medium">{case_.agency}</span>
                        </span>
                        <span className="text-gray-600">
                          Previsão: <span className="font-medium">{case_.estimatedTime}</span>
                        </span>
                        <span className="text-gray-600">
                          Anexos: <span className="font-medium">{case_.attachments}</span>
                        </span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'laws' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-blue-600" />
                Marco Legal Brasileiro - Saúde e Medicamentos
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {brazilianHealthLaws.map((law, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedLaw(law)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{law.name}</h4>
                        <p className="text-sm text-blue-600 mt-1">{law.title}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Federal
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{law.description}</p>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <div className="flex justify-between">
                        <span>Taxa de sucesso: {law.successRate}%</span>
                        <span>Casos relacionados: {law.cases}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-900">Artigos principais:</h5>
                      <div className="flex flex-wrap gap-1">
                        {law.articles.slice(0, 3).map((article: any, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            Art. {article.number}
                          </span>
                        ))}
                        {law.articles.length > 3 && (
                          <span className="text-xs text-gray-500">+{law.articles.length - 3} mais</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agencies' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-green-600" />
                Órgãos Competentes - Rede de Proteção ao Consumidor
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {governmentAgencies.map((agency, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAgency(agency)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{agency.fullName}</h4>
                        <p className="text-sm text-blue-600 mt-1">{agency.name}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Federal
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{agency.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Competências:</h5>
                        <div className="space-y-1">
                          {agency.competencies.slice(0, 3).map((competency, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{competency}</span>
                            </div>
                          ))}
                          {agency.competencies.length > 3 && (
                            <p className="text-xs text-gray-500 ml-3.5">+{agency.competencies.length - 3} competências adicionais</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Contato:</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          {agency.contact.phone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-2" />
                              <span>{agency.contact.phone}</span>
                            </div>
                          )}
                          {agency.contact.email && (
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-2" />
                              <span>{agency.contact.email}</span>
                            </div>
                          )}
                          {agency.contact.website && (
                            <div className="flex items-center">
                              <Globe className="w-3 h-3 mr-2" />
                              <span className="text-blue-600">{agency.contact.website}</span>
                            </div>
                          )}
                          {agency.contact.address && (
                            <div className="flex items-start">
                              <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{agency.contact.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Detalhes do Caso {selectedCase.id}
                  </h3>
                  <button 
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Informações do Cidadão</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><span className="text-gray-600">Nome:</span> <span className="font-medium">{selectedCase.citizen}</span></p>
                        <p><span className="text-gray-600">CPF:</span> <span className="font-medium">{selectedCase.cpf}</span></p>
                        <p><span className="text-gray-600">Última atualização:</span> <span className="font-medium">{selectedCase.lastUpdate}</span></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Status do Caso</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <p className="flex items-center">
                          <span className="text-gray-600 mr-2">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                            {getStatusLabel(selectedCase.status)}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Urgência:</span>
                          <span className={`ml-2 font-medium ${getUrgencyColor(selectedCase.urgency)}`}>
                            {getUrgencyLabel(selectedCase.urgency)}
                          </span>
                        </p>
                        <p><span className="text-gray-600">Interações:</span> <span className="font-medium">{selectedCase.interactions}</span></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Medicamento</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-lg">{selectedCase.medication}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <p><span className="text-blue-700">Valor:</span> <span className="font-medium">{selectedCase.value}</span></p>
                        <p><span className="text-blue-700">Categoria:</span> <span className="font-medium">{selectedCase.category}</span></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Base Legal</h4>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-medium text-purple-900">{selectedCase.legalBasis}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <p><span className="text-purple-700">Órgão responsável:</span> <span className="font-medium">{selectedCase.agency}</span></p>
                        <p><span className="text-purple-700">Confiança da análise:</span> <span className="font-medium">{selectedCase.confidence}</span></p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Descrição do Problema</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedCase.description}
                    </p>
                  </div>

                  {selectedCase.resolution && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Resolução</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800">{selectedCase.resolution}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Cronograma</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><span className="text-gray-600">Criado em:</span> <span className="font-medium">{selectedCase.createdAt}</span></p>
                        <p><span className="text-gray-600">Tempo estimado:</span> <span className="font-medium">{selectedCase.estimatedTime}</span></p>
                        <p><span className="text-gray-600">Anexos:</span> <span className="font-medium">{selectedCase.attachments} documentos</span></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Ações</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Atualizar Status
                        </button>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Enviar para Órgão
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                          Adicionar Observação
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Law Detail Modal */}
        {selectedLaw && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedLaw.name}</h3>
                    <p className="text-blue-600 font-medium">{selectedLaw.number}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedLaw(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedLaw.description}</p>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span className="text-blue-700">Título: <span className="font-medium">{selectedLaw.title}</span></span>
                      <span className="text-blue-700">Taxa de sucesso: <span className="font-medium">{selectedLaw.successRate}%</span></span>
                      <span className="text-blue-700">Casos relacionados: <span className="font-medium">{selectedLaw.cases}</span></span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Artigos Principais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLaw.articles.map((article: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">Art. {article.number}: {article.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cenários Aplicáveis</h4>
                    <div className="space-y-2">
                      {selectedLaw.applicableScenarios.map((scenario: string, idx: number) => (
                        <div key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{scenario}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Estatísticas de Eficiência</h4>
                    <p className="text-sm text-green-800">Taxa de sucesso: {selectedLaw.successRate}% em {selectedLaw.cases} casos analisados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agency Detail Modal */}
        {selectedAgency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedAgency.name}</h3>
                    <p className="text-blue-600 font-medium">{selectedAgency.acronym}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedAgency(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedAgency.description}</p>
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Federal
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Competências e Atribuições</h4>
                    <div className="space-y-2">
                      {selectedAgency.competencies.map((competency: string, idx: number) => (
                        <div key={idx} className="flex items-start bg-gray-50 p-3 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
          </div>
        )}

        {/* Nova Aba: Bíblia da Legislação */}
        {activeTab === 'legislation' && (
          <div className="bg-white rounded-lg shadow-sm">
            <LegislationBrowser userType="mp" />
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
