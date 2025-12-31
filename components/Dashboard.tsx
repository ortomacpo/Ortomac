
import React from 'react';
import { MOCK_FINANCE } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppView, Patient, WorkshopOrder, Appointment, UserRole } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
  onOpenScoliosis: (patientId: string) => void;
  patients: Patient[];
  orders: WorkshopOrder[];
  appointments: Appointment[];
  userRole?: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onOpenScoliosis, patients, orders, appointments, userRole }) => {
  const stats = [
    { label: 'Sessões Hoje', value: appointments.length, icon: '📅', trend: '+2', bg: 'bg-indigo-50/50' },
    { label: 'Oficina Ativa', value: orders.length, icon: '🛠️', trend: '4 urgentes', bg: 'bg-amber-50/50' },
    { label: 'Fila de Espera', value: patients.filter(p => p.waiting_status && p.waiting_status !== 'None').length, icon: '🕒', trend: 'Pico: 14h', bg: 'bg-rose-50/50' },
    { label: 'Novos Pacientes', value: 12, icon: '✨', trend: '+15% mês', bg: 'bg-emerald-50/50' },
  ];

  // Filtra pendências por papel. Gestor vê tudo.
  const pendingActions = patients.filter(p => {
    if (userRole === UserRole.GESTOR) return p.pending_physio_eval || p.pending_workshop_eval;
    if (userRole === UserRole.FISIOTERAPEUTA) return p.pending_physio_eval;
    if (userRole === UserRole.TECNICO) return p.pending_workshop_eval;
    return false;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* SEÇÃO DE NOTIFICAÇÕES CRÍTICAS */}
      {pendingActions.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem] animate-fadeInUp">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl animate-pulse">🔔</div>
              <div>
                 <h3 className="text-xl font-black text-amber-900 tracking-tight">Avaliações Pendentes</h3>
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    {userRole === UserRole.GESTOR 
                      ? `Existem ${pendingActions.length} paciente(s) com pendências clínicas ou técnicas.`
                      : `Você possui ${pendingActions.length} paciente(s) aguardando atendimento.`
                    }
                 </p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingActions.map(patient => (
                <div key={patient.id} className="bg-white p-6 rounded-[2rem] border border-amber-100 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer group">
                   <div>
                      <h4 className="font-black text-slate-800">{patient.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {patient.categories.map(cat => (
                          <span key={cat} className="text-[8px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-widest">{cat}</span>
                        ))}
                      </div>
                      <div className="mt-2 space-y-1">
                        {patient.pending_physio_eval && <p className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">● Pendência Clínica</p>}
                        {patient.pending_workshop_eval && <p className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">● Pendência Técnica</p>}
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                        if(patient.categories.includes('Escoliose')) {
                            onOpenScoliosis(patient.id);
                        } else if (patient.categories.includes('Oficina')) {
                            onViewChange(AppView.WORKSHOP);
                        } else {
                            onViewChange(AppView.PATIENTS);
                        }
                    }}
                    className="mt-6 w-full bg-amber-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-amber-600 transition-all"
                   >
                      Tratar Pendência ➔
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tighter">Performance Operacional</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Receita Mensal Projetada
              </p>
            </div>
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

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex-1 border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="font-black text-xl text-white tracking-tight">Agenda Hoje</h3>
              <button onClick={() => onViewChange(AppView.CALENDAR)} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Ver Todos</button>
            </div>
            
            <div className="space-y-4 relative z-10">
              {appointments.slice(0, 4).map((app) => (
                <div key={app.id} className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all border border-white/5">
                  <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 w-12 py-2 rounded-xl text-center">{app.time}</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{app.patient_name}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase mt-0.5">{app.type === 'Physio' ? 'Fisioterapia' : 'Oficina'}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 bg-white py-4 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-xl active:scale-95 transition-all">Abrir Sala de Espera</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
