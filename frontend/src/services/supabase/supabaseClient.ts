/**
 * /frontend/src/services/supabase/supabaseClient.ts
 *
 * Supabase client — stores only non-sensitive data.
 * Gracefully no-ops when credentials are not configured.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ??
  (import.meta.env['REACT_APP_SUPABASE_URL'] as string | undefined) ??
  '';

const SUPABASE_ANON_KEY =
  (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined) ??
  (import.meta.env['REACT_APP_SUPABASE_ANON_KEY'] as string | undefined) ??
  '';

let supabaseClient: SupabaseClient | null = null;

export const initSupabase = (): SupabaseClient => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return supabaseClient;
};

const getSupabase = (): SupabaseClient | null => {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    return initSupabase();
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  user_id: string;
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

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  changes: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
}

export interface FeatureUsage {
  id: string;
  organization_id: string;
  feature_id: string;
  usage_count: number;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const userProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) { console.error('[Supabase] getProfile:', error.message); return null; }
    return data as UserProfile;
  },

  async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('user_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) { console.error('[Supabase] upsertProfile:', error.message); return null; }
    return data as UserProfile;
  },

  async updateTheme(
    userId: string,
    theme: 'light' | 'dark' | 'system'
  ): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) return false;
    const { error } = await sb
      .from('user_profiles')
      .update({ theme_preference: theme, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) { console.error('[Supabase] updateTheme:', error.message); return false; }
    return true;
  },

  async updateLastLogin(userId: string): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) return false;
    const { error } = await sb
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) { console.error('[Supabase] updateLastLogin:', error.message); return false; }
    return true;
  },
};

export const orgBillingService = {
  async getBillingRecord(organizationId: string): Promise<OrgBillingRecord | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('org_billing')
      .select('*')
      .eq('organization_id', organizationId)
      .single();
    if (error) { console.error('[Supabase] getBillingRecord:', error.message); return null; }
    return data as OrgBillingRecord;
  },

  async updateBillingRecord(
    organizationId: string,
    updates: Partial<OrgBillingRecord>
  ): Promise<OrgBillingRecord | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('org_billing')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('organization_id', organizationId)
      .select()
      .single();
    if (error) { console.error('[Supabase] updateBillingRecord:', error.message); return null; }
    return data as OrgBillingRecord;
  },

  async getAllBillingRecords(limit = 100): Promise<OrgBillingRecord[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
      .from('org_billing')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (error) { console.error('[Supabase] getAllBillingRecords:', error.message); return []; }
    return (data ?? []) as OrgBillingRecord[];
  },
};

export const auditLogService = {
  async createLog(
    log: Omit<AuditLog, 'id' | 'created_at'>
  ): Promise<AuditLog | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('audit_logs')
      .insert({ ...log, created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) { console.error('[Supabase] createLog:', error.message); return null; }
    return data as AuditLog;
  },

  async getLogs(
    filters?: { adminId?: string; resourceType?: string; severity?: string },
    limit = 100
  ): Promise<AuditLog[]> {
    const sb = getSupabase();
    if (!sb) return [];
    let query = sb
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (filters?.adminId) query = query.eq('admin_id', filters.adminId);
    if (filters?.resourceType) query = query.eq('resource_type', filters.resourceType);
    if (filters?.severity) query = query.eq('severity', filters.severity);
    const { data, error } = await query;
    if (error) { console.error('[Supabase] getLogs:', error.message); return []; }
    return (data ?? []) as AuditLog[];
  },
};

export const featureUsageService = {
  async trackUsage(organizationId: string, featureId: string): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) return false;
    const { error } = await sb.rpc('track_feature_usage', {
      p_organization_id: organizationId,
      p_feature_id: featureId,
    });
    if (error) { console.error('[Supabase] trackUsage:', error.message); return false; }
    return true;
  },

  async getUsage(organizationId: string): Promise<FeatureUsage[]> {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
      .from('feature_usage')
      .select('*')
      .eq('organization_id', organizationId);
    if (error) { console.error('[Supabase] getUsage:', error.message); return []; }
    return (data ?? []) as FeatureUsage[];
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