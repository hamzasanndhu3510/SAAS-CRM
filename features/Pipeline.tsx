
import React, { useState } from 'react';
import { MoreHorizontal, Plus, Filter, SortAsc, MapPin, Phone, Zap } from 'lucide-react';
import { Lead } from '../types';

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
];

// Fix: Use React.FC to allow standard React props like 'key' in mapped components
const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-3 cursor-move hover:border-indigo-400 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        lead.source === 'WHATSAPP' ? 'bg-green-100 text-green-700' : 
        lead.source === 'FACEBOOK' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
      }`}>
        {lead.source}
      </span>
      <button className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <h4 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h4>
    <div className="flex items-center text-xs text-slate-500 mb-2">
       <Phone size={12} className="mr-1" />
       {lead.phone}
    </div>
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
      <span className="font-bold text-indigo-600 text-sm">Rs. {(lead.value / 1000).toFixed(0)}k</span>
      {lead.ai_score && (
        <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded ${
          lead.ai_score > 80 ? 'bg-emerald-50 text-emerald-600' : 
          lead.ai_score > 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <Zap size={10} fill="currentColor" />
          <span className="text-[10px] font-bold">{lead.ai_score}</span>
        </div>
      )}
    </div>
  </div>
);

// Fix: Use regular function to avoid potential children-related type issues in standard usage
const Pipeline = () => {
  const [leads] = useState<Lead[]>(INITIAL_LEADS);

  return (
    <div className="flex flex-col h-full space-y-6">
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
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2">
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
                Rs. {(leads.filter(l => l.stage === stage.id).reduce((sum, l) => sum + l.value, 0) / 1000).toFixed(0)}k
              </span>
            </div>
            
            <div className="flex-1 bg-slate-100/50 rounded-xl p-3 kanban-column border-2 border-dashed border-transparent hover:border-slate-200 transition-all">
              {leads.filter(l => l.stage === stage.id).map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              <button className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all text-xs font-medium mt-2 border border-transparent hover:border-indigo-100">
                <Plus size={14} className="mr-1" />
                Add Lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;
