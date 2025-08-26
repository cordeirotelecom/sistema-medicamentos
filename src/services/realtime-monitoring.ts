// Sistema de Monitoramento em Tempo Real Avançado
export class RealTimeMonitoringService {
  private static instance: RealTimeMonitoringService;
  private websocket: WebSocket | null = null;
  private eventStream: EventSource | null = null;
  private monitoringData: Map<string, any> = new Map();
  private alerts: MonitoringAlert[] = [];
  private subscribers: Map<string, Function[]> = new Map();

  static getInstance(): RealTimeMonitoringService {
    if (!this.instance) {
      this.instance = new RealTimeMonitoringService();
    }
    return this.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.setupWebSocketConnection();
      await this.setupServerSentEvents();
      await this.startHealthChecks();
      await this.initializeAlertSystem();
      // console.log('Sistema de monitoramento inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar monitoramento:', error);
    }
  }

  // WebSocket para comunicação bidirecional
  private async setupWebSocketConnection(): Promise<void> {
    try {
      // Em produção, usar WSS com autenticação
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://api.medicamentos.gov.br/ws' 
        : 'ws://localhost:8080/monitoring';

      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        // console.log('WebSocket conectado para monitoramento');
        this.sendHeartbeat();
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };

      this.websocket.onclose = () => {
        // console.log('WebSocket desconectado, tentando reconectar...');
        setTimeout(() => this.setupWebSocketConnection(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('Erro WebSocket:', error);
      };

    } catch (error) {
      console.error('Erro ao configurar WebSocket:', error);
      // Fallback para polling
      this.startPollingFallback();
    }
  }

  // Server-Sent Events para atualizações do servidor
  private async setupServerSentEvents(): Promise<void> {
    try {
      const sseUrl = process.env.NODE_ENV === 'production'
        ? 'https://api.medicamentos.gov.br/events'
        : 'http://localhost:3001/events';

      this.eventStream = new EventSource(sseUrl);

      this.eventStream.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleServerEvent(data);
      };

      this.eventStream.onerror = (error) => {
        console.error('Erro SSE:', error);
        this.eventStream?.close();
        setTimeout(() => this.setupServerSentEvents(), 10000);
      };

    } catch (error) {
      console.error('Erro ao configurar SSE:', error);
    }
  }

  // Monitoramento de APIs externas
  async monitorExternalAPIs(): Promise<APIHealthStatus[]> {
    const apis = [
      { name: 'FDA', url: 'https://api.fda.gov/drug/label.json', timeout: 5000 },
      { name: 'ANVISA', url: 'https://consultas.anvisa.gov.br', timeout: 10000 },
      { name: 'ViaCEP', url: 'https://viacep.com.br/ws/01310-000/json/', timeout: 3000 },
      { name: 'ReceitaWS', url: 'https://www.receitaws.com.br/v1/cnpj/11222333000181', timeout: 5000 }
    ];

    const results = await Promise.allSettled(
      apis.map(api => this.checkAPIHealth(api))
    );

    return results.map((result, index) => {
      const api = apis[index];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          name: api.name,
          status: 'down',
          responseTime: -1,
          lastChecked: new Date().toISOString(),
          error: result.reason?.message || 'Erro desconhecido'
        };
      }
    });
  }

  private async checkAPIHealth(api: { name: string; url: string; timeout: number }): Promise<APIHealthStatus> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), api.timeout);

      const response = await fetch(api.url, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      return {
        name: api.name,
        status: response.ok ? 'up' : 'degraded',
        responseTime,
        lastChecked: new Date().toISOString(),
        statusCode: response.status
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        name: api.name,
        status: 'down',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Monitoramento de performance do sistema
  async getSystemMetrics(): Promise<SystemMetrics> {
    const metrics = {
      cpu: await this.getCPUUsage(),
      memory: await this.getMemoryUsage(),
      network: await this.getNetworkStats(),
      database: await this.getDatabaseStats(),
      responseTime: await this.getAverageResponseTime(),
      errorRate: await this.getErrorRate(),
      activeUsers: await this.getActiveUsers(),
      requestsPerMinute: await this.getRequestsPerMinute(),
      timestamp: new Date().toISOString()
    };

    // Verificar se há alertas baseado nas métricas
    this.checkMetricAlerts(metrics);

    return metrics;
  }

  // Monitoramento de medicamentos críticos
  async monitorCriticalMedications(): Promise<CriticalMedicationStatus[]> {
    const criticalMeds = [
      'Insulina', 'Adrenalina', 'Morfina', 'Dipirona', 
      'Paracetamol', 'Amoxicilina', 'Losartana', 'Sinvastatina'
    ];

    const statuses = await Promise.all(
      criticalMeds.map(med => this.checkMedicationStatus(med))
    );

    // Detectar medicamentos em situação crítica
    const criticalIssues = statuses.filter(status => 
      status.stockLevel === 'critical' || status.priceVariation > 50
    );

    if (criticalIssues.length > 0) {
      this.triggerCriticalAlert(criticalIssues);
    }

    return statuses;
  }

  private async checkMedicationStatus(medication: string): Promise<CriticalMedicationStatus> {
    try {
      // Simular verificação de status em múltiplas fontes
      const [stockData, priceData, availabilityData] = await Promise.all([
        this.getStockLevel(medication),
        this.getPriceVariation(medication),
        this.getAvailabilityStatus(medication)
      ]);

      return {
        medication,
        stockLevel: stockData.level,
        currentStock: stockData.quantity,
        minimumThreshold: stockData.threshold,
        priceVariation: priceData.variation,
        currentPrice: priceData.current,
        averagePrice: priceData.average,
        availability: availabilityData.status,
        affectedRegions: availabilityData.regions,
        lastUpdated: new Date().toISOString(),
        trend: this.calculateTrend(stockData, priceData)
      };

    } catch (error) {
      console.error(`Erro ao verificar status do medicamento ${medication}:`, error);
      return this.getDefaultMedicationStatus(medication);
    }
  }

  // Sistema de alertas inteligentes
  private async initializeAlertSystem(): Promise<void> {
    const alertRules = [
      {
        name: 'api_down',
        condition: (data: any) => data.status === 'down',
        severity: 'high',
        cooldown: 300000 // 5 minutos
      },
      {
        name: 'high_response_time',
        condition: (data: any) => data.responseTime > 5000,
        severity: 'medium',
        cooldown: 600000 // 10 minutos
      },
      {
        name: 'medication_shortage',
        condition: (data: any) => data.stockLevel === 'critical',
        severity: 'critical',
        cooldown: 0 // Sem cooldown para alertas críticos
      },
      {
        name: 'price_spike',
        condition: (data: any) => data.priceVariation > 30,
        severity: 'medium',
        cooldown: 3600000 // 1 hora
      }
    ];

    this.monitoringData.set('alertRules', alertRules);
  }

  private checkMetricAlerts(metrics: SystemMetrics): void {
    // CPU alto
    if (metrics.cpu > 80) {
      this.createAlert({
        type: 'system',
        severity: 'high',
        title: 'CPU Usage High',
        message: `CPU usage at ${metrics.cpu}%`,
        timestamp: new Date().toISOString(),
        data: { cpu: metrics.cpu }
      });
    }

    // Memória alta
    if (metrics.memory > 85) {
      this.createAlert({
        type: 'system',
        severity: 'high',
        title: 'Memory Usage High',
        message: `Memory usage at ${metrics.memory}%`,
        timestamp: new Date().toISOString(),
        data: { memory: metrics.memory }
      });
    }

    // Taxa de erro alta
    if (metrics.errorRate > 5) {
      this.createAlert({
        type: 'application',
        severity: 'medium',
        title: 'High Error Rate',
        message: `Error rate at ${metrics.errorRate}%`,
        timestamp: new Date().toISOString(),
        data: { errorRate: metrics.errorRate }
      });
    }
  }

  private createAlert(alert: MonitoringAlert): void {
    // Verificar cooldown
    const existingAlert = this.alerts.find(a => 
      a.type === alert.type && a.title === alert.title
    );

    if (existingAlert) {
      const timeSinceLastAlert = Date.now() - new Date(existingAlert.timestamp).getTime();
      const cooldown = this.getAlertCooldown(alert.type);
      
      if (timeSinceLastAlert < cooldown) {
        return; // Ainda em cooldown
      }
    }

    // Adicionar alert
    this.alerts.unshift(alert);
    
    // Manter apenas os últimos 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    // Notificar subscribers
    this.notifySubscribers('alert_created', alert);

    // Enviar para sistemas externos se crítico
    if (alert.severity === 'critical') {
      this.sendCriticalAlert(alert);
    }
  }

  private getAlertCooldown(type: string): number {
    const cooldowns: { [key: string]: number } = {
      'system': 300000, // 5 minutos
      'application': 600000, // 10 minutos
      'medication': 0 // Sem cooldown
    };
    return cooldowns[type] || 300000;
  }

  // Análise de tendências
  async analyzeTrends(timeframe: string = '24h'): Promise<TrendAnalysis> {
    const metrics = await this.getHistoricalMetrics(timeframe);
    
    return {
      systemPerformance: this.analyzeSystemTrends(metrics.system),
      apiHealth: this.analyzeAPITrends(metrics.apis),
      medicationAlerts: this.analyzeMedicationTrends(metrics.medications),
      userActivity: this.analyzeUserTrends(metrics.users),
      predictions: await this.generatePredictions(metrics),
      timeframe,
      generatedAt: new Date().toISOString()
    };
  }

  // Relatórios automatizados
  async generateMonitoringReport(period: 'daily' | 'weekly' | 'monthly'): Promise<MonitoringReport> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
    }

    const [metrics, apiStatus, alerts, incidents] = await Promise.all([
      this.getMetricsForPeriod(startDate, endDate),
      this.getAPIStatusForPeriod(startDate, endDate),
      this.getAlertsForPeriod(startDate, endDate),
      this.getIncidentsForPeriod(startDate, endDate)
    ]);

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        totalRequests: metrics.totalRequests,
        averageResponseTime: metrics.averageResponseTime,
        uptime: metrics.uptime,
        errorRate: metrics.errorRate,
        totalAlerts: alerts.length,
        criticalIncidents: incidents.filter(i => i.severity === 'critical').length
      },
      apiHealth: apiStatus,
      topAlerts: alerts.slice(0, 10),
      systemTrends: this.calculateSystemTrends(metrics),
      recommendations: this.generateRecommendations(metrics, alerts, incidents),
      generatedAt: new Date().toISOString()
    };
  }

  // Métodos de subscription para real-time updates
  subscribe(event: string, callback: Function): string {
    const id = this.generateSubscriptionId();
    
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    
    this.subscribers.get(event)?.push(callback);
    return id;
  }

  unsubscribe(event: string, subscriptionId: string): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      // Remover callback baseado no ID (implementação simplificada)
      // Em produção, manter um mapa de ID -> callback
    }
  }

  private notifySubscribers(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erro ao notificar subscriber:', error);
        }
      });
    }
  }

  // Métodos auxiliares simulados
  private async getCPUUsage(): Promise<number> {
    return Math.random() * 100;
  }

  private async getMemoryUsage(): Promise<number> {
    return Math.random() * 100;
  }

  private async getNetworkStats(): Promise<any> {
    return {
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 1000000),
      packetsIn: Math.floor(Math.random() * 10000),
      packetsOut: Math.floor(Math.random() * 10000)
    };
  }

  private async getDatabaseStats(): Promise<any> {
    return {
      connections: Math.floor(Math.random() * 100),
      queryTime: Math.random() * 1000,
      deadlocks: Math.floor(Math.random() * 5)
    };
  }

  private async getAverageResponseTime(): Promise<number> {
    return Math.random() * 2000;
  }

  private async getErrorRate(): Promise<number> {
    return Math.random() * 10;
  }

  private async getActiveUsers(): Promise<number> {
    return Math.floor(Math.random() * 1000) + 100;
  }

  private async getRequestsPerMinute(): Promise<number> {
    return Math.floor(Math.random() * 100) + 20;
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'metric_update':
        this.handleMetricUpdate(message.data);
        break;
      case 'alert':
        this.handleIncomingAlert(message.data);
        break;
      case 'system_status':
        this.handleSystemStatusUpdate(message.data);
        break;
    }
  }

  private handleServerEvent(data: any): void {
    this.notifySubscribers('server_event', data);
  }

  private sendHeartbeat(): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
    }
    setTimeout(() => this.sendHeartbeat(), 30000); // A cada 30 segundos
  }

  private startPollingFallback(): void {
    setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        this.notifySubscribers('metrics_update', metrics);
      } catch (error) {
        console.error('Erro no polling fallback:', error);
      }
    }, 60000); // A cada minuto
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Outros métodos auxiliares simulados...
  private async getStockLevel(medication: string): Promise<any> {
    return {
      level: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'low' : 'normal',
      quantity: Math.floor(Math.random() * 1000),
      threshold: 100
    };
  }

  private async getPriceVariation(medication: string): Promise<any> {
    return {
      variation: (Math.random() - 0.5) * 100,
      current: Math.random() * 100,
      average: Math.random() * 80
    };
  }

  private async getAvailabilityStatus(medication: string): Promise<any> {
    return {
      status: Math.random() > 0.9 ? 'unavailable' : 'available',
      regions: Math.random() > 0.8 ? ['SP', 'RJ'] : []
    };
  }

  private calculateTrend(stockData: any, priceData: any): 'improving' | 'stable' | 'declining' {
    if (stockData.level === 'critical' || priceData.variation > 30) return 'declining';
    if (stockData.level === 'normal' && Math.abs(priceData.variation) < 5) return 'stable';
    return 'improving';
  }

  private getDefaultMedicationStatus(medication: string): CriticalMedicationStatus {
    return {
      medication,
      stockLevel: 'unknown',
      currentStock: 0,
      minimumThreshold: 0,
      priceVariation: 0,
      currentPrice: 0,
      averagePrice: 0,
      availability: 'unknown',
      affectedRegions: [],
      lastUpdated: new Date().toISOString(),
      trend: 'stable'
    };
  }

  private async startHealthChecks(): Promise<void> {
    // Verificar APIs a cada 5 minutos
    setInterval(async () => {
      const apiStatus = await this.monitorExternalAPIs();
      this.notifySubscribers('api_status_update', apiStatus);
    }, 300000);

    // Verificar medicamentos críticos a cada 10 minutos
    setInterval(async () => {
      const medicationStatus = await this.monitorCriticalMedications();
      this.notifySubscribers('medication_status_update', medicationStatus);
    }, 600000);
  }

  private triggerCriticalAlert(issues: CriticalMedicationStatus[]): void {
    issues.forEach(issue => {
      this.createAlert({
        type: 'medication',
        severity: 'critical',
        title: `Medicamento Crítico: ${issue.medication}`,
        message: `${issue.medication} em situação crítica - ${issue.stockLevel}`,
        timestamp: new Date().toISOString(),
        data: issue
      });
    });
  }

  private async sendCriticalAlert(alert: MonitoringAlert): Promise<void> {
    // Integrar com sistemas de notificação externa
    // console.log('Alerta crítico enviado:', alert);
  }

  private handleMetricUpdate(data: any): void {
    this.notifySubscribers('metric_update', data);
  }

  private handleIncomingAlert(data: any): void {
    this.createAlert(data);
  }

  private handleSystemStatusUpdate(data: any): void {
    this.notifySubscribers('system_status', data);
  }

  // Métodos de análise e relatórios (implementação simplificada)
  private async getHistoricalMetrics(timeframe: string): Promise<any> {
    return { system: [], apis: [], medications: [], users: [] };
  }

  private analyzeSystemTrends(metrics: any[]): any {
    return { trend: 'stable', performance: 'good' };
  }

  private analyzeAPITrends(metrics: any[]): any {
    return { availability: 98.5, averageResponseTime: 850 };
  }

  private analyzeMedicationTrends(metrics: any[]): any {
    return { criticalAlerts: 3, resolvedIssues: 15 };
  }

  private analyzeUserTrends(metrics: any[]): any {
    return { activeUsers: 1250, peakHour: '14:00' };
  }

  private async generatePredictions(metrics: any): Promise<any> {
    return {
      systemLoad: 'increasing',
      medicationDemand: 'stable',
      apiUsage: 'growing'
    };
  }

  private async getMetricsForPeriod(start: Date, end: Date): Promise<any> {
    return {
      totalRequests: 10000,
      averageResponseTime: 850,
      uptime: 99.9,
      errorRate: 0.5
    };
  }

  private async getAPIStatusForPeriod(start: Date, end: Date): Promise<any> {
    return { fda: 99.5, anvisa: 98.2, viacep: 99.8 };
  }

  private async getAlertsForPeriod(start: Date, end: Date): Promise<MonitoringAlert[]> {
    return [];
  }

  private async getIncidentsForPeriod(start: Date, end: Date): Promise<any[]> {
    return [];
  }

  private calculateSystemTrends(metrics: any): any {
    return { performance: 'improving', reliability: 'stable' };
  }

  private generateRecommendations(metrics: any, alerts: any[], incidents: any[]): string[] {
    return [
      'Considere aumentar a capacidade do servidor',
      'Monitorar APIs externas mais frequentemente',
      'Implementar cache adicional para consultas'
    ];
  }
}

// Interfaces
export interface APIHealthStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastChecked: string;
  statusCode?: number;
  error?: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  network: any;
  database: any;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  requestsPerMinute: number;
  timestamp: string;
}

export interface CriticalMedicationStatus {
  medication: string;
  stockLevel: 'critical' | 'low' | 'normal' | 'unknown';
  currentStock: number;
  minimumThreshold: number;
  priceVariation: number;
  currentPrice: number;
  averagePrice: number;
  availability: 'available' | 'unavailable' | 'unknown';
  affectedRegions: string[];
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface MonitoringAlert {
  type: 'system' | 'application' | 'medication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

export interface TrendAnalysis {
  systemPerformance: any;
  apiHealth: any;
  medicationAlerts: any;
  userActivity: any;
  predictions: any;
  timeframe: string;
  generatedAt: string;
}

export interface MonitoringReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  summary: {
    totalRequests: number;
    averageResponseTime: number;
    uptime: number;
    errorRate: number;
    totalAlerts: number;
    criticalIncidents: number;
  };
  apiHealth: any;
  topAlerts: MonitoringAlert[];
  systemTrends: any;
  recommendations: string[];
  generatedAt: string;
}
