import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  ToggleLeft, 
  ToggleRight, 
  MoreVertical,
  Clock,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  X,
  Trash2
} from 'lucide-react';
import { DataService } from '../services/DataService';
import { AutomationRule } from '../types';

const Automations: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: 'Lead Created',
    action: 'Send WhatsApp Template',
    is_active: true
  });

  useEffect(() => {
    setRules(DataService.getAutomations());
  }, []);

  const refresh = () => setRules(DataService.getAutomations());

  const toggleRule = (rule: AutomationRule) => {
    const updated = { ...rule, is_active: !rule.is_active };
    DataService.saveAutomation(updated);
    refresh();
  };

  const deleteRule = (id: string) => {
    if (confirm("Delete this automation?")) {
      DataService.deleteAutomation(id);
      refresh();
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const rule: AutomationRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRule.name || 'Unnamed Workflow',
      trigger: newRule.trigger || 'Manual',
      action: newRule.action || 'Notify',
      is_active: true,
      tenant_id: 'user-tenant'
    };
    DataService.saveAutomation(rule);
    setIsModalOpen(false);
    setNewRule({ name: '', trigger: 'Lead Created', action: 'Send WhatsApp Template' });
    refresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workflows & Automations</h1>
          <p className="text-slate-500">Design your own logic to handle leads automatically.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2 transition-all"
        >
          <Plus size={18} />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
             <Sparkles size={160} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                   <Zap size={28} fill="white" />
                </div>
                <h2 className="text-2xl font-black">AI Trigger Engine</h2>
              </div>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-xl">
                Create custom rules. Gemini Pro will monitor conversations and trigger these actions based on your logic.
              </p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Efficiency</h3>
            <p className="text-4xl font-black text-indigo-600 my-2">{rules.filter(r => r.is_active).length}</p>
            <p className="text-sm text-slate-500">Active workflows currently running.</p>
        </div>
      </div>

      <div className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map(rule => (
            <div key={rule.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-800">{rule.name}</h3>
                <div className="flex space-x-1">
                  <button onClick={() => deleteRule(rule.id)} className="p-1 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-6">
                 <div className="flex items-center space-x-3 text-sm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                       <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trigger</p>
                      <p className="text-slate-700 font-bold">{rule.trigger}</p>
                    </div>
                 </div>
                 <div className="flex ml-4"><ArrowRight size={14} className="text-slate-300 rotate-90" /></div>
                 <div className="flex items-center space-x-3 text-sm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                       <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Action</p>
                      <p className="text-slate-700 font-bold">{rule.action}</p>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                 <span className="text-xs font-bold text-slate-500 uppercase">{rule.is_active ? 'Active' : 'Paused'}</span>
                 <button onClick={() => toggleRule(rule)} className="transition-colors">
                    {rule.is_active ? <ToggleRight size={32} className="text-indigo-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                 </button>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
              <Zap size={48} className="mx-auto text-slate-300 mb-4 opacity-50" />
              <p className="text-slate-500 font-medium">No automations created yet.</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">+ Build your first workflow</button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold">New Workflow</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Workflow Name</label>
                <input required value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="e.g. Welcome Series" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Trigger Event</label>
                <select value={newRule.trigger} onChange={e => setNewRule({...newRule, trigger: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-white">
                  <option>Lead Created</option>
                  <option>Stage Changed to WON</option>
                  <option>Inbound WhatsApp Message</option>
                  <option>AI Sentiment: Positive</option>
                  <option>No Contact for 2 Days</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Action to Take</label>
                <select value={newRule.action} onChange={e => setNewRule({...newRule, action: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-white">
                  <option>Send WhatsApp Template</option>
                  <option>Notify Agent via Slack</option>
                  <option>Add Tag: "Hot Lead"</option>
                  <option>Send Internal Alert</option>
                  <option>Update Stage to CONTACTED</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold">Create Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;