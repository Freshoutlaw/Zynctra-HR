/**
 * /frontend/src/services/payment/paymentGateway.ts
 * 
 * Abstract payment gateway with multi-provider support
 * Currently integrated: Paystack
 * Easily extensible: Stripe, Square, etc.
 * 
 * No hardcoded API keys - all loaded from environment
 */

import {
  PaymentProvider,
  PaystackInitializePaymentRequest,
  PaystackVerifyPaymentResponse,
  PaymentStatus,
} from '../../types/billing.types';

/**
 * Abstract Payment Gateway Interface
 */
export interface IPaymentGateway {
  provider: PaymentProvider;
  initializePayment(request: any): Promise<{ authorizationUrl: string; reference: string }>;
  verifyPayment(reference: string): Promise<PaystackVerifyPaymentResponse>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
  refundPayment(reference: string, amount?: number): Promise<boolean>;
  cancelPayment(reference: string): Promise<boolean>;
}

/**
 * Paystack Payment Gateway Implementation
 */
class PaystackGateway implements IPaymentGateway {
  provider: PaymentProvider = PaymentProvider.PAYSTACK;
  private apiKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor() {
    // Load API key from environment - NEVER hardcode
    this.apiKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || '';

    if (!this.apiKey) {
      console.error(
        'Paystack public key not configured. Set REACT_APP_PAYSTACK_PUBLIC_KEY in environment.'
      );
    }
  }

  /**
   * Initialize payment with Paystack
   * Returns authorization URL and payment reference
   */
  async initializePayment(
    request: PaystackInitializePaymentRequest
  ): Promise<{ authorizationUrl: string; reference: string }> {
    try {
      // Call backend to initialize payment (backend has secret key)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/payments/paystack/initialize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({
            amount: request.amount * 100, // Paystack uses cents
            email: request.email,
            metadata: request.metadata,
            channels: request.channels || ['card', 'bank'],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await response.json();

      if (!data.data.authorization_url) {
        throw new Error('No authorization URL returned');
      }

      return {
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw error;
    }
  }

  /**
   * Verify payment with Paystack
   * Called after payment completion to verify and finalize
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyPaymentResponse> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/payments/paystack/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            'X-CSRF-Token': this.getCsrfToken(),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get current payment status
   */
  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    try {
      const response = await this.verifyPayment(reference);

      if (response.data.status === 'success') {
        return PaymentStatus.COMPLETED;
      } else if (response.data.status === 'pending') {
        return PaymentStatus.PROCESSING;
      } else {
        return PaymentStatus.FAILED;
      }
    } catch (error) {
      console.error('Status check error:', error);
      return PaymentStatus.FAILED;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(reference: string, amount?: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/payments/paystack/refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({
            reference,
            amount: amount ? amount * 100 : undefined,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Refund error:', error);
      return false;
    }
  }

  /**
   * Cancel a payment (only works for pending payments)
   */
  async cancelPayment(reference: string): Promise<boolean> {
    try {
      const status = await this.getPaymentStatus(reference);

      if (status !== PaymentStatus.PROCESSING) {
        throw new Error('Only pending payments can be cancelled');
      }

      // Backend will handle cancellation logic
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/payments/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.getCsrfToken(),
          },
          credentials: 'include',
          body: JSON.stringify({ reference }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Cancellation error:', error);
      return false;
    }
  }

  /**
   * Get CSRF token for secure requests
   */
  private getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || '';
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }

    return '';
  }
}

/**
 * Stripe Gateway (placeholder for future implementation)
 */
class StripeGateway implements IPaymentGateway {
  provider: PaymentProvider = PaymentProvider.STRIPE;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Stripe not configured. Set REACT_APP_STRIPE_PUBLIC_KEY to enable.');
    }
  }

  async initializePayment(request: any): Promise<{ authorizationUrl: string; reference: string }> {
    throw new Error('Stripe integration coming soon');
  }

  async verifyPayment(reference: string): Promise<any> {
    throw new Error('Stripe integration coming soon');
  }

  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    throw new Error('Stripe integration coming soon');
  }

  async refundPayment(reference: string, amount?: number): Promise<boolean> {
    throw new Error('Stripe integration coming soon');
  }

  async cancelPayment(reference: string): Promise<boolean> {
    throw new Error('Stripe integration coming soon');
  }
}

/**
 * Payment Gateway Factory
 * Returns the appropriate gateway based on configuration
 */
export class PaymentGatewayFactory {
  private static instances: Map<PaymentProvider, IPaymentGateway> = new Map();

  static getGateway(provider: PaymentProvider): IPaymentGateway {
    // Return cached instance
    if (this.instances.has(provider)) {
      return this.instances.get(provider)!;
    }

    let gateway: IPaymentGateway;

    switch (provider) {
      case PaymentProvider.PAYSTACK:
        gateway = new PaystackGateway();
        break;
      case PaymentProvider.STRIPE:
        gateway = new StripeGateway();
        break;
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }

    this.instances.set(provider, gateway);
    return gateway;
  }

  static getDefaultGateway(): IPaymentGateway {
    const provider =
      (process.env.REACT_APP_PAYMENT_PROVIDER as PaymentProvider) ||
      PaymentProvider.PAYSTACK;
    return this.getGateway(provider);
  }

  static clearCache(): void {
    this.instances.clear();
  }
}

export const getPaymentGateway = (provider?: PaymentProvider) => {
  if (provider) {
    return PaymentGatewayFactory.getGateway(provider);
  }
  return PaymentGatewayFactory.getDefaultGateway();
};

export default PaymentGatewayFactory;