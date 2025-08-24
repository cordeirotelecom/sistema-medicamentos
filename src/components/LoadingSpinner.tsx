'use client';

import { Loader2, Pill, Search, FileText, Database, CheckCircle } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="relative">
              <Search className="h-7 w-7 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            Analisando sua Solicitação
          </h1>
          <p className="mt-2 opacity-90 text-lg">
            Estamos processando suas informações e buscando a melhor orientação...
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Spinner principal aprimorado */}
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 w-20 h-20 border-4 border-purple-400 rounded-full border-b-transparent animate-spin animate-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Pill className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
            </div>

            {/* Etapas do processo com melhor design */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform transition-all duration-300 hover:scale-105">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-grow">
                  <span className="text-blue-800 font-semibold">Validando informações do medicamento</span>
                  <div className="text-blue-600 text-sm mt-1">Verificando dados na base ANVISA...</div>
                </div>
                <Database className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-green-600 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-grow">
                  <span className="text-green-800 font-semibold">Consultando base de dados governamental</span>
                  <div className="text-green-600 text-sm mt-1">Acessando APIs oficiais do governo...</div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600 animate-pulse" />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.4s' }}>
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-grow">
                  <span className="text-purple-800 font-semibold">Determinando órgão competente</span>
                  <div className="text-purple-600 text-sm mt-1">Analisando tipo de problema e jurisdição...</div>
                </div>
                <Search className="h-5 w-5 text-purple-600 animate-pulse" />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.6s' }}>
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-orange-600 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-grow">
                  <span className="text-orange-800 font-semibold">Gerando recomendações personalizadas</span>
                  <div className="text-orange-600 text-sm mt-1">Criando passos específicos para sua situação...</div>
                </div>
                <FileText className="h-5 w-5 text-orange-600 animate-pulse" />
              </div>
            </div>

            {/* Informações adicionais com melhor layout */}
            <div className="text-center space-y-4 bg-gray-50 p-6 rounded-xl w-full max-w-2xl">
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Isso pode levar alguns segundos...</span>
              </div>
              <div className="text-sm text-gray-600 max-w-md mx-auto">
                Estamos analisando mais de <span className="font-semibold text-blue-600">50 critérios</span> para fornecer a orientação mais precisa para seu caso
              </div>
              
              {/* Barra de progresso animada */}
              <div className="w-full max-w-md mx-auto mt-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-full rounded-full progress-bar shadow-sm"></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Processando...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.6;
          }
          25% {
            width: 30%;
            opacity: 0.8;
          }
          50% {
            width: 60%;
            opacity: 1;
          }
          75% {
            width: 85%;
            opacity: 0.9;
          }
          100% {
            width: 100%;
            opacity: 0.7;
          }
        }
        .progress-bar {
          animation: progress 3s ease-in-out infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}
