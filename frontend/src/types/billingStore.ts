/**
 * /frontend/src/stores/billingStore.ts
 * 
 * Billing state management using Zustand
 * Handles subscriptions, payments, invoices, and feature access
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  BillingState,
  Subscription,
  PlanConfig,
  PaymentMethod,
  Invoice,
  SubscriptionPlan,
  PaymentStatus,
  BillingContact,
  FeatureFlagConfig,
  SubscriptionUsage,
} from '../types/billing.types';

// Default plan configurations
const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  [SubscriptionPlan.FREE]: {
    id: SubscriptionPlan.FREE,
    name: 'free',
    displayName: 'Free',
    description: 'Get started with essential HR features',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'USD',
    recommendedFor: 'Testing',
    maxUsers: 5,
    storageGB: 5,
    apiCallsPerMonth: 1000,
    supportLevel: 'email',
    features: [
      {
        id: 'core_hr',
        name: 'Core HR',
        description: 'Basic employee management',
        included: true,
        category: 'core',
      },
      {
        id: 'basic_ats',
        name: 'Basic ATS',
        description: 'Job posting and candidate tracking',
        included: true,
        category: 'core',
      },
      {
        id: 'basic_reporting',
        name: 'Basic Reporting',
        description: 'Essential reports and dashboards',
        included: true,
        category: 'core',
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Predictive insights and trends',
        included: false,
        category: 'advanced',
      },
      {
        id: 'ai_copilot',
        name: 'AI Copilot',
        description: 'AI-powered assistance',
        included: false,
        category: 'advanced',
      },
      {
        id: 'payroll_tools',
        name: 'Payroll Tools',
        description: 'Advanced payroll management',
        included: false,
        category: 'advanced',
      },
      {
        id: 'compliance',
        name: 'Compliance Tools',
        description: 'Regulatory compliance management',
        included: false,
        category: 'advanced',
      },
      {
        id: 'audit_tools',
        name: 'Audit & Incident Tools',
        description: 'Security auditing and incident response',
        included: false,
        category: 'advanced',
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: '24/7 dedicated support',
        included: false,
        category: 'support',
      },
    ],
  },
  [SubscriptionPlan.STANDARD]: {
    id: SubscriptionPlan.STANDARD,
    name: 'standard',
    displayName: 'Standard',
    description: 'For growing companies',
    monthlyPrice: 50,
    annualPrice: 500,
    currency: 'USD',
    recommendedFor: 'Startups & SMBs',
    maxUsers: 100,
    storageGB: 100,
    apiCallsPerMonth: 50000,
    supportLevel: 'email',
    features: [
      {
        id: 'core_hr',
        name: 'Core HR',
        description: 'Complete employee management',
        included: true,
        category: 'core',
      },
      {
        id: 'ats',
        name: 'Full ATS',
        description: 'Advanced recruitment tools',
        included: true,
        category: 'core',
      },
      {
        id: 'attendance',
        name: 'Attendance Management',
        description: 'Time tracking and scheduling',
        included: true,
        category: 'core',
      },
      {
        id: 'reporting',
        name: 'Advanced Reporting',
        description: 'Custom reports and dashboards',
        included: true,
        category: 'core',
      },
      {
        id: 'automation',
        name: 'Workflow Automation',
        description: 'Automate HR workflows',
        included: true,
        category: 'core',
      },
      {
        id: 'basic_ai',
        name: 'Basic AI Assistance',
        description: 'AI-powered recommendations',
        included: true,
        category: 'advanced',
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Predictive insights',
        included: false,
        category: 'advanced',
      },
      {
        id: 'ai_copilot',
        name: 'Full AI Copilot',
        description: 'Advanced AI features',
        included: false,
        category: 'advanced',
      },
      {
        id: 'payroll_tools',
        name: 'Payroll Tools',
        description: 'Payroll management',
        included: false,
        category: 'advanced',
      },
      {
        id: 'compliance',
        name: 'Compliance Tools',
        description: 'Compliance management',
        included: false,
        category: 'advanced',
      },
      {
        id: 'priority_support',
        name: 'Priority Support',
        description: 'Email support during business hours',
        included: false,
        category: 'support',
      },
    ],
  },
  [SubscriptionPlan.PREMIUM]: {
    id: SubscriptionPlan.PREMIUM,
    name: 'premium',
    displayName: 'Premium',
    description: 'For enterprise organizations',
    monthlyPrice: 75,
    annualPrice: 750,
    currency: 'USD',
    recommendedFor: 'Enterprise',
    maxUsers: 1000,
    storageGB: 1000,
    apiCallsPerMonth: 500000,
    supportLevel: 'dedicated',
    features: [
      {
        id: 'core_hr',
        name: 'Core HR',
        description: 'Complete employee management',
        included: true,
        category: 'core',
      },
      {
        id: 'ats',
        name: 'Full ATS',
        description: 'Advanced recruitment tools',
        included: true,
        category: 'core',
      },
      {
        id: 'attendance',
        name: 'Attendance Management',
        description: 'Time tracking and scheduling',
        included: true,
        category: 'core',
      },
      {
        id: 'payroll',
        name: 'Full Payroll',
        description: 'Multi-country payroll processing',
        included: true,
        category: 'core',
      },
      {
        id: 'compliance',
        name: 'Compliance Tools',
        description: 'Comprehensive compliance management',
        included: true,
        category: 'advanced',
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Predictive insights and ML models',
        included: true,
        category: 'advanced',
      },
      {
        id: 'ai_copilot',
        name: 'Full AI Copilot',
        description: 'Advanced AI-powered assistance',
        included: true,
        category: 'advanced',
      },
      {
        id: 'audit_tools',
        name: 'Audit & Incident Tools',
        description: 'Complete security auditing',
        included: true,
        category: 'advanced',
      },
      {
        id: 'integrations',
        name: 'Advanced Integrations',
        description: '100+ pre-built integrations',
        included: true,
        category: 'integrations',
      },
      {
        id: 'priority_support',
        name: '24/7 Dedicated Support',
        description: 'Dedicated account manager and support',
        included: true,
        category: 'support',
      },
      {
        id: 'sso',
        name: 'SSO & Advanced Security',
        description: 'Enterprise security features',
        included: true,
        category: 'advanced',
      },
    ],
  },
};

interface BillingStore extends BillingState {
  // Subscriptions
  setSubscription: (subscription: Subscription) => void;
  setCurrentPlan: (plan: PlanConfig) => void;
  
  // Payment Methods
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  
  // Invoices
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  
  // Billing Contacts
  addBillingContact: (contact: BillingContact) => void;
  updateBillingContact: (contactId: string, contact: Partial<BillingContact>) => void;
  
  // State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastPaymentStatus: (status: PaymentStatus | null) => void;
  
  // Utility
  resetBillingState: () => void;
  getPlanFeatures: (planId: SubscriptionPlan) => PlanConfig['features'];
  canAccessFeature: (featureId: string) => boolean;
  getNextBillingAmount: () => number;
}

const initialState: BillingState = {
  currentSubscription: null,
  currentPlan: null,
  availablePlans: Object.values(PLAN_CONFIGS),
  paymentMethods: [],
  invoices: [],
  billingContacts: [],
  isLoading: false,
  error: null,
  lastPaymentStatus: null,
};

export const useBillingStore = create<BillingStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSubscription: (subscription: Subscription) => {
          const plan = PLAN_CONFIGS[subscription.plan];
          set({ currentSubscription: subscription, currentPlan: plan });
        },

        setCurrentPlan: (plan: PlanConfig) => {
          set({ currentPlan: plan });
        },

        addPaymentMethod: (method: PaymentMethod) => {
          set((state) => ({
            paymentMethods: [...state.paymentMethods, method],
          }));
        },

        removePaymentMethod: (methodId: string) => {
          set((state) => ({
            paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId),
          }));
        },

        setDefaultPaymentMethod: (methodId: string) => {
          set((state) => ({
            paymentMethods: state.paymentMethods.map((m) => ({
              ...m,
              isDefault: m.id === methodId,
            })),
          }));
        },

        addInvoice: (invoice: Invoice) => {
          set((state) => ({
            invoices: [invoice, ...state.invoices],
          }));
        },

        updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => {
          set((state) => ({
            invoices: state.invoices.map((inv) =>
              inv.id === invoiceId ? { ...inv, status } : inv
            ),
          }));
        },

        addBillingContact: (contact: BillingContact) => {
          set((state) => ({
            billingContacts: [...state.billingContacts, contact],
          }));
        },

        updateBillingContact: (contactId: string, contact: Partial<BillingContact>) => {
          set((state) => ({
            billingContacts: state.billingContacts.map((c) =>
              c.id === contactId ? { ...c, ...contact } : c
            ),
          }));
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setLastPaymentStatus: (status: PaymentStatus | null) => {
          set({ lastPaymentStatus: status });
        },

        resetBillingState: () => {
          set(initialState);
        },

        getPlanFeatures: (planId: SubscriptionPlan) => {
          const plan = PLAN_CONFIGS[planId];
          return plan?.features || [];
        },

        canAccessFeature: (featureId: string) => {
          const currentPlan = get().currentPlan;
          if (!currentPlan) return false;
          
          const feature = currentPlan.features.find((f) => f.id === featureId);
          return feature?.included ?? false;
        },

        getNextBillingAmount: () => {
          const subscription = get().currentSubscription;
          const plan = get().currentPlan;
          
          if (!subscription || !plan) return 0;
          
          if (subscription.billingPeriod === 'MONTHLY') {
            return plan.monthlyPrice;
          } else {
            return plan.annualPrice;
          }
        },
      }),
      {
        name: 'zynctra-billing-store',
        partialize: (state) => ({
          currentSubscription: state.currentSubscription,
          currentPlan: state.currentPlan,
          paymentMethods: state.paymentMethods,
          invoices: state.invoices,
          billingContacts: state.billingContacts,
          lastPaymentStatus: state.lastPaymentStatus,
        }),
      }
    )
  )
);

export default useBillingStore;