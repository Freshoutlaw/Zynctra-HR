/**
 * /frontend/src/services/supabase/supabaseClient.ts
 * 
 * Supabase client initialization and management
 * Stores only non-sensitive data in cloud database
 * Handles auth, profiles, billing records, audit logs
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Never expose secrets in frontend - these are public anon keys
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 */
export const initSupabase = (): SupabaseClient => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase credentials not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY'
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
};

/**
 * Get Supabase client instance
 */
export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
};

/**
 * User Profiles Table
 */
export interface UserProfile {
  id: string;
  user_id: string; // FK to auth.users
  email: string;
  full_name: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark' | 'system';
  timezone: string;
  language: string;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Organization Billing Table
 * (Non-sensitive billing info only - amounts, plan, status)
 */
export interface OrgBillingRecord {
  id: string;
  organization_id: string;
  current_plan: 'FREE' | 'STANDARD' | 'PREMIUM';
  billing_period: 'MONTHLY' | 'ANNUAL';
  subscription_status: 'active' | 'cancelled' | 'expired' | 'trialing';
  renewal_date: string;
  total_spent: number;
  currency: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Audit Logs Table
 * (Important admin actions logged to Supabase for audit trail)
 */
export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes: Record<string, any>;
  ip_address: string;
  user_agent: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
}

/**
 * Feature Usage Table
 * (Track usage metrics for billing and analytics)
 */
export interface FeatureUsage {
  id: string;
  organization_id: string;
  feature_id: string;
  usage_count: number;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * User Profile Service
 */
export const userProfileService = {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await getSupabase()
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Create or update user profile
   */
  async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await getSupabase()
      .from('user_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Update theme preference
   */
  async updateTheme(userId: string, theme: 'light' | 'dark' | 'system'): Promise<boolean> {
    const { error } = await getSupabase()
      .from('user_profiles')
      .update({ theme_preference: theme, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return !error;
  },

  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<boolean> {
    const { error } = await getSupabase()
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', userId);

    return !error;
  },
};

/**
 * Organization Billing Service
 */
export const orgBillingService = {
  /**
   * Get org billing record
   */
  async getBillingRecord(organizationId: string): Promise<OrgBillingRecord | null> {
    const { data, error } = await getSupabase()
      .from('org_billing')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      console.error('Failed to fetch billing record:', error);
      return null;
    }

    return data as OrgBillingRecord;
  },

  /**
   * Update billing record
   */
  async updateBillingRecord(
    organizationId: string,
    updates: Partial<OrgBillingRecord>
  ): Promise<OrgBillingRecord | null> {
    const { data, error } = await getSupabase()
      .from('org_billing')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update billing record:', error);
      return null;
    }

    return data as OrgBillingRecord;
  },

  /**
   * Get all org billing records (admin)
   */
  async getAllBillingRecords(limit: number = 100): Promise<OrgBillingRecord[]> {
    const { data, error } = await getSupabase()
      .from('org_billing')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch billing records:', error);
      return [];
    }

    return (data || []) as OrgBillingRecord[];
  },
};

/**
 * Audit Log Service
 */
export const auditLogService = {
  /**
   * Create audit log entry
   */
  async createLog(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog | null> {
    const { data, error } = await getSupabase()
      .from('audit_logs')
      .insert({
        ...log,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create audit log:', error);
      return null;
    }

    return data as AuditLog;
  },

  /**
   * Get audit logs for admin
   */
  async getLogs(
    filters?: {
      adminId?: string;
      resourceType?: string;
      severity?: string;
    },
    limit: number = 100
  ): Promise<AuditLog[]> {
    let query = getSupabase()
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filters?.adminId) {
      query = query.eq('admin_id', filters.adminId);
    }
    if (filters?.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }
    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return (data || []) as AuditLog[];
  },
};

/**
 * Feature Usage Service
 */
export const featureUsageService = {
  /**
   * Track feature usage
   */
  async trackUsage(organizationId: string, featureId: string): Promise<boolean> {
    const { error } = await getSupabase().rpc('track_feature_usage', {
      p_organization_id: organizationId,
      p_feature_id: featureId,
    });

    return !error;
  },

  /**
   * Get usage for organization
   */
  async getUsage(organizationId: string): Promise<FeatureUsage[]> {
    const { data, error } = await getSupabase()
      .from('feature_usage')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Failed to fetch usage:', error);
      return [];
    }

    return (data || []) as FeatureUsage[];
  },
};

export default {
  initSupabase,
  getSupabase,
  userProfileService,
  orgBillingService,
  auditLogService,
  featureUsageService,
};