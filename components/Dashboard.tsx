
import React from 'react';
import { MOCK_FINANCE } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppView, Patient, WorkshopOrder, Appointment } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
  patients: Patient[];
  orders: WorkshopOrder[];
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, patients, orders, appointments }) => {
  const stats = [
    { label: 'Sessões Hoje', value: appointments.length, icon: '📅', color: 'bg-indigo-600', trend: '+2', bg: 'bg-indigo-50/50' },
    { label: 'Oficina Ativa', value: orders.length, icon: '🛠️', color: 'bg-amber-500', trend: '4 urgentes', bg: 'bg-amber-50/50' },
    // Fix: Changed waitingStatus to waiting_status
    { label: 'Fila de Espera', value: patients.filter(p => p.waiting_status && p.waiting_status !== 'None').length, icon: '🕒', color: 'bg-rose-500', trend: 'Pico: 14h', bg: 'bg-rose-50/50' },
    { label: 'Novos Pacientes', value: 12, icon: '✨', color: 'bg-emerald-500', trend: '+15% mês', bg: 'bg-emerald-50/50' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
        {/* Main Chart Card */}
        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tighter">Performance Operacional</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Receita Mensal Projetada
              </p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500/20">
               <option>Últimos 6 meses</option>
               <option>Este Ano</option>
            </select>
          </div>
          <div className="h-[320px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FINANCE}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1rem' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Schedule Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex-1 border border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="font-black text-xl text-white tracking-tight">Agenda Hoje</h3>
              <button onClick={() => onViewChange(AppView.CALENDAR)} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Ver Todos</button>
            </div>
            
            <div className="space-y-4 relative z-10">
              {appointments.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <p className="text-white text-[10px] font-black uppercase">Vazio para hoje</p>
                </div>
              ) : (
                appointments.slice(0, 4).map((app) => (
                  <div key={app.id} className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer border border-white/5">
                    <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 w-12 py-2 rounded-xl text-center">{app.time}</div>
                    <div className="flex-1 overflow-hidden">
                      {/* Fix: Changed app.patientName to app.patient_name */}
                      <p className="text-sm font-bold text-white truncate">{app.patient_name}</p>
                      <p className="text-[8px] font-black text-slate-500 uppercase mt-0.5">{app.type === 'Physio' ? 'Fisioterapia' : 'Oficina'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-8 bg-white py-4 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-slate-950/20 active:scale-95">Abrir Sala de Espera</button>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Insight da IA</h4>
               <p className="text-sm font-bold mt-2 leading-tight">"Aumente o estoque de resinas. A demanda da oficina subiu 22% esta semana."</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
