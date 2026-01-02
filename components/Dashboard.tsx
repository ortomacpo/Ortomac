import React from 'react';
import { AppView, Patient, WorkOrder } from '../types.ts';

interface DashboardProps {
  patients: Patient[];
  orders: WorkOrder[];
  onViewChange: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, orders, onViewChange }) => {
  const stats = [
    { label: 'Pacientes', value: patients.length, icon: '👥', color: 'indigo' },
    { label: 'Ordens Ativas', value: orders.filter(o => o.status !== 'Delivered').length, icon: '🛠️', color: 'amber' },
    { label: 'Concluídos', value: orders.filter(o => o.status === 'Delivered').length, icon: '✅', color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`text-3xl`}>{stat.icon}</div>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-black tracking-tight mb-2">Próximas Entregas</h3>
          <p className="text-slate-400 text-sm mb-6">Acompanhamento de prazos da oficina</p>
          <div className="space-y-4">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{order.product}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{order.patient_name}</p>
                </div>
                <span className="text-[10px] font-black bg-indigo-600 px-3 py-1 rounded-full">{order.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;