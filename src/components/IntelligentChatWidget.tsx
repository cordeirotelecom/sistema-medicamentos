import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Phone, Video, FileText, AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  type?: 'text' | 'medication' | 'emergency' | 'appointment' | 'document';
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  medicationContext?: any;
}

export default function IntelligentChatWidget({ isOpen, onClose, medicationContext }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'agent' | 'emergency'>('ai');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      text: 'Olá! 👋 Sou sua assistente virtual para orientações medicamentosas. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      actions: [
        { label: 'Consultar Medicamento', action: 'consult-medication' },
        { label: 'Verificar Preços', action: 'check-prices' },
        { label: 'Programas Governamentais', action: 'government-programs' },
        { label: 'Emergência Médica', action: 'emergency' }
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length, initializeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(async () => {
      const response = await generateAIResponse(messageText, messages);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = async (userMessage: string, chatHistory: ChatMessage[]): Promise<ChatMessage> => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Análise de intenção
    if (lowercaseMessage.includes('emergência') || lowercaseMessage.includes('emergencia') || lowercaseMessage.includes('urgente')) {
      return {
        id: generateId(),
        text: '🚨 Detectei uma situação de emergência. Estou te conectando com atendimento prioritário.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'emergency',
        actions: [
          { label: 'Chamar SAMU (192)', action: 'call-samu' },
          { label: 'Localizar Hospital', action: 'find-hospital' },
          { label: 'Falar com Médico', action: 'talk-to-doctor' }
        ]
      };
    }

    if (lowercaseMessage.includes('preço') || lowercaseMessage.includes('preco') || lowercaseMessage.includes('custo')) {
      return {
        id: generateId(),
        text: '💰 Vou ajudá-lo a encontrar os melhores preços! Qual medicamento você está procurando?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'medication',
        data: {
          searchType: 'price',
          medications: ['Losartana', 'Metformina', 'Sinvastatina', 'Omeprazol']
        },
        actions: [
          { label: 'Comparar Farmácias', action: 'compare-pharmacies' },
          { label: 'Ver Desconto SUS', action: 'sus-discount' }
        ]
      };
    }

    if (lowercaseMessage.includes('programa') || lowercaseMessage.includes('governo') || lowercaseMessage.includes('sus')) {
      return {
        id: generateId(),
        text: '🏛️ Ótimo! Temos várias opções de programas governamentais disponíveis:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        data: {
          programs: [
            {
              name: 'Farmácia Popular',
              description: 'Medicamentos com até 90% de desconto',
              requirements: 'Prescrição médica + CPF'
            },
            {
              name: 'CEAF - Alto Custo',
              description: 'Medicamentos especializados gratuitos',
              requirements: 'Protocolo clínico + laudos'
            },
            {
              name: 'SUS - Farmácia Básica',
              description: 'Medicamentos essenciais gratuitos',
              requirements: 'Cartão SUS + prescrição'
            }
          ]
        },
        actions: [
          { label: 'Verificar Elegibilidade', action: 'check-eligibility' },
          { label: 'Localizar Unidades', action: 'find-units' }
        ]
      };
    }

    if (lowercaseMessage.includes('dosagem') || lowercaseMessage.includes('como tomar')) {
      return {
        id: generateId(),
        text: '💊 Orientações sobre dosagem são muito importantes! Por favor, me informe:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'medication',
        actions: [
          { label: 'Nome do Medicamento', action: 'input-medication' },
          { label: 'Falar com Farmacêutico', action: 'talk-to-pharmacist' },
          { label: 'Ver Bula Completa', action: 'view-leaflet' }
        ]
      };
    }

    // Resposta padrão inteligente
    return {
      id: generateId(),
      text: 'Entendi sua solicitação! Vou analisar as melhores opções para você. Enquanto isso, posso sugerir:',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      actions: [
        { label: 'Análise Personalizada', action: 'personalized-analysis' },
        { label: 'Consulta Especializada', action: 'specialized-consultation' },
        { label: 'Documentos Necessários', action: 'required-documents' }
      ]
    };
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'consult-medication':
        handleSendMessage('Gostaria de consultar informações sobre um medicamento');
        break;
      case 'check-prices':
        handleSendMessage('Quero verificar preços de medicamentos');
        break;
      case 'government-programs':
        handleSendMessage('Quais programas governamentais estão disponíveis?');
        break;
      case 'emergency':
        setChatMode('emergency');
        handleSendMessage('Tenho uma emergência médica');
        break;
      case 'call-samu':
        window.open('tel:192');
        break;
      case 'find-hospital':
        // Integração com geolocalização
        findNearestHospital();
        break;
      case 'talk-to-doctor':
        setChatMode('agent');
        connectToMedicalAgent();
        break;
      case 'compare-pharmacies':
        openPharmacyComparison();
        break;
      case 'personalized-analysis':
        startPersonalizedAnalysis();
        break;
      default:
        handleSendMessage(`Ação selecionada: ${action}`);
    }
  };

  const findNearestHospital = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const hospitalMessage: ChatMessage = {
          id: generateId(),
          text: '🏥 Hospitais mais próximos da sua localização:',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
          data: {
            hospitals: [
              {
                name: 'Hospital das Clínicas',
                distance: '2.3 km',
                emergency: true,
                phone: '(11) 2661-0000'
              },
              {
                name: 'Hospital São Paulo',
                distance: '3.1 km',
                emergency: true,
                phone: '(11) 5576-4848'
              }
            ]
          }
        };
        setMessages(prev => [...prev, hospitalMessage]);
      });
    }
  };

  const connectToMedicalAgent = () => {
    setChatMode('agent');
    const agentMessage: ChatMessage = {
      id: generateId(),
      text: '👨‍⚕️ Conectando você com um profissional de saúde... Por favor, aguarde.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, agentMessage]);

    setTimeout(() => {
      const doctorMessage: ChatMessage = {
        id: generateId(),
        text: 'Olá! Sou Dr. Silva, farmacêutico responsável. Como posso ajudá-lo?',
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, doctorMessage]);
    }, 3000);
  };

  const openPharmacyComparison = () => {
    // Simular abertura de comparação de farmácias
    const comparisonMessage: ChatMessage = {
      id: generateId(),
      text: '🔍 Iniciando comparação de preços em farmácias próximas...',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      data: {
        comparison: [
          { pharmacy: 'Drogasil', price: 'R$ 15,90', discount: '10%' },
          { pharmacy: 'Droga Raia', price: 'R$ 14,50', discount: '15%' },
          { pharmacy: 'Farmácia Popular', price: 'R$ 4,50', discount: '90%' }
        ]
      }
    };
    setMessages(prev => [...prev, comparisonMessage]);
  };

  const startPersonalizedAnalysis = () => {
    const analysisMessage: ChatMessage = {
      id: generateId(),
      text: '🧠 Iniciando análise personalizada baseada no seu perfil e histórico...',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      actions: [
        { label: 'Ver Relatório Completo', action: 'view-report' },
        { label: 'Agendar Consulta', action: 'schedule-appointment' }
      ]
    };
    setMessages(prev => [...prev, analysisMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const renderMessage = (message: ChatMessage) => {
    const isBot = message.sender === 'bot';
    const isAgent = message.sender === 'agent';

    return (
      <div key={message.id} className={`flex mb-4 ${isBot || isAgent ? 'justify-start' : 'justify-end'}`}>
        <div className={`flex max-w-xs lg:max-w-md ${isBot || isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex-shrink-0 ${isBot || isAgent ? 'mr-2' : 'ml-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isBot ? 'bg-blue-500' : isAgent ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              {isBot ? <Bot className="w-4 h-4 text-white" /> : 
               isAgent ? <User className="w-4 h-4 text-white" /> :
               <User className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className={`rounded-lg p-3 ${
            isBot || isAgent ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
          }`}>
            <p className="text-sm">{message.text}</p>
            
            {/* Renderizar dados especiais */}
            {message.data && renderMessageData(message.data)}
            
            {/* Renderizar ações */}
            {message.actions && (
              <div className="mt-2 space-y-1">
                {message.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleActionClick(action.action)}
                    className="block w-full text-left px-2 py-1 text-xs bg-white/20 rounded hover:bg-white/30 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageData = (data: any) => {
    if (data.programs) {
      return (
        <div className="mt-2 space-y-2">
          {data.programs.map((program: any, index: number) => (
            <div key={index} className="bg-white/10 rounded p-2">
              <div className="font-semibold">{program.name}</div>
              <div className="text-xs">{program.description}</div>
              <div className="text-xs opacity-70">Requisitos: {program.requirements}</div>
            </div>
          ))}
        </div>
      );
    }

    if (data.comparison) {
      return (
        <div className="mt-2 space-y-1">
          {data.comparison.map((item: any, index: number) => (
            <div key={index} className="bg-white/10 rounded p-2 flex justify-between">
              <span className="font-semibold">{item.pharmacy}</span>
              <span>{item.price} ({item.discount})</span>
            </div>
          ))}
        </div>
      );
    }

    if (data.hospitals) {
      return (
        <div className="mt-2 space-y-2">
          {data.hospitals.map((hospital: any, index: number) => (
            <div key={index} className="bg-white/10 rounded p-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{hospital.name}</div>
                  <div className="text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {hospital.distance}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`tel:${hospital.phone}`)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  <Phone className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Assistente de Medicamentos</h3>
            <div className="flex items-center text-xs">
              <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              {chatMode === 'ai' ? 'IA Online' : chatMode === 'agent' ? 'Agente Conectado' : 'Emergência'}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-white/20 rounded">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/20 rounded">
            <Video className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-xs text-gray-500 ml-2">Digitando...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {chatMode === 'emergency' && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Modo emergência ativo - Respostas prioritárias
          </div>
        )}
      </div>
    </div>
  );
}
