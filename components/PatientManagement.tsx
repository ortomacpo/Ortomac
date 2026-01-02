import React, { useState } from 'react';
import { Patient, UserRole } from '../types.ts';

interface PatientManagementProps {
  patients: Patient[];
  userRole: UserRole;
  onSavePatient: (p: Patient) => Promise<void>;
  onDeletePatient: (id: string) => Promise<void>;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ patients }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl mb-6">
              {patient.name.charAt(0)}
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{patient.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{patient.condition}</p>
            <div className="pt-4 border-t border-slate-50 text-[11px] font-bold text-slate-500">
              📞 {patient.phone}
            </div>
          </div>
        ))}
        <button className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all">
          <span className="text-3xl mb-2">+</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Novo Paciente</span>
        </button>
      </div>
    </div>
  );
};

export default PatientManagement;