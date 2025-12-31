
import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  Filter, 
  SortAsc, 
  Phone, 
  Zap, 
  X, 
  Loader2, 
  Sparkles,
  ChevronRight,
  Target,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  ArrowRight
} from 'lucide-react';
import { Lead, AiAnalysis } from '../types';
// Fix: Use consistent casing for AIAnalysisService to resolve TS error
import { parseLeadFromText, scoreLeadProfile } from './AIAnalysisService';

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Zainab Qureshi', phone: '0300-1234567', source: 'WHATSAPP', value: 500000, stage: 'NEW', tenant_id: 't1', created_at: '2023-10-01', ai_score: 92 },
  { id: '2', name: 'Asad Malik', phone: '0321-7654321', source: 'FACEBOOK', value: 1200000, stage: 'NEW', tenant_id: 't1', created_at: '2023-10-02', ai_score: 45 },
  { id: '3', name: 'Fatima Sheikh', phone: '0310-1112223', source: 'WEBSITE', value: 350000, stage: 'CONTACTED', tenant_id: 't1', created_at: '2023-10-01', ai_score: 78 },
  { id: '4', name: 'Haris Khan', phone: '0345-9998887', source: 'WHATSAPP', value: 2000000, stage: 'PROPOSAL', tenant_id: 't1', created_at: '2023-09-28', ai_score: 95 },
  { id: '5', name: 'Umer Farooq', phone: '0333-5554443', source: 'WALK_IN', value: 80000, stage: 'PROPOSAL', tenant_id: 't1', created_at: '2023-10-02', ai_score: 61 },
];

