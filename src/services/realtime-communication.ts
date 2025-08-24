// Sistema de comunicação em tempo real com WebRTC
export class RealTimeCommunicationService {
  private static instance: RealTimeCommunicationService;
  private webSocket: WebSocket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  static getInstance(): RealTimeCommunicationService {
    if (!this.instance) {
      this.instance = new RealTimeCommunicationService();
    }
    return this.instance;
  }

  // Inicializa conexão WebSocket
  async initializeWebSocket(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Em produção, usar WSS://
        this.webSocket = new WebSocket(`wss://api.medicamentos.gov.br/ws/${userId}`);
        
        this.webSocket.onopen = () => {
          console.log('🟢 Conexão WebSocket estabelecida');
          this.emit('connection-established', { status: 'connected' });
          resolve();
        };

        this.webSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem WebSocket:', error);
          }
        };

        this.webSocket.onerror = (error) => {
          console.error('❌ Erro WebSocket:', error);
          this.emit('connection-error', { error });
          reject(error);
        };

        this.webSocket.onclose = () => {
          console.log('🔴 Conexão WebSocket fechada');
          this.emit('connection-closed', {});
          // Reconectar automaticamente após 5 segundos
          setTimeout(() => this.initializeWebSocket(userId), 5000);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Configurar WebRTC para chat/vídeo com especialistas
  async initializeWebRTC(): Promise<void> {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Configurar data channel para chat
    this.dataChannel = this.peerConnection.createDataChannel('medicationChat', {
      ordered: true
    });

    this.setupDataChannelHandlers();
    this.setupPeerConnectionHandlers();
  }

  // Enviar mensagem via WebSocket
  sendMessage(type: string, data: any): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify({ type, data, timestamp: Date.now() }));
    } else {
      console.warn('⚠️ WebSocket não conectado, mensagem não enviada');
    }
  }

  // Chat em tempo real com especialistas
  sendChatMessage(message: string, recipientId?: string): void {
    const chatData = {
      message,
      timestamp: Date.now(),
      sender: 'user',
      recipientId
    };

    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(chatData));
    } else {
      this.sendMessage('chat-message', chatData);
    }
  }

  // Solicitar consulta por vídeo
  async requestVideoConsultation(specialtyType: string): Promise<string> {
    const consultationRequest = {
      type: 'video-consultation-request',
      specialty: specialtyType,
      timestamp: Date.now(),
      urgency: 'medium'
    };

    this.sendMessage('consultation-request', consultationRequest);
    
    return new Promise((resolve) => {
      this.once('consultation-accepted', (data: any) => {
        resolve(data.consultationId);
      });
    });
  }

  // Sistema de notificações push
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Enviar notificação local
  showNotification(title: string, options: NotificationOptions = {}): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/medication-icon.png',
        badge: '/icons/badge-icon.png',
        tag: 'medication-system',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-fechar após 5 segundos
      setTimeout(() => notification.close(), 5000);
    }
  }

  // Subscrição para Push Notifications
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('⚠️ Push notifications não suportadas');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIQ2Ruv96WMAACDMA621QjpviAq2Gpnw8Gf6fHYKzH-9l5s9mJWFE'
        ).buffer as ArrayBuffer
      });

      // Enviar subscription para o servidor
      this.sendMessage('push-subscription', {
        subscription: subscription.toJSON()
      });

      return subscription;
    } catch (error) {
      console.error('❌ Erro ao subscrever push notifications:', error);
      return null;
    }
  }

  // Sistema de geolocalização para farmácias próximas
  async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }

  // Buscar farmácias próximas em tempo real
  async findNearbyPharmacies(radius: number = 5000): Promise<PharmacyLocation[]> {
    try {
      const position = await this.getCurrentLocation();
      const { latitude, longitude } = position.coords;

      this.sendMessage('find-pharmacies', {
        location: { latitude, longitude },
        radius,
        timestamp: Date.now()
      });

      return new Promise((resolve) => {
        this.once('pharmacies-found', (data: any) => {
          resolve(data.pharmacies);
        });
      });
    } catch (error) {
      console.error('❌ Erro ao buscar farmácias:', error);
      return [];
    }
  }

  // Monitoramento de status em tempo real
  startStatusMonitoring(caseId: string): void {
    this.sendMessage('monitor-case', { caseId });
    
    // Ping a cada 30 segundos para manter conexão
    setInterval(() => {
      this.sendMessage('ping', { caseId, timestamp: Date.now() });
    }, 30000);
  }

  // Sistema de eventos
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  once(event: string, handler: Function): void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Handlers privados
  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'case-update':
        this.emit('case-updated', data.data);
        this.showNotification('📋 Atualização do Caso', {
          body: `Seu caso foi atualizado: ${data.data.status}`,
          tag: 'case-update'
        });
        break;

      case 'pharmacy-stock-alert':
        this.emit('stock-alert', data.data);
        this.showNotification('💊 Medicamento Disponível', {
          body: `${data.data.medication} está disponível em ${data.data.pharmacy}`,
          tag: 'stock-alert'
        });
        break;

      case 'specialist-available':
        this.emit('specialist-available', data.data);
        this.showNotification('👨‍⚕️ Especialista Disponível', {
          body: `Um especialista está disponível para consulta`,
          tag: 'specialist-available'
        });
        break;

      case 'government-response':
        this.emit('government-response', data.data);
        this.showNotification('🏛️ Resposta do Órgão', {
          body: `${data.data.agency} respondeu sua solicitação`,
          tag: 'government-response'
        });
        break;

      case 'price-alert':
        this.emit('price-alert', data.data);
        if (data.data.decreased) {
          this.showNotification('💰 Preço Reduzido', {
            body: `O preço de ${data.data.medication} reduziu para R$ ${data.data.newPrice}`,
            tag: 'price-alert'
          });
        }
        break;

      default:
        this.emit(data.type, data.data);
    }
  }

  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('🟢 Data channel aberto');
      this.emit('chat-connected', {});
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('chat-message-received', data);
      } catch (error) {
        console.error('❌ Erro ao processar mensagem do chat:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('❌ Erro no data channel:', error);
    };
  }

  private setupPeerConnectionHandlers(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage('ice-candidate', {
          candidate: event.candidate
        });
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (messageEvent) => {
        try {
          const data = JSON.parse(messageEvent.data);
          this.emit('chat-message-received', data);
        } catch (error) {
          console.error('❌ Erro ao processar mensagem:', error);
        }
      };
    };
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Cleanup
  disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.eventHandlers.clear();
  }
}

// Interfaces
export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone: string;
  isOpen: boolean;
  hasStock: boolean;
  price?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Service Worker para Push Notifications
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('🟢 Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Erro ao registrar Service Worker:', error);
    return null;
  }
};

// Hook para React
export const useRealTimeCommunication = () => {
  const service = RealTimeCommunicationService.getInstance();
  
  return {
    connect: (userId: string) => service.initializeWebSocket(userId),
    sendMessage: (type: string, data: any) => service.sendMessage(type, data),
    sendChatMessage: (message: string) => service.sendChatMessage(message),
    requestVideoConsultation: (specialty: string) => service.requestVideoConsultation(specialty),
    findNearbyPharmacies: (radius?: number) => service.findNearbyPharmacies(radius),
    startMonitoring: (caseId: string) => service.startStatusMonitoring(caseId),
    showNotification: (title: string, options?: NotificationOptions) => service.showNotification(title, options),
    on: (event: string, handler: Function) => service.on(event, handler),
    off: (event: string, handler: Function) => service.off(event, handler),
    disconnect: () => service.disconnect()
  };
};
