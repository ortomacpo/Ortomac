
import React, { useState } from 'react';
import { Patient, ScoliosisData } from '../types';

interface ScoliosisRecordProps {
  patient: Patient;
  onSave: (patient: Patient) => Promise<void>;
  onBack: () => void;
}

// Adicionando export default e implementação funcional básica para o prontuário de escoliose
const ScoliosisRecord: React.FC<ScoliosisRecordProps> = ({ patient, onSave, onBack }) => {
  const [data, setData] = useState<ScoliosisData>(patient.scoliosis_record || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedPatient = {
      ...patient,
      scoliosis_record: data,
      pending_physio_eval: false
    };
    await onSave(updatedPatient);
    setIsSaving(false);
  };

  return (
    <div className="animate-fadeIn space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Avaliação de Escoliose</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Paciente: {patient.name}</p>
        </div>
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
        <section>
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px]">01</span>
            Anamnese Clínica
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Queixa Principal</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium min-h-[100px] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                value={data.main_complaint || ''}
                onChange={e => setData({...data, main_complaint: e.target.value})}
                placeholder="Descreva a queixa principal do paciente..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ângulo de Cobb Torácica</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black"
                  value={data.cobb_toracica || ''}
                  onChange={e => setData({...data, cobb_toracica: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ângulo de Cobb Lombar</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black"
                  value={data.cobb_lombar || ''}
                  onChange={e => setData({...data, cobb_lombar: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10 border-t border-slate-50">
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px]">02</span>
            Maturidade Esquelética (Risser)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Estágio de Risser</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black"
                value={data.risser_scale || 0}
                onChange={e => setData({...data, risser_scale: Number(e.target.value)})}
              >
                {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>Risser {v}</option>)}
              </select>
            </div>
          </div>
        </section>

        <div className="pt-10 flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          >
            Voltar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
          >
            {isSaving ? 'Salvando...' : 'Finalizar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoliosisRecord;
