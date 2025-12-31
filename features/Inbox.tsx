
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile,
  Zap,
  Loader2,
  TrendingUp,
  MessageSquare,
  PlusCircle
} from 'lucide-react';
// Fixed casing for import to match the standard AiAnalysisService.ts
import { analyzeLeadConversation } from './AiAnalysisService';
import { Message, AiAnalysis, Lead } from '../types';
import { DataService } from '../services/DataService';
import { Link } from 'react-router-dom';

const Inbox: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    const loadedLeads = DataService.getLeads();
    setLeads(loadedLeads);
    if (loadedLeads.length > 0) setSelectedLeadId(loadedLeads[0].id);
  }, []);

  const activeLead = useMemo(() => leads.find(l => l.id === selectedLeadId), [leads, selectedLeadId]);
  
  const messages = useMemo(() => {
    return selectedLeadId ? DataService.getMessages(selectedLeadId) : [];
  }, [selectedLeadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedLeadId) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      lead_id: selectedLeadId,
      content: messageText,
      type: 'OUTBOUND',
      channel: 'WHATSAPP',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tenant_id: 'user-tenant'
    };

    DataService.addMessage(newMsg);
    setMessageText('');
  };

  const handleAnalyze = async () => {
    if (!activeLead) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeLeadConversation(messages, activeLead.name);
      DataService.saveLead({ ...activeLead, ai_analysis: result, ai_score: result.score });
      setLeads(DataService.getLeads());
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -m-6 bg-white overflow-hidden border border-slate-200">
      {/* Sidebar */}
      <div className="w-80 md:w-96 border-r flex flex-col h-full bg-slate-50/30">
        <div className="p-4 bg-white border-b">
          <h2 className="text-xl font-bold text-slate-800">Your Leads</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {leads.length > 0 ? (
            leads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`flex items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors border-b ${
                  selectedLeadId === lead.id ? 'bg-indigo-50 border-r-4 border-r-indigo-500' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                  {lead.name.charAt(0)}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <h3 className="text-sm font-bold truncate">{lead.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{lead.phone}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center space-y-4">
              <MessageSquare size={32} className="mx-auto text-slate-300 opacity-50" />
              <p className="text-xs text-slate-500">No leads available for chatting.</p>
              <Link to="/pipeline" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:underline">
                <PlusCircle size={14} className="mr-1" />
                Add Lead
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50">
        {activeLead ? (
          <>
            <div className="h-16 bg-white border-b flex items-center justify-between px-6 z-10 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">{activeLead.name}</h3>
              <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                <Zap size={20} fill={showInfo ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.type === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      msg.type === 'OUTBOUND' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      <p>{msg.content}</p>
                      <span className="text-[10px] opacity-70 mt-1 block">{msg.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-2">
                   <MessageSquare size={48} />
                   <p className="text-sm italic">Send your first message to {activeLead.name}.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex space-x-3">
              <input 
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Simulate a message..." 
                className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
             <p>Select a lead from the sidebar to tinker with messages.</p>
          </div>
        )}
      </div>

      {/* Info Sidebar */}
      {showInfo && activeLead && (
        <div className="w-80 border-l bg-white flex flex-col p-6 overflow-y-auto">
          <h2 className="font-bold mb-6 flex items-center">
            <Zap size={18} className="mr-2 text-indigo-600" fill="currentColor" />
            AI Scorecard
          </h2>

          {!activeLead.ai_analysis && !isAnalyzing ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed">
              <p className="text-xs text-slate-500 mb-4">Run Gemini analysis on this conversation.</p>
              <button onClick={handleAnalyze} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">
                Analyze Conversation
              </button>
            </div>
          ) : isAnalyzing ? (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Scanning Intent...</p>
            </div>
          ) : activeLead.ai_analysis && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-800">{activeLead.ai_score}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Conversion Potential</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-xs italic">
                {activeLead.ai_analysis.summary}
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                Next: {activeLead.ai_analysis.next_action}
              </div>
              <button onClick={handleAnalyze} className="w-full py-2 border text-slate-400 text-xs font-bold rounded-lg hover:text-indigo-600">
                Refresh Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
