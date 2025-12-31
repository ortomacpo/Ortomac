import React, { useState } from 'react';
import { Appointment, Patient } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointments: (appointment: Appointment) => Promise<void>;
  patients: Patient[];
}

// Fixed: Added React.FC type correctly by importing React
const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onUpdateAppointments, patients }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    time: '08:00',
    date: new Date().toISOString().split('T')[0],
    type: 'Physio' as 'Physio' | 'Workshop'
  });

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Fixed: Added React.FormEvent type correctly by importing React
  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    setIsSaving(true);
    const newApp: Appointment = {
      id: crypto.randomUUID(),
      patient_id: patient.id,
      patient_name: patient.name,
      time: formData.time,
      appointment_date: formData.date,
      type: formData.type,
      status: 'confirmed'
    };

    try {
      await onUpdateAppointments(newApp);
      setShowAddModal(false);
    } catch (err) {
      alert("Erro ao agendar. Verifique a conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn relative">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agenda Clínica</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Sincronizado em Tempo Real</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-3 transition hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
              Novo Agendamento
            </button>
          </div>

          <div className="p-10">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                  <div key={app.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-wider">{app.time}</span>
                        <span className={`text-[8px] px-2 py-1 rounded-md font-black uppercase border ${app.type === 'Physio' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                          {app.type === 'Physio' ? 'Fisioterapia' : 'Oficina'}
                        </span>
                     </div>
                     <h4 className="font-black text-slate-800 text-base">{app.patient_name}</h4>
                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{new Date(app.appointment_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-20 grayscale">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="font-black uppercase text-[10px] tracking-widest">Nenhum compromisso agendado</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-fadeInUp">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Agendar Horário</h3>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition">✕</button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Paciente</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  value={formData.patientId}
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                  required
                >
                  <option value="">Selecione o paciente...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hora</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tipo de Atendimento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Physio'})}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.type === 'Physio' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'}`}
                  >
                    Fisioterapia
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'Workshop'})}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.type === 'Workshop' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'}`}
                  >
                    Oficina
                  </button>
                </div>
              </div>
              <button disabled={isSaving} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                {isSaving ? 'Processando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;