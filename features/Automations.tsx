
import React, { useState } from 'react';
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
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Target
} from 'lucide-react';

const INITIAL_RULES = [
  { 
    id: '1', 
    name: 'Welcome Message', 
    trigger: 'Lead Created', 
    action: 'Send WhatsApp Template', 
    active: true, 
    type: 'STANDARD',
    channel: 'WhatsApp' 
  },
  { 
    id: '4', 
    name: 'Lead Rescue Bot', 
    trigger: 'AI Score drops > 15%', 
    action: 'Notify Senior Manager', 
    active: true, 
    type: 'SMART',
    channel: 'Slack' 
  },
  { 
    id: '2', 
    name: 'Follow up (2 days)', 
    trigger: 'No response after 48h', 
    action: 'Notify Agent', 
    active: true, 
    type: 'STANDARD',
    channel: 'Internal' 
  },
  { 
    id: '5', 
    name: 'High Potential Alert', 
    trigger: 'AI Score crosses 90', 
    action: 'Move to Priority Lane', 
    active: true, 
    type: 'SMART',
    channel: 'Pipeline' 
  },
];

const Automations: React.FC = () => {
  const [rules, setRules] = useState(INITIAL_RULES);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Automations</h1>
          <p className="text-slate-500">Put your repetitive CRM tasks on autopilot.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2 transition-all">
          <Plus size={18} />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Featured AI Config Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
             <Sparkles size={160} />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                   <Zap size={28} fill="white" className="text-white" />
                </div>
                <div>
                   <span className="text-xs font-black bg-indigo-400/30 text-indigo-100 px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-400/20">Pro Engine</span>
                   <h2 className="text-2xl font-black">AI Lead Sentiment Monitor</h2>
                </div>
              </div>
              
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-xl">
                Our Gemini-powered engine monitors your WhatsApp conversations 24/7. When a lead's intent changes from "Curious" to "Urgent", PakCRM Pro automatically triggers your team.
              </p>
              
              <div className="flex flex-wrap gap-4">
                 <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    Configure Smart Triggers
                 </button>
                 <button className="bg-indigo-500/30 border border-indigo-400/30 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500/50 transition-all">
                    View AI Logs
                 </button>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Efficiency Score</h3>
            <p className="text-4xl font-black text-indigo-600 my-2">84%</p>
            <p className="text-sm text-slate-500">Your automations saved <span className="font-bold text-slate-700">12 hours</span> of manual work this week.</p>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
          <Target size={18} className="mr-2" />
          Active Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map(rule => (
            <div key={rule.id} className={`bg-white p-6 rounded-2xl border transition-all flex flex-col group ${
              rule.type === 'SMART' ? 'border-indigo-100 ring-4 ring-indigo-50/50' : 'border-slate-200 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                   <h3 className="font-bold text-slate-800">{rule.name}</h3>
                   {rule.type === 'SMART' && (
                     <div className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded uppercase flex items-center">
                       <Sparkles size={8} className="mr-1" fill="white" />
                       Smart
                     </div>
                   )}
                </div>
                <button className="text-slate-400 group-hover:text-slate-600 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <div className="flex-1 space-y-4 mb-6">
                 <div className="flex items-center space-x-3 text-sm">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      rule.type === 'SMART' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                       {rule.type === 'SMART' ? (
                          rule.name.includes('Rescue') ? <TrendingDown size={18} /> : <TrendingUp size={18} />
                       ) : <Clock size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trigger</p>
                      <p className="text-slate-700 font-bold">{rule.trigger}</p>
                    </div>
                 </div>
                 
                 <div className="flex ml-4">
                    <ArrowRight size={14} className="text-slate-300 rotate-90" />
                 </div>

                 <div className="flex items-center space-x-3 text-sm">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      rule.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                       <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Action</p>
                      <p className="text-slate-700 font-bold">{rule.action}</p>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                 <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{rule.active ? 'Monitoring' : 'Paused'}</span>
                 </div>
                 <button 
                  onClick={() => toggleRule(rule.id)}
                  className="transition-colors"
                >
                    {rule.active ? (
                      <ToggleRight size={32} className="text-indigo-600" />
                    ) : (
                      <ToggleLeft size={32} className="text-slate-300" />
                    )}
                 </button>
              </div>
            </div>
          ))}

          <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all group min-h-[250px]">
             <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                <Plus size={28} />
             </div>
             <span className="font-bold text-sm">Add New Workflow</span>
             <p className="text-xs mt-2 opacity-60">Custom triggers & actions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Automations;
