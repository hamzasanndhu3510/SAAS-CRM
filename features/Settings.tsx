
import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Zap, 
  Users, 
  Mail, 
  Save, 
  CheckCircle2, 
  Smartphone,
  MessageSquare,
  Lock,
  ChevronRight,
  DollarSign,
  Clock,
  ShieldCheck,
  LayoutTemplate,
  Trash2,
  Plus,
  Sparkles,
  RefreshCw,
  X,
  Check,
  Info,
  MoreVertical,
  Globe
} from 'lucide-react';
import { DataService } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { TenantSettings, UserProfile, EmailTemplate } from '../types';
import { GoogleGenAI } from "@google/genai";

const BRAND_COLORS = [
  '#4f46e5', // Indigo
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#1e293b', // Slate
];

const AUTOMATION_TRIGGERS = [
  'Lead Created',
  'Stage Changed to WON',
  'Inbound WhatsApp Message',
  'AI Sentiment: Positive',
  'No Contact for 2 Days'
];

const TEMPLATE_VARIABLES = [
  { name: 'name', label: 'Lead Name' },
  { name: 'source', label: 'Source' },
  { name: 'value', label: 'Price' },
  { name: 'agent_name', label: 'Your Name' },
  { name: 'business_name', label: 'Agency' }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branding' | 'integrations' | 'team' | 'templates' | 'general'>('templates');
  const [settings, setSettings] = useState<TenantSettings>(DataService.getSettings());
  const [profile, setProfile] = useState<UserProfile>(AuthService.getProfile());
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isAiImproving, setIsAiImproving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      DataService.saveSettings(settings);
      AuthService.updateProfile(profile);
      setIsSaving(false);
      setShowToast(true);
    }, 800);
  };

  const updateIntegration = (index: number, apiKey: string) => {
    const updated = [...settings.integrations];
    updated[index] = { ...updated[index], apiKey, status: apiKey ? 'CONNECTED' : 'DISCONNECTED' };
    setSettings({ ...settings, integrations: updated });
  };

  const handleAddTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Marketing Template',
      content: 'Hi {{name}}, we saw your interest on {{source}}. How can we help you today?',
      trigger: 'Lead Created',
      isDefault: false
    };
    setSettings({ ...settings, templates: [...settings.templates, newTemplate] });
    setEditingTemplate(newTemplate);
  };

  const handleDeleteTemplate = (id: string) => {
    setSettings({ ...settings, templates: settings.templates.filter(t => t.id !== id) });
    if (editingTemplate?.id === id) setEditingTemplate(null);
  };

  const handleUpdateTemplate = (updated: EmailTemplate) => {
    setSettings({
      ...settings,
      templates: settings.templates.map(t => (t.id === updated.id ? updated : t))
    });
  };

  const setAsDefault = (template: EmailTemplate) => {
    const updatedTemplates = settings.templates.map(t => {
      if (t.trigger === template.trigger) {
        return { ...t, isDefault: t.id === template.id };
      }
      return t;
    });
    setSettings({ ...settings, templates: updatedTemplates });
  };

  const handleImproveWithAi = async () => {
    if (!editingTemplate) return;
    setIsAiImproving(true);
    
    try {
      // Initialize with named apiKey parameter as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a world-class real estate sales copywriter. Rewrite this template to be more engaging, professional, and high-converting for the Pakistan market.
        Template Name: ${editingTemplate.name}
        Context Trigger: ${editingTemplate.trigger}
        Current Text: "${editingTemplate.content}"
        
        Mandatory Rules:
        1. Keep variables like {{name}}, {{source}}, {{agent_name}}, {{value}}, and {{business_name}} exactly as they are.
        2. Tone: Professional, authoritative, but friendly.
        3. Length: Concise (under 100 words).
        4. Return ONLY the new content text.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const improvedText = response.text;
      if (improvedText) {
        const updated = { ...editingTemplate, content: improvedText.trim() };
        setEditingTemplate(updated);
        handleUpdateTemplate(updated);
      }
    } catch (err) {
      console.error("AI Improvement failed", err);
    } finally {
      setIsAiImproving(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    const textarea = document.getElementById('template-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editingTemplate.content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newContent = `${before}{{${variable}}}${after}`;
    
    const updated = { ...editingTemplate, content: newContent };
    setEditingTemplate(updated);
    handleUpdateTemplate(updated);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
             <Zap size={24} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 font-medium">Manage whitelabel branding, team access, and AI automation.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 min-w-[180px]"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Syncing...' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-1">
          <TabButton active={activeTab === 'templates'} icon={LayoutTemplate} label="AI Templates" onClick={() => setActiveTab('templates')} />
          <TabButton active={activeTab === 'branding'} icon={Palette} label="Whitelabeling" onClick={() => setActiveTab('branding')} />
          <TabButton active={activeTab === 'integrations'} icon={Zap} label="Integrations" onClick={() => setActiveTab('integrations')} />
          <TabButton active={activeTab === 'team'} icon={Users} label="Team Access" onClick={() => setActiveTab('team')} />
          <TabButton active={activeTab === 'general'} icon={Globe} label="Global Config" onClick={() => setActiveTab('general')} />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* List of Templates */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Template Library</h3>
                    <button 
                      onClick={handleAddTemplate}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                    >
                      <Plus size={14} className="mr-1" />
                      New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.templates.map(template => (
                      <div 
                        key={template.id} 
                        onClick={() => setEditingTemplate(template)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                          editingTemplate?.id === template.id 
                            ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100' 
                            : 'bg-white border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className={`text-sm font-black truncate leading-tight mb-1 ${editingTemplate?.id === template.id ? 'text-white' : 'text-slate-800'}`}>
                              {template.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded ${
                                editingTemplate?.id === template.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {template.trigger}
                              </span>
                              {template.isDefault && (
                                <span className={`flex items-center text-[9px] font-black uppercase ${editingTemplate?.id === template.id ? 'text-white/70' : 'text-emerald-500'}`}>
                                  <Check size={10} className="mr-0.5" />
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                              editingTemplate?.id === template.id ? 'text-white/40 hover:text-white' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editor Area */}
                <div className="xl:col-span-3 min-h-[600px]">
                  {editingTemplate ? (
                    <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm space-y-6 animate-in slide-in-from-right-10 duration-500 h-full">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <LayoutTemplate size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-800">Visual Editor</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI Copywriter Enabled</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                           {!editingTemplate.isDefault && (
                             <button 
                               onClick={() => setAsDefault(editingTemplate)}
                               className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                             >
                               Set as Default
                             </button>
                           )}
                           <button onClick={() => setEditingTemplate(null)} className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                             <X size={20} />
                           </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Friendly Name</label>
                          <input 
                            value={editingTemplate.name}
                            onChange={e => {
                              const updated = { ...editingTemplate, name: e.target.value };
                              setEditingTemplate(updated);
                              handleUpdateTemplate(updated);
                            }}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                            placeholder="e.g. Welcome Series"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Assign to Trigger</label>
                          <select 
                            value={editingTemplate.trigger}
                            onChange={e => {
                              const updated = { ...editingTemplate, trigger: e.target.value };
                              setEditingTemplate(updated);
                              handleUpdateTemplate(updated);
                            }}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                          >
                            {AUTOMATION_TRIGGERS.map(trig => (
                              <option key={trig} value={trig}>{trig}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                          <div className="flex flex-wrap gap-1.5">
                            {TEMPLATE_VARIABLES.map(v => (
                              <button 
                                key={v.name}
                                onClick={() => insertVariable(v.name)}
                                className="px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                              >
                                {v.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <textarea 
                            id="template-editor"
                            value={editingTemplate.content}
                            onChange={e => {
                              const updated = { ...editingTemplate, content: e.target.value };
                              setEditingTemplate(updated);
                              handleUpdateTemplate(updated);
                            }}
                            className="w-full bg-slate-900 text-indigo-100 border-none rounded-3xl px-8 py-8 text-sm font-medium leading-relaxed h-[350px] resize-none shadow-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-mono"
                          />
                          <button 
                            onClick={handleImproveWithAi}
                            disabled={isAiImproving}
                            className="absolute bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center space-x-3 hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                          >
                            {isAiImproving ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            <span>{isAiImproving ? 'Gemini Optimizing...' : 'Improve with AI'}</span>
                          </button>
                        </div>
                        
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] font-bold text-amber-700 leading-normal">
                            System will automatically replace placeholders like <strong>{"{{name}}"}</strong> with real data before sending.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-slate-400 p-12 text-center group">
                      <div className="p-8 bg-white rounded-3xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-700">
                        <Mail size={56} className="text-slate-100" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Editor Inactive</h3>
                      <p className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
                        Select an existing template from the library or create a brand new automation workflow.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm space-y-12 animate-pop">
              <section>
                <div className="flex items-center space-x-3 mb-8">
                  <Palette className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-black text-slate-800">Visual Whitelabeling</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Primary Brand Accent</label>
                    <div className="flex flex-wrap gap-4">
                      {BRAND_COLORS.map(color => (
                        <button 
                          key={color}
                          onClick={() => setSettings({...settings, brandColor: color})}
                          className={`w-12 h-12 rounded-2xl transition-all border-4 ${settings.brandColor === color ? 'border-white scale-110 shadow-xl shadow-slate-200 ring-2 ring-indigo-500' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Agency Name</label>
                      <input 
                        value={profile.businessName}
                        onChange={e => setProfile({...profile, businessName: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none"
                        placeholder="Mustafa Real Estate"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-1">Whitelabel Logo URL</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none"
                        placeholder="https://your-domain.com/logo.png"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pop">
              {settings.integrations.map((int, idx) => (
                <div key={int.id} className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm group hover:border-indigo-500 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <Zap size={100} fill="currentColor" />
                  </div>
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${int.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' : 'bg-slate-100 text-slate-400'} shadow-lg`}>
                      {int.provider === 'WHATSAPP' ? <MessageSquare size={32} /> : <Smartphone size={32} />}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${int.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {int.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 relative z-10">{int.provider} Gateway</h3>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed max-w-xs relative z-10">Enable instant outreach by connecting your official business API key.</p>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="relative group">
                      <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="password"
                        placeholder="Secure API Secret"
                        value={int.apiKey}
                        onChange={e => updateIntegration(idx, e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-slate-900 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
             <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm animate-pop">
              <div className="p-10 border-b bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Permission Control</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Manage user seats and multi-tenant visibility.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95">
                  Invite Member
                </button>
              </div>
              <div className="p-8 space-y-4">
                 <TeamRow name={profile.name} email={profile.email} role={profile.role} isSelf />
                 <TeamRow name="Omar Farooq" email="omar@estate.pk" role="AGENT" />
                 <TeamRow name="Zain Malik" email="zain@estate.pk" role="VIEWER" />
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm space-y-10 animate-pop">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <DollarSign size={14} className="mr-2 text-indigo-500" />
                    Currency Baseline
                  </label>
                  <select 
                    value={settings.currency}
                    onChange={e => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="PKR">Pakistani Rupee (₨)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <Clock size={14} className="mr-2 text-indigo-500" />
                    Standard Timezone
                  </label>
                  <select 
                    value={settings.timezone}
                    onChange={e => setSettings({...settings, timezone: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="UTC+5 (Karachi)">Pakistan (GMT+5)</option>
                    <option value="UTC+0 (London)">London (GMT)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                  <Mail size={14} className="mr-2 text-indigo-500" />
                  Global Agency Signature
                </label>
                <textarea 
                  value={settings.emailSignature}
                  onChange={e => setSettings({...settings, emailSignature: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl px-8 py-6 text-sm font-bold text-slate-900 transition-all outline-none h-40 resize-none font-mono"
                  placeholder="Regards, Mustafa Team"
                />
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl shadow-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">PII Anonymization</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">Mask lead data in Gemini training logs</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSettings({...settings, isAiPrivacyEnabled: !settings.isAiPrivacyEnabled})}
                  className={`w-16 h-9 rounded-full transition-all relative shadow-inner ${settings.isAiPrivacyEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${settings.isAiPrivacyEnabled ? 'right-1.5' : 'left-1.5'}`}></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Persistence Toast */}
      {showToast && (
        <div className="fixed bottom-12 right-12 bg-slate-900 text-white px-10 py-6 rounded-[40px] shadow-2xl flex items-center space-x-5 animate-in slide-in-from-right-20 duration-500 z-50 ring-8 ring-indigo-500/10">
           <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={28} />
           </div>
           <div>
              <p className="text-base font-black">Environment Synced</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Global parameters updated across tenants.</p>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${
      active ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100/20 border border-slate-100 font-black' : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 font-bold'
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-transparent text-slate-400 group-hover:text-slate-700'}`}>
        <Icon size={20} />
      </div>
      <span className="text-xs uppercase tracking-[0.15em]">{label}</span>
    </div>
    <ChevronRight size={16} className={`transition-all ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
  </button>
);

const TeamRow = ({ name, email, role, isSelf }: any) => (
  <div className="flex items-center justify-between py-5 px-8 bg-slate-50/50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 group">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-slate-500 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-base font-black text-slate-800 flex items-center leading-none">
          {name}
          {isSelf && <span className="ml-3 text-[9px] bg-indigo-600 text-white px-2 py-1 rounded-lg uppercase font-black tracking-widest">Master</span>}
        </p>
        <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-wide">{email}</p>
      </div>
    </div>
    <div className="flex items-center space-x-6">
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-600 uppercase bg-white border border-slate-200 px-4 py-1.5 rounded-xl inline-block shadow-sm">{role}</p>
      </div>
      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={20} />
      </button>
    </div>
  </div>
);

export default Settings;
