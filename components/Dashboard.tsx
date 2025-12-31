
import React from 'react';
import { MOCK_FINANCE } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppView, Patient, WorkOrder, Appointment, UserRole } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
  onOpenScoliosis: (patientId: string) => void;
  patients: Patient[];
  orders: WorkOrder[];
  appointments: Appointment[];
  userRole?: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onOpenScoliosis, patients, orders, appointments, userRole }) => {
  const stats = [
    { label: 'Sessões Hoje', value: appointments.length, icon: '📅', trend: '+2 agendados', bg: 'bg-indigo-50' },
    { label: 'Oficina Ativa', value: orders.filter(o => o.status !== 'Entregue').length, icon: '🛠️', trend: 'Produção', bg: 'bg-amber-50' },
    { label: 'Pacientes Totais', value: patients.length, icon: '👥', trend: 'Base ativa', bg: 'bg-emerald-50' },
    { label: 'Escoliose', value: patients.filter(p => p.categories.includes('Escoliose')).length, icon: '📏', trend: 'Especialidade', bg: 'bg-rose-50' },
  ];

  const recentPatients = patients.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>{stat.icon}</div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-black text-xl text-slate-800 tracking-tight">Evolução Mensal (Receita)</h3>
            </div>
          </div>
          <div className="h-[300px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FINANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="#4F46E520" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6">Ações Rápidas</h3>
          <div className="space-y-4">
            {recentPatients.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                <div>
                  <p className="text-xs font-black text-slate-800">{p.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{p.condition}</p>
                </div>
                {p.categories.includes('Escoliose') && (
                  <button 
                    onClick={() => onOpenScoliosis(p.id)}
                    className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-indigo-100"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => onViewChange('patients')}
              className="w-full py-4 text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 rounded-2xl transition-all"
            >
              Ver Todos os Pacientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
