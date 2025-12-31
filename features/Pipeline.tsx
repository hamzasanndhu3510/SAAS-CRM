
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
// Fixed casing for import to match the standard AiAnalysisService.ts
import { parseLeadFromText, scoreLeadProfile } from './AiAnalysisService';
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
      // 1. Prepare base lead
      const baseLead: Partial<Lead> = {
        name: formData.name || 'Unnamed Lead',
        phone: formData.phone || '',
        value: Number(formData.value) || 0,
        source: formData.source || 'WHATSAPP',
        stage: formData.stage || 'NEW',
        tenant_id: 'user-tenant',
        created_at: new Date().toISOString().split('T')[0],
      };

      // 2. Generate initial AI insights (Probability + Email)
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
      setSelectedLeadId(finalLead.id); // Auto-open the new lead
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
            className="group relative bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2 overflow-hidden"
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
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color} animate-pulse`}></div>
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage.title}</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {leads.filter(l => l.stage === stage.id).length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100/50 rounded-2xl p-3 border-2 border-dashed border-slate-200/50 hover:border-indigo-200 transition-all overflow-y-auto">
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm mb-3 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all p-4 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {lead.source}
                    </span>
                    <div className="flex items-center space-x-1 text-indigo-600 font-bold text-[10px]">
                      <Sparkles size={10} fill="currentColor" />
                      <span>{lead.ai_score || '--'}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs font-bold text-slate-400">Rs. {lead.value.toLocaleString()}</p>
                    {lead.ai_analysis?.closing_probability && (
                      <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
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
                className="w-full py-3 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all text-xs font-bold mt-2 border border-transparent hover:border-indigo-100"
              >
                <Plus size={14} className="mr-1" />
                Quick Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedLeadId(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">{selectedLead.name}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedLead.stage}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleDeleteLead(selectedLead.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setSelectedLeadId(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {/* Closing Funnel AI Section */}
              <section className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">AI Closing Chance</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-black">{selectedLead.ai_analysis?.closing_probability || '??'}</span>
                        <span className="text-indigo-400 font-bold">%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                       <Target size={24} className="text-emerald-400" />
                    </div>
                 </div>
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-1000" 
                      style={{ width: `${selectedLead.ai_analysis?.closing_probability || 0}%` }}
                    ></div>
                 </div>
                 <p className="text-[10px] text-indigo-200 font-medium">
                    Estimation based on source quality and Pakistan market intent benchmarks.
                 </p>
              </section>

              {/* Personalized Email Section */}
              {selectedLead.ai_analysis?.personalized_email && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <Mail size={14} className="mr-2 text-indigo-600" />
                      Personalized AI Email
                    </h3>
                    <button 
                      onClick={() => copyEmail(selectedLead.ai_analysis?.personalized_email || '')}
                      className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center hover:bg-indigo-100 transition-colors"
                    >
                      {copied ? <CheckCircle size={12} className="mr-1 text-emerald-600" /> : <Copy size={12} className="mr-1" />}
                      {copied ? 'Copied!' : 'Copy Template'}
                    </button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
                    <pre className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedLead.ai_analysis.personalized_email}
                    </pre>
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pipeline Progression</h3>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => updateLeadStage(selectedLead, s.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedLead.stage === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Lead Intelligence</h3>
                  <button onClick={() => handleScoreLead(selectedLead.id)} className="text-[10px] font-bold text-indigo-600 flex items-center">
                    <Zap size={12} className="mr-1" fill="currentColor" />
                    {scoringIds.has(selectedLead.id) ? 'Re-analyzing...' : 'Refresh AI'}
                  </button>
                </div>
                
                {selectedLead.ai_analysis ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Conversion Score</p>
                        <p className="text-2xl font-black text-slate-800">{selectedLead.ai_score}</p>
                      </div>
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase">
                        {selectedLead.ai_analysis.sentiment} SENTIMENT
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">AI Summary</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{selectedLead.ai_analysis.summary}"</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Recommended Action</p>
                      <p className="text-xs font-bold text-emerald-800">{selectedLead.ai_analysis.next_action}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Sparkles size={32} className="mx-auto text-slate-300 mb-3 opacity-50" />
                    <p className="text-sm text-slate-500 font-medium">No deep insights yet.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900">New Deal Entry</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manual & AI Onboarding</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-8">
              {/* AI Parser */}
              <div className="mb-8 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <label className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
                  <Sparkles size={14} className="mr-2" />
                  Fast AI Lead Parse
                </label>
                <div className="flex gap-3">
                  <textarea 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Paste a WhatsApp text like: 'Hi, I'm Zain from Lahore, interested in the 5M plot...'"
                    className="flex-1 bg-white border border-indigo-200 rounded-xl p-4 text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleAiScan} 
                    disabled={isAiScanning || !aiInput.trim()} 
                    className="bg-indigo-600 text-white px-5 rounded-xl flex flex-col items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold group"
                  >
                    {isAiScanning ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
                    <span className="text-[10px] mt-2 uppercase">Parse</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveLead} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Client Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Target size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300" 
                        placeholder="e.g. Hassan Ahmed"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input 
                        required 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300" 
                        placeholder="03xx-xxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deal Value (PKR)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input 
                        type="number" 
                        required 
                        value={formData.value || ''} 
                        onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300" 
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    <span>{isSaving ? 'Processing...' : 'Save & AI Onboard'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
