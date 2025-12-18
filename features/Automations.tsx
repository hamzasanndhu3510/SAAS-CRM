
import React from 'react';
import { 
  Zap, 
  Plus, 
  ToggleLeft, 
  ToggleRight, 
  MoreVertical,
  Clock,
  MessageSquare,
  ArrowRight,
  Mail
} from 'lucide-react';

const RULES = [
  { id: '1', name: 'Welcome Message', trigger: 'Lead Created', action: 'Send WhatsApp Template', active: true, channel: 'WhatsApp' },
  { id: '2', name: 'Follow up (2 days)', trigger: 'No response after 48h', action: 'Notify Agent', active: true, channel: 'Slack' },
  { id: '3', name: 'Stage Move Notification', trigger: 'Pipeline Stage: Won', action: 'Send SMS Payment Link', active: false, channel: 'SMS' },
];

const Automations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Automations</h1>
          <p className="text-slate-500">Put your repetitive CRM tasks on autopilot.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2">
          <Plus size={18} />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white">
           <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Zap size={24} fill="white" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-wider">Premium Feature</span>
           </div>
           <h3 className="text-xl font-bold mb-2">AI Sales Assistant</h3>
           <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
             Gemini-powered bot that qualifies leads on WhatsApp automatically before notifying your agents.
           </p>
           <button className="w-full bg-white text-indigo-600 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
              Configure AI Bot
           </button>
        </div>

        {RULES.map(rule => (
          <div key={rule.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800">{rule.name}</h3>
              <div className="flex items-center space-x-2">
                <button className="text-slate-400 group-hover:text-slate-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
               <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                     <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">When</p>
                    <p className="text-slate-700 font-medium">{rule.trigger}</p>
                  </div>
               </div>
               
               <div className="flex justify-center ml-4">
                  <ArrowRight size={14} className="text-slate-300 rotate-90" />
               </div>

               <div className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Then</p>
                    <p className="text-slate-700 font-medium">{rule.action}</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
               <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className="text-xs font-medium text-slate-500">{rule.active ? 'Active' : 'Paused'}</span>
               </div>
               <button className="text-indigo-600 hover:text-indigo-800">
                  {rule.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
               </button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all group">
           <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
              <Plus size={24} />
           </div>
           <span className="font-bold text-sm">Add New Rule</span>
        </button>
      </div>
    </div>
  );
};

export default Automations;
