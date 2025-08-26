/**
 * Componente Avançado para Promotores de Justiça
 * Dashboard completo com preços, genéricos, jurisprudência e análise preditiva
 */

'use client';

import { useState, useEffect } from 'react';
import { MedicationPriceAPI } from '@/services/medication-price-api';
import { LegalIntelligenceService } from '@/services/legal-intelligence';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scale,
  FileText,
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  Calendar,
  Star,
  ExternalLink,
  Download,
  Filter,
  Search,
  Bell,
  Target,
  BookOpen,
  Gavel
} from 'lucide-react';

interface AdvancedMPDashboardProps {
  medicationName?: string;
  patientProfile?: any;
}

export default function AdvancedMPDashboard({ medicationName, patientProfile }: AdvancedMPDashboardProps) {
  const [medicationData, setMedicationData] = useState<any>(null);
  const [priceAnalysis, setPriceAnalysis] = useState<any>(null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [jurisprudence, setJurisprudence] = useState<any[]>([]);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<any>(null);
  const [regionalStats, setRegionalStats] = useState<any>(null);
  const [activeNewsTab, setActiveNewsTab] = useState<'all' | 'regulation' | 'jurisprudence' | 'prices'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicationName) {
      loadMedicationData();
    }
    loadGeneralData();
  }, [medicationName]);

  const loadMedicationData = async () => {
    setLoading(true);
    try {
      // Carregar dados do medicamento específico
      const medData = await MedicationPriceAPI.getMedicationPrice(medicationName!);
      setMedicationData(medData);

      if (medData) {
        const analysis = await MedicationPriceAPI.analyzePricing(medicationName!);
        setPriceAnalysis(analysis);

        // Buscar jurisprudência relacionada
        const cases = LegalIntelligenceService.getJurisprudenceByMedication(medicationName!);
        setJurisprudence(cases);

        // Análise preditiva
        const prediction = LegalIntelligenceService.getPredictiveAnalysis(
          medData.category,
          patientProfile,
          patientProfile?.urgency || 'media'
        );
        setPredictiveAnalysis(prediction);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do medicamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGeneralData = async () => {
    try {
      // Carregar notícias recentes
      const news = LegalIntelligenceService.getRecentNews();
      setRecentNews(news);

      // Carregar estatísticas regionais
      const stats = LegalIntelligenceService.getRegionalStatistics('SP');
      setRegionalStats(stats);
    } catch (error) {
      console.error('Erro ao carregar dados gerais:', error);
    }
  };

  const getFilteredNews = () => {
    if (activeNewsTab === 'all') return recentNews;
    
    const categoryMap = {
      regulation: 'regulacao',
      jurisprudence: 'jurisprudencia',
      prices: 'precos'
    };
    
    return recentNews.filter(news => news.category === categoryMap[activeNewsTab]);
  };

  const renderPriceAnalysis = () => {
    if (!medicationData || !priceAnalysis) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold">Análise de Preços e Genéricos</h3>
        </div>

        {/* Preços do Medicamento */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Preço Máximo Varejo</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-800">
              R$ {medicationData.pmvg.toFixed(2)}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Preço SUS</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">GRATUITO</span>
            </div>
            <div className="text-2xl font-bold text-green-800">R$ 0,00</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Economia SUS</span>
              <TrendingDown className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-800">
              R$ {medicationData.pmvg.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Genéricos Disponíveis */}
        {medicationData.generics && medicationData.generics.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Genéricos e Biossimilares Disponíveis
            </h4>
            <div className="space-y-3">
              {medicationData.generics.map((generic: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{generic.name}</div>
                    <div className="text-sm text-gray-600">{generic.manufacturer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">R$ {generic.price.toFixed(2)}</div>
                    <div className="text-sm text-green-700">Economia: {generic.savings.toFixed(1)}%</div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      generic.quality === 'a' ? 'bg-green-100 text-green-800' :
                      generic.quality === 'b' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Qualidade {generic.quality.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendação para o MP */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-blue-800 mb-2">Recomendação Jurídica</h5>
              {medicationData.availability.sus ? (
                <p className="text-blue-700 text-sm">
                  ✅ Medicamento incluído no SUS. Argumente responsabilidade do ente federativo para fornecimento gratuito.
                  {medicationData.generics?.length > 0 && (
                    <span className="block mt-2">
                      💡 Existem {medicationData.generics.length} genéricos disponíveis com economia de até {Math.max(...medicationData.generics.map((g: any) => g.savings)).toFixed(1)}%.
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-blue-700 text-sm">
                  ⚠️ Medicamento não incluído no SUS. Necessária argumentação excepcional baseada na Lei 12.401/11.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJurisprudence = () => {
    if (!jurisprudence || jurisprudence.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Gavel className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">Jurisprudência Relevante</h3>
        </div>

        <div className="space-y-4">
          {jurisprudence.map((case_: any) => (
            <div key={case_.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{case_.court}</h4>
                  <p className="text-sm text-gray-600">{case_.caseNumber} - {case_.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  case_.decision === 'favorable' ? 'bg-green-100 text-green-800' :
                  case_.decision === 'unfavorable' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {case_.decision === 'favorable' ? 'Favorável' :
                   case_.decision === 'unfavorable' ? 'Desfavorável' : 'Parcial'}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{case_.summary}</p>

              <div className="mb-3">
                <span className="font-medium text-gray-700">Base Legal: </span>
                <span className="text-gray-600">{case_.legalBasis.join(', ')}</span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700">Pontos-chave:</span>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {case_.keyPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  case_.precedentValue === 'alto' ? 'bg-red-100 text-red-800' :
                  case_.precedentValue === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Precedente: {case_.precedentValue}
                </span>
                <span className="text-xs text-gray-500">
                  Âmbito: {case_.applicability.scope}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPredictiveAnalysis = () => {
    if (!predictiveAnalysis) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold">Análise Preditiva</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Probabilidade de Sucesso */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Probabilidade de Sucesso
            </h4>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {predictiveAnalysis.successProbability}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${predictiveAnalysis.successProbability}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tempo Médio */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Tempo Médio de Tramitação
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {predictiveAnalysis.avgTimeframe}
              </div>
              <div className="text-sm text-gray-600">
                {predictiveAnalysis.similarCases.toLocaleString()} casos similares
              </div>
            </div>
          </div>
        </div>

        {/* Evidências Necessárias */}
        <div className="mt-6">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Evidências Recomendadas
          </h4>
          <ul className="grid md:grid-cols-2 gap-2">
            {predictiveAnalysis.requiredEvidence.map((evidence: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {evidence}
              </li>
            ))}
          </ul>
        </div>

        {/* Recomendações */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-orange-800">
            <Star className="w-5 h-5" />
            Recomendações Estratégicas
          </h4>
          <ul className="space-y-2">
            {predictiveAnalysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderNews = () => {
    const filteredNews = getFilteredNews();

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold">Notícias e Atualizações</h3>
          </div>
          
          {/* Filtros de Notícias */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'regulation', label: 'Regulação' },
              { id: 'jurisprudence', label: 'Jurisprudência' },
              { id: 'prices', label: 'Preços' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveNewsTab(tab.id as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeNewsTab === tab.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredNews.slice(0, 5).map((news) => (
            <div key={news.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600">{news.summary}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                  news.relevance === 'alta' ? 'bg-red-100 text-red-800' :
                  news.relevance === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {news.relevance.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{news.source.toUpperCase()}</span>
                  <span>{new Date(news.date).toLocaleDateString('pt-BR')}</span>
                  <span className="capitalize">{news.category.replace('_', ' ')}</span>
                </div>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver mais
                </a>
              </div>

              {news.impact.legalImplications.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <span className="font-medium text-blue-800 text-sm">Implicações Jurídicas:</span>
                  <ul className="text-xs text-blue-700 mt-1">
                    {news.impact.legalImplications.slice(0, 2).map((implication: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {implication}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com informações do medicamento */}
      {medicationData && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{medicationData.name}</h2>
              <p className="text-blue-100">
                {medicationData.commercialName} - {medicationData.manufacturer}
              </p>
              <p className="text-sm text-blue-200 mt-1">
                Registro ANVISA: {medicationData.registry}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full font-medium ${
                medicationData.category === 'alto_custo' ? 'bg-red-100 text-red-800' :
                medicationData.category === 'basico' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {medicationData.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Componentes */}
      <div className="grid gap-6">
        {/* Análise de Preços e Genéricos */}
        {renderPriceAnalysis()}

        {/* Análise Preditiva */}
        {renderPredictiveAnalysis()}

        {/* Jurisprudência */}
        {renderJurisprudence()}

        {/* Notícias */}
        {renderNews()}

        {/* Estatísticas Regionais */}
        {regionalStats && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold">Estatísticas Regionais - {regionalStats.state}</h3>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{regionalStats.totalCases.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Casos Totais</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{regionalStats.successRate}%</div>
                <div className="text-sm text-green-700">Taxa de Sucesso</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{regionalStats.avgTimeframe}</div>
                <div className="text-sm text-purple-700">Tempo Médio</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">+{regionalStats.trends.monthlyGrowth}%</div>
                <div className="text-sm text-orange-700">Crescimento Mensal</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Medicamentos Mais Solicitados</h4>
                <div className="space-y-2">
                  {regionalStats.topMedications.map((med: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{med.name}</span>
                      <div className="text-right text-sm">
                        <div>{med.cases} casos</div>
                        <div className="text-green-600">{med.successRate}% sucesso</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">Cidades com Mais Casos</h4>
                <div className="space-y-2">
                  {regionalStats.topCities.map((city: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{city.name}</span>
                      <div className="text-right text-sm">
                        <div>{city.cases} casos</div>
                        <div className="text-green-600">{city.successRate}% sucesso</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
