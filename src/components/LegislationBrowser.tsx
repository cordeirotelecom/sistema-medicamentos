/**
 * Componente de Consulta de Legislação - "Bíblia da Legislação"
 * Integração completa com APIs governamentais para consulta de leis sobre medicamentos gratuitos
 */

'use client';

import { useState, useEffect } from 'react';
import { LegislationAPIService } from '@/services/legislation-api';
import { 
  Search, 
  BookOpen, 
  Scale, 
  FileText, 
  Building, 
  Clock, 
  Star, 
  ExternalLink,
  Download,
  Filter,
  Users,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface LegislationBrowserProps {
  userType: 'cidadao' | 'mp' | 'defensoria';
  medicationContext?: {
    name?: string;
    condition?: string;
    urgency?: string;
    state?: string;
    city?: string;
  };
}

export default function LegislationBrowser({ userType, medicationContext }: LegislationBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [legislation, setLegislation] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'laws' | 'agencies' | 'report'>('laws');
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: ['vigente'],
    scope: [] as string[]
  });
  const [personalizedReport, setPersonalizedReport] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, [userType]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carregar legislações
      const legislationData = await LegislationAPIService.searchLegislation({
        userType,
        status: filters.status,
        state: medicationContext?.state,
        city: medicationContext?.city
      });
      setLegislation(legislationData);

      // Carregar agências recomendadas
      const agenciesData = LegislationAPIService.getRecommendedAgencies(
        userType,
        'basico',
        medicationContext?.urgency as any || 'media'
      );
      setAgencies(agenciesData);

      // Gerar relatório personalizado
      const report = LegislationAPIService.generatePersonalizedReport(
        userType,
        medicationContext || {}
      );
      setPersonalizedReport(report);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    setLoading(true);
    try {
      const results = await LegislationAPIService.searchLegislation({
        query: searchQuery,
        userType,
        type: filters.type,
        status: filters.status,
        scope: filters.scope,
        state: medicationContext?.state
      });
      setLegislation(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = () => {
    const labels = {
      cidadao: 'Cidadão',
      mp: 'Ministério Público',
      defensoria: 'Defensoria Pública'
    };
    return labels[userType];
  };

  const getUserTypeIcon = () => {
    const icons = {
      cidadao: Users,
      mp: Scale,
      defensoria: Building
    };
    return icons[userType];
  };

  const UserIcon = getUserTypeIcon();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Bíblia da Legislação sobre Medicamentos</h1>
            <p className="text-blue-100">Consulta completa de leis, decretos e orientações</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
          <UserIcon className="w-5 h-5" />
          <span className="font-medium">Visualização para: {getUserTypeLabel()}</span>
          {medicationContext?.name && (
            <span className="bg-white/20 px-2 py-1 rounded text-sm">
              Contexto: {medicationContext.name}
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar legislação (ex: SUS, medicamentos gratuitos, alto custo...)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            Buscar
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtros:</span>
          </div>
          
          <select 
            className="border rounded px-2 py-1"
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value ? [e.target.value] : [] }))}
          >
            <option value="">Todos os tipos</option>
            <option value="lei">Leis</option>
            <option value="decreto">Decretos</option>
            <option value="portaria">Portarias</option>
            <option value="resolucao">Resoluções</option>
          </select>

          <select 
            className="border rounded px-2 py-1"
            onChange={(e) => setFilters(prev => ({ ...prev, scope: e.target.value ? [e.target.value] : [] }))}
          >
            <option value="">Todos os âmbitos</option>
            <option value="federal">Federal</option>
            <option value="estadual">Estadual</option>
            <option value="municipal">Municipal</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'laws', label: 'Legislações', icon: FileText },
              { id: 'agencies', label: 'Órgãos e Contatos', icon: Building },
              { id: 'report', label: 'Relatório Personalizado', icon: Download }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Legislations Tab */}
          {activeTab === 'laws' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando legislações...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {legislation.map((law) => (
                    <div key={law.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              law.priority === 'alta' ? 'bg-red-100 text-red-800' :
                              law.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {law.priority.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {law.type.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {law.scope.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">{law.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {law.type} nº {law.number}/{law.year}
                          </p>
                          <p className="text-gray-700">{law.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">{law.status}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Órgãos relacionados: </span>
                          <span className="text-gray-600">{law.relatedAgencies.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Requisitos: </span>
                          <span className="text-gray-600">{law.requirements.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <a
                            href={law.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Ver texto completo
                          </a>
                          <span className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Atualizado em {new Date(law.lastUpdate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agencies Tab */}
          {activeTab === 'agencies' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">
                  💡 Órgãos Recomendados para {getUserTypeLabel()}
                </h3>
                <p className="text-blue-700 text-sm">
                  Lista ordenada por efetividade e rapidez de resposta
                </p>
              </div>

              <div className="grid gap-4">
                {agencies.map((agency, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{agency.name}</h3>
                          <p className="text-gray-600 capitalize">{agency.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Prioridade {agency.priority}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Contato: </span>
                        <span className="text-gray-600">{agency.contact}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Serviços oferecidos:</span>
                        <ul className="list-disc list-inside text-gray-600 mt-1">
                          {agency.services.map((service: string, idx: number) => (
                            <li key={idx}>{service}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Documentos necessários:</span>
                        <ul className="list-disc list-inside text-gray-600 mt-1">
                          {agency.requirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Prazo: {agency.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && personalizedReport && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{personalizedReport.title}</h2>
                <p className="text-gray-600">{personalizedReport.subtitle}</p>
              </div>

              {/* Action Plan */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Plano de Ação Recomendado
                </h3>
                <ol className="space-y-2">
                  {personalizedReport.actionPlan.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Legal Tips */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Dicas Jurídicas Importantes
                </h3>
                <div className="space-y-3">
                  {personalizedReport.legalTips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-500" />
                  Contatos de Emergência
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(personalizedReport.emergencyContacts).map(([key, value]) => {
                    if (key === 'note') return null;
                    return (
                      <div key={key} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <Phone className="w-4 h-4 text-red-600" />
                        <div>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="text-gray-700">{value as string}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-3">{personalizedReport.emergencyContacts.note}</p>
              </div>

              {/* Download Report */}
              <div className="bg-white border rounded-lg p-6 text-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                  <Download className="w-5 h-5" />
                  Baixar Relatório Completo (PDF)
                </button>
                <p className="text-xs text-gray-500 mt-2">{personalizedReport.disclaimer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
