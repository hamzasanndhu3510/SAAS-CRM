
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './features/Dashboard';
import Pipeline from './features/Pipeline';
import Inbox from './features/Inbox';
import Contacts from './features/Contacts';
import Automations from './features/Automations';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  MessageSquare, 
  Zap, 
  CreditCard, 
  Settings,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Navbar = ({ tenantName }: { tenantName: string }) => (
  <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search size={18} />
        </span>
        <input 
          type="text" 
          placeholder="Search leads, contacts..." 
          className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-lg text-sm transition-all outline-none w-64 md:w-96"
        />
      </div>
    </div>
    
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>WhatsApp API: Connected</span>
      </div>
      
      <button className="relative text-slate-500 hover:text-slate-700">
        <Bell size={22} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
      </button>

      <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">Mustafa Ahmed</p>
          <p className="text-xs text-slate-500 capitalize">{tenantName}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          MA
        </div>
        <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
      </div>
    </div>
  </header>
);

// Fix: Use React.FC with optional children to ensure correct type inference during component usage
const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Mock Tenant
  const tenant = { name: "Ahmed Real Estate Lahore", id: "tenant-786" };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col h-full z-30">
        <div className="p-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-black italic">P</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">PakCRM<span className="text-indigo-600">Pro</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={path === '/'} />
          <SidebarItem to="/pipeline" icon={Kanban} label="Pipeline" active={path === '/pipeline'} />
          <SidebarItem to="/inbox" icon={MessageSquare} label="Inbox" active={path === '/inbox'} />
          <SidebarItem to="/contacts" icon={Users} label="Contacts" active={path === '/contacts'} />
          <SidebarItem to="/automations" icon={Zap} label="Automations" active={path === '/automations'} />
          <SidebarItem to="/payments" icon={CreditCard} label="Payments" active={path === '/payments'} />
        </nav>

        <div className="p-4 border-t">
          <SidebarItem to="/settings" icon={Settings} label="Settings" active={path === '/settings'} />
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700 font-medium">
             Plan: Business Pro
             <div className="mt-1 w-full bg-indigo-200 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-3/4"></div>
             </div>
             <p className="mt-1 opacity-70">75% leads used</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar tenantName={tenant.name} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Fix: Use regular function component to avoid issues with standard component instantiation in some environments
const App = () => {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
};

export default App;
