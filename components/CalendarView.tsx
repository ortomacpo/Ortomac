
import React, { useState } from 'react';
import { Appointment, Patient } from '../types';

interface CalendarViewProps {
  appointments: Appointment[];
  onUpdateAppointments: (appointment: Appointment) => Promise<void>;
  patients: Patient[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onUpdateAppointments, patients }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    time: '08:00',
    date: new Date().toISOString().split('T')[0],
    type: 'Physio' as 'Physio' | 'Workshop'
  });

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

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
      alert("Erro ao agendar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn relative">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 capitalize">Agenda da Clínica</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Sincronizado com Supabase</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition hover:bg-blue-700"
            >
              + NOVO AGENDAMENTO
            </button>
          </div>

          <div className="p-8 text-center text-slate-400">
             <p className="text-sm font-medium">A visualização semanal está pronta para receber os dados do banco.</p>
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map(app => (
                  <div key={app.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                     <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">{app.time} - {app.appointment_date}</span>
                        <span className="text-[8px] bg-white px-2 py-0.5 rounded border border-slate-100 font-bold uppercase">{app.type}</span>
                     </div>
                     <h4 className="font-black text-slate-800 mt-1">{app.patient_name}</h4>
                  </div>
                ))}
                {appointments.length === 0 && <p className="col-span-2 py-10 opacity-30 italic">Nenhum agendamento para este período.</p>}
             </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Agendar Atendimento</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800 transition">✕</button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Paciente</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Data</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Hora</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={isSaving} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                {isSaving ? 'Salvando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
