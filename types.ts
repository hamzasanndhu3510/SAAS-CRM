
export type TenantId = string;

export interface AiAnalysis {
  score: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  summary: string;
  next_action: string;
  key_points: string[];
  closing_probability?: number;
  personalized_email?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  businessName: string;
  role: 'ADMIN' | 'AGENT' | 'VIEWER';
  tenant_id: TenantId;
  avatarColor: string;
}

export interface Integration {
  id: string;
  provider: 'WHATSAPP' | 'ZENSEND' | 'SMSCOUNTRY';
  apiKey: string;
  status: 'CONNECTED' | 'DISCONNECTED';
}

export interface EmailTemplate {
  id: string;
  name: string;
  content: string;
  trigger: string;
  isDefault: boolean;
}

export interface TenantSettings {
  brandColor: string;
  logoUrl?: string;
  currency: string;
  timezone: string;
  emailSignature: string;
  isAiPrivacyEnabled: boolean;
  integrations: Integration[];
  templates: EmailTemplate[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string; 
  source: 'WHATSAPP' | 'FACEBOOK' | 'WALK_IN' | 'WEBSITE';
  value: number;
  stage: 'NEW' | 'CONTACTED' | 'PROPOSAL' | 'WON' | 'LOST';
  tenant_id: TenantId;
  created_at: string;
  ai_score?: number; 
  ai_analysis?: AiAnalysis;
}

export interface Message {
  id: string;
  lead_id: string;
  content: string;
  type: 'INBOUND' | 'OUTBOUND';
  channel: 'WHATSAPP' | 'SMS';
  timestamp: string;
  tenant_id: TenantId;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  is_active: boolean;
  tenant_id: TenantId;
}
