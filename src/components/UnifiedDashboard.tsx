'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Settings, Database, Brain, FileText, Workflow, Calendar, BarChart3, Shield } from 'lucide-react';
import IntegratedServicesManager, { type ServiceStatus, type IntegratedFlowResult, type HealthStatus } from '@/services/unified-integration';

interface UnifiedDashboardProps {
  medicationData?: any;
  medicationName?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ medicationData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [servicesManager] = useState(() => IntegratedServicesManager.getInstance());
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [serviceStatuses, setServiceStatuses] = useState<Map<string, ServiceStatus>>(new Map());
  const [recentFlows, setRecentFlows] = useState<IntegratedFlowResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar dashboard
    const initializeDashboard = async () => {
      try {
        const health = await servicesManager.checkServicesHealth();
        setHealthStatus(health);
        setServiceStatuses(servicesManager.getServiceStatus());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(async () => {
      try {
        const health = await servicesManager.checkServicesHealth();
        setHealthStatus(health);
        setServiceStatuses(servicesManager.getServiceStatus());
      } catch (error) {
        console.error('Failed to update dashboard:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [servicesManager]);

  const executeTestFlow = async () => {
    try {
      const result = await servicesManager.executePredictiveDemandFlow(['med001', 'med002', 'med003']);
      setRecentFlows(prev => [result, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to execute test flow:', error);
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'automation': return <Workflow className="w-5 h-5" />;
      case 'reporting': return <BarChart3 className="w-5 h-5" />;
      case 'ai': return <Brain className="w-5 h-5" />;
      case 'content': return <FileText className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando Dashboard Unificado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard de Serviços Integrados</h1>
        <p className="text-gray-600">Monitoramento e controle unificado de todos os serviços</p>
      </div>

      {/* Navegação */}
      <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'overview', label: 'Visão Geral', icon: Activity },
          { id: 'services', label: 'Serviços', icon: Database },
          { id: 'flows', label: 'Fluxos Integrados', icon: Workflow },
          { id: 'health', label: 'Saúde do Sistema', icon: Shield }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === id 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Visão Geral */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Status Geral</h3>
                <CheckCircle className={`w-5 h-5 ${healthStatus?.overallHealth ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${healthStatus?.overallHealth ? 'text-green-600' : 'text-red-600'}`}>
                {healthStatus?.overallHealth ? 'Saudável' : 'Degradado'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Serviços Ativos</h3>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {Array.from(serviceStatuses.values()).filter(s => s.status === 'active').length}/
                {serviceStatuses.size}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Pontos de Integração</h3>
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {servicesManager.getIntegrationPoints().size}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Fluxos Executados</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{recentFlows.length}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={executeTestFlow}
                className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Brain className="w-6 h-6 text-indigo-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Executar Análise Preditiva</p>
                  <p className="text-sm text-gray-600">Fluxo integrado de IA e automação</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Gerar Relatório</p>
                  <p className="text-sm text-gray-600">Relatório executivo semanal</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <FileText className="w-6 h-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Atualizar Conteúdo</p>
                  <p className="text-sm text-gray-600">Documentação automática</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Serviços */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Array.from(serviceStatuses.entries()).map(([serviceId, status]) => (
              <div key={serviceId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getServiceIcon(serviceId)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">{status.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                    {status.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime:</span>
                    <span className="text-sm font-medium">{status.metrics.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Memória:</span>
                    <span className="text-sm font-medium">{status.metrics.memory} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CPU:</span>
                    <span className="text-sm font-medium">{status.metrics.cpu}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Última verificação:</span>
                    <span className="text-sm font-medium">
                      {new Date(status.lastCheck).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Ver detalhes →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fluxos Integrados */}
      {activeTab === 'flows' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxos Recentes</h3>
            
            {recentFlows.length === 0 ? (
              <div className="text-center py-12">
                <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum fluxo executado ainda</p>
                <button 
                  onClick={executeTestFlow}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Executar Fluxo de Teste
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentFlows.map((flow) => (
                  <div key={flow.flowId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{flow.type}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        flow.status === 'completed' ? 'bg-green-100 text-green-800' :
                        flow.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {flow.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Início: {new Date(flow.startTime).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Fim: {new Date(flow.endTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ID: {flow.flowId}</p>
                      </div>
                    </div>

                    {flow.insights.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Insights:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {flow.insights.map((insight, index) => (
                            <li key={index}>• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {flow.recommendations.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Recomendações:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {flow.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saúde do Sistema */}
      {activeTab === 'health' && healthStatus && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Saúde do Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Serviços</h4>
                <div className="space-y-3">
                  {healthStatus.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{service.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status === 'healthy' ? 'Saudável' : 'Não saudável'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pontos de Integração</h4>
                <div className="space-y-3">
                  {healthStatus.integrationPoints.map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{point.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(point.status)}`}>
                        {point.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Última verificação: {new Date(healthStatus.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboard;
