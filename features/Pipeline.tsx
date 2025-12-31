
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
  Trash2
} from 'lucide-react';
import { Lead } from '../types';
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
  const [scoringIds, setScoringIds] = useState<Set<string>>(new Set());
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  
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

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: formData.id || Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Unnamed Lead',
      phone: formData.phone || '',
      value: Number(formData.value) || 0,
      source: formData.source || 'WHATSAPP',
      stage: formData.stage || 'NEW',
      tenant_id: 'user-tenant',
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
      ai_score: formData.ai_score || 0,
      ai_analysis: formData.ai_analysis
    };
    DataService.saveLead(newLead);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', value: 0, source: 'WHATSAPP', stage: 'NEW' });
    refreshData();
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

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Pipeline</h1>
          <p className="text-slate-500">Add and manage your own leads here.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2 transition-all"
          >
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
                <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                <h3 className="font-bold text-slate-700 text-sm">{stage.title}</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {leads.filter(l => l.stage === stage.id).length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100/50 rounded-xl p-3 border-2 border-dashed border-transparent hover:border-slate-200 transition-all overflow-y-auto">
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm mb-3 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {lead.source}
                    </span>
                    <div className="flex items-center space-x-1 text-indigo-600 font-bold text-[10px]">
                      <Sparkles size={10} fill="currentColor" />
                      <span>{lead.ai_score || '--'}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
                  <p className="text-xs text-slate-500">Rs. {lead.value.toLocaleString()}</p>
                </div>
              ))}
              <button 
                onClick={() => {
                  setFormData({ ...formData, stage: stage.id });
                  setIsModalOpen(true);
                }}
                className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all text-xs font-medium mt-2 border border-transparent hover:border-indigo-100"
              >
                <Plus size={14} className="mr-1" />
                Add Lead
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
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold">{selectedLead.name}</h2>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleDeleteLead(selectedLead.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-full">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setSelectedLeadId(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Update Stage</h3>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => updateLeadStage(selectedLead, s.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedLead.stage === s.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Gemini Insights</h3>
                  <button onClick={() => handleScoreLead(selectedLead.id)} className="text-[10px] font-bold text-indigo-600 flex items-center">
                    <Zap size={12} className="mr-1" />
                    {scoringIds.has(selectedLead.id) ? 'Calculating...' : 'Run Analysis'}
                  </button>
                </div>
                
                {selectedLead.ai_analysis ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                        <p className="text-2xl font-black text-indigo-600">{selectedLead.ai_score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sentiment</p>
                        <p className="text-sm font-bold text-slate-700">{selectedLead.ai_analysis.sentiment}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{selectedLead.ai_analysis.summary}"</p>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Next Step</p>
                      <p className="text-xs font-bold text-emerald-600">{selectedLead.ai_analysis.next_action}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Sparkles size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500">Run analysis to see lead potential.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold">New Custom Deal</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <label className="text-xs font-bold text-indigo-700 uppercase mb-2 block">AI Fast Parse</label>
                <div className="flex gap-2">
                  <textarea 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Paste a WhatsApp message snippet here..."
                    className="flex-1 bg-white border border-indigo-200 rounded-lg p-3 text-sm h-16 resize-none"
                  />
                  <button onClick={handleAiScan} disabled={isAiScanning} className="bg-indigo-600 text-white px-4 rounded-lg flex flex-col items-center justify-center">
                    {isAiScanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span className="text-[10px] font-bold mt-1">Scan</span>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSaveLead} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Lead Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Value (PKR)</label>
                  <input type="number" required value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="py-2 bg-indigo-600 text-white rounded-xl font-bold">Save Deal</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
