// Payment Event Service for real-time updates across modules
export interface PaymentEvent {
  invoice_id: string;
  invoice_number: string;
  amount: number;
  student_id: string;
  payment_intent_id: string;
  timestamp: string;
}

export class PaymentEventService {
  private static instance: PaymentEventService;
  private listeners: Map<string, (event: PaymentEvent) => void> = new Map();

  static getInstance(): PaymentEventService {
    if (!PaymentEventService.instance) {
      PaymentEventService.instance = new PaymentEventService();
    }
    return PaymentEventService.instance;
  }

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for payment completed events
    window.addEventListener('paymentCompleted', (event: any) => {
      const paymentData = event.detail as PaymentEvent;
      console.log('📡 Payment event received:', paymentData);
      
      // Notify all registered listeners
      this.listeners.forEach((listener, moduleName) => {
        try {
          listener(paymentData);
          console.log(`✅ ${moduleName} notified of payment event`);
        } catch (error) {
          console.error(`❌ Error notifying ${moduleName}:`, error);
        }
      });
    });
  }

  // Register a module to receive payment events
  registerListener(moduleName: string, callback: (event: PaymentEvent) => void) {
    this.listeners.set(moduleName, callback);
    console.log(`📝 ${moduleName} registered for payment events`);
  }

  // Unregister a module from payment events
  unregisterListener(moduleName: string) {
    this.listeners.delete(moduleName);
    console.log(`🗑️ ${moduleName} unregistered from payment events`);
  }

  // Get current listeners (for debugging)
  getListeners(): string[] {
    return Array.from(this.listeners.keys());
  }
}

export default PaymentEventService;
