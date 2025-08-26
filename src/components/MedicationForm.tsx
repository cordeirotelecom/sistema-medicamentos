'use client';

import { useState, useEffect, useCallback } from 'react';
import { MedicationRequest } from '@/types';
import { brazilianStates } from '@/data/agencies';
import { GovernmentAPIService } from '@/services/government-api';
import { AlertCircle, Pill, MapPin, User, Phone, Mail, Scale, BookOpen } from 'lucide-react';
import LegislationBrowser from './LegislationBrowser';

interface MedicationFormProps {
  onSubmit: (request: MedicationRequest) => void;
  isLoading: boolean;
  onFormChange?: (hasChanges: boolean) => void;
}

export default function MedicationForm({ onSubmit, isLoading, onFormChange }: MedicationFormProps) {
  const [formData, setFormData] = useState<Partial<MedicationRequest>>({
    medicationName: '',
    issueType: 'quality',
    urgency: 'medium',
    description: '',
    patientInfo: {
      hasChronicCondition: false,
      isPregnant: false,
      isBrazilianCitizen: true
    },
    location: {
      state: '',
      city: ''
    },
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showLegislation, setShowLegislation] = useState(false);

  // Limpar cache e forçar estado inicial
  useEffect(() => {
    const clearBrowserCache = () => {
      // Limpar formulários do histórico do navegador
      if (typeof window !== 'undefined') {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          if (form instanceof HTMLFormElement) {
            form.reset();
          }
        });

        // Limpar campos individualmente
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.value = '';
            input.defaultValue = '';
          } else if (input instanceof HTMLSelectElement) {
            input.selectedIndex = 0;
          }
        });

        // Forçar re-renderização do estado
        setTimeout(() => {
          // Formulário pronto para uso
        }, 100);
      }
    };

    clearBrowserCache();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validar nome do medicamento
    if (!formData.medicationName?.trim()) {
      newErrors.medicationName = 'Nome do medicamento é obrigatório';
    } else if (formData.medicationName.length < 3) {
      newErrors.medicationName = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar descrição
    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição do problema é obrigatória';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }

    // Validar informações de contato
    if (!formData.contactInfo?.name?.trim()) {
      newErrors.contactName = 'Nome é obrigatório';
    }

    if (!formData.contactInfo?.email?.trim()) {
      newErrors.contactEmail = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors.contactEmail = 'Email inválido';
    }

    // Validar localização
    if (!formData.location?.state) {
      newErrors.locationState = 'Estado é obrigatório';
    }

    if (!formData.location?.city?.trim()) {
      newErrors.locationCity = 'Cidade é obrigatória';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    
    // Log temporário para debug
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ CAMPOS COM ERRO:', {
        errors: newErrors,
        formData: {
          medicationName: `"${formData.medicationName}" (${formData.medicationName?.length} chars)`,
          description: `"${formData.description}" (${formData.description?.length} chars)`,
          contactName: `"${formData.contactInfo?.name}" (${formData.contactInfo?.name?.length} chars)`,
          contactEmail: `"${formData.contactInfo?.email}" (${formData.contactInfo?.email?.length} chars)`,
          state: `"${formData.location?.state}"`,
          city: `"${formData.location?.city}"`
        }
      });
    }
    
    return isValid;
  }, [formData]);

  // Validação em tempo real
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Detectar mudanças no formulário
  useEffect(() => {
    const hasChanges = !!(
      formData.medicationName?.trim() ||
      formData.description?.trim() ||
      formData.contactInfo?.name?.trim() ||
      formData.contactInfo?.email?.trim() ||
      formData.contactInfo?.phone?.trim() ||
      formData.location?.state ||
      formData.location?.city
    );
    
    onFormChange?.(hasChanges);
  }, [formData, onFormChange]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    if (numbers.length === 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    
    // Limita a 11 dígitos
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const issueTypes = [
    { value: 'shortage', label: 'Falta/Desabastecimento do medicamento' },
    { value: 'quality', label: 'Problema de qualidade (defeito, contaminação)' },
    { value: 'adverse_reaction', label: 'Reação adversa/Efeito colateral grave' },
    { value: 'registration', label: 'Medicamento não registrado/aprovado' },
    { value: 'price', label: 'Preço abusivo/Cartel de preços' },
    { value: 'accessibility', label: 'Dificuldade de acesso no SUS' },
    { value: 'import', label: 'Necessidade de importação' },
    { value: 'other', label: 'Outro problema' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Baixa - Pode aguardar' },
    { value: 'medium', label: 'Média - Situação preocupante' },
    { value: 'high', label: 'Alta - Situação grave' },
    { value: 'emergency', label: 'Emergencial - Risco de vida' }
  ];

  useEffect(() => {
    if (formData.location?.state) {
      loadCities(formData.location.state);
    }
  }, [formData.location?.state]);

  const loadCities = async (stateCode: string) => {
    setLoadingCities(true);
    try {
      const citiesList = await GovernmentAPIService.getCitiesByState(stateCode);
      setCities(citiesList);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onSubmit(formData as MedicationRequest);
  };

  const clearForm = () => {
    setFormData({
      medicationName: '',
      issueType: 'quality',
      urgency: 'medium',
      description: '',
      patientInfo: {
        hasChronicCondition: false,
        isPregnant: false,
        isBrazilianCitizen: true
      },
      location: {
        state: '',
        city: ''
      },
      contactInfo: {
        name: '',
        email: '',
        phone: ''
      }
    });
    setCities([]);
    setErrors({});
    setIsFormValid(false);
    
    // Limpar campos DOM também
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form instanceof HTMLFormElement) {
        form.reset();
      }
    }, 100);
  };

  return (
    <div className="w-full mx-auto animate-fade-in">
      <div className="card overflow-hidden w-full max-w-none">
        <div className="gradient-primary text-white p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl animate-bounce-subtle">
              <Pill className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </div>
            <span className="hidden sm:inline">DHS via PGS Medicamentos</span>
            <span className="sm:hidden">Med DHS</span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl opacity-95 max-w-3xl leading-relaxed">
            🚀 Sistema integrado de orientação com <strong>consulta à base legal atualizada</strong> que verifica seus direitos conforme a legislação brasileira vigente. 
            <span className="hidden sm:inline">Desenvolvimento Harmônico Sustentável via Planejamento de Gestão Sistêmicos e métodos de NMC.</span>
          </p>
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <span>✅</span> <span className="hidden sm:inline">Verificação de </span>Direitos Legais
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <span>🏛️</span> <span className="hidden sm:inline">Inclui </span>MPE Estadual
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <span>📋</span> Base Legal<span className="hidden sm:inline"> Atualizada</span>
            </div>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          autoComplete="off" 
          className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full"
        >
        {/* Informações do Medicamento */}
        <div className="space-y-6 w-full">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            Informações do Medicamento
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="lg:col-span-2 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome do Medicamento *
              </label>
              <input
                type="text"
                name="medication-name"
                autoComplete="off"
                value={formData.medicationName || ''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, medicationName: e.target.value }));
                }}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 transition-all duration-200 text-lg ${
                  errors.medicationName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Ex: Paracetamol 500mg, Dipirona, Omeprazol..."
                required
              />
              {errors.medicationName && (
                <p className="text-red-600 text-sm mt-1">{errors.medicationName}</p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Problema *
              </label>
              <select
                title="Selecione o tipo de problema"
                value={formData.issueType || ''}
                onChange={(e) => updateFormData('issueType', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white"
                required
              >
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nível de Urgência *
              </label>
              <select
                title="Selecione o nível de urgência"
                value={formData.urgency || ''}
                onChange={(e) => updateFormData('urgency', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white"
                required
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição Detalhada do Problema *
              </label>
              <textarea
                name="description"
                autoComplete="off"
                value={formData.description || ''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                }}
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                placeholder="Descreva detalhadamente o problema encontrado. Inclua informações como: onde comprou, quando aconteceu, sintomas observados, etc..."
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <div className="text-sm text-gray-500 mt-2">
                Quanto mais detalhes você fornecer, melhor será nossa orientação.
              </div>
            </div>
          </div>
        </div>        {/* Localização */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            Sua Localização
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                title="Selecione seu estado"
                value={formData.location?.state || ''}
                onChange={(e) => updateFormData('location.state', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg bg-white"
                required
              >
                <option value="">Selecione seu estado</option>
                {brazilianStates.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </option>
                ))}
              </select>
              {errors.locationState && (
                <p className="text-red-500 text-sm mt-1">{errors.locationState}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade *
              </label>
              <select
                title="Selecione sua cidade"
                value={formData.location?.city || ''}
                onChange={(e) => updateFormData('location.city', e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!formData.location?.state || loadingCities}
                required
              >
                <option value="">
                  {loadingCities ? 'Carregando cidades...' : formData.location?.state ? 'Selecione sua cidade' : 'Primeiro selecione o estado'}
                </option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.locationCity && (
                <p className="text-red-500 text-sm mt-1">{errors.locationCity}</p>
              )}
              {loadingCities && (
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Carregando cidades...
                </div>
              )}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Por que precisamos de sua localização?</p>
                <p className="mt-1">
                  Alguns órgãos têm representações regionais ou estaduais. Sua localização nos ajuda a direcioná-lo 
                  para o escritório mais próximo e adequado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Paciente */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            Informações do Paciente
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idade (opcional)
              </label>
              <input
                type="number"
                value={formData.patientInfo?.age || ''}
                onChange={(e) => updateFormData('patientInfo.age', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                placeholder="Idade em anos"
                min="0"
                max="120"
              />
            </div>
            <div></div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-semibold text-purple-800 mb-4">Informações Adicionais (opcional)</h3>
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.patientInfo?.hasChronicCondition || false}
                  onChange={(e) => updateFormData('patientInfo.hasChronicCondition', e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded mt-0.5"
                />
                <div>
                  <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">
                    Paciente tem condição crônica
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Ex: diabetes, hipertensão, doenças cardíacas, etc. Isso pode dar prioridade ao atendimento.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.patientInfo?.isPregnant || false}
                  onChange={(e) => updateFormData('patientInfo.isPregnant', e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded mt-0.5"
                />
                <div>
                  <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">
                    Paciente está grávida
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestantes têm prioridade especial nos atendimentos de saúde.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.patientInfo?.isBrazilianCitizen ?? true}
                  onChange={(e) => updateFormData('patientInfo.isBrazilianCitizen', e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded mt-0.5"
                />
                <div>
                  <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">
                    Cidadão brasileiro
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Estrangeiros também têm direito ao atendimento no SUS e podem fazer denúncias.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="h-6 w-6 text-orange-600" />
            </div>
            Informações de Contato
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="contact-name"
                autoComplete="off"
                value={formData.contactInfo?.name || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    contactInfo: { 
                      ...prev.contactInfo, 
                      name: e.target.value,
                      email: prev.contactInfo?.email || '',
                      phone: prev.contactInfo?.phone || ''
                    }
                  }));
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="Seu nome completo"
                required
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                name="contact-email"
                autoComplete="off"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    contactInfo: { 
                      ...prev.contactInfo, 
                      email: e.target.value,
                      name: prev.contactInfo?.name || '',
                      phone: prev.contactInfo?.phone || ''
                    }
                  }));
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="seu.email@exemplo.com"
                required
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                name="contact-phone"
                autoComplete="off"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  updateFormData('contactInfo.phone', formatted);
                }}
                onInput={(e) => {
                  const formatted = formatPhone((e.target as HTMLInputElement).value);
                  updateFormData('contactInfo.phone', formatted);
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                placeholder="(11) 99999-9999"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
              )}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Privacidade garantida</p>
                <p className="mt-1">
                  Seus dados pessoais são utilizados apenas para gerar as recomendações e não são armazenados 
                  em nossos servidores. Você receberá orientações baseadas nas informações fornecidas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="gradient-secondary -mx-8 -mb-8 px-8 py-8 mt-8 text-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">Gerar Análise Inteligente</h3>
              <p className="opacity-90">Análise legal + Recomendação de órgãos competentes</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="btn-primary text-lg py-4 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg w-full max-w-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analisando...
                  </>
                ) : (
                  <>
                    <Scale className="h-5 w-5" />
                    Fazer Consulta
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={clearForm}
                className="text-xs text-gray-400 hover:text-gray-600 underline hover:no-underline transition-all duration-200 mt-2"
              >
                Limpar Campos
              </button>
            </div>

            {/* Botão para abrir Guia Resumo Legislativo */}
            <button
              type="button"
              onClick={() => setShowLegislation(!showLegislation)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {showLegislation ? 'Ocultar' : 'Abrir'} Guia Resumo Legislativo
            </button>
            
            {!isFormValid && (
              <div className="status-error bg-red-100 border-red-300 text-red-800 max-w-md text-center">
                <p className="font-medium">Campos obrigatórios em falta</p>
                <p className="text-sm mt-1">Verifique: medicamento, descrição, localização, nome e e-mail.</p>
              </div>
            )}
            
            <div className="text-sm text-center max-w-2xl opacity-80 bg-white/10 p-4 rounded-lg">
              <p className="mb-2"><strong>Privacidade garantida</strong> - Seus dados são processados localmente</p>
              <p>Análise baseada na <strong>legislação brasileira mais recente (2024-2025)</strong></p>
            </div>
          </div>
        </div>
        </form>

        {/* Seção do Guia Resumo Legislativo */}
        {showLegislation && (
          <div className="mt-8">
            <LegislationBrowser 
              userType="cidadao"
              medicationContext={{
                name: formData.medicationName,
                urgency: formData.urgency,
                state: formData.location?.state,
                city: formData.location?.city
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
