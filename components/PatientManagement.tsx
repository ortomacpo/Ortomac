
import React, { useState, useMemo } from 'react';
import { Patient, UserRole } from '../types';

interface PatientManagementProps {
  userRole: UserRole;
  patients: Patient[];
  onSavePatient: (patient: Patient) => Promise<void | boolean>;
  onDeletePatient: (id: string) => Promise<void>;
  onOpenScoliosis: (patientId: string) => void;
}

type FilterCategory = 'Todos' | 'Escoliose' | 'Amputados' | 'Oficina';
type FormTab = 'identificacao' | 'endereco' | 'encaminhamento' | 'faturamento' | 'clinico';

// Adicionando export default e estrutura básica para resolver o erro de compilação
const PatientManagement: React.FC<PatientManagementProps> = ({ userRole, patients, onSavePatient, onDeletePatient, onOpenScoliosis }) => {
  const [filter, setFilter] = useState<FilterCategory>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesFilter = filter === 'Todos' || p.categories?.includes(filter);
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [patients, filter, searchTerm]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gestão de Pacientes</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Base de Dados Clínica & Histórico</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Escoliose', 'Amputados', 'Oficina'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as FilterCategory)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filter === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                {patient.name.charAt(0)}
              </div>
              <div className="flex gap-2">
                {patient.categories?.map(cat => (
                  <span key={cat} className="text-[7px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-md border border-slate-100 uppercase tracking-widest">{cat}</span>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-black text-slate-800 mb-1">{patient.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{patient.condition || 'Sem condição informada'}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="text-xs font-bold">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span className="text-xs font-bold">Última visita: {new Date(patient.last_visit).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {patient.categories?.includes('Escoliose') && (
                <button 
                  onClick={() => onOpenScoliosis(patient.id)}
                  className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Ficha Escoliose
                </button>
              )}
              <button 
                onClick={() => onDeletePatient(patient.id)}
                className="w-12 h-11 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientManagement;
