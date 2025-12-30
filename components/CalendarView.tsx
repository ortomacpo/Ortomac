
import React, { useState } from 'react';
import { MOCK_PATIENTS } from '../constants';
import { Appointment } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointments: (appointments: Appointment[]) => void;
}

// Added props to handle centralized appointment state from App.tsx
const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onUpdateAppointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    time: '08:00',
    date: new Date().toISOString().split('T')[0],
    type: 'Physio' as 'Physio' | 'Workshop'
  });

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  // Helper to get start of the current week (Monday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = MOCK_PATIENTS.find(p => p.id === formData.patientId);
    if (!patient) return;

    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      // Fix: Changed patientId to patient_id
      patient_id: patient.id,
      // Fix: Changed patientName to patient_name
      patient_name: patient.name,
      time: formData.time,
      type: formData.type,
      status: 'pending'
    };

    onUpdateAppointments([...appointments, newApp]);
    setShowAddModal(false);
  };

  return (
    <div className="animate-fadeIn relative">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Lado Esquerdo: Calendário Principal */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Semana de Trabalho</p>
              </div>
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm ml-2">
                <button 
                  onClick={() => navigateWeek(-1)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg transition text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 text-[10px] font-bold text-slate-500 hover:text-blue-600 uppercase"
                >
                  Hoje
                </button>
                <button 
                  onClick={() => navigateWeek(1)}
                  className="p-1.5 hover:bg-slate-50 rounded-lg transition text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setFormData({...formData, date: new Date().toISOString().split('T')[0]});
                setShowAddModal(true);
              }}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              NOVO AGENDAMENTO
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="w-20 p-4 border-b border-r border-slate-50"></th>
                  {weekDays.map((day, idx) => (
                    <th key={idx} className={`p-4 border-b border-r border-slate-50 min-w-[150px] ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50/30' : ''}`}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{getDayName(day)}</p>
                      <p className={`text-sm font-bold ${day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-slate-700'}`}>
                        {formatDateLabel(day)}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map(hour => (
                  <tr key={hour} className="group hover:bg-slate-50/20 transition">
                    <td className="p-4 border-b border-r border-slate-50 text-[10px] font-bold text-slate-400 text-center">
                      {hour}
                    </td>
                    {weekDays.map((day, dayIdx) => (
                      <td key={dayIdx} className={`p-2 border-b border-r border-slate-50 h-24 relative ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50/10' : ''}`}>
                        {appointments
                          .filter(app => app.time === hour) 
                          .filter(() => dayIdx === 0) 
                          .map(app => (
                            <div 
                              key={app.id} 
                              className={`p-2 rounded-xl border shadow-sm h-full flex flex-col justify-between ${
                                app.type === 'Physio' 
                                ? 'bg-blue-50 border-blue-100 text-blue-800' 
                                : 'bg-orange-50 border-orange-100 text-orange-800'
                              }`}
                            >
                              <div className="overflow-hidden">
                                <p className="text-[8px] font-bold uppercase opacity-60 truncate">{app.type === 'Physio' ? 'Fisioterapia' : 'Oficina'}</p>
                                {/* Fix: Changed patientName to patient_name */}
                                <h4 className="text-[11px] font-bold leading-tight truncate">{app.patient_name}</h4>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase w-fit ${
                                app.status === 'confirmed' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                              }`}>
                                {app.status === 'confirmed' ? 'Conf.' : 'Pend.'}
                              </span>
                            </div>
                          ))}
                        
                        <button 
                          onClick={() => {
                            setFormData({...formData, time: hour, date: day.toISOString().split('T')[0]});
                            setShowAddModal(true);
                          }}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-300 transition"
                        >
                          <span className="text-[10px] font-bold">+ AGENDAR</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lado Direito: Resumo */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Resumo Semanal
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-medium text-slate-500">Agendamentos</span>
                <span className="text-sm font-bold text-slate-800">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-2xl">
                <span className="text-xs font-medium text-blue-600">Fisioterapia</span>
                <span className="text-sm font-bold text-blue-700">08</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-2xl">
                <span className="text-xs font-medium text-orange-600">Oficina</span>
                <span className="text-sm font-bold text-orange-700">04</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold">!</div>
                <div>
                   <h4 className="font-bold text-sm">Aviso de Agenda</h4>
                   <p className="text-[10px] text-slate-400">Você tem 2 pendências</p>
                </div>
             </div>
             <p className="text-xs text-slate-300 leading-relaxed mb-4">
               Maria Santos ainda não confirmou a sessão de quarta-feira.
             </p>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition">
               ENVIAR LEMBRETES
             </button>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-md rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Novo Agendamento</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Preencha os detalhes abaixo</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Paciente</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                >
                  <option value="">Selecione um paciente...</option>
                  {MOCK_PATIENTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Data do Atendimento</label>
                <input 
                  type="date"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Horário</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Tipo de Serviço</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'Physio' | 'Workshop'})}
                  >
                    <option value="Physio">Fisioterapia</option>
                    <option value="Workshop">Oficina Ortopédica</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-200 transition"
                >
                  DESCARTAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition"
                >
                  SALVAR AGENDAMENTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
