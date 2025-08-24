'use client';

import { Loader2, Pill, Search, FileText, Database, CheckCircle } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-red-100">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="relative">
              <Search className="h-7 w-7 animate-bounce-subtle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            Análise Jurídica Especializada em Andamento
          </h1>
          <p className="mt-2 opacity-90 text-lg">
            Processando suas informações com base na legislação brasileira atualizada...
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center space-y-8">
            {/* Spinner principal aprimorado */}
            <div className="relative">
              <div className="w-24 h-24 border-4 border-red-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 w-20 h-20 border-4 border-red-400 rounded-full border-b-transparent animate-spin reverse-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Pill className="h-10 w-10 text-red-600 animate-pulse-subtle" />
              </div>
            </div>

            {/* Status steps */}
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-sm">Dados recebidos e validados</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-700">
                <div className="flex-shrink-0">
                  <Loader2 className="h-5 w-5 text-red-600 animate-spin" />
                </div>
                <span className="text-sm">Consultando base legal atualizada...</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <span className="text-sm">Verificando órgãos competentes</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm">Gerando recomendações personalizadas</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full progress-bar"></div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">
                Analisando legislação e jurisprudência...
              </p>
            </div>

            {/* Dicas enquanto espera */}
            <div className="bg-red-50 rounded-lg p-4 w-full max-w-md border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">💡 Você Sabia?</h3>
              <p className="text-red-700 text-sm">
                O sistema analisa mais de 50 leis e regulamentações para garantir 
                que você receba a orientação mais precisa e atualizada possível.
              </p>
            </div>

            {/* Dicas adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-800 mb-1">📋 Leis Consultadas</h4>
                <p className="text-green-700 text-xs">
                  Lei 9.782/99 (ANVISA), CDC, CF/88 Art. 196
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-medium text-red-800 mb-1">⚖️ Análise Legal</h4>
                <p className="text-red-700 text-xs">
                  Verificando jurisprudência do STF e STJ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          animation: progress 3s ease-in-out infinite;
        }
        
        .reverse-spin {
          animation: spin 1s linear infinite reverse;
        }
        
        @keyframes progress {
          0% { width: 0%; opacity: 0.6; }
          25% { width: 30%; opacity: 0.8; }
          50% { width: 60%; opacity: 1; }
          75% { width: 85%; opacity: 0.9; }
          100% { width: 100%; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
