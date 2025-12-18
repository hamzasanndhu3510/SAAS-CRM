
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  Info,
  CheckCheck
} from 'lucide-react';

const CHATS = [
  { id: '1', name: 'Zainab Qureshi', lastMsg: 'I am interested in the DHA Phase 6 plot.', time: '2:15 PM', unread: 2, status: 'online', avatar: 'https://picsum.photos/seed/zainab/200' },
  { id: '2', name: 'Mustafa Sheikh', lastMsg: 'Please send me the payment plan.', time: '1:45 PM', unread: 0, status: 'offline', avatar: 'https://picsum.photos/seed/mustafa/200' },
  { id: '3', name: 'Eshaal Khan', lastMsg: 'Is the possession available?', time: 'Yesterday', unread: 0, status: 'online', avatar: 'https://picsum.photos/seed/eshaal/200' },
  { id: '4', name: 'Raza Malik', lastMsg: 'Thank you for the info.', time: 'Yesterday', unread: 0, status: 'offline', avatar: 'https://picsum.photos/seed/raza/200' },
];

const MESSAGES = [
  { id: 'm1', type: 'inbound', text: 'Salam, I saw your ad on Facebook about DHA Phase 6.', time: '2:10 PM' },
  { id: 'm2', type: 'outbound', text: 'Walaikum Assalam! Yes, we have some premium options available. Are you looking for a residential or commercial plot?', time: '2:12 PM' },
  { id: 'm3', type: 'inbound', text: 'Residential 1 Kanal. What is the price range right now?', time: '2:15 PM' },
];

const Inbox: React.FC = () => {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [messageText, setMessageText] = useState('');

  return (
    <div className="flex h-[calc(100vh-140px)] -m-6 bg-white overflow-hidden shadow-sm border border-slate-200">
      {/* Sidebar List */}
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

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
        {/* Header */}
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
            <button className="hover:text-indigo-600 transition-colors"><Info size={20} /></button>
            <button className="hover:text-indigo-600 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="bg-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
              Today
            </span>
          </div>
          
          {MESSAGES.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'outbound' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                msg.type === 'outbound' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`flex items-center mt-1 text-[10px] ${msg.type === 'outbound' ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                  <span>{msg.time}</span>
                  {msg.type === 'outbound' && <CheckCheck size={12} className="ml-1" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
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
          <div className="flex items-center justify-between mt-2 px-2">
             <div className="flex space-x-4">
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-indigo-600">Templates</button>
                <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-indigo-600">AI Rewriter</button>
             </div>
             <p className="text-[10px] text-slate-400">Encrypted via WhatsApp BSP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
