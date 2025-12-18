
import React from 'react';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download, 
  UserPlus,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';

const CONTACTS = [
  { id: '1', name: 'Zainab Qureshi', email: 'zainab@example.com', phone: '0300-1234567', city: 'Lahore', stage: 'New', source: 'WhatsApp', value: '500,000' },
  { id: '2', name: 'Mustafa Sheikh', email: 'mustafa@example.com', phone: '0321-7654321', city: 'Karachi', stage: 'Proposal', source: 'Facebook', value: '1,200,000' },
  { id: '3', name: 'Eshaal Khan', email: 'eshaal@example.com', phone: '0310-1112223', city: 'Islamabad', stage: 'Contacted', source: 'Website', value: '350,000' },
  { id: '4', name: 'Raza Malik', email: 'raza@example.com', phone: '0345-9998887', city: 'Multan', stage: 'New', source: 'Walk-in', value: '2,000,000' },
  { id: '5', name: 'Hina Ahmed', email: 'hina@example.com', phone: '0333-5554443', city: 'Lahore', stage: 'Won', source: 'WhatsApp', value: '80,000' },
];

const Contacts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>
          <p className="text-slate-500">View and manage all your leads and customers.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm flex items-center space-x-2 text-sm font-medium">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 flex items-center space-x-2">
            <UserPlus size={18} />
            <span>Import Leads</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Filter by name, city, or phone..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Potential Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mr-3">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                        <p className="text-xs text-slate-400">Source: {contact.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-600">
                        <Mail size={12} className="mr-2 text-slate-400" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-600">
                        <Phone size={12} className="mr-2 text-slate-400" />
                        {contact.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{contact.city}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      contact.stage === 'Won' ? 'bg-emerald-100 text-emerald-700' : 
                      contact.stage === 'Proposal' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {contact.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">Rs. {contact.value}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                          <MessageSquare size={16} />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreHorizontal size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <p className="text-xs text-slate-500 font-medium">Showing 5 of 2,451 leads</p>
           <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border rounded text-xs font-bold text-slate-600 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-white border rounded text-xs font-bold text-indigo-600">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
