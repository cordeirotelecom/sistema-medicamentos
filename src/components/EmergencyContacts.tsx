/**
 * Componente de Contatos de Emergência e Órgãos Úteis
 * Fornece informações de contato essenciais antes da solicitação
 */

'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Clock, 
  Building, 
  Heart, 
  Shield, 
  Users, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface ContactInfo {
  name: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  hours?: string;
  services: string[];
  priority: 'alta' | 'media' | 'baixa';
  type: 'emergencia' | 'saude' | 'social' | 'juridico' | 'administrativo';
  icon: any;
}

export default function EmergencyContacts() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('todos');

  const contacts: ContactInfo[] = [
    {
      name: 'SAMU - Serviço de Atendimento Móvel de Urgência',
      description: 'Emergências médicas graves e urgentes',
      phone: '192',
      services: ['Emergência médica', 'Transporte de urgência', 'Atendimento pré-hospitalar'],
      priority: 'alta',
      type: 'emergencia',
      icon: Heart,
      hours: '24 horas'
    },
    {
      name: 'Ouvidoria do SUS',
      description: 'Reclamações, denúncias e informações sobre o SUS',
      phone: '136',
      website: 'https://ouvidoria.saude.gov.br',
      services: ['Reclamações SUS', 'Informações sobre direitos', 'Denúncias'],
      priority: 'alta',
      type: 'saude',
      icon: Shield,
      hours: '24 horas'
    },
    {
      name: 'Farmácia Popular / Aqui Tem Farmácia Popular',
      description: 'Medicamentos gratuitos e com desconto',
      phone: '136',
      website: 'https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular',
      services: ['Medicamentos gratuitos', 'Medicamentos com desconto', 'Fraldas geriátricas'],
      priority: 'alta',
      type: 'saude',
      icon: Building,
      hours: 'Horário comercial'
    },
    {
      name: 'CRAS - Centro de Referência de Assistência Social',
      description: 'Assistência social e cadastro em programas sociais',
      services: ['Cadastro Único', 'Bolsa Família', 'BPC', 'Orientação social'],
      priority: 'alta',
      type: 'social',
      icon: Users,
      hours: 'Segunda a sexta, 8h às 17h'
    },
    {
      name: 'Defensoria Pública',
      description: 'Assistência jurídica gratuita para quem não pode pagar advogado',
      phone: '129',
      services: ['Ações judiciais', 'Orientação jurídica', 'Mediação', 'Direito à saúde'],
      priority: 'alta',
      type: 'juridico',
      icon: Shield,
      hours: 'Segunda a sexta, 8h às 18h'
    },
    {
      name: 'PROCON',
      description: 'Defesa do consumidor, inclusive medicamentos',
      phone: '151',
      website: 'https://www.procon.df.gov.br',
      services: ['Reclamações de consumo', 'Preços abusivos', 'Medicamentos defeituosos'],
      priority: 'media',
      type: 'juridico',
      icon: Shield,
      hours: 'Segunda a sexta, 8h às 18h'
    },
    {
      name: 'Secretaria Municipal de Saúde',
      description: 'Gestão local da saúde e medicamentos básicos',
      services: ['Medicamentos básicos', 'UBS', 'Programas municipais', 'Cadastro no SUS'],
      priority: 'alta',
      type: 'administrativo',
      icon: Building,
      hours: 'Segunda a sexta, 8h às 17h'
    },
    {
      name: 'Secretaria Estadual de Saúde',
      description: 'Medicamentos de alto custo e especialidades',
      services: ['Medicamentos de alto custo', 'CEAF', 'Medicamentos especializados'],
      priority: 'media',
      type: 'administrativo',
      icon: Building,
      hours: 'Segunda a sexta, 8h às 17h'
    },
    {
      name: 'ANVISA - Agência Nacional de Vigilância Sanitária',
      description: 'Regulamentação e fiscalização de medicamentos',
      phone: '0800 642 9782',
      website: 'https://www.gov.br/anvisa/pt-br',
      email: 'ouvidoria@anvisa.gov.br',
      services: ['Denúncias sobre medicamentos', 'Medicamentos falsificados', 'Efeitos adversos'],
      priority: 'media',
      type: 'administrativo',
      icon: Shield,
      hours: 'Segunda a sexta, 8h às 18h'
    },
    {
      name: 'Ministério Público Estadual',
      description: 'Fiscalização e defesa dos direitos coletivos',
      services: ['Ações coletivas', 'Fiscalização de políticas públicas', 'TAC'],
      priority: 'media',
      type: 'juridico',
      icon: Shield,
      hours: 'Segunda a sexta, 8h às 18h'
    },
    {
      name: 'CNES - Cadastro Nacional de Estabelecimentos de Saúde',
      description: 'Consulta de estabelecimentos de saúde credenciados',
      website: 'http://cnes.datasus.gov.br',
      services: ['Consulta de hospitais', 'UBS credenciadas', 'Farmácias SUS'],
      priority: 'baixa',
      type: 'administrativo',
      icon: Building,
      hours: 'Consulta online 24h'
    },
    {
      name: 'Disque Saúde',
      description: 'Informações gerais sobre saúde e direitos',
      phone: '136',
      services: ['Informações sobre saúde', 'Orientações gerais', 'Direcionamento'],
      priority: 'media',
      type: 'saude',
      icon: Phone,
      hours: '24 horas'
    }
  ];

  const typeLabels = {
    todos: 'Todos os Órgãos',
    emergencia: 'Emergência',
    saude: 'Saúde',
    social: 'Assistência Social',
    juridico: 'Jurídico',
    administrativo: 'Administrativo'
  };

  const filteredContacts = selectedType === 'todos' 
    ? contacts 
    : contacts.filter(contact => contact.type === selectedType);

  const priorityColors = {
    alta: 'bg-red-100 text-red-800 border-red-200',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    baixa: 'bg-green-100 text-green-800 border-green-200'
  };

  const typeColors = {
    emergencia: 'bg-red-50 border-red-200',
    saude: 'bg-blue-50 border-blue-200',
    social: 'bg-purple-50 border-purple-200',
    juridico: 'bg-orange-50 border-orange-200',
    administrativo: 'bg-gray-50 border-gray-200'
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Contatos Úteis - Busque Ajuda Primeiro
            </h2>
            <p className="text-gray-600 text-sm">
              Antes de fazer sua solicitação, tente estes órgãos que podem resolver rapidamente
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Ocultar
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Ver Todos os Contatos
            </>
          )}
        </button>
      </div>

      {/* Contatos Prioritários - Sempre Visíveis */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {contacts.filter(c => c.priority === 'alta').slice(0, 3).map((contact, index) => {
          const IconComponent = contact.icon;
          return (
            <div
              key={index}
              className={`${typeColors[contact.type]} border rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{contact.name}</h3>
                  <p className="text-gray-600 text-xs mb-2">{contact.description}</p>
                  
                  <div className="space-y-1">
                    {contact.phone && (
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline font-medium">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    
                    {contact.hours && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {contact.hours}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista Completa - Expansível */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Lista Completa */}
          <div className="grid gap-4">
            {filteredContacts.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div
                  key={index}
                  className={`${typeColors[contact.type]} border rounded-lg p-4`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-800">{contact.name}</h3>
                        <p className="text-gray-600 text-sm">{contact.description}</p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[contact.priority]}`}>
                      {contact.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline font-medium">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline text-sm">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      
                      {contact.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                            Acessar site
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      
                      {contact.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 text-sm">{contact.hours}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 text-sm mb-2">Serviços oferecidos:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {contact.services.map((service, idx) => (
                          <li key={idx} className="text-gray-600 text-xs">{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aviso Importante */}
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-start gap-2">
          <HelpCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-orange-800 mb-1">Dica Importante:</p>
            <p className="text-orange-700">
              Muitas vezes seus direitos podem ser atendidos rapidamente através destes órgãos, 
              evitando processos mais demorados. <strong>Tente primeiro</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
