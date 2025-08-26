'use client';

import Link from 'next/link';
import { Users, UserCheck, FileText, Shield, Activity, TrendingUp } from 'lucide-react';
import { AnvisaConsultationWidget } from '@/components/AnvisaConsultationWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-red-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-red-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-16">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  DHS via PGS Medicamentos
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sistema Integrado de Acesso a Medicamentos</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Ministério Público - Defesa do Consumidor
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Orientação para Acesso a Medicamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Sistema público gratuito que promove <strong>atuações resolutivas de Planejamento e de Gestão Sistêmicos</strong>, 
            <strong>Negociação</strong>, <strong>Mediação</strong> e <strong>Conciliação</strong> para garantir o acesso aos direitos de saúde 
            através do <strong>Desenvolvimento Harmônico Sustentável (DHS)</strong>.
          </p>
          
          {/* Explicação das Siglas */}
          <div className="max-w-5xl mx-auto bg-red-50 rounded-xl p-6 border border-red-100">
            <h3 className="text-lg font-semibold text-red-800 mb-4">📚 Metodologia de Atuações Resolutivas</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-red-700 mb-2">🌱 DHS</h4>
                <p className="text-gray-700">
                  <strong>Desenvolvimento Harmônico Sustentável</strong><br/>
                  Equilibra o acesso efetivo à saúde com sustentabilidade institucional, promovendo soluções duradouras.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-red-700 mb-2">📊 PGS</h4>
                <p className="text-gray-700">
                  <strong>Planejamento e Gestão Sistêmicos</strong><br/>
                  <strong>Foco em atuações resolutivas de planejamento</strong> que conectam diferentes órgãos para soluções eficazes.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-red-700 mb-2">🤝 NMC</h4>
                <p className="text-gray-700">
                  <strong>Negociação, Mediação e Conciliação</strong><br/>
                  Métodos consensuais que priorizam soluções colaborativas antes da judicialização.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Cidadão Card */}
          <Link href="/cidadao">
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Portal do Cidadão
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Consulte medicamentos, conheça seus direitos e receba orientações 
                  sobre procedimentos junto aos órgãos competentes.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-3 text-red-500" />
                    Orientações sobre direitos e procedimentos
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-3 text-green-500" />
                    Consulta de medicamentos ANVISA
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-3 text-red-600" />
                    Indicação de órgãos competentes
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium group-hover:bg-red-200 transition-colors duration-300">
                    Acessar Portal do Cidadão
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Promotor Card */}
          <Link href="/promotor">
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Ministério Público
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Painel de monitoramento para acompanhar demandas da comunidade 
                  e implementar atuações resolutivas de planejamento sistêmico.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-3 text-red-500" />
                    Dados para planejamento de ações
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity className="w-4 h-4 mr-3 text-green-500" />
                    Monitoramento de demandas
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-3 text-red-600" />
                    Gestão sistêmica de casos
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium group-hover:bg-red-200 transition-colors duration-300">
                    Acessar MPE
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Defensoria Pública Card */}
          <Link href="/defensoria">
            <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-700 to-red-800 rounded-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Defensoria Pública
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Acesso especializado para defesa dos direitos dos hipossuficientes 
                  em questões medicamentosas e de saúde pública.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-3 text-red-700" />
                    Defesa dos hipossuficientes
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-3 text-red-600" />
                    Assistência jurídica gratuita
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-3 text-red-500" />
                    Casos de vulnerabilidade social
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium group-hover:bg-red-200 transition-colors duration-300">
                    Acessar Defensoria
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Seção de Notícias/Atualizações */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">🔔 Últimas Atualizações</h4>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <div className="text-sm font-medium text-gray-900">Nova base legal atualizada</div>
                <div className="text-xs text-gray-600">Lei 14.874/2024 incluída no sistema</div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <div className="text-sm font-medium text-gray-900">Integração ANVISA melhorada</div>
                <div className="text-xs text-gray-600">Consulta de medicamentos mais rápida</div>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm font-medium text-gray-900">Dashboard MPE atualizado</div>
                <div className="text-xs text-gray-600">Novos indicadores disponíveis</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">⚡ Funcionalidades em Destaque</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Análise jurídica automatizada com IA</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Recomendações personalizadas por caso</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Estimativa de custos e prazos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Dashboard em tempo real</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Precisa de Ajuda com Medicamentos?</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Nosso sistema oferece orientação especializada baseada na legislação brasileira. 
            Descubra seus direitos e receba recomendações personalizadas.
          </p>
          <Link href="/cidadao" className="inline-flex items-center px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors duration-300 shadow-lg">
            Começar Consulta Gratuita
          </Link>
        </div>

        {/* Sistema Information */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Sistema de Orientação Medicamentosa
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-4xl mx-auto">
            Plataforma digital desenvolvida para orientar cidadãos, promotores e defensores públicos 
            sobre direitos relacionados ao acesso a medicamentos, baseada na legislação brasileira vigente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">6</div>
              <div className="text-sm text-gray-600">Leis Principais</div>
              <div className="text-xs text-gray-500 mt-1">Base legal atualizada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Órgãos Integrados</div>
              <div className="text-xs text-gray-500 mt-1">ANVISA, MS, PROCON e outros</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Perfis de Usuário</div>
              <div className="text-xs text-gray-500 mt-1">Cidadão, MP e Defensoria</div>
            </div>
          </div>
          
          {/* Explicação sobre o Sistema */}
          <div className="mt-8 pt-6 border-t border-red-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🎯 Objetivos do Sistema
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="font-semibold text-red-800 mb-2">� Orientação Legal</h5>
                <p className="text-gray-700">
                  Fornecer informações precisas sobre direitos e procedimentos legais 
                  relacionados ao acesso a medicamentos com base na legislação vigente.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="font-semibold text-red-800 mb-2">🤝 Mediação Preventiva</h5>
                <p className="text-gray-700">
                  Promover soluções consensuais e extrajudiciais através de negociação, 
                  mediação e conciliação antes da judicialização.
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="font-semibold text-red-800 mb-2">⚖️ Suporte Institucional</h5>
                <p className="text-gray-700">
                  Auxiliar promotores e defensores públicos com dados e análises para 
                  atuações resolutivas de planejamento sistêmico.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Órgãos Integrados */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-6">
            Órgãos e Instituições Integradas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-center">
              <div className="font-semibold text-red-700">ANVISA</div>
              <div className="text-xs text-gray-600">Vigilância Sanitária</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-700">MS</div>
              <div className="text-xs text-gray-600">Ministério da Saúde</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-800">PROCON</div>
              <div className="text-xs text-gray-600">Defesa do Consumidor</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-700">ANS</div>
              <div className="text-xs text-gray-600">Saúde Suplementar</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-700">MPE</div>
              <div className="text-xs text-gray-600">Ministério Público</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-900">DPE</div>
              <div className="text-xs text-gray-600">Defensoria Pública</div>
            </div>
          </div>
        </div>
      </main>

      {/* Widget de Consulta ANVISA */}
      <AnvisaConsultationWidget />
    </div>
  );
}
