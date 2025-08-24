// Sistema de Automação e Workflows Avançados
export class AutomationWorkflowService {
  private static instance: AutomationWorkflowService;
  private workflows: Map<string, Workflow> = new Map();
  private activeJobs: Map<string, JobExecution> = new Map();
  private scheduler: WorkflowScheduler;
  private eventBus: EventBus;

  static getInstance(): AutomationWorkflowService {
    if (!this.instance) {
      this.instance = new AutomationWorkflowService();
    }
    return this.instance;
  }

  constructor() {
    this.scheduler = new WorkflowScheduler();
    this.eventBus = new EventBus();
    this.initializeDefaultWorkflows();
  }

  // Workflow automático de monitoramento de estoque
  async createStockMonitoringWorkflow(): Promise<string> {
    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: 'Stock Monitoring Automation',
      description: 'Monitora automaticamente o estoque de medicamentos críticos',
      triggers: [
        {
          type: 'schedule',
          config: { cron: '0 */6 * * *' } // A cada 6 horas
        },
        {
          type: 'event',
          config: { event: 'stock.level.changed' }
        }
      ],
      steps: [
        {
          id: 'fetch_stock_data',
          type: 'api_call',
          config: {
            url: '/api/medications/stock',
            method: 'GET',
            timeout: 30000
          }
        },
        {
          id: 'analyze_stock_levels',
          type: 'script',
          config: {
            script: `
              const criticalMeds = data.medications.filter(med => 
                med.stockLevel < med.minimumThreshold * 1.5
              );
              return { criticalMedications: criticalMeds };
            `
          }
        },
        {
          id: 'send_alerts',
          type: 'conditional',
          config: {
            condition: 'criticalMedications.length > 0',
            trueBranch: [
              {
                id: 'create_alerts',
                type: 'notification',
                config: {
                  type: 'email',
                  template: 'stock_alert',
                  recipients: ['admin@medicamentos.gov.br']
                }
              },
              {
                id: 'update_dashboard',
                type: 'api_call',
                config: {
                  url: '/api/dashboard/alerts',
                  method: 'POST',
                  body: '{{ criticalMedications }}'
                }
              }
            ]
          }
        },
        {
          id: 'log_execution',
          type: 'log',
          config: {
            level: 'info',
            message: 'Stock monitoring completed: {{ criticalMedications.length }} critical items found'
          }
        }
      ],
      errorHandling: {
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          baseDelay: 1000
        },
        onError: [
          {
            id: 'error_notification',
            type: 'notification',
            config: {
              type: 'slack',
              message: 'Stock monitoring workflow failed: {{ error.message }}'
            }
          }
        ]
      },
      metadata: {
        category: 'monitoring',
        priority: 'high',
        author: 'system',
        version: '1.0'
      }
    };

    this.workflows.set(workflow.id, workflow);
    await this.scheduler.scheduleWorkflow(workflow);
    
    return workflow.id;
  }

  // Workflow de sincronização de preços
  async createPriceSyncWorkflow(): Promise<string> {
    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: 'Price Synchronization',
      description: 'Sincroniza preços de medicamentos com fontes externas',
      triggers: [
        {
          type: 'schedule',
          config: { cron: '0 8,14,20 * * *' } // 3x por dia
        }
      ],
      steps: [
        {
          id: 'fetch_external_prices',
          type: 'parallel',
          config: {
            branches: [
              {
                id: 'fetch_drogasil',
                type: 'api_call',
                config: {
                  url: 'https://api.drogasil.com.br/prices',
                  headers: { 'Authorization': 'Bearer {{ secrets.drogasil_token }}' }
                }
              },
              {
                id: 'fetch_pacheco',
                type: 'api_call',
                config: {
                  url: 'https://api.pacheco.com.br/prices',
                  headers: { 'Authorization': 'Bearer {{ secrets.pacheco_token }}' }
                }
              },
              {
                id: 'fetch_raia',
                type: 'api_call',
                config: {
                  url: 'https://api.drogaraia.com.br/prices',
                  headers: { 'Authorization': 'Bearer {{ secrets.raia_token }}' }
                }
              }
            ]
          }
        },
        {
          id: 'merge_price_data',
          type: 'script',
          config: {
            script: `
              const allPrices = [...drogasil.prices, ...pacheco.prices, ...raia.prices];
              const groupedPrices = allPrices.reduce((acc, price) => {
                if (!acc[price.medication]) acc[price.medication] = [];
                acc[price.medication].push(price);
                return acc;
              }, {});
              
              const analyzedPrices = Object.entries(groupedPrices).map(([med, prices]) => ({
                medication: med,
                prices: prices,
                averagePrice: prices.reduce((sum, p) => sum + p.value, 0) / prices.length,
                minPrice: Math.min(...prices.map(p => p.value)),
                maxPrice: Math.max(...prices.map(p => p.value)),
                priceVariation: (Math.max(...prices.map(p => p.value)) - Math.min(...prices.map(p => p.value))) / Math.min(...prices.map(p => p.value)) * 100
              }));
              
              return { analyzedPrices };
            `
          }
        },
        {
          id: 'update_database',
          type: 'database',
          config: {
            operation: 'bulkUpdate',
            table: 'medication_prices',
            data: '{{ analyzedPrices }}'
          }
        },
        {
          id: 'detect_significant_changes',
          type: 'script',
          config: {
            script: `
              const significantChanges = analyzedPrices.filter(item => 
                item.priceVariation > 20 // Variação > 20%
              );
              return { significantChanges };
            `
          }
        },
        {
          id: 'notify_price_changes',
          type: 'conditional',
          config: {
            condition: 'significantChanges.length > 0',
            trueBranch: [
              {
                id: 'send_price_alerts',
                type: 'notification',
                config: {
                  type: 'push',
                  template: 'price_change_alert',
                  data: '{{ significantChanges }}'
                }
              }
            ]
          }
        }
      ],
      metadata: {
        category: 'price-sync',
        priority: 'medium',
        author: 'system',
        version: '1.0'
      }
    };

    this.workflows.set(workflow.id, workflow);
    await this.scheduler.scheduleWorkflow(workflow);
    
    return workflow.id;
  }

  // Workflow de backup e sincronização de dados
  async createDataBackupWorkflow(): Promise<string> {
    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: 'Data Backup and Sync',
      description: 'Backup automático de dados críticos e sincronização com sistemas externos',
      triggers: [
        {
          type: 'schedule',
          config: { cron: '0 2 * * *' } // Diariamente às 2h
        }
      ],
      steps: [
        {
          id: 'create_database_backup',
          type: 'script',
          config: {
            script: `
              const backupId = 'backup_' + new Date().toISOString().split('T')[0];
              // Simular backup do banco de dados
              await database.createBackup(backupId);
              return { backupId, timestamp: new Date().toISOString() };
            `
          }
        },
        {
          id: 'upload_to_cloud',
          type: 'api_call',
          config: {
            url: 'https://storage.googleapis.com/medicamentos-backup',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{ secrets.gcp_token }}',
              'Content-Type': 'application/octet-stream'
            },
            body: '{{ backup_data }}'
          }
        },
        {
          id: 'sync_with_anvisa',
          type: 'api_call',
          config: {
            url: 'https://api.anvisa.gov.br/sync',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer {{ secrets.anvisa_token }}'
            },
            body: {
              'system_id': 'medicamentos_system',
              'last_sync': '{{ last_sync_timestamp }}',
              'data_types': ['medications', 'recalls', 'approvals']
            }
          }
        },
        {
          id: 'validate_backup',
          type: 'script',
          config: {
            script: `
              // Validar integridade do backup
              const isValid = await validateBackupIntegrity(backupId);
              if (!isValid) {
                throw new Error('Backup validation failed');
              }
              return { validated: true };
            `
          }
        },
        {
          id: 'cleanup_old_backups',
          type: 'script',
          config: {
            script: `
              // Manter apenas os últimos 30 backups
              const retentionDays = 30;
              await cleanupOldBackups(retentionDays);
              return { cleanupCompleted: true };
            `
          }
        },
        {
          id: 'send_backup_report',
          type: 'notification',
          config: {
            type: 'email',
            template: 'backup_success',
            recipients: ['backup-admin@medicamentos.gov.br'],
            data: {
              'backupId': '{{ backupId }}',
              'timestamp': '{{ timestamp }}',
              'size': '{{ backup_size }}',
              'duration': '{{ execution_duration }}'
            }
          }
        }
      ],
      errorHandling: {
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'fixed',
          baseDelay: 5000
        },
        onError: [
          {
            id: 'backup_failure_alert',
            type: 'notification',
            config: {
              type: 'slack',
              channel: '#critical-alerts',
              message: '🚨 BACKUP FAILED: {{ error.message }} - Backup ID: {{ backupId }}'
            }
          }
        ]
      },
      metadata: {
        category: 'backup',
        priority: 'high',
        author: 'system',
        version: '1.0'
      }
    };

    this.workflows.set(workflow.id, workflow);
    await this.scheduler.scheduleWorkflow(workflow);
    
    return workflow.id;
  }

  // Workflow de análise de sentimento e feedback
  async createSentimentAnalysisWorkflow(): Promise<string> {
    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: 'Sentiment Analysis and Feedback Processing',
      description: 'Analisa feedback dos usuários e sentimento geral',
      triggers: [
        {
          type: 'event',
          config: { event: 'feedback.received' }
        },
        {
          type: 'schedule',
          config: { cron: '0 12 * * *' } // Análise diária ao meio-dia
        }
      ],
      steps: [
        {
          id: 'collect_feedback',
          type: 'database',
          config: {
            operation: 'query',
            query: `
              SELECT * FROM user_feedback 
              WHERE analyzed = false 
              AND created_at >= NOW() - INTERVAL 24 HOUR
            `
          }
        },
        {
          id: 'analyze_sentiment',
          type: 'ai_processing',
          config: {
            model: 'sentiment-analysis-pt-br',
            input: '{{ feedback.text }}',
            batch_size: 100
          }
        },
        {
          id: 'categorize_feedback',
          type: 'script',
          config: {
            script: `
              const categories = feedback.map(item => {
                const sentiment = item.sentiment_score;
                const text = item.text.toLowerCase();
                
                let category = 'general';
                if (text.includes('preço') || text.includes('caro')) category = 'pricing';
                else if (text.includes('demora') || text.includes('lento')) category = 'performance';
                else if (text.includes('erro') || text.includes('bug')) category = 'technical';
                else if (text.includes('médico') || text.includes('orientação')) category = 'medical';
                
                return {
                  ...item,
                  category,
                  sentiment_label: sentiment > 0.6 ? 'positive' : sentiment < 0.4 ? 'negative' : 'neutral'
                };
              });
              
              return { categorizedFeedback: categories };
            `
          }
        },
        {
          id: 'generate_insights',
          type: 'script',
          config: {
            script: `
              const insights = {
                totalFeedback: categorizedFeedback.length,
                sentimentDistribution: {
                  positive: categorizedFeedback.filter(f => f.sentiment_label === 'positive').length,
                  neutral: categorizedFeedback.filter(f => f.sentiment_label === 'neutral').length,
                  negative: categorizedFeedback.filter(f => f.sentiment_label === 'negative').length
                },
                topCategories: categorizedFeedback.reduce((acc, f) => {
                  acc[f.category] = (acc[f.category] || 0) + 1;
                  return acc;
                }, {}),
                averageSentiment: categorizedFeedback.reduce((sum, f) => sum + f.sentiment_score, 0) / categorizedFeedback.length,
                urgentIssues: categorizedFeedback.filter(f => f.sentiment_score < 0.2 && f.category === 'technical')
              };
              
              return { insights };
            `
          }
        },
        {
          id: 'update_feedback_status',
          type: 'database',
          config: {
            operation: 'bulkUpdate',
            table: 'user_feedback',
            data: '{{ categorizedFeedback }}',
            updateField: 'analyzed',
            updateValue: true
          }
        },
        {
          id: 'create_action_items',
          type: 'conditional',
          config: {
            condition: 'insights.urgentIssues.length > 0',
            trueBranch: [
              {
                id: 'create_tickets',
                type: 'api_call',
                config: {
                  url: '/api/support/tickets',
                  method: 'POST',
                  body: {
                    'type': 'urgent_feedback',
                    'issues': '{{ insights.urgentIssues }}',
                    'priority': 'high'
                  }
                }
              }
            ]
          }
        },
        {
          id: 'send_daily_report',
          type: 'notification',
          config: {
            type: 'email',
            template: 'sentiment_report',
            recipients: ['product-team@medicamentos.gov.br'],
            data: '{{ insights }}'
          }
        }
      ],
      metadata: {
        category: 'feedback',
        priority: 'medium',
        author: 'system',
        version: '1.0'
      }
    };

    this.workflows.set(workflow.id, workflow);
    await this.scheduler.scheduleWorkflow(workflow);
    
    return workflow.id;
  }

  // Workflow de detecção de fraudes e anomalias
  async createFraudDetectionWorkflow(): Promise<string> {
    const workflow: Workflow = {
      id: this.generateWorkflowId(),
      name: 'Fraud Detection and Anomaly Analysis',
      description: 'Detecta padrões suspeitos e possíveis fraudes no sistema',
      triggers: [
        {
          type: 'schedule',
          config: { cron: '0 */4 * * *' } // A cada 4 horas
        },
        {
          type: 'event',
          config: { event: 'suspicious.activity.detected' }
        }
      ],
      steps: [
        {
          id: 'collect_transaction_data',
          type: 'database',
          config: {
            operation: 'query',
            query: `
              SELECT * FROM user_transactions 
              WHERE created_at >= NOW() - INTERVAL 4 HOUR
              AND status = 'completed'
            `
          }
        },
        {
          id: 'analyze_patterns',
          type: 'ml_processing',
          config: {
            model: 'fraud_detection_v2',
            features: [
              'transaction_amount', 'user_location', 'time_of_day', 
              'medication_type', 'user_history', 'pharmacy_id'
            ],
            threshold: 0.75
          }
        },
        {
          id: 'detect_anomalies',
          type: 'script',
          config: {
            script: `
              const anomalies = transactions.filter(t => {
                // Detectar padrões suspeitos
                const suspiciousPatterns = [
                  t.amount > 1000 && t.user_history_length < 5, // Alto valor, usuário novo
                  t.transaction_count_last_hour > 10, // Muitas transações em pouco tempo
                  t.location_distance_from_usual > 500, // Localização muito distante do usual
                  t.medication_controlled && !t.prescription_verified // Medicamento controlado sem receita
                ];
                
                return suspiciousPatterns.some(pattern => pattern);
              });
              
              const riskScores = anomalies.map(anomaly => ({
                ...anomaly,
                riskScore: Math.random() * 0.4 + 0.6, // Score entre 0.6 e 1.0
                riskFactors: ['unusual_location', 'high_frequency', 'new_user']
              }));
              
              return { suspiciousTransactions: riskScores };
            `
          }
        },
        {
          id: 'validate_prescriptions',
          type: 'api_call',
          config: {
            url: '/api/prescriptions/validate/bulk',
            method: 'POST',
            body: {
              'transactions': '{{ suspiciousTransactions }}'
            }
          }
        },
        {
          id: 'flag_high_risk',
          type: 'conditional',
          config: {
            condition: 'suspiciousTransactions.some(t => t.riskScore > 0.8)',
            trueBranch: [
              {
                id: 'freeze_accounts',
                type: 'database',
                config: {
                  operation: 'update',
                  table: 'users',
                  where: 'id IN ({{ high_risk_user_ids }})',
                  set: { 'account_status': 'frozen', 'freeze_reason': 'suspicious_activity' }
                }
              },
              {
                id: 'notify_authorities',
                type: 'api_call',
                config: {
                  url: '/api/authorities/report',
                  method: 'POST',
                  body: {
                    'type': 'suspected_fraud',
                    'transactions': '{{ high_risk_transactions }}',
                    'timestamp': '{{ current_timestamp }}'
                  }
                }
              }
            ]
          }
        },
        {
          id: 'update_ml_model',
          type: 'ml_training',
          config: {
            model: 'fraud_detection_v2',
            training_data: '{{ validated_transactions }}',
            retrain_threshold: 1000
          }
        },
        {
          id: 'generate_fraud_report',
          type: 'script',
          config: {
            script: `
              const report = {
                timestamp: new Date().toISOString(),
                totalTransactions: transactions.length,
                suspiciousCount: suspiciousTransactions.length,
                highRiskCount: suspiciousTransactions.filter(t => t.riskScore > 0.8).length,
                commonPatterns: ['unusual_location', 'high_frequency'],
                recommendedActions: ['increase_monitoring', 'require_additional_verification']
              };
              
              return { fraudReport: report };
            `
          }
        }
      ],
      metadata: {
        category: 'security',
        priority: 'high',
        author: 'system',
        version: '1.0'
      }
    };

    this.workflows.set(workflow.id, workflow);
    await this.scheduler.scheduleWorkflow(workflow);
    
    return workflow.id;
  }

  // Métodos de controle de workflow
  async executeWorkflow(workflowId: string, inputData?: any): Promise<JobExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const jobId = this.generateJobId();
    const execution: JobExecution = {
      jobId,
      workflowId,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: [],
      inputData: inputData || {},
      outputData: {},
      errors: []
    };

    this.activeJobs.set(jobId, execution);

    try {
      await this.runWorkflowSteps(workflow, execution);
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      execution.errors.push({
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        step: execution.steps[execution.steps.length - 1]?.id || 'unknown'
      });
      
      await this.handleWorkflowError(workflow, execution, error);
    }

    return execution;
  }

  async pauseWorkflow(jobId: string): Promise<void> {
    const execution = this.activeJobs.get(jobId);
    if (execution && execution.status === 'running') {
      execution.status = 'paused';
    }
  }

  async resumeWorkflow(jobId: string): Promise<void> {
    const execution = this.activeJobs.get(jobId);
    if (execution && execution.status === 'paused') {
      execution.status = 'running';
      // Continuar execução do ponto onde parou
    }
  }

  async cancelWorkflow(jobId: string): Promise<void> {
    const execution = this.activeJobs.get(jobId);
    if (execution) {
      execution.status = 'cancelled';
      execution.endTime = new Date().toISOString();
    }
  }

  // Métodos auxiliares
  private initializeDefaultWorkflows(): void {
    // Inicializar workflows padrão do sistema
    setTimeout(async () => {
      await this.createStockMonitoringWorkflow();
      await this.createPriceSyncWorkflow();
      await this.createDataBackupWorkflow();
      await this.createSentimentAnalysisWorkflow();
      await this.createFraudDetectionWorkflow();
    }, 1000);
  }

  private generateWorkflowId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async runWorkflowSteps(workflow: Workflow, execution: JobExecution): Promise<void> {
    let context = { ...execution.inputData };

    for (const step of workflow.steps) {
      if (execution.status === 'paused' || execution.status === 'cancelled') {
        break;
      }

      const stepExecution = {
        id: step.id,
        status: 'running' as 'running' | 'completed' | 'failed',
        startTime: new Date().toISOString(),
        endTime: '',
        output: {}
      };

      execution.steps.push(stepExecution);

      try {
        const result = await this.executeStep(step, context);
        stepExecution.status = 'completed';
        stepExecution.endTime = new Date().toISOString();
        stepExecution.output = result;
        
        // Adicionar resultado ao contexto
        context = { ...context, ...result };
        
      } catch (error) {
        stepExecution.status = 'failed';
        stepExecution.endTime = new Date().toISOString();
        throw error;
      }
    }

    execution.outputData = context;
  }

  private async executeStep(step: WorkflowStep, context: any): Promise<any> {
    switch (step.type) {
      case 'api_call':
        return this.executeAPICall(step, context);
      case 'script':
        return this.executeScript(step, context);
      case 'database':
        return this.executeDatabaseOperation(step, context);
      case 'notification':
        return this.sendNotification(step, context);
      case 'conditional':
        return this.executeConditional(step, context);
      case 'parallel':
        return this.executeParallel(step, context);
      case 'ai_processing':
        return this.executeAIProcessing(step, context);
      case 'ml_processing':
        return this.executeMLProcessing(step, context);
      case 'ml_training':
        return this.executeMLTraining(step, context);
      case 'log':
        return this.executeLog(step, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  // Implementações simplificadas dos executores de step
  private async executeAPICall(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    const url = this.interpolateTemplate(config.url, context);
    const body = config.body ? this.interpolateTemplate(JSON.stringify(config.body), context) : undefined;

    console.log(`Executing API call to ${url}`);
    
    // Simular chamada de API
    return { success: true, data: { message: 'API call executed' } };
  }

  private async executeScript(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    const script = config.script;

    console.log(`Executing script: ${step.id}`);
    
    // Simular execução de script
    // Em produção, usar um sandbox seguro para executar JavaScript
    return { scriptResult: 'Script executed successfully' };
  }

  private async executeDatabaseOperation(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Executing database operation: ${config.operation}`);
    
    // Simular operação de banco de dados
    return { affected_rows: 1, operation: config.operation };
  }

  private async sendNotification(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Sending ${config.type} notification`);
    
    // Simular envio de notificação
    return { sent: true, type: config.type };
  }

  private async executeConditional(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    const condition = this.evaluateCondition(config.condition, context);
    
    if (condition && config.trueBranch) {
      const results = [];
      for (const subStep of config.trueBranch) {
        const result = await this.executeStep(subStep, context);
        results.push(result);
      }
      return { branchExecuted: 'true', results };
    } else if (!condition && config.falseBranch) {
      const results = [];
      for (const subStep of config.falseBranch) {
        const result = await this.executeStep(subStep, context);
        results.push(result);
      }
      return { branchExecuted: 'false', results };
    }
    
    return { branchExecuted: 'none' };
  }

  private async executeParallel(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Executing ${config.branches.length} parallel branches`);
    
    const results = await Promise.allSettled(
      config.branches.map((branch: WorkflowStep) => this.executeStep(branch, context))
    );
    
    return { parallelResults: results };
  }

  private async executeAIProcessing(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Executing AI processing with model: ${config.model}`);
    
    // Simular processamento de IA
    return { aiResult: 'AI processing completed', confidence: 0.87 };
  }

  private async executeMLProcessing(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Executing ML processing with model: ${config.model}`);
    
    // Simular processamento de ML
    return { mlResult: 'ML processing completed', predictions: [] };
  }

  private async executeMLTraining(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    console.log(`Training ML model: ${config.model}`);
    
    // Simular treinamento de modelo
    return { trainingResult: 'Model trained successfully', accuracy: 0.94 };
  }

  private async executeLog(step: WorkflowStep, context: any): Promise<any> {
    const config = step.config as any;
    const message = this.interpolateTemplate(config.message, context);
    
    console.log(`[${config.level.toUpperCase()}] ${message}`);
    return { logged: true };
  }

  private interpolateTemplate(template: string, context: any): string {
    return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
      const value = this.getNestedValue(context, key.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(condition: string, context: any): boolean {
    // Implementação simplificada - em produção, usar um parser seguro
    try {
      const interpolated = this.interpolateTemplate(condition, context);
      return eval(interpolated);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private async handleWorkflowError(workflow: Workflow, execution: JobExecution, error: any): Promise<void> {
    if (workflow.errorHandling?.onError) {
      for (const errorStep of workflow.errorHandling.onError) {
        try {
          await this.executeStep(errorStep, { ...execution.outputData, error });
        } catch (errorHandlingError) {
          console.error('Error in error handling:', errorHandlingError);
        }
      }
    }
  }

  // Getters para monitoramento
  getActiveJobs(): JobExecution[] {
    return Array.from(this.activeJobs.values());
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}

// Classes auxiliares
class WorkflowScheduler {
  private scheduledJobs: Map<string, any> = new Map();

  async scheduleWorkflow(workflow: Workflow): Promise<void> {
    for (const trigger of workflow.triggers) {
      if (trigger.type === 'schedule') {
        // Simular agendamento cron
        console.log(`Scheduled workflow ${workflow.id} with cron: ${trigger.config.cron}`);
      } else if (trigger.type === 'event') {
        // Simular listener de eventos
        console.log(`Set up event listener for ${trigger.config.event} on workflow ${workflow.id}`);
      }
    }
  }
}

class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Interfaces
export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  errorHandling?: {
    retryPolicy?: {
      maxRetries: number;
      backoffStrategy: 'fixed' | 'exponential';
      baseDelay: number;
    };
    onError?: WorkflowStep[];
  };
  metadata: {
    category: string;
    priority: 'low' | 'medium' | 'high';
    author: string;
    version: string;
  };
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'webhook';
  config: {
    cron?: string;
    event?: string;
    webhook?: string;
  };
}

export interface WorkflowStep {
  id: string;
  type: 'api_call' | 'script' | 'database' | 'notification' | 'conditional' | 'parallel' | 'ai_processing' | 'ml_processing' | 'ml_training' | 'log';
  config: any;
}

export interface JobExecution {
  jobId: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  startTime: string;
  endTime?: string;
  steps: Array<{
    id: string;
    status: 'running' | 'completed' | 'failed';
    startTime: string;
    endTime: string;
    output: any;
  }>;
  inputData: any;
  outputData: any;
  errors: Array<{
    message: string;
    timestamp: string;
    step: string;
  }>;
}
