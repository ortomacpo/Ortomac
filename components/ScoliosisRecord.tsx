
import React, { useState, useMemo } from 'react';
import { Patient, ScoliosisData } from '../types.ts';

interface ScoliosisRecordProps {
  patient: Patient;
  onSave: (patient: Patient) => Promise<void>;
  onBack: () => void;
}

const ScoliosisRecord: React.FC<ScoliosisRecordProps> = ({ patient, onSave, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<ScoliosisData>(patient.scoliosis_record || {
    main_complaint: '',
    life_habits: '',
    history_current_past: '',
    family_history: '',
    past_treatments: '',
    has_surgeries: false,
    has_diabetes: false,
    has_fractures: false,
    has_cardiac_issues: false,
    has_allergies: false,
    has_others: false,
    pain_type: '',
    medication: '',
    eva_scale: 0,
    has_breasts: false,
    has_axillary_hair: false,
    menstruation_obs: '',
    worsening_factors: '',
    improvement_factors: '',
    sleep_obs: '',
    physical_activity_obs: '',
    activity_frequency: '',
    activity_duration: '',
    chronological_age: 0,
    risser_scale: 0,
    cobb_toracica: 0,
    cobb_lombar: 0,
    cobb_toracolombar: 0,
    inc_cervical_c7: 0,
    inc_toracica_t12_1: 0,
    inc_resultado_1: 0,
    inc_toracica_t12_2: 0,
    inc_sacro_s1: 0,
    inc_resultado_2: 0,
    rot_sentado_d: 0,
    rot_sentado_e: 0,
    rot_superior_d: 0,
    rot_superior_e: 0,
    rot_inferior_d: 0,
    rot_inferior_e: 0,
    equi_unipodal_d: 0,
    equi_unipodal_e: 0,
    scoliometer_toracica: 0,
    scoliometer_lombar: 0,
    mmii_real_mid: 0,
    mmii_real_mie: 0,
    mmii_aparente_mid: 0,
    mmii_aparente_mie: 0,
    adams_side_d: false,
    adams_side_e: false,
    lumbar_flexibility_cm: 0,
    abdominal_strength_g3: '',
    abdominal_strength_g4: '',
    abdominal_strength_g5: '',
    oblique_right: '',
    oblique_left: '',
    lower_abdominal_sim: false,
    physio_diagnosis: '',
    physio_plan: '',
    apex_level: '',
    adams_test_mm: 0,
    rotation_degrees: 0,
    treatment_goal: '',
    is_finished: false
  });

  const handleFinalize = async () => {
    setIsSaving(true);
    const updatedPatient: Patient = {
      ...patient,
      pending_physio_eval: false,
      scoliosis_record: { ...data, is_finished: true }
    };

    try {
      await onSave(updatedPatient);
      onBack();
    } catch (err) {
      alert("Erro ao salvar prontuário.");
    } finally {
      setIsSaving(false);
    }
  };

  const progressionFactor = useMemo(() => {
    const maxCobb = Math.max(data.cobb_toracica || 0, data.cobb_lombar || 0, data.cobb_toracolombar || 0);
    const risser = data.risser_scale || 0;
    const age = data.chronological_age || 1; 
    if (age === 0) return 0;
    return (maxCobb - (3 * risser)) / age;
  }, [data.cobb_toracica, data.cobb_lombar, data.cobb_toracolombar, data.risser_scale, data.chronological_age]);

  const getEvaColor = (val: number) => {
    if (val <= 2) return 'bg-blue-400';
    if (val <= 5) return 'bg-emerald-400';
    if (val <= 7) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  const BooleanToggle = ({ label, value, onChange }: { label: string, value: boolean | undefined, onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      <div className="flex gap-2">
        <button 
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${value === true ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-300 border border-slate-100'}`}
        >
          Sim
        </button>
        <button 
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${value === false ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-300 border border-slate-100'}`}
        >
          Não
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp pb-20">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <button onClick={onBack} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar ao Dashboard
          </button>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Avaliação de Escoliose</h2>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
            <span className="text-indigo-600">ID: {patient.id.slice(0,8)}</span> • Paciente: {patient.name}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleFinalize} disabled={isSaving} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">
            {isSaving ? 'SALVANDO...' : 'FINALIZAR AVALIAÇÃO'}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        
        {/* SECTION 1: ANAMNESE E DADOS INICIAIS */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">📋</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Anamnese Clínica</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Queixa Principal</label>
                <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-sm min-h-[100px] outline-none transition-all focus:ring-4 focus:ring-slate-100" value={data.main_complaint} onChange={e => setData({...data, main_complaint: e.target.value})} placeholder="Relato do paciente sobre sua condição..." />
               </div>
               <div>
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Hábitos de Vida</label>
                <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-sm min-h-[100px] outline-none transition-all focus:ring-4 focus:ring-slate-100" value={data.life_habits} onChange={e => setData({...data, life_habits: e.target.value})} placeholder="Exercícios, postura no trabalho, lazer..." />
               </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">História da Doença (HDA/HDP)</label>
              <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-sm min-h-[250px] outline-none transition-all focus:ring-4 focus:ring-slate-100" value={data.history_current_past} onChange={e => setData({...data, history_current_past: e.target.value})} placeholder="Histórico completo da evolução da escoliose..." />
            </div>
          </div>
        </div>

        {/* SECTION 2: MATURIDADE E HÁBITOS BIOLÓGICOS */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl font-bold shadow-sm">🧬</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Maturidade Biológica</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <BooleanToggle label="Presença de Seios" value={data.has_breasts} onChange={v => setData({...data, has_breasts: v})} />
              <BooleanToggle label="Pêlos Axilares" value={data.has_axillary_hair} onChange={v => setData({...data, has_axillary_hair: v})} />
              
              <div className="pt-4 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50/50">
                <table className="w-full border-collapse">
                   <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-4 text-[9px] font-black uppercase text-slate-400 w-48">Menstruação (Obs)</td>
                        <td className="p-2"><input className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.menstruation_obs} onChange={e => setData({...data, menstruation_obs: e.target.value})} /></td>
                      </tr>
                      <tr>
                        <td className="p-4 text-[9px] font-black uppercase text-slate-400">Fatores de Piora</td>
                        <td className="p-2"><input className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.worsening_factors} onChange={e => setData({...data, worsening_factors: e.target.value})} /></td>
                      </tr>
                   </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50/50">
               <table className="w-full border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 text-[9px] font-black uppercase text-slate-400 w-48">Sono (Obs)</td>
                      <td className="p-2"><input className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.sleep_obs} onChange={e => setData({...data, sleep_obs: e.target.value})} /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-[9px] font-black uppercase text-slate-400">Atividade Física</td>
                      <td className="p-2"><input className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.physical_activity_obs} onChange={e => setData({...data, physical_activity_obs: e.target.value})} /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-[9px] font-black uppercase text-slate-400">Frequência/Duração</td>
                      <td className="p-2 flex gap-2">
                        <input placeholder="Frequência" className="w-1/2 p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.activity_frequency} onChange={e => setData({...data, activity_frequency: e.target.value})} />
                        <input placeholder="Duração" className="w-1/2 p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none shadow-sm" value={data.activity_duration} onChange={e => setData({...data, activity_duration: e.target.value})} />
                      </td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: AVALIAÇÃO POSTURAL / INCLINÔMETRO (IMAGE 1) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold shadow-sm">🧍‍♂️</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Avaliação Postural e Inclinômetro</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Silhouettes - Visual Reference */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-[3rem] opacity-60">
               <div className="flex gap-4 text-6xl">🧍 🧍‍♀️ 🧍‍♂️</div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mt-4 leading-relaxed">Avaliação de Alinhamento<br/>Frontal • Dorsal • Sagital</p>
            </div>

            {/* Inclinômetro Table */}
            <div className="lg:col-span-4 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-inner">
               <table className="w-full border-collapse">
                  <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest text-center">
                    <tr><th colSpan={2} className="p-4">INCLINÔMETRO</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="p-3 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-6">Cervical (C7)</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center text-indigo-600" value={data.inc_cervical_c7} onChange={e => setData({...data, inc_cervical_c7: Number(e.target.value)})} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-6">Torácica (T12)</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center text-indigo-600" value={data.inc_toracica_t12_1} onChange={e => setData({...data, inc_toracica_t12_1: Number(e.target.value)})} /></td>
                    </tr>
                    <tr className="bg-indigo-50/50">
                      <td className="p-3 text-[9px] font-black uppercase text-indigo-700 pl-6 tracking-widest">RESULTADO</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center bg-transparent text-indigo-900" value={data.inc_resultado_1} onChange={e => setData({...data, inc_resultado_1: Number(e.target.value)})} /></td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-6">Sacro (S1)</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center text-indigo-600" value={data.inc_sacro_s1} onChange={e => setData({...data, inc_sacro_s1: Number(e.target.value)})} /></td>
                    </tr>
                  </tbody>
               </table>
            </div>

            {/* Rotation / Balance Table */}
            <div className="lg:col-span-5 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-inner">
               <table className="w-full border-collapse">
                  <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest text-center">
                    <tr>
                      <th className="p-4 text-left pl-6">TESTE ESPECÍFICO</th>
                      <th className="p-4">D</th>
                      <th className="p-4">E</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {[
                      { label: 'Rotação Sentado', d: 'rot_sentado_d', e: 'rot_sentado_e' },
                      { label: 'Rotação Superior', d: 'rot_superior_d', e: 'rot_superior_e' },
                      { label: 'Rotação Inferior', d: 'rot_inferior_d', e: 'rot_inferior_e' },
                      { label: 'Equilíbrio Unipodal', d: 'equi_unipodal_d', e: 'equi_unipodal_e' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-6">{row.label}</td>
                        <td className="p-1 border-r border-slate-100"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center text-slate-700" value={(data as any)[row.d]} onChange={e => setData({...data, [row.d]: Number(e.target.value)})} /></td>
                        <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center text-slate-700" value={(data as any)[row.e]} onChange={e => setData({...data, [row.e]: Number(e.target.value)})} /></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* SECTION 4: ESCOLIÔMETRO E MMII (IMAGE 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Escoliômetro Card */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold shadow-sm">📐</div>
               <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Escoliometria</h3>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-inner">
               <table className="w-full border-collapse">
                  <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest text-center">
                    <tr><th colSpan={2} className="p-4">ESCOLIÔMETRO</th></tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-8">Torácica (°)</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-xl text-center text-amber-600 outline-none" value={data.scoliometer_toracica} onChange={e => setData({...data, scoliometer_toracica: Number(e.target.value)})} /></td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400 pl-8">Lombar (°)</td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-xl text-center text-amber-600 outline-none" value={data.scoliometer_lombar} onChange={e => setData({...data, scoliometer_lombar: Number(e.target.value)})} /></td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>

          {/* Mensuração MMII Card */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xl font-bold shadow-sm">🦵</div>
               <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Mensuração de MMII</h3>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-inner">
               <table className="w-full border-collapse text-center">
                  <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="p-4">MEDIDA (CM)</th>
                      <th className="p-4">MID</th>
                      <th className="p-4">MIE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400">Real</td>
                      <td className="p-1 border-r border-slate-100"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center" value={data.mmii_real_mid} onChange={e => setData({...data, mmii_real_mid: Number(e.target.value)})} /></td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center" value={data.mmii_real_mie} onChange={e => setData({...data, mmii_real_mie: Number(e.target.value)})} /></td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400">Aparente</td>
                      <td className="p-1 border-r border-slate-100"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center" value={data.mmii_aparente_mid} onChange={e => setData({...data, mmii_aparente_mid: Number(e.target.value)})} /></td>
                      <td className="p-1"><input type="number" className="w-full p-4 font-black text-sm outline-none text-center" value={data.mmii_aparente_mie} onChange={e => setData({...data, mmii_aparente_mie: Number(e.target.value)})} /></td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* SECTION 5: ADAMS, FLEXIBILIDADE E FORÇA (IMAGE 2 COMPLEMENT) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Adams & Flexibility */}
            <div className="space-y-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-xl font-bold shadow-sm">🧬</div>
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Adams e Flexibilidade</h3>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Teste de Adams</h4>
                    <div className="flex gap-4">
                       <button onClick={() => setData({...data, adams_side_d: !data.adams_side_d})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${data.adams_side_d ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-slate-300 border-slate-100'}`}>D</button>
                       <button onClick={() => setData({...data, adams_side_e: !data.adams_side_e})} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all border-2 ${data.adams_side_e ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-slate-300 border-slate-100'}`}>E</button>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center text-center">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Flexibilidade Lombar</h4>
                    <div className="flex items-center justify-center gap-3">
                       <input type="number" className="w-24 p-4 bg-white border border-slate-100 rounded-2xl font-black text-2xl text-center text-rose-600 shadow-sm" value={data.lumbar_flexibility_cm} onChange={e => setData({...data, lumbar_flexibility_cm: Number(e.target.value)})} />
                       <span className="font-black text-slate-400 text-xs">CM</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Abdominal Strength Table */}
            <div className="space-y-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold shadow-sm">💪</div>
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Teste de Força Abdominal</h3>
               </div>
               <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-inner">
                  <table className="w-full border-collapse text-center">
                    <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                       <tr className="bg-slate-800 border-b border-slate-700"><th colSpan={3} className="p-3">DINÂMICO / ESTÁTICO</th></tr>
                       <tr>
                         <th className="p-3 border-r border-slate-700">GRAU 3</th>
                         <th className="p-3 border-r border-slate-700">GRAU 4</th>
                         <th className="p-3">GRAU 5</th>
                       </tr>
                    </thead>
                    <tbody className="bg-white">
                       <tr>
                         <td className="p-2 border-r border-slate-100"><input className="w-full p-4 bg-slate-50/50 rounded-xl font-bold text-center text-sm" value={data.abdominal_strength_g3} onChange={e => setData({...data, abdominal_strength_g3: e.target.value})} /></td>
                         <td className="p-2 border-r border-slate-100"><input className="w-full p-4 bg-slate-50/50 rounded-xl font-bold text-center text-sm" value={data.abdominal_strength_g4} onChange={e => setData({...data, abdominal_strength_g4: e.target.value})} /></td>
                         <td className="p-2"><input className="w-full p-4 bg-slate-50/50 rounded-xl font-bold text-center text-sm" value={data.abdominal_strength_g5} onChange={e => setData({...data, abdominal_strength_g5: e.target.value})} /></td>
                       </tr>
                    </tbody>
                  </table>
               </div>
            </div>
          </div>

          {/* Obliques and Lower Abdominal */}
          <div className="overflow-hidden rounded-[3rem] border border-slate-100 shadow-sm bg-slate-50/30">
             <table className="w-full border-collapse">
                <tbody className="divide-y divide-slate-100">
                   <tr>
                      <td className="p-6 text-[10px] font-black uppercase text-slate-400 w-1/4 pl-10">Oblíquo Direito</td>
                      <td className="p-2 px-10"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm outline-none" value={data.oblique_right} onChange={e => setData({...data, oblique_right: e.target.value})} /></td>
                      <td className="p-6 text-[10px] font-black uppercase text-slate-400 w-1/4 pl-10">Oblíquo Esquerdo</td>
                      <td className="p-2 px-10"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm outline-none" value={data.oblique_left} onChange={e => setData({...data, oblique_left: e.target.value})} /></td>
                   </tr>
                   <tr>
                      <td className="p-6 text-[10px] font-black uppercase text-slate-400 w-1/4 pl-10">Abdominal Inferior</td>
                      <td colSpan={3} className="p-2 px-10">
                        <div className="flex bg-white p-2 border border-slate-200 rounded-2xl shadow-sm max-w-xs">
                          <button onClick={() => setData({...data, lower_abdominal_sim: true})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${data.lower_abdominal_sim ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-400'}`}>SIM</button>
                          <button onClick={() => setData({...data, lower_abdominal_sim: false})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${!data.lower_abdominal_sim ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-400'}`}>NÃO</button>
                        </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>

        {/* SECTION 6: DIAGNÓSTICO E PLANO (IMAGE 3) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">🎯</div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Conclusão Terapêutica</h3>
          </div>

          <div className="space-y-12">
             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-4 block border-l-4 border-indigo-600 pl-4">Diagnóstico Fisioterapêutico</label>
                <textarea 
                   className="w-full p-10 bg-slate-50/50 border border-slate-100 rounded-[3.5rem] font-medium text-slate-700 text-base min-h-[180px] resize-none outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-inner" 
                   value={data.physio_diagnosis} 
                   onChange={e => setData({...data, physio_diagnosis: e.target.value})} 
                   placeholder="Baseado nos testes clínicos, descreva as disfunções encontradas..."
                />
             </div>
             
             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-4 block border-l-4 border-emerald-500 pl-4">Plano Fisioterapêutico</label>
                <textarea 
                   className="w-full p-10 bg-slate-50/50 border border-slate-100 rounded-[3.5rem] font-medium text-slate-700 text-base min-h-[180px] resize-none outline-none focus:ring-8 focus:ring-emerald-50 transition-all shadow-inner" 
                   value={data.physio_plan} 
                   onChange={e => setData({...data, physio_plan: e.target.value})} 
                   placeholder="Metas de curto e longo prazo, protocolos selecionados (Schroth, SEAS, etc)..."
                />
             </div>
          </div>
        </div>

        {/* RISK & PROGRESSION SUMMARY FOOTER */}
        <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-black tracking-tight mb-2">Monitoramento de Progressão</h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-relaxed">
              Fórmula de Progressão de Harrington / Lonstein:<br/>
              (Maior Cobb - 3 * Risser) / Idade
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-10 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
            <div className="text-center">
               <label className="text-[9px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Idade Atual</label>
               <input 
                 type="number" 
                 className="w-24 p-5 bg-white/10 border border-white/20 rounded-2xl font-black text-2xl text-center text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={data.chronological_age} 
                 onChange={e => setData({...data, chronological_age: Number(e.target.value)})} 
               />
            </div>
            <div className="h-20 w-px bg-white/10"></div>
            <div className="text-right">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Fator de Risco</p>
               <div className="text-6xl font-black tracking-tighter text-white">
                 {progressionFactor.toFixed(2)}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScoliosisRecord;
