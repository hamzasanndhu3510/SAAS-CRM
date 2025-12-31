
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  SortAsc, 
  Phone, 
  Zap, 
  X, 
  Loader2, 
  Sparkles,
  Target,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  Trash2,
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Lead, AiAnalysis } from '../types';
// Standardized casing for import to resolve the casing collision error
import { parseLeadFromText, scoreLeadProfile } from './AIAnalysisService';
import { DataService } from '../services/DataService';

const STAGES = [
  { id: 'NEW', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-amber-500' },
  { id: 'PROPOSAL', title: 'Proposal Sent', color: 'bg-indigo-500' },
  { id: 'WON', title: 'Closed Won', color: 'bg-emerald-500' },
] as const;

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scoringIds, setScoringIds] = useState<Set<string>>(new Set());
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    value: 0,
    source: 'WHATSAPP',
    stage: 'NEW'
  });

  useEffect(() => {
    setLeads(DataService.getLeads());
  }, []);

  const refreshData = () => {
    setLeads(DataService.getLeads());
  };

  const handleScoreLead = async (id: string) => {
    const leadToScore = leads.find(l => l.id === id);
    if (!leadToScore) return;

    setScoringIds(prev => new Set(prev).add(id));
    try {
      const analysis = await scoreLeadProfile(leadToScore);
      const updatedLead = { ...leadToScore, ai_score: analysis.score, ai_analysis: analysis };
      DataService.saveLead(updatedLead);
      refreshData();
    } catch (err) {
      console.error("Scoring failed", err);
    } finally {
      setScoringIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleAiScan = async () => {
    if (!aiInput.trim()) return;
    setIsAiScanning(true);
    try {
      const parsedData = await parseLeadFromText(aiInput);
      setFormData(prev => ({ ...prev, ...parsedData }));
      setAiInput("");
    } catch (err) {
      console.error("AI Scan failed", err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const baseLead: Partial<Lead> = {
        name: formData.name || 'Unnamed Lead',
        phone: formData.phone || '',
        value: Number(formData.value) || 0,
        source: formData.source || 'WHATSAPP',
        stage: formData.stage || 'NEW',
        tenant_id: 'user-tenant',
        created_at: new Date().toISOString().split('T')[0],
      };

      // Automatically generate funnel analysis and email
      const aiInsights = await scoreLeadProfile(baseLead);

      const finalLead: Lead = {
        ...baseLead as Lead,
        id: Math.random().toString(36).substr(2, 9),
        ai_score: aiInsights.score,
        ai_analysis: aiInsights
      };

      DataService.saveLead(finalLead);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', value: 0, source: 'WHATSAPP', stage: 'NEW' });
      refreshData();
      setSelectedLeadId(finalLead.id); 
    } catch (err) {
      console.error("Lead saving failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Delete this lead?")) {
      DataService.deleteLead(id);
      setSelectedLeadId(null);
      refreshData();
    }
  };

  const updateLeadStage = (lead: Lead, newStage: any) => {
    DataService.saveLead({ ...lead, stage: newStage });
    refreshData();
  };

  const copyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Pipeline</h1>
          <p className="text-slate-500">Managing {leads.length} active opportunities.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center space-x-2 overflow-hidden animate-pulse-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={18} />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-x-auto gap-6 pb-6 scrollbar-hide">
        {STAGES.map((stage) => (
          <div key={stage.id} className="min-w-[300px] flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-sm animate-pulse`}></div>
                <h3 className="font-bold text-slate-700 text-[11px] uppercase tracking-[0.15em]">{stage.title}</h3>
                <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {leads.filter(l => l.stage === stage.id).length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100/40 rounded-3xl p-3 border-2 border-dashed border-slate-200/50 hover:border-indigo-200 transition-all overflow-y-auto scrollbar-hide">
              {leads.filter(l => l.stage === stage.id).map((lead, idx) => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-3 cursor-pointer hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50 transition-all p-4 group animate-pop"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {lead.source}
                    </span>
                    <div className="flex items-center space-x-1 text-indigo-600 font-black text-[10px]">
                      <Sparkles size={10} fill="currentColor" />
                      <span>{lead.ai_score || '--'}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-700 transition-colors">{lead.name}</h4>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                    <p className="text-xs font-black text-slate-400 tracking-tight">Rs. {lead.value.toLocaleString()}</p>
                    {lead.ai_analysis?.closing_probability && (
                      <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        <TrendingUp size={10} className="mr-1" />
                        {lead.ai_analysis.closing_probability}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  setFormData({ ...formData, stage: stage.id });
                  setIsModalOpen(true);
                }}
                className="w-full py-4 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest mt-2 border border-transparent hover:border-indigo-100"
              >
                <Plus size={14} className="mr-2" />
                Quick Entry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedLeadId(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-none">{selectedLead.name}</h2>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedLead.stage}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-400">Created {new Date(selectedLead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleDeleteLead(selectedLead.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setSelectedLeadId(null)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {/* Funnel Section */}
              <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Closing Probability (Post-Reply)</h3>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-5xl font-black">{selectedLead.ai_analysis?.closing_probability || '??'}</span>
                          <span className="text-indigo-500 font-black text-xl">%</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-inner">
                         <Target size={28} className="text-emerald-400" />
                      </div>
                   </div>
                   <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-1000 ease-out" 
                        style={{ width: `${selectedLead.ai_analysis?.closing_probability || 0}%` }}
                      ></div>
                   </div>
                   <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                      <span>Low Chance</span>
                      <span>High Intent</span>
                   </div>
                 </div>
              </section>

              {/* Email Outreach Section */}
              {selectedLead.ai_analysis?.personalized_email && (
                <section className="animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <Mail size={16} className="mr-2 text-indigo-600" />
                      Personalized AI Outreach
                    </h3>
                    <button 
                      onClick={() => copyEmail(selectedLead.ai_analysis?.personalized_email || '')}
                      className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full flex items-center hover:bg-indigo-100 transition-all"
                    >
                      {copied ? <CheckCircle size={14} className="mr-1.5 text-emerald-600" /> : <Copy size={14} className="mr-1.5" />}
                      {copied ? 'Copied!' : 'Copy Template'}
                    </button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:bg-white hover:border-indigo-100 transition-all">
                    <pre className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedLead.ai_analysis.personalized_email}
                    </pre>
                  </div>
                </section>
              )}

              <section className="animate-slide-up">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Pipeline Action</h3>
                <div className="grid grid-cols-2 gap-3">
                  {STAGES.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => updateLeadStage(selectedLead, s.id)}
                      className={`px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                        selectedLead.stage === s.id 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-pop">
            <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">New Deal Entry</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">SaaS Multi-Tenant Onboarding</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              {/* Form */}
              <form onSubmit={handleSaveLead} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Lead Information (White Field)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Target size={20} />
                      </div>
                      <input 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-2xl pl-14 pr-4 py-4 text-sm font-bold text-slate-900 transition-all outline-none" 
                        placeholder="Client Name (e.g. Zain Malik)"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Phone</label>
                    <input 
                      required 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 transition-all outline-none" 
                      placeholder="03xx-xxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Price (PKR)</label>
                    <input 
                      type="number" 
                      required 
                      value={formData.value || ''} 
                      onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
                      className="w-full bg-white border-2 border-slate-100 focus:border-indigo-