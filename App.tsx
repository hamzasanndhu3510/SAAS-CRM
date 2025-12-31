
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './features/Dashboard';
import Pipeline from './features/Pipeline';
import Inbox from './features/Inbox';
import Contacts from './features/Contacts';
import Automations from './features/Automations';
import Settings from './features/Settings';
import { AuthService } from './services/AuthService';
import { UserProfile } from './types';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  MessageSquare, 
  Zap, 
  CreditCard, 
  Settings as SettingsIcon,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Building,
  Mail,
  X,
  ShieldCheck
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [profile, setProfile] = useState<UserProfile>(AuthService.getProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col h-full z-30 shadow-sm">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black italic">P</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">PakCRM<span className="text-indigo-600">Pro</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={path === '/'} />
          <SidebarItem to="/pipeline" icon={Kanban} label="Pipeline" active={path === '/pipeline'} />
          <SidebarItem to="/inbox" icon={MessageSquare} label="Inbox" active={path === '/inbox'} />
          <SidebarItem to="/contacts" icon={Users} label="Contacts" active={path === '/contacts'} />
          <SidebarItem to="/automations" icon={Zap} label="Automations" active={path === '/automations'} />
          <SidebarItem to="/payments" icon={CreditCard} label="Payments" active={path === '/payments'} />
          <SidebarItem to="/settings" icon={SettingsIcon} label="Settings" active={path === '/settings'} />
        </nav>

        <div className="p-4 border-t">
          <div className="p-4 bg-indigo-50 rounded-2xl text-xs text-indigo-700 font-medium border border-indigo-100/50">
             <p className="font-bold opacity-80 uppercase tracking-wider text-[10px] mb-2">Subscription</p>
             <p className="mb-2">Business Pro Plan</p>
             <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden mb-1">
                <div className="bg-indigo-600 h-full w-3/4"></div>
             </div>
             <p className="opacity-70">1,450 / 2,000 leads</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Search leads, contacts..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all outline-none w-64 md:w-96"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Live API: OK</span>
            </div>
            
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>

            {/* Account Profile Button */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 pl-4 border-l border-slate-200 profile-btn focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-tight">{profile.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.businessName}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${profile.avatarColor} flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-100 transition-transform hover:scale-105`}>
                  {initials}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
                    </div>
                    <Link 
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                    >
                      <User size={16} className="mr-3" />
                      Account Settings
                    </Link>
                    <div className="border-t border-slate-50 mt-1 pt-1">
                      <button 
                        onClick={() => AuthService.logout()}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

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
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
};

export default App;