const STAGES = [
  { id: 'NEW', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-amber-500' },
  { id: 'PROPOSAL', title: 'Proposal Sent', color: 'bg-indigo-500' },
  { id: 'WON', title: 'Closed Won', color: 'bg-emerald-500' },
] as const;

interface LeadCardProps {
  lead: Lead;
  onScore: (id: string) => void;
  onClick: (lead: Lead) => void;
  isScoring: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onScore, onClick, isScoring }) => {
  return (
    <div 
      onClick={() => onClick(lead)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm mb-3 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            lead.source === 'WHATSAPP' ? 'bg-green-100 text-green-700' : 
            lead.source === 'FACEBOOK' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {lead.source}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onScore(lead.id); }}
            disabled={isScoring}
            className={`p-1 rounded-lg transition-colors ${
              isScoring ? 'bg-indigo-50 text-indigo-400' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isScoring ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          </button>
        </div>
        
        <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
        
        <div className="flex items-center text-xs text-slate-500 mb-2">
          <Phone size={12} className="mr-1" />
          {lead.phone}
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
          <span className="font-bold text-indigo-600 text-sm">Rs. {(lead.value / 1000).toLocaleString()}k</span>
          
          <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-all ${
            isScoring ? 'bg-indigo-100 animate-pulse' :
            (lead.ai_score || 0) > 80 ? 'bg-emerald-50 text-emerald-600' : 
            (lead.ai_score || 0) > 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <Sparkles size={10} className={isScoring ? 'animate-bounce' : ''} fill="currentColor" />
            <span className="text-[10px] font-bold">{isScoring ? '...' : (lead.ai_score || '??')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadDetailsDrawer = ({ 
  lead, 
  onClose, 
  onScore, 
  isScoring 
}: { 
  lead: Lead | null, 
  onClose: () => void, 
  onScore: (id: string) => void,
  isScoring: boolean
}) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{lead.stage.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* AI Score Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <Zap size={14} className="mr-2 text-indigo-500" fill="currentColor" />
                AI Health Report
              </h3>
              <button 
                onClick={() => onScore(lead.id)}
                disabled={isScoring}
                className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center"
              >
                {isScoring ? <Loader2 size={12} className="animate-spin mr-1" /> : <TrendingUp size={12} className="mr-1" />}
                {isScoring ? 'Recalculating...' : 'Refresh Score'}
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={80} />
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Conversion Probability</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-black">{lead.ai_score || '??'}</span>
                    <span className="text-xl font-bold text-indigo-400">/ 100</span>
                  </div>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                    (lead.ai_score || 0) > 80 ? 'bg-emerald-500/20 text-emerald-400' : 
                    (lead.ai_score || 0) > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {lead.ai_score && lead.ai_score > 80 ? 'Hot Lead' : lead.ai_score && lead.ai_score > 50 ? 'Warm Intent' : 'Needs Nurturing'}
                  </div>
                </div>

                {lead.ai_analysis && (
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center min-w-[100px]">
                    <p className="text-[10px] text-indigo-200 font-bold uppercase mb-1">Sentiment</p>
                    <span className="text-lg font-black">{lead.ai_analysis.sentiment}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Detailed AI Insights */}
          {lead.ai_analysis ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center">
                  <Target size={16} className="mr-2 text-indigo-500" />
                  Intent Summary
                </h4>
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{lead.ai_analysis.summary}"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                  <Sparkles size={16} className="mr-2 text-amber-500" />
                  Key Behavioral Insights
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {lead.ai_analysis.key_points.map((pt, i) => (
                    <div key={i} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <CheckCircle2 size={16} className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-600 font-medium leading-tight">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Recommended Next Step</h4>
                </div>
                <p className="text-indigo-50 text-xs font-bold leading-snug">
                  {lead.ai_analysis.next_action}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Zap size={32} className="mx-auto text-slate-300 mb-4" />
              <p className="text-sm text-slate-500 font-medium">Deep analysis pending.</p>
              <button 
                onClick={() => onScore(lead.id)}
                className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
              >
                Generate insights with Gemini
              </button>
            </div>
          )}

          {/* Basic Info Details */}
          <section className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Lead Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                <div className="flex items-center text-sm font-bold text-slate-800">
                  <Phone size={14} className="mr-2 text-slate-300" />
                  {lead.phone}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deal Value</p>
                <div className="flex items-center text-sm font-bold text-indigo-600">
                  <DollarSign size={14} className="mr-2 text-slate-300" />
                  PKR {lead.value.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead Source</p>
                <div className="flex items-center text-sm font-bold text-slate-800">
                  <MessageSquare size={14} className="mr-2 text-slate-300" />
                  {lead.source}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Created Date</p>
                <div className="flex items-center text-sm font-bold text-slate-800">
                  <Calendar size={14} className="mr-2 text-slate-300" />
                  {lead.created_at}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-slate-50 flex items-center space-x-3">
          <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
            <MessageSquare size={18} />
            <span>Open in Inbox</span>
          </button>
          <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2">
            <TrendingUp size={18} />
            <span>Update Stage</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scoringIds, setScoringIds] = useState<Set<string>>(new Set());
  const [aiInput, setAiInput] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    value: 0,
    source: 'WHATSAPP',
    stage: 'NEW'
  });

  const handleScoreLead = async (id: string) => {
    const leadToScore = leads.find(l => l.id === id);
    if (!leadToScore) return;

    setScoringIds(prev => new Set(prev).add(id));
    try {
      const analysis = await scoreLeadProfile(leadToScore);
      setLeads(prev => prev.map(l => 
        l.id === id ? { ...l, ai_score: analysis.score, ai_analysis: analysis } : l
      ));
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
      alert("Failed to parse text. Please try manual entry.");
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'New Lead',
      phone: formData.phone || '',
      value: formData.value || 0,
      source: formData.source || 'WHATSAPP',
      stage: formData.stage || 'NEW',
      tenant_id: 't1',
      created_at: new Date().toISOString().split('T')[0],
      ai_score: formData.ai_score || 0
    };
    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', value: 0, source: 'WHATSAPP', stage: 'NEW', ai_score: 0 });
  };

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Pipeline</h1>
          <p className="text-slate-500">Manage your deals through different stages.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
            <SortAsc size={18} />
          </button>
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
              <span className="text-xs font-bold text-slate-400">
                Rs. {(leads.filter(l => l.stage === stage.id).reduce((sum, l) => sum + l.value, 0) / 1000).toLocaleString()}k
              </span>
            </div>
            
            <div className="flex-1 bg-slate-100/50 rounded-xl p-3 kanban-column border-2 border-dashed border-transparent hover:border-slate-200 transition-all overflow-y-auto">
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onScore={handleScoreLead} 
                  onClick={(l) => setSelectedLeadId(l.id)}
                  isScoring={scoringIds.has(lead.id)} 
                />
              ))}
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, stage: stage.id }));
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
      <LeadDetailsDrawer 
        lead={selectedLead} 
        onClose={() => setSelectedLeadId(null)} 
        onScore={handleScoreLead}
        isScoring={!!selectedLead && scoringIds.has(selectedLead.id)}
      />

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Add New Lead</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <label className="flex items-center text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  <Sparkles size={14} className="mr-2" />
                  Quick AI Scan
                </label>
                <div className="flex gap-2">
                  <textarea 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Paste WhatsApp message or notes here..."
                    className="flex-1 bg-white border border-indigo-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
                  />
                  <button 
                    onClick={handleAiScan}
                    disabled={isAiScanning || !aiInput.trim()}
                    className="bg-indigo-600 text-white px-4 rounded-lg font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    {isAiScanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <input 
                      type="text" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Value (PKR)</label>
                    <input 
                      type="number" required
                      value={formData.value || ''}
                      onChange={e => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">AI Score Suggestion</label>
                    <div className="flex items-center space-x-2">
                       <input 
                        type="number"
                        value={formData.ai_score || ''}
                        onChange={e => setFormData({...formData, ai_score: parseInt(e.target.value) || 0})}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm bg-indigo-50 text-indigo-700 font-bold outline-none"
                      />
                      <Sparkles size={16} className="text-indigo-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg transition-all">Save Lead</button>
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
