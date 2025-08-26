import React, { useState } from 'react';
import { Search, Pill, CheckCircle, XCircle, Info, FileText, Clock } from 'lucide-react';
import { AnvisaConsultationService, AnvisaConsultationResult, MedicationInfo } from '@/services/anvisa-consultation';

export function AnvisaConsultationWidget() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnvisaConsultationResult | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const consultation = await AnvisaConsultationService.consultMedication(searchTerm);
      setResult(consultation);
    } catch (error) {
      console.error('Erro na consulta ANVISA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'VÁLIDO': return 'bg-green-100 text-green-800 border-green-200';
        case 'VENCIDO': return 'bg-red-100 text-red-800 border-red-200';
        case 'CANCELADO': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'SUSPENSO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  const MedicationCard = ({ medication }: { medication: MedicationInfo }) => (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{medication.name}</h4>
          <p className="text-gray-600 text-sm">{medication.activeSubstance}</p>
        </div>
        <StatusBadge status={medication.status} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-500">Registro ANVISA</p>
          <p className="font-mono text-sm">{medication.registrationNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Laboratório</p>
          <p className="text-sm">{medication.company}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Categoria</p>
          <p className="text-sm">{medication.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Validade do Registro</p>
          <p className="text-sm">{new Date(medication.expiryDate).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {medication.susIncluded && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponível no SUS
          </span>
        )}
        {medication.coafIncluded && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <FileText className="w-3 h-3 mr-1" />
            CEAF (Alto Custo)
          </span>
        )}
        {medication.genericAvailable && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
            <Pill className="w-3 h-3 mr-1" />
            Genérico Disponível
          </span>
        )}
        {medication.controlledSubstance && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
            <Info className="w-3 h-3 mr-1" />
            Controlado
          </span>
        )}
      </div>
    </div>
  );

  if (!showWidget) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowWidget(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          title="Consultar medicamento na ANVISA"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Consulta ANVISA
          </h3>
          <button
            onClick={() => setShowWidget(false)}
            className="text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Verificar registro e disponibilidade no SUS
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite o nome do medicamento..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm transition-colors"
          >
            {isLoading ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {result && (
          <div className="p-4 space-y-4">
            {result.found && result.medication ? (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Medicamento Encontrado
                  </h4>
                  <MedicationCard medication={result.medication} />
                </div>

                {/* Public Access Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900 mb-2">Acesso Público</h5>
                  <div className="space-y-1 text-sm">
                    <p className={`${result.publicAccessInfo.susAvailable ? 'text-green-700' : 'text-gray-600'}`}>
                      SUS: {result.publicAccessInfo.susAvailable ? '✅ Disponível' : '❌ Não disponível'}
                    </p>
                    <p className={`${result.publicAccessInfo.farmaciaPopularAvailable ? 'text-green-700' : 'text-gray-600'}`}>
                      Farmácia Popular: {result.publicAccessInfo.farmaciaPopularAvailable ? '✅ Disponível' : '❌ Não disponível'}
                    </p>
                    <p className="text-blue-700 font-medium">
                      💰 {result.publicAccessInfo.estimatedPublicPrice}
                    </p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2">Próximos Passos</h5>
                  <ul className="space-y-1">
                    {result.nextSteps.slice(0, 3).map((step, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alternatives */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Alternativas (mesmo princípio ativo)</h5>
                    <div className="space-y-2">
                      {result.alternatives.slice(0, 2).map((alt, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                          <p className="font-medium">{alt.name}</p>
                          <p className="text-gray-600">{alt.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">Medicamento não encontrado na base de dados</p>
                
                {/* Sugestões "Você quis dizer..." */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="text-left mb-4">
                    <h5 className="font-medium text-orange-800 mb-2 flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Você quis dizer...?
                    </h5>
                    <div className="space-y-1">
                      {result.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchTerm(suggestion);
                            handleSearch();
                          }}
                          className="block w-full text-left text-sm p-2 bg-orange-50 hover:bg-orange-100 rounded border-l-4 border-orange-400 transition-colors cursor-pointer"
                        >
                          <p className="font-medium text-orange-800">{suggestion}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="text-left mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Medicamentos similares encontrados:</h5>
                    <div className="space-y-2">
                      {result.alternatives.slice(0, 3).map((alt, index) => (
                        <div key={index} className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                          <p className="font-medium">{alt.name}</p>
                          <p className="text-gray-600">{alt.activeSubstance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-left bg-blue-50 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900 mb-2">Recomendações</h5>
                  <ul className="space-y-1">
                    {result.nextSteps.slice(0, 2).map((step, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !isLoading && (
          <div className="p-4 text-center text-gray-500">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>Digite o nome de um medicamento para consultar</p>
          </div>
        )}
      </div>
    </div>
  );
}
