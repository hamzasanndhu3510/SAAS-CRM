
import React from 'react';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', leads: 40 },
  { name: 'Tue', leads: 30 },
  { name: 'Wed', leads: 65 },
  { name: 'Thu', leads: 45 },
  { name: 'Fri', leads: 90 },
  { name: 'Sat', leads: 55 },
  { name: 'Sun', leads: 30 },
];

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
      <span className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </span>
    </div>
    <p className="text-xs text-slate-400 mt-2">{subtext}</p>
  </div>
);

// Fix: Use regular function and import Zap to resolve type errors
const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Khush Amdeed, Mustafa! 👋</h1>
          <p className="text-slate-500">Here's what's happening in your CRM today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white border px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">
            <Calendar size={16} />
            <span>Last 7 Days</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors">
            + New Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Leads" 
          value="2,451" 
          subtext="From Facebook, WhatsApp & Web" 
          icon={Users} 
          trend={12} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Conversion Rate" 
          value="18.5%" 
          subtext="Active in your pipeline" 
          icon={TrendingUp} 
          trend={4} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="WhatsApp Responses" 
          value="982" 
          subtext="Messages received today" 
          icon={MessageCircle} 
          trend={-2} 
          color="bg-sky-500" 
        />
        <StatCard 
          title="Expected Revenue" 
          value="Rs. 4.2M" 
          subtext="Potential deal value" 
          icon={DollarSign} 
          trend={8} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Lead Flow Analysis</h2>
            <div className="flex space-x-2">
               <span className="flex items-center space-x-1 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>New Leads</span>
               </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Market Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Real Estate', value: 45, color: 'bg-indigo-500' },
              { label: 'Ecommerce', value: 30, color: 'bg-sky-500' },
              { label: 'Consulting', value: 15, color: 'bg-emerald-500' },
              { label: 'Other', value: 10, color: 'bg-slate-300' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
             <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                <Zap size={16} fill="currentColor" />
                <span className="text-sm font-bold">AI Recommendation</span>
             </div>
             <p className="text-xs text-indigo-600 leading-relaxed">
               Your lead response time on WhatsApp is 14 mins. Reduce it to under 5 mins to increase conversion by 22% for Real Estate deals.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
