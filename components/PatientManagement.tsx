
import React, { useState, useMemo } from 'react';
import { Patient, ScoliosisEvaluation, UserRole, ClinicalNote, ScoliosisCurve } from '../types';

interface PatientManagementProps {
  userRole: UserRole;
  patients: Patient[];
  onSavePatient: (patient: Patient) => Promise<void>;
}

type FilterCategory = 'Todos' | 'Escoliose' | 'Oficina' | 'Amputados';
type DetailSection = 'Geral' | 'Scoliosis' | 'Workshop' | 'Evolutions';

const PatientManagement: React.FC<PatientManagementProps> = ({ userRole, patients, onSavePatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterCategory>('Todos');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeSection, setActiveSection] = useState<DetailSection>('Geral');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form state for new patient
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: 'M',
    condition: '',
    categories: [] as string[],
    mainComplaint: '',
    history: '',
    physicalActivity: { type: '', frequency: '', duration: '' },
    habits: ''
  });

  const [evalForm, setEvalForm] = useState<ScoliosisEvaluation>({
    curves: [{ type: 'Torácica', degrees: '' }],
    risser: '',
    evaScale: 0,
    adamsTest: { side: '', resultCm: '', level: '' },
    mmiiMeasurement: { real: { mid: '', mie: '' }, apparent: { mid: '', mie: '' } },
    scoliosometer: { thoracic: '', lumbar: '', thoracolumbar: '' },
    healthCheck: { surgery: false, diabetes: false, fractures: false, cardiac: false, allergies: false, others: false },
    physicalActivity: { type: '', frequency: '', duration: '' }
  });

  const canEdit = [UserRole.GESTOR, UserRole.FISIOTERAPEUTA].includes(userRole);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const name = p.name || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const categories = p.categories || [];
      const matchesTab = activeTab === 'Todos' || (categories.includes(activeTab as any));
      return matchesSearch && matchesTab;
    });
  }, [patients, searchTerm, activeTab]);

  const handleSaveEval = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    const updated = { ...selectedPatient, scoliosisData: evalForm };
    await onSavePatient(updated);
    setSelectedPatient(updated);
    setIsSaving(false);
    setShowEvalModal(false);
  };

  const handleSaveNewPatient = async () => {
    setIsSaving(true);
    const newPatient: Patient = {
      id: `P-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: newPatientData.name,
      phone: newPatientData.phone,
      email: newPatientData.email,
      birthDate: newPatientData.birthDate,
      condition: newPatientData.condition,
      lastVisit: new Date().toISOString(),
      categories: newPatientData.categories as any,
      clinicalNotes: [],
      scoliosisData: {
        curves: [],
        gender: newPatientData.gender,
        mainComplaint: newPatientData.mainComplaint,
        history: newPatientData.history,
        habits: newPatientData.habits,
        physicalActivity: newPatientData.physicalActivity
      }
    };

    await onSavePatient(newPatient);
    setIsSaving(false);
    resetAddModal();
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setAddStep(1);
    setNewPatientData({
      name: '', phone: '', email: '', birthDate: '', gender: 'M',
      condition: '', categories: [], mainComplaint: '', history: '',
      physicalActivity: { type: '', frequency: '', duration: '' }, habits: ''
    });
  };

  const handleAddEvolution = async () => {
    if (!selectedPatient || !newNote.trim()) return;
    setIsSaving(true);
    const note: ClinicalNote = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      professional: userRole,
      content: newNote,
      type: 'Evolution'
    };
    const updated = { ...selectedPatient, clinicalNotes: [note, ...selectedPatient.clinicalNotes] };
    await onSavePatient(updated);
    setSelectedPatient(updated);
    setNewNote('');
    setIsSaving(false);
  };

  const isHighRisk = (degrees: string) => parseInt(degrees) >= 25;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] animate-fadeIn">
      {/* Sidebar de Pacientes */}
      <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50 space-y-4 bg-slate-50/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Pacientes</h3>
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[9px] font-black">{filteredPatients.length} Ativos</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar nome..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['Todos', 'Escoliose', 'Oficina', 'Amputados'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat as FilterCategory)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPatients.map(p => (
            <div 
              key={p.id} 
              onClick={() => {
                setSelectedPatient(p);
                setActiveSection('Geral');
              }}
              className={`p-5 rounded-3xl cursor-pointer transition-all border ${selectedPatient?.id === p.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100' : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm truncate">{p.name}</h4>
                {p.scoliosisData?.curves?.some(c => isHighRisk(c.degrees)) && <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-white shadow-sm"></span>}
              </div>
              <p className={`text-[10px] font-black uppercase mt-1 ${selectedPatient?.id === p.id ? 'text-indigo-100' : 'text-slate-400'}`}>{p.condition}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-50">
          <button onClick={() => setShowAddModal(true)} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Novo Paciente</button>
        </div>
      </div>

      {/* Prontuário Digital */}
      <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {selectedPatient ? (
          <>
            <div className="p-8 border-b border-slate-50 bg-slate-50/20">
               <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedPatient.name}</h2>
                    <div className="flex gap-2 mt-3">
                      {selectedPatient.categories?.map(c => <span key={c} className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg uppercase">{c}</span>)}
                    </div>
                  </div>
                  <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    {[
                      { id: 'Geral', label: 'Cadastro' },
                      { id: 'Scoliosis', label: 'Escoliose' },
                      { id: 'Workshop', label: 'Oficina' },
                      { id: 'Evolutions', label: 'Evoluções' }
                    ].map(sec => (
                      <button 
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id as DetailSection)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === sec.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              {activeSection === 'Geral' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
                   <div className="space-y-8">
                      <section>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ficha Cadastral</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone</p>
                               <p className="text-sm font-bold text-slate-800">{selectedPatient.phone}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Nascimento</p>
                               <p className="text-sm font-bold text-slate-800">{selectedPatient.birthDate || 'N/A'}</p>
                            </div>
                         </div>
                      </section>
                      <section>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Diagnóstico Principal</h4>
                         <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                            <p className="text-sm font-bold text-indigo-800 leading-relaxed italic">"{selectedPatient.condition}"</p>
                         </div>
                      </section>
                   </div>
                   <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Ações Rápidas</h4>
                         <div className="space-y-3">
                            <button className="w-full bg-white/10 p-4 rounded-2xl text-[10px] font-bold uppercase text-left hover:bg-white/20 transition-all flex items-center justify-between">
                               <span>Imprimir Ficha Clínica</span>
                               <span>→</span>
                            </button>
                         </div>
                      </div>
                      <button className="w-full bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-12 hover:bg-indigo-400 transition-colors shadow-lg">Nova Consulta</button>
                   </div>
                </div>
              )}

              {activeSection === 'Scoliosis' && (
                <div className="space-y-12 animate-fadeInUp">
                   <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Avaliação Especializada</h4>
                      <button 
                        onClick={() => {
                          if(selectedPatient.scoliosisData) setEvalForm(selectedPatient.scoliosisData);
                          setShowEvalModal(true);
                        }}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                      >
                        {selectedPatient.scoliosisData ? 'Editar Dados' : 'Iniciar Avaliação'}
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`p-8 rounded-[2.5rem] border shadow-sm text-center ${isHighRisk(selectedPatient.scoliosisData?.curves?.[0]?.degrees || '0') ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'}`}>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cobb Máximo</p>
                         <h3 className={`text-5xl font-black ${isHighRisk(selectedPatient.scoliosisData?.curves?.[0]?.degrees || '0') ? 'text-rose-600' : 'text-indigo-600'}`}>
                            {selectedPatient.scoliosisData?.curves?.[0]?.degrees || '--'}°
                         </h3>
                         {isHighRisk(selectedPatient.scoliosisData?.curves?.[0]?.degrees || '0') && <span className="inline-block mt-3 px-3 py-1 bg-rose-600 text-white text-[8px] font-black rounded-lg animate-pulse">ALERTA COLETE</span>}
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sinal de Risser</p>
                         <h3 className="text-5xl font-black text-amber-500">{selectedPatient.scoliosisData?.risser || '--'}</h3>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Adams Test</p>
                         <h3 className="text-5xl font-black text-indigo-500">{selectedPatient.scoliosisData?.adamsTest?.resultCm || '--'}°</h3>
                      </div>
                   </div>

                   <section className="bg-slate-900 p-10 rounded-[3rem] text-white">
                      <h4 className="text-sm font-black uppercase tracking-tight mb-8 text-indigo-300">Medidas Comparativas MMII</h4>
                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-400">Medida Real</p>
                            <div className="flex justify-between bg-white/5 p-4 rounded-2xl">
                               <span className="text-xs">MID: <b className="text-indigo-400">{selectedPatient.scoliosisData?.mmiiMeasurement?.real?.mid || '--'}cm</b></span>
                               <span className="text-xs">MIE: <b className="text-indigo-400">{selectedPatient.scoliosisData?.mmiiMeasurement?.real?.mie || '--'}cm</b></span>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-400">Medida Aparente</p>
                            <div className="flex justify-between bg-white/5 p-4 rounded-2xl">
                               <span className="text-xs">MID: <b className="text-emerald-400">{selectedPatient.scoliosisData?.mmiiMeasurement?.apparent?.mid || '--'}cm</b></span>
                               <span className="text-xs">MIE: <b className="text-emerald-400">{selectedPatient.scoliosisData?.mmiiMeasurement?.apparent?.mie || '--'}cm</b></span>
                            </div>
                         </div>
                      </div>
                   </section>
                </div>
              )}

              {activeSection === 'Evolutions' && (
                <div className="max-w-3xl space-y-10 animate-fadeIn">
                   {canEdit && (
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                        <textarea 
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                          placeholder="Registrar evolução de hoje..."
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm min-h-[140px] outline-none"
                        />
                        <div className="flex justify-end">
                           <button 
                             onClick={handleAddEvolution} 
                             disabled={isSaving}
                             className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700 disabled:opacity-50"
                           >
                             {isSaving ? 'Salvando...' : 'Registrar Evolução'}
                           </button>
                        </div>
                     </div>
                   )}

                   <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-0 before:w-1 before:bg-slate-50">
                      {selectedPatient.clinicalNotes?.map((note) => (
                        <div key={note.id} className="relative pl-16 group">
                           <div className="absolute left-4 top-5 w-5 h-5 rounded-full bg-white border-4 border-indigo-500"></div>
                           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                              <div className="flex justify-between items-center mb-6">
                                 <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-xl">{new Date(note.date).toLocaleDateString()}</span>
                                 <span className="text-[9px] font-black text-indigo-600 uppercase">Prof. {note.professional}</span>
                              </div>
                              <p className="text-slate-600 text-base leading-relaxed">{note.content}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 text-center animate-fadeIn">
             <div className="w-40 h-40 bg-slate-50 rounded-[3rem] flex items-center justify-center text-7xl mb-10">📋</div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Gestão Unificada Ortomac</h3>
             <p className="max-w-xs mt-4 text-sm font-medium text-slate-400">Escolha um paciente na lateral para ver seu histórico clínico e ordens de serviço.</p>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO STEPPER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Novo Paciente</h3>
                   <button onClick={resetAddModal} className="text-slate-400">✕</button>
                </div>
                <div className="flex gap-2">
                   {[1, 2, 3].map(step => (
                     <div key={step} className={`flex-1 h-1.5 rounded-full transition-all ${addStep >= step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                   ))}
                </div>
             </div>

             <div className="p-10 min-h-[400px]">
                {addStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                     <input placeholder="Nome Completo" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPatientData.name} onChange={e => setNewPatientData({...newPatientData, name: e.target.value})} />
                     <input placeholder="Telefone" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} />
                     <input type="date" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPatientData.birthDate} onChange={e => setNewPatientData({...newPatientData, birthDate: e.target.value})} />
                  </div>
                )}

                {addStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                     <textarea placeholder="Queixa Principal..." className="w-full p-4 bg-slate-50 border rounded-2xl font-bold min-h-[150px]" value={newPatientData.mainComplaint} onChange={e => setNewPatientData({...newPatientData, mainComplaint: e.target.value})} />
                     <textarea placeholder="Histórico Médico..." className="w-full p-4 bg-slate-50 border rounded-2xl font-bold min-h-[100px]" value={newPatientData.history} onChange={e => setNewPatientData({...newPatientData, history: e.target.value})} />
                  </div>
                )}

                {addStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                     <input placeholder="Diagnóstico Inicial" className="w-full p-4 bg-indigo-50 border-indigo-200 rounded-2xl font-black text-indigo-900" value={newPatientData.condition} onChange={e => setNewPatientData({...newPatientData, condition: e.target.value})} />
                     <div className="grid grid-cols-3 gap-3">
                        {['Escoliose', 'Oficina', 'Amputados'].map(cat => (
                          <button 
                             key={cat}
                             type="button"
                             onClick={() => {
                               const cats = [...newPatientData.categories];
                               if(cats.includes(cat)) setNewPatientData({...newPatientData, categories: cats.filter(c => c !== cat)});
                               else setNewPatientData({...newPatientData, categories: [...cats, cat]});
                             }}
                             className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${newPatientData.categories.includes(cat) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                          >
                            {cat}
                          </button>
                        ))}
                     </div>
                  </div>
                )}
             </div>

             <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex gap-4">
                {addStep > 1 && <button onClick={() => setAddStep(s => s - 1)} className="flex-1 py-4 bg-white border rounded-2xl font-black uppercase text-slate-400">Voltar</button>}
                {addStep < 3 ? (
                  <button onClick={() => setAddStep(s => s + 1)} disabled={!newPatientData.name} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase">Avançar</button>
                ) : (
                  <button onClick={handleSaveNewPatient} disabled={isSaving} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase">
                    {isSaving ? 'Sincronizando...' : 'Concluir Cadastro'}
                  </button>
                )}
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE AVALIAÇÃO */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[3.5rem] shadow-2xl overflow-hidden animate-slideUp flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">Avaliação Clínica Técnica</h3>
                 <button onClick={() => setShowEvalModal(false)} className="text-slate-400">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 <section className="space-y-6">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b">Ângulos de Cobb</h5>
                    {evalForm.curves.map((c, i) => (
                      <div key={i} className="flex gap-4">
                         <select className="flex-1 p-4 bg-slate-50 border rounded-2xl font-bold" value={c.type} onChange={e => {
                           const n = [...evalForm.curves]; n[i].type = e.target.value as any; setEvalForm({...evalForm, curves: n});
                         }}>
                            <option>Torácica</option><option>Lombar</option><option>Toracolombar</option>
                         </select>
                         <input type="number" placeholder="Graus°" className="w-32 p-4 bg-slate-50 border rounded-2xl font-black" value={c.degrees} onChange={e => {
                           const n = [...evalForm.curves]; n[i].degrees = e.target.value; setEvalForm({...evalForm, curves: n});
                         }} />
                      </div>
                    ))}
                 </section>

                 <section className="bg-slate-50 p-8 rounded-[2.5rem]">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Medidas MMII (cm)</h5>
                    <div className="grid grid-cols-2 gap-8">
                       <input placeholder="Real MID" className="p-4 bg-white border rounded-2xl font-bold" value={evalForm.mmiiMeasurement?.real.mid} onChange={e => setEvalForm({...evalForm, mmiiMeasurement: {...evalForm.mmiiMeasurement!, real: {...evalForm.mmiiMeasurement!.real, mid: e.target.value}}})} />
                       <input placeholder="Real MIE" className="p-4 bg-white border rounded-2xl font-bold" value={evalForm.mmiiMeasurement?.real.mie} onChange={e => setEvalForm({...evalForm, mmiiMeasurement: {...evalForm.mmiiMeasurement!, real: {...evalForm.mmiiMeasurement!.real, mie: e.target.value}}})} />
                    </div>
                 </section>

                 <textarea placeholder="Plano de Tratamento..." className="w-full p-8 bg-slate-900 text-white rounded-[2.5rem] min-h-[150px]" value={evalForm.physioPlan} onChange={e => setEvalForm({...evalForm, physioPlan: e.target.value})} />
              </div>

              <div className="p-8 border-t flex gap-4 bg-slate-50/50">
                 <button onClick={() => setShowEvalModal(false)} className="flex-1 py-4 bg-white border rounded-2xl font-black uppercase text-slate-400">Descartar</button>
                 <button onClick={handleSaveEval} disabled={isSaving} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase">
                    {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
