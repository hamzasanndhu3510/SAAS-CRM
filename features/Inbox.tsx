
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  Info,
  CheckCheck,
  Zap,
  Loader2,
  TrendingUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
// Fix: Use consistent casing for AIAnalysisService to resolve TS error
import { analyzeLeadConversation } from './AIAnalysisService';
import { Message, AiAnalysis } from '../types';

const CHATS = [
  { id: '1', name: 'Zainab Qureshi', lastMsg: 'I am interested in the DHA Phase 6 plot.', time: '2:15 PM', unread: 2, status: 'online', avatar: 'https://picsum.photos/seed/zainab/200' },
  { id: '2', name: 'Mustafa Sheikh', lastMsg: 'Please send me the payment plan.', time: '1:45 PM', unread: 0, status: 'offline', avatar: 'https://picsum.photos/seed/mustafa/200' },
  { id: '3', name: 'Eshaal Khan', lastMsg: 'Is the possession available?', time: 'Yesterday', unread: 0, status: 'online', avatar: 'https://picsum.photos/seed/eshaal/200' },
  { id: '4', name: 'Raza Malik', lastMsg: 'Thank you for the info.', time: 'Yesterday', unread: 0, status: 'offline', avatar: 'https://picsum.photos/seed/raza/200' },
];

const INITIAL_MESSAGES: Message[] = [
  { 
    id: 'm1', 
    lead_id: '1', 
    tenant_id: 't1', 
    type: 'INBOUND', 
    channel: 'WHATSAPP', 
    content: 'Salam, I saw your ad on Facebook about DHA Phase 6.', 
    timestamp: '2:10 PM' 
  },
  { 
    id: 'm2', 
    lead_id: '1', 
    tenant_id: 't1', 
    type: 'OUTBOUND', 
    channel: 'WHATSAPP', 
    content: 'Walaikum Assalam! Yes, we have some premium options available. Are you looking for a residential or commercial plot?', 
    timestamp: '2:12 PM' 
  },
  { 
    id: 'm3', 
    lead_id: '1', 
    tenant_id: 't1', 
    type: 'INBOUND', 
    channel: 'WHATSAPP', 
    content: 'Residential 1 Kanal. What is the price range right now?', 
    timestamp: '2:15 PM' 
  },
];

const Inbox: React.FC = () => {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [messageText, setMessageText] = useState('');
  const [showInfo, setShowInfo] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeLeadConversation(INITIAL_MESSAGES, activeChat.name);
      setAnalysis(result);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    setAnalysis(null);
  }, [activeChat]);

  return (
    <div className="flex h-[calc(100vh-140px)] -m-6 bg-white overflow-hidden shadow-sm border border-slate-200">
      <div className="w-80 md:w-96 border-r flex flex-col h-full bg-slate-50/30">
        <div className="p-4 bg-white border-b">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {CHATS.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center p-4 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 ${
                activeChat.id === chat.id ? 'bg-indigo-50 border-r-4 border-r-indigo-500' : ''
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                {chat.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-sm font-bold truncate ${activeChat.id === chat.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {chat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
        <div className="h-16 bg-white border-b flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center">
            <img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="ml-3">
              <h3 className="text-sm font-bold text-slate-800">{activeChat.name}</h3>
              <p className="text-xs text-green-500 font-medium">{activeChat.status === 'online' ? 'Online' : 'Last seen 2h ago'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <button className="hover:text-indigo-600 transition-colors"><Phone size={20} /></button>
            <button className="hover:text-indigo-600 transition-colors"><Video size={20} /></button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`transition-colors ${showInfo ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
            >
              <Zap size={20} />
            </button>
            <button className="hover:text-indigo-600 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="bg-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
              Today
            </span>
          </div>
          
          {INITIAL_MESSAGES.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                msg.type === 'OUTBOUND' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
                <div className={`flex items-center mt-1 text-[10px] ${msg.type === 'OUTBOUND' ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                  {msg.type === 'OUTBOUND' && <CheckCheck size={12} className="ml-1" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex items-end space-x-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <button className="p-2 text-slate-400 hover:text-indigo-600"><Paperclip size={20} /></button>
            <textarea 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-2 max-h-32"
              rows={1}
            />
            <button className="p-2 text-slate-400 hover:text-amber-500"><Smile size={20} /></button>
            <button className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="w-80 border-l bg-white flex flex-col h-full overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-bold text-slate-800 flex items-center">
                 <Zap size={18} className="mr-2 text-indigo-600" fill="currentColor" />
                 AI Insights
               </h2>
               <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600">
                 <MoreVertical size={16} className="rotate-90" />
               </button>
            </div>
            
            {!analysis && !isAnalyzing && (
              <div className="text-center py-6">
                <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                  <TrendingUp size={32} className="mx-auto text-indigo-500 mb-2" />
                  <p className="text-xs text-indigo-700 font-medium">Predict Lead conversion probability using Gemini AI.</p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center"
                >
                  Analyze Conversation
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader2 size={32} className="mx-auto text-indigo-600 animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-600">Analyzing lead sentiment...</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Powered by Gemini 3</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-2">
                    <svg className="w-24 h-24">
                      <circle className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                      <circle 
                        className={analysis.score > 70 ? "text-emerald-500" : analysis.score > 40 ? "text-amber-500" : "text-rose-500"} 
                        strokeWidth="6" 
                        strokeDasharray={251.2} 
                        strokeDashoffset={251.2 - (251.2 * analysis.score) / 100} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="48" 
                        cy="48" 
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-slate-800">{analysis.score}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">Lead Health: 
                    <span className={analysis.score > 70 ? "text-emerald-600" : analysis.score > 40 ? "text-amber-600" : "text-rose-600 ml-1"}>
                      {analysis.score > 70 ? ' Hot' : analysis.score > 40 ? ' Warm' : ' Cold'}
                    </span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sentiment</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      analysis.sentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-700' : 
                      analysis.sentiment === 'NEUTRAL' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {analysis.sentiment}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Persona</p>
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      Investor
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center">
                      <MessageSquare size={14} className="mr-2 text-indigo-500" />
                      Executive Summary
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {analysis.summary}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center">
                      <CheckCheck size={14} className="mr-2 text-emerald-500" />
                      Key Insights
                    </h5>
                    <ul className="space-y-2">
                      {analysis.key_points.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 mr-2 flex-shrink-0"></span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h5 className="text-xs font-bold text-emerald-800 mb-1 flex items-center">
                      <TrendingUp size={14} className="mr-2" />
                      Next Action
                    </h5>
                    <p className="text-xs text-emerald-700 font-medium">{analysis.next_action}</p>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    Refresh Analysis
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Contact Details</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-400">Phone</span>
                 <span className="font-bold text-slate-700">0300-1234567</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-400">Location</span>
                 <span className="font-bold text-slate-700">Lahore, PK</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-400">Project</span>
                 <span className="font-bold text-slate-700">DHA Phase 6</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
