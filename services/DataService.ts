
import { Lead, Message, AutomationRule, TenantSettings, EmailTemplate } from '../types';

const KEYS = {
  LEADS: 'pakcrm_leads_v1',
  MESSAGES: 'pakcrm_messages_v1',
  AUTOMATIONS: 'pakcrm_automations_v1',
  SETTINGS: 'pakcrm_settings_v1'
};

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1',
    name: 'Initial Welcome Outreach',
    trigger: 'Lead Created',
    isDefault: true,
    content: "Hi {{name}},\n\nThank you for reaching out via {{source}}. I noticed your interest in our property listings. I'd love to discuss how we can help you find the perfect match.\n\nBest regards,\n{{agent_name}}"
  },
  {
    id: 't2',
    name: 'Deal Won Congratulation',
    trigger: 'Stage Changed to WON',
    isDefault: true,
    content: "Hi {{name}},\n\nCongratulations! We've successfully closed the deal for the PKR {{value}} property. It's been a pleasure working with you.\n\nWarm regards,\n{{agent_name}}"
  }
];

const DEFAULT_SETTINGS: TenantSettings = {
  brandColor: '#4f46e5',
  currency: 'PKR',
  timezone: 'UTC+5 (Karachi)',
  emailSignature: '--\nBest Regards,\nSales Team',
  isAiPrivacyEnabled: false,
  integrations: [
    { id: '1', provider: 'WHATSAPP', apiKey: '', status: 'DISCONNECTED' },
    { id: '2', provider: 'ZENSEND', apiKey: '', status: 'DISCONNECTED' }
  ],
  templates: DEFAULT_TEMPLATES
};

export const DataService = {
  // Settings
  getSettings: (): TenantSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    const settings = JSON.parse(data);
    // Ensure templates exist for older data
    if (!settings.templates) settings.templates = DEFAULT_TEMPLATES;
    return settings;
  },
  saveSettings: (settings: TenantSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Leads
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  },
  saveLead: (lead: Lead) => {
    const leads = DataService.getLeads();
    const index = leads.findIndex(l => l.id === lead.id);
    if (index > -1) {
      leads[index] = lead;
    } else {
      leads.push(lead);
    }
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
  },
  deleteLead: (id: string) => {
    const leads = DataService.getLeads().filter(l => l.id !== id);
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
    const msgs = DataService.getAllMessages().filter(m => m.lead_id !== id);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(msgs));
  },

  // Messages
  getAllMessages: (): Message[] => {
    const data = localStorage.getItem(KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  },
  getMessages: (leadId: string): Message[] => {
    return DataService.getAllMessages().filter(m => m.lead_id === leadId);
  },
  addMessage: (message: Message) => {
    const allMessages = DataService.getAllMessages();
    allMessages.push(message);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMessages));
  },

  // Automations
  getAutomations: (): AutomationRule[] => {
    const data = localStorage.getItem(KEYS.AUTOMATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveAutomation: (rule: AutomationRule) => {
    const rules = DataService.getAutomations();
    const index = rules.findIndex(r => r.id === rule.id);
    if (index > -1) {
      rules[index] = rule;
    } else {
      rules.push(rule);
    }
    localStorage.setItem(KEYS.AUTOMATIONS, JSON.stringify(rules));
  },
  deleteAutomation: (id: string) => {
    const rules = DataService.getAutomations().filter(r => r.id !== id);
    localStorage.setItem(KEYS.AUTOMATIONS, JSON.stringify(rules));
  },

  // Utility
  clearAllData: () => {
    localStorage.removeItem(KEYS.LEADS);
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.AUTOMATIONS);
    localStorage.removeItem(KEYS.SETTINGS);
    window.location.reload();
  }
};
