import React from 'react';
import { AppView, UserRole } from '../types.ts';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  userRole: UserRole;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userRole, onLogout, userName }) => {
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Painel', icon: '📊' },
    { id: 'patients' as AppView, label: 'Pacientes', icon: '👥' },
    { id: 'workshop' as AppView, label: 'Oficina', icon: '🛠️' },
    { id: 'inventory' as AppView, label: 'Insumos', icon: '📦' },
    { id: 'ai_insights' as AppView, label: 'IA Cérebro', icon: '✨' }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl text-xl">OP</div>
        <span className="text-xl font-black text-slate-800 tracking-tighter">OrtoPhysio</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${currentView === item.id ? 'bg-slate-900 text-white font-bold shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-50">
        <div className="p-4 bg-slate-50 rounded-2xl">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuário</p>
          <p className="text-xs font-black text-slate-800 truncate mb-3">{userName}</p>
          <button onClick={onLogout} className="w-full py-2 bg-white border border-slate-200 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-50 transition-colors">Sair</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;