
export type TenantId = string;

export interface AiAnalysis {
  score: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  summary: string;
  next_action: string;
  key_points: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'VIEWER';
  tenant_id: TenantId;
}

export interface Lead {
  id: string;
  name: string;
  phone: string; // Pakistani format 03xx-xxxxxxx
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

export interface PipelineStage {
  id: string;
  title: string;
  leads: Lead[];
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  is_active: boolean;
  tenant_id: TenantId;
}
