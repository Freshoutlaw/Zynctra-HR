/**
 * /frontend/src/types/billing.types.ts
 * 
 * Complete type definitions for billing, subscriptions, and payment processing
 */

export enum SubscriptionPlan {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum BillingPeriod {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  STRIPE = 'STRIPE',
  CUSTOM = 'CUSTOM',
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  category: 'core' | 'advanced' | 'support' | 'integrations';
  limit?: string | number;
}

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  features: PlanFeature[];
  recommendedFor: string;
  maxUsers?: number;
  storageGB?: number;
  apiCallsPerMonth?: number;
  supportLevel: 'email' | 'priority' | 'dedicated';
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  billingPeriod: BillingPeriod;
  status: 'active' | 'inactive' | 'cancelled' | 'pending' | 'expired';
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
  trialEndDate?: Date;
  isTrialActive: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerId: string; // Payment provider's reference ID
  paymentMethodId?: string;
  invoiceId?: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  nextRetryAt?: Date;
}

export interface Invoice {
  id: string;
  organizationId: string;
  subscriptionId: string;
  paymentId?: string;
  invoiceNumber: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
  amount: number;
  amountPaid: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  pdfUrl?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  planId?: SubscriptionPlan;
  period?: string;
}

export interface PaymentMethod {
  id: string;
  organizationId: string;
  type: 'card' | 'bank_transfer' | 'wallet';
  provider: PaymentProvider;
  providerMethodId: string;
  cardBrand?: string;
  cardLast4?: string;
  bankName?: string;
  accountLast4?: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
  status: 'active' | 'expired' | 'failed';
}

export interface BillingContact {
  id: string;
  organizationId: string;
  type: 'billing' | 'support' | 'technical';
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
}

export interface PaystackInitializePaymentRequest {
  amount: number;
  email: string;
  currency: string;
  metadata: {
    organizationId: string;
    subscriptionId?: string;
    planId: SubscriptionPlan;
    billingPeriod: BillingPeriod;
    userId: string;
  };
  channels?: string[];
}

export interface PaystackVerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    metadata: Record<string, any>;
  };
}

export interface BillingState {
  currentSubscription: Subscription | null;
  currentPlan: PlanConfig | null;
  availablePlans: PlanConfig[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  billingContacts: BillingContact[];
  isLoading: boolean;
  error: string | null;
  lastPaymentStatus: PaymentStatus | null;
}

export interface FeatureFlagConfig {
  monetizationEnabled: boolean;
  freeMode: boolean;
  allowedPlans: SubscriptionPlan[];
  defaultPlan: SubscriptionPlan;
  trialDaysCount: number;
  primaryPaymentProvider: PaymentProvider;
  currencies: string[];
  requirePaymentMethod: boolean;
}

export interface MonetizationSettings {
  enabled: boolean;
  freeMode: boolean;
  enforceBilling: boolean;
  allowDowngrade: boolean;
  allowPlanChange: boolean;
  requirePaymentOnSignup: boolean;
  trialPeriodDays: number;
  autoRenew: boolean;
  lastUpdatedAt: Date;
  updatedBy: string;
}

export interface BillingException {
  code: 'PAYMENT_FAILED' | 'SUBSCRIPTION_EXPIRED' | 'PLAN_DOWNGRADE_REQUIRED' | 'FEATURE_UNAVAILABLE' | 'PAYMENT_RETRY_FAILED';
  message: string;
  planRequired?: SubscriptionPlan;
  featureName?: string;
  retryAfter?: number;
}

export interface OrganizationBillingInfo {
  organizationId: string;
  organizationName: string;
  currentPlan: SubscriptionPlan;
  currentSubscriptionStatus: 'active' | 'inactive' | 'trialing' | 'past_due' | 'cancelled';
  totalUsers: number;
  maxUsers: number;
  usagePercentage: number;
  nextBillingDate?: Date;
  lastPaymentDate?: Date;
  totalSpent: number;
  currency: string;
}

export interface SubscriptionUsage {
  organizationId: string;
  planId: SubscriptionPlan;
  apiCallsUsed: number;
  apiCallsLimit: number;
  storageUsedGB: number;
  storageLimit: number;
  activeUsers: number;
  maxUsers: number;
  resetDate: Date;
}