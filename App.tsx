import React, { useState } from 'react';
import { AppView, User, UserRole } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import WorkshopManagement from './components/WorkshopManagement.tsx';
import Login from './components/Login.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl text-xl">OP</div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">OrthoPhysio</span>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Painel', icon: '📊' },
            { id: 'calendar', label: 'Agenda', icon: '📅' },
            { id: 'workshop', label: 'Oficina', icon: '🛠️' },
            { id: 'ai_insights', label: 'IA Cérebro', icon: '✨' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${view === item.id ? 'bg-slate-900 text-white font-bold shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{view}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Bem-vindo, {user.name}</p>
          </div>
        </header>

        <div className="animate-fadeIn">
          {view === 'dashboard' && <Dashboard />}
          {view === 'ai_insights' && <AIAssistant />}
          {view === 'workshop' && <WorkshopManagement orders={[]} onUpdateOrder={async () => {}} />}
        </div>
      </main>
    </div>
  );
};

export default App;