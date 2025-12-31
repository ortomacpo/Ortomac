
import React from 'react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  userRole: UserRole;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userRole, onLogout, userName }) => {
  
  const isGestor = userRole === UserRole.GESTOR;
  const isRecepcao = userRole === UserRole.RECEPCIONISTA;
  const isFisio = userRole === UserRole.FISIOTERAPEUTA;
  const isTecnico = userRole === UserRole.TECNICO;

  // Fix: AppView is a type and cannot be used as an object. Using string literals instead.
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Painel Geral', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', visible: true },
    { id: 'calendar' as AppView, label: 'Minha Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', visible: true },
    { id: 'patients' as AppView, label: 'Pacientes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', visible: true },
    { id: 'workshop' as AppView, label: 'Oficina', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z', visible: isGestor || isTecnico || isFisio },
    { id: 'inventory' as AppView, label: 'Insumos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', visible: isGestor || isTecnico || isRecepcao },
    { id: 'finances' as AppView, label: 'Financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', visible: isGestor },
    { id: 'indicators' as AppView, label: 'Estatísticas', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', visible: isGestor },
    { id: 'ai_insights' as AppView, label: 'Inteligência', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', visible: !isRecepcao },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col animate-fadeInLeft">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-2xl shadow-blue-200 text-xl">OP</div>
          <div>
            <span className="text-xl font-black text-slate-800 tracking-tighter block leading-none">OrthoPhysio</span>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 block">Enterprise v2</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.filter(item => item.visible).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-slate-900 text-white font-bold shadow-2xl shadow-slate-300 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-5 h-5 ${currentView === item.id ? 'text-blue-400' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-50">
        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Operador Logado</p>
           <p className="text-xs font-black text-slate-800 truncate mb-4">{userName}</p>
           <button onClick={onLogout} className="w-full py-2.5 bg-white border border-slate-200 text-rose-600 text-[10px] font-black uppercase rounded-xl hover:bg-rose-50 transition-colors shadow-sm">Sair</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
