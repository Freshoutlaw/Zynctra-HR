/**
 * /frontend/src/services/payment/paymentGateway.ts
 *
 * Abstract payment gateway — currently integrates Paystack.
 * Fixed: uses import.meta.env; getCsrfToken imported from AuthContext.
 */

import {
  PaymentProvider,
  PaystackInitializePaymentRequest,
  PaystackVerifyPaymentResponse,
  PaymentStatus,
} from '../../types/billing.types';
import { getCsrfToken } from '../../context/AuthContext';

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IPaymentGateway {
  provider: PaymentProvider;
  initializePayment(
    request: PaystackInitializePaymentRequest
  ): Promise<{ authorizationUrl: string; reference: string }>;
  verifyPayment(reference: string): Promise<PaystackVerifyPaymentResponse>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
  refundPayment(reference: string, amount?: number): Promise<boolean>;
  cancelPayment(reference: string): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Paystack implementation
// ---------------------------------------------------------------------------

class PaystackGateway implements IPaymentGateway {
  readonly provider = PaymentProvider.PAYSTACK;

  async initializePayment(
    request: PaystackInitializePaymentRequest
  ): Promise<{ authorizationUrl: string; reference: string }> {
    const res = await fetch(`${API_BASE}/payments/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: request.amount * 100,
        email: request.email,
        metadata: request.metadata,
        channels: request.channels ?? ['card', 'bank'],
      }),
    });
    if (!res.ok) throw new Error('Failed to initialise payment');
    const data = (await res.json()) as {
      data: { authorization_url: string; reference: string };
    };
    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    };
  }

  async verifyPayment(
    reference: string
  ): Promise<PaystackVerifyPaymentResponse> {
    const res = await fetch(
      `${API_BASE}/payments/paystack/verify/${reference}`,
      {
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() },
      }
    );
    if (!res.ok) throw new Error('Failed to verify payment');
    return res.json() as Promise<PaystackVerifyPaymentResponse>;
  }

  async getPaymentStatus(reference: string): Promise<PaymentStatus> {
    try {
      const response = await this.verifyPayment(reference);
      if (response.data.status === 'success') return PaymentStatus.COMPLETED;
      if (response.data.status === 'pending') return PaymentStatus.PROCESSING;
      return PaymentStatus.FAILED;
    } catch {
      return PaymentStatus.FAILED;
    }
  }

  async refundPayment(reference: string, amount?: number): Promise<boolean> {
    const res = await fetch(`${API_BASE}/payments/paystack/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({ reference, amount: amount ? amount * 100 : undefined }),
    });
    return res.ok;
  }

  async cancelPayment(reference: string): Promise<boolean> {
    const status = await this.getPaymentStatus(reference);
    if (status !== PaymentStatus.PROCESSING) return false;
    const res = await fetch(`${API_BASE}/payments/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({ reference }),
    });
    return res.ok;
  }
}

// ---------------------------------------------------------------------------
// Stub Stripe gateway
// ---------------------------------------------------------------------------

class StripeGateway implements IPaymentGateway {
  readonly provider = PaymentProvider.STRIPE;

  async initializePayment(): Promise<{
    authorizationUrl: string;
    reference: string;
  }> {
    throw new Error('Stripe integration not yet implemented.');
  }
  async verifyPayment(): Promise<PaystackVerifyPaymentResponse> {
    throw new Error('Stripe integration not yet implemented.');
  }
  async getPaymentStatus(): Promise<PaymentStatus> {
    throw new Error('Stripe integration not yet implemented.');
  }
  async refundPayment(): Promise<boolean> {
    throw new Error('Stripe integration not yet implemented.');
  }
  async cancelPayment(): Promise<boolean> {
    throw new Error('Stripe integration not yet implemented.');
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export class PaymentGatewayFactory {
  private static readonly instances = new Map<PaymentProvider, IPaymentGateway>();

  static getGateway(provider: PaymentProvider): IPaymentGateway {
    if (this.instances.has(provider)) return this.instances.get(provider)!;
    let gw: IPaymentGateway;
    switch (provider) {
      case PaymentProvider.PAYSTACK:
        gw = new PaystackGateway();
        break;
      case PaymentProvider.STRIPE:
        gw = new StripeGateway();
        break;
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
    this.instances.set(provider, gw);
    return gw;
  }

  static getDefaultGateway(): IPaymentGateway {
    const provider =
      ((import.meta.env['VITE_PAYMENT_PROVIDER'] as string | undefined) as
        | PaymentProvider
        | undefined) ?? PaymentProvider.PAYSTACK;
    return this.getGateway(provider);
  }

  static clearCache(): void {
    this.instances.clear();
  }
}

export const getPaymentGateway = (provider?: PaymentProvider): IPaymentGateway =>
  provider
    ? PaymentGatewayFactory.getGateway(provider)
    : PaymentGatewayFactory.getDefaultGateway();

export default PaymentGatewayFactory;