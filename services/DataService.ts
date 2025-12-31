import { Lead, Message, AutomationRule } from '../types';

const KEYS = {
  LEADS: 'pakcrm_leads_v1',
  MESSAGES: 'pakcrm_messages_v1',
  AUTOMATIONS: 'pakcrm_automations_v1'
};

export const DataService = {
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
    // Also cleanup messages for this lead
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
    window.location.reload();
  }
};