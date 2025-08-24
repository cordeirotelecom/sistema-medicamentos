// Sistema avançado de notificações em tempo real
export class AdvancedNotificationService {
  private static instance: AdvancedNotificationService;
  private notificationQueue: NotificationItem[] = [];
  private workers: Worker[] = [];
  private serviceWorker: ServiceWorker | null = null;

  static getInstance(): AdvancedNotificationService {
    if (!this.instance) {
      this.instance = new AdvancedNotificationService();
    }
    return this.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Service Worker desabilitado temporariamente para evitar erros
      // if ('serviceWorker' in navigator) {
      //   const registration = await navigator.serviceWorker.register('/sw-notifications.js');
      //   this.serviceWorker = registration.active;
      //   console.log('Service Worker registrado para notificações');
      // }

      // Solicitar permissão para notificações
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Permissão para notificações concedida');
        }
      }

      // Inicializar Web Workers para processamento em background
      this.initializeWorkers();

      // Configurar interceptação de push notifications
      this.setupPushNotifications();

    } catch (error) {
      console.error('Erro ao inicializar sistema de notificações:', error);
    }
  }

  // Notificação de medicamento crítico
  async notifyMedicationCritical(data: CriticalMedicationData): Promise<void> {
    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'medication-critical',
      priority: 'high',
      title: '🚨 Alerta Crítico - Medicamento',
      message: `${data.medicationName}: ${data.criticalReason}`,
      data: data,
      actions: [
        { action: 'view-details', title: 'Ver Detalhes' },
        { action: 'find-alternative', title: 'Buscar Alternativa' },
        { action: 'contact-doctor', title: 'Contatar Médico' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      channels: ['push', 'email', 'sms']
    };

    await this.sendNotification(notification);
  }

  // Notificação de estoque baixo
  async notifyLowStock(data: StockData): Promise<void> {
    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'stock-low',
      priority: 'medium',
      title: '📦 Estoque Baixo',
      message: `${data.medicationName} com estoque baixo em sua região`,
      data: data,
      actions: [
        { action: 'find-pharmacy', title: 'Encontrar Farmácia' },
        { action: 'reserve-medication', title: 'Reservar' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 dias
      channels: ['push', 'in-app']
    };

    await this.sendNotification(notification);
  }

  // Notificação de alteração de preço
  async notifyPriceChange(data: PriceChangeData): Promise<void> {
    const changeType = data.newPrice > data.oldPrice ? 'aumento' : 'redução';
    const icon = data.newPrice > data.oldPrice ? '📈' : '📉';

    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'price-change',
      priority: 'low',
      title: `${icon} Alteração de Preço`,
      message: `${data.medicationName}: ${changeType} de ${data.percentage}%`,
      data: data,
      actions: [
        { action: 'view-prices', title: 'Ver Preços' },
        { action: 'compare-pharmacies', title: 'Comparar Farmácias' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 dias
      channels: ['push']
    };

    await this.sendNotification(notification);
  }

  // Notificação de novo programa governamental
  async notifyGovernmentProgram(data: GovernmentProgramData): Promise<void> {
    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'government-program',
      priority: 'medium',
      title: '🏛️ Novo Programa Governamental',
      message: `${data.programName} agora disponível para ${data.medicationName}`,
      data: data,
      actions: [
        { action: 'learn-more', title: 'Saiba Mais' },
        { action: 'check-eligibility', title: 'Verificar Elegibilidade' },
        { action: 'apply-now', title: 'Inscrever-se' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 24 * 60 * 60 * 1000), // 60 dias
      channels: ['push', 'email', 'in-app']
    };

    await this.sendNotification(notification);
  }

  // Notificação de recall/recolhimento
  async notifyRecall(data: RecallData): Promise<void> {
    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'recall',
      priority: 'emergency',
      title: '⚠️ RECALL - Recolhimento de Medicamento',
      message: `${data.medicationName} (Lote: ${data.batchNumber}) foi recolhido pela ANVISA`,
      data: data,
      actions: [
        { action: 'check-batch', title: 'Verificar Lote' },
        { action: 'return-medication', title: 'Devolver Medicamento' },
        { action: 'contact-anvisa', title: 'Contatar ANVISA' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 dias
      channels: ['push', 'email', 'sms', 'in-app'],
      persistent: true
    };

    await this.sendNotification(notification);
  }

  // Notificação de lembrete de medicamento
  async notifyMedicationReminder(data: MedicationReminderData): Promise<void> {
    const notification: NotificationItem = {
      id: this.generateId(),
      type: 'medication-reminder',
      priority: 'medium',
      title: '💊 Lembrete de Medicamento',
      message: `Hora de tomar ${data.medicationName} - ${data.dosage}`,
      data: data,
      actions: [
        { action: 'mark-taken', title: 'Marcar como Tomado' },
        { action: 'snooze', title: 'Lembrar em 10min' },
        { action: 'skip-dose', title: 'Pular Dose' }
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 horas
      channels: ['push', 'in-app'],
      recurring: {
        enabled: true,
        interval: data.frequency * 60 * 60 * 1000, // frequência em horas
        times: data.duration
      }
    };

    await this.sendNotification(notification);
  }

  // Sistema de análise de notificações
  async analyzeNotificationEffectiveness(): Promise<NotificationAnalytics> {
    const analytics: NotificationAnalytics = {
      totalSent: this.notificationQueue.length,
      deliveryRate: 0,
      openRate: 0,
      actionRate: 0,
      typeBreakdown: {},
      engagementMetrics: {
        averageTimeToOpen: 0,
        mostEngagingType: '',
        leastEngagingType: '',
        peakHours: []
      },
      userPreferences: {
        preferredChannels: [],
        optOutRate: 0,
        customizationLevel: 0
      }
    };

    // Simular análise de dados
    await this.processAnalytics(analytics);
    return analytics;
  }

  // Envio inteligente de notificações
  private async sendNotification(notification: NotificationItem): Promise<void> {
    try {
      // Adicionar à fila
      this.notificationQueue.push(notification);

      // Processar baseado na prioridade
      await this.processNotificationByPriority(notification);

      // Registrar evento para analytics
      this.trackNotificationEvent(notification, 'sent');

    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      this.trackNotificationEvent(notification, 'failed');
    }
  }

  private async processNotificationByPriority(notification: NotificationItem): Promise<void> {
    switch (notification.priority) {
      case 'emergency':
        await this.sendImmediateNotification(notification);
        break;
      case 'high':
        await this.sendHighPriorityNotification(notification);
        break;
      case 'medium':
        await this.scheduleNotification(notification, 0);
        break;
      case 'low':
        await this.scheduleNotification(notification, 30 * 60 * 1000); // 30min delay
        break;
    }
  }

  private async sendImmediateNotification(notification: NotificationItem): Promise<void> {
    // Push notification imediata
    if (notification.channels.includes('push') && 'Notification' in window) {
      const pushNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        tag: notification.id,
        requireInteraction: true
      });

      pushNotification.onclick = () => this.handleNotificationClick(notification);
    }

    // SMS para emergências
    if (notification.channels.includes('sms')) {
      await this.sendSMS(notification);
    }

    // Email para emergências
    if (notification.channels.includes('email')) {
      await this.sendEmail(notification);
    }
  }

  private async sendHighPriorityNotification(notification: NotificationItem): Promise<void> {
    // Push notification com vibração
    if (notification.channels.includes('push')) {
      // ServiceWorker desabilitado temporariamente
      // if ('serviceWorker' in navigator && this.serviceWorker) {
      //   await this.serviceWorker.postMessage({
      //     type: 'SHOW_NOTIFICATION',
      //     notification: {
      //       ...notification,
      //       options: {
      //         vibrate: [200, 100, 200],
      //         requireInteraction: true
      //       }
      //     }
      //   });
      // }
    }

    // In-app notification
    if (notification.channels.includes('in-app')) {
      this.showInAppNotification(notification);
    }
  }

  private async scheduleNotification(notification: NotificationItem, delay: number): Promise<void> {
    setTimeout(async () => {
      await this.sendHighPriorityNotification(notification);
    }, delay);
  }

  private async sendSMS(notification: NotificationItem): Promise<void> {
    // Integração com serviço de SMS (simulado)
    console.log('SMS enviado:', notification.message);
  }

  private async sendEmail(notification: NotificationItem): Promise<void> {
    // Integração com serviço de email (simulado)
    console.log('Email enviado:', notification.title);
  }

  private showInAppNotification(notification: NotificationItem): void {
    // Criar elemento de notificação in-app
    const notificationElement = document.createElement('div');
    notificationElement.className = 'in-app-notification';
    notificationElement.innerHTML = `
      <div class="notification-content">
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
        <div class="notification-actions">
          ${notification.actions?.map(action => 
            `<button data-action="${action.action}">${action.title}</button>`
          ).join('') || ''}
        </div>
      </div>
    `;

    document.body.appendChild(notificationElement);

    // Auto-remove após tempo especificado
    setTimeout(() => {
      notificationElement.remove();
    }, 10000);
  }

  private handleNotificationClick(notification: NotificationItem): void {
    this.trackNotificationEvent(notification, 'clicked');
    // Lógica de navegação baseada no tipo de notificação
    switch (notification.type) {
      case 'medication-critical':
        window.location.href = `/medication/${notification.data.medicationId}`;
        break;
      case 'recall':
        window.location.href = `/recall/${notification.data.recallId}`;
        break;
      default:
        window.location.href = '/notifications';
    }
  }

  private trackNotificationEvent(notification: NotificationItem, event: string): void {
    // Analytics tracking (simulado)
    console.log(`Notification Event: ${event}`, {
      notificationId: notification.id,
      type: notification.type,
      timestamp: Date.now()
    });
  }

  private initializeWorkers(): void {
    // Inicializar workers para processamento em background
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('/workers/notification-processor.js');
      this.workers.push(worker);
    }
  }

  private setupPushNotifications(): void {
    // Push notifications com service worker desabilitado temporariamente
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.addEventListener('message', (event) => {
    //     if (event.data.type === 'NOTIFICATION_ACTION') {
    //       this.handleNotificationAction(event.data.action, event.data.notificationId);
    //     }
    //   });
    // }
  }

  private handleNotificationAction(action: string, notificationId: string): void {
    const notification = this.notificationQueue.find(n => n.id === notificationId);
    if (!notification) return;

    this.trackNotificationEvent(notification, `action:${action}`);

    switch (action) {
      case 'mark-taken':
        this.markMedicationTaken(notification.data);
        break;
      case 'find-pharmacy':
        this.openPharmacyFinder(notification.data);
        break;
      case 'contact-doctor':
        this.initiateDockerContact(notification.data);
        break;
      // Adicionar mais ações conforme necessário
    }
  }

  private markMedicationTaken(data: any): void {
    // Lógica para marcar medicamento como tomado
    console.log('Medicamento marcado como tomado:', data);
  }

  private openPharmacyFinder(data: any): void {
    // Abrir localizador de farmácias
    window.location.href = `/pharmacy-finder?medication=${data.medicationName}`;
  }

  private initiateDockerContact(data: any): void {
    // Iniciar contato com médico
    window.location.href = `/contact-doctor?medication=${data.medicationName}`;
  }

  private async processAnalytics(analytics: NotificationAnalytics): Promise<void> {
    // Processar analytics de notificações (simulado)
    analytics.deliveryRate = 95.5;
    analytics.openRate = 67.8;
    analytics.actionRate = 34.2;
    analytics.typeBreakdown = {
      'medication-reminder': 45,
      'price-change': 25,
      'stock-low': 15,
      'government-program': 10,
      'recall': 3,
      'medication-critical': 2
    };
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Interfaces
export interface NotificationItem {
  id: string;
  type: 'medication-critical' | 'stock-low' | 'price-change' | 'government-program' | 'recall' | 'medication-reminder';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  title: string;
  message: string;
  data: any;
  actions?: Array<{
    action: string;
    title: string;
  }>;
  timestamp: number;
  expiresAt: number;
  channels: Array<'push' | 'email' | 'sms' | 'in-app'>;
  persistent?: boolean;
  recurring?: {
    enabled: boolean;
    interval: number;
    times: number;
  };
}

export interface CriticalMedicationData {
  medicationId: string;
  medicationName: string;
  criticalReason: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  recommendedAction: string;
}

export interface StockData {
  medicationId: string;
  medicationName: string;
  currentStock: number;
  minimumStock: number;
  estimatedRunoutDate: string;
  alternativePharmacies: string[];
}

export interface PriceChangeData {
  medicationId: string;
  medicationName: string;
  oldPrice: number;
  newPrice: number;
  percentage: number;
  pharmacy: string;
  effectiveDate: string;
}

export interface GovernmentProgramData {
  programId: string;
  programName: string;
  medicationName: string;
  benefits: string[];
  eligibilityCriteria: string[];
  applicationProcess: string;
  deadline?: string;
}

export interface RecallData {
  recallId: string;
  medicationName: string;
  manufacturer: string;
  batchNumber: string;
  reason: string;
  severity: string;
  actionRequired: string;
  contactInfo: string;
}

export interface MedicationReminderData {
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: number; // hours
  duration: number; // days
  nextDose: string;
}

export interface NotificationAnalytics {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  actionRate: number;
  typeBreakdown: Record<string, number>;
  engagementMetrics: {
    averageTimeToOpen: number;
    mostEngagingType: string;
    leastEngagingType: string;
    peakHours: number[];
  };
  userPreferences: {
    preferredChannels: string[];
    optOutRate: number;
    customizationLevel: number;
  };
}
