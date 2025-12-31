import React from 'react';
import { WorkshopStatus, WorkOrder } from '../types.ts';

interface WorkshopProps {
  orders: WorkOrder[];
  onUpdateOrder: (order: WorkOrder) => Promise<void>;
}

const WorkshopManagement: React.FC<WorkshopProps> = ({ orders, onUpdateOrder }) => {
  const columns = [
    { title: 'Medição & Molde', statuses: [WorkshopStatus.MEASURING, WorkshopStatus.MOLDING], color: 'indigo' },
    { title: 'Fabricação', statuses: [WorkshopStatus.MANUFACTURING, WorkshopStatus.FINISHING], color: 'amber' },
    { title: 'Finalizado', statuses: [WorkshopStatus.READY, WorkshopStatus.DELIVERED], color: 'emerald' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.title} className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">{col.title}</h3>
            <div className="space-y-4">
              {orders.filter(o => col.statuses.includes(o.status as WorkshopStatus)).map(order => (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <span className="text-[9px] font-black text-slate-300 uppercase block mb-2">{order.id}</span>
                  <h4 className="font-black text-slate-800 text-sm mb-1">{order.product}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{order.patient_name}</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[9px] font-black bg-slate-50 px-2 py-1 rounded text-slate-500 uppercase">{order.status}</span>
                    <button 
                      onClick={() => {/* Lógica de avanço de status */}}
                      className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopManagement;