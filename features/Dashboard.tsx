import React, { useMemo, useEffect, useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Zap,
  PlusCircle,
  RefreshCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataService } from '../services/DataService';
import { Lead } from '../types';

const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <Icon size={24} />
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreVertical size={20} />
      </button>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline space-x-2 mt-1">
      <span className="text-2xl font-bold text-slate-800">{value}</span>
    </div>
    <p className="text-xs text-slate-400 mt-2">{subtext}</p>
  </div>
);

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(DataService.getLeads());
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter(l => l.stage === 'WON').length;
    const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : "0";
    const revenue = leads.reduce((acc, l) => acc + l.value, 0);
    
    const sources = leads.reduce((acc: any, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {});

    return { total, conversionRate, revenue, sources };
  }, [leads]);

  const chartData = useMemo(() => {
    if (leads.length === 0) return [];
    // Basic progression based on total leads count
    return [
      { name: 'Start', leads: 0 },
      { name: 'Current', leads: leads.length },
    ];
  }, [leads]);

  const handleReset = () => {
    if (confirm("This will permanently clear ALL leads, messages, and automations you have created. Continue?")) {
      DataService.clearAllData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your CRM Hub</h1>
          <p className="text-slate-500">Add data to see these charts come to life.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors border rounded-lg bg-white"
            title="Clear all data"
          >
            <RefreshCcw size={18} />
          </button>
          <Link 
            to="/pipeline" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            New Entry
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={stats.total} subtext="Manually added" icon={Users} color="bg-indigo-500" />
        <StatCard title="Conversion" value={`${stats.conversionRate}%`} subtext="Won vs Total" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Lead Origins" value={Object.keys(stats.sources).length} subtext="Unique channels" icon={MessageCircle} color="bg-sky-500" />
        <StatCard title="Booked Value" value={`Rs. ${(stats.revenue / 1000).toFixed(0)}k`} subtext="Pipeline total" icon={DollarSign} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Pipeline Growth</h2>
          {leads.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed">
              <p className="text-sm">Empty Dashboard. Go to Pipeline to add your leads.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Distribution</h2>
          <div className="space-y-4">
            {Object.keys(stats.sources).length > 0 ? (
              Object.entries(stats.sources).map(([source, count]: [string, any]) => {
                const percentage = Math.round((count / leads.length) * 100);
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span className="capitalize">{source.toLowerCase()}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-400 text-sm py-10">No lead sources to map yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;