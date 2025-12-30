
import React, { useState } from 'react';
import { WorkshopStatus, WorkshopOrder, UserRole } from '../types';

interface WorkshopManagementProps {
  userRole: UserRole;
  orders: WorkshopOrder[];
  onUpdateOrders: (orders: WorkshopOrder[]) => void;
}

const WorkshopManagement: React.FC<WorkshopManagementProps> = ({ userRole, orders, onUpdateOrders }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const columns = [
    { id: 'prep', title: 'Medição & Molde', statuses: [WorkshopStatus.MEASURING, WorkshopStatus.MOLDING], color: 'indigo' },
    { id: 'prod', title: 'Fabricação / Acabamento', statuses: [WorkshopStatus.MANUFACTURING, WorkshopStatus.FINISHING], color: 'amber' },
    { id: 'ready', title: 'Entrega Finalizada', statuses: [WorkshopStatus.READY, WorkshopStatus.DELIVERED], color: 'emerald' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Chão de Fábrica Ortomac</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fluxo de Produção de Órteses e Próteses</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
        >
          + Abrir Ordem de Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
        {columns.map(col => (
          <div key={col.id} className="bg-slate-100/30 rounded-[3rem] p-8 flex flex-col border border-slate-50">
             <div className="flex justify-between items-center mb-10 px-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{col.title}</h3>
                <span className={`bg-white text-slate-800 px-3 py-1 rounded-xl text-[10px] font-black shadow-sm border border-slate-100`}>
                  {orders.filter(o => col.statuses.includes(o.status)).length}
                </span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                {orders.filter(o => col.statuses.includes(o.status)).map(order => (
                  <div key={order.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${col.color}-500 group-hover:w-3 transition-all`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-slate-300 uppercase">{order.id}</span>
                      <div className="flex gap-2">
                        {new Date(order.deadline) < new Date() && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>}
                        <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-xl uppercase border border-rose-100">
                           {new Date(order.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{order.product}</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">{order.patientName}</p>
                    
                    <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-5">
                       <span className={`text-[10px] font-black uppercase text-${col.color}-600 bg-${col.color}-50 px-2 py-1 rounded-lg`}>{order.status}</span>
                       <div className="flex -space-x-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">M</div>
                          <div className="w-9 h-9 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">+</div>
                       </div>
                    </div>
                  </div>
                ))}
                
                {orders.filter(o => col.statuses.includes(o.status)).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                    <div className="text-7xl mb-6">📦</div>
                    <p className="text-xs font-black uppercase tracking-widest">Sem atividades no momento</p>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopManagement;
