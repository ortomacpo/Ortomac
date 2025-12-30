
import React, { useState, useMemo, useEffect } from 'react';
import { Patient, UserRole } from '../types.ts';

interface PatientManagementProps {
  userRole: UserRole;
  patients: Patient[];
  onSavePatient: (patient: Patient) => Promise<void>;
  onDeletePatient: (id: string) => Promise<void>;
}

type FilterCategory = 'Todos' | 'Escoliose' | 'Oficina' | 'Amputados';
type DetailSection = 'Geral' | 'Evoluções';

const PatientManagement: React.FC<PatientManagementProps> = ({ userRole, patients, onSavePatient, onDeletePatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterCategory>('Todos');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeSection, setActiveSection] = useState<DetailSection>('Geral');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [nfUseMainAddress, setNfUseMainAddress] = useState(true);

  const isReceptionist = userRole === UserRole.RECEPCIONISTA;
  const isGestor = userRole === UserRole.GESTOR;

  const [newPatientData, setNewPatientData] = useState({
    id: '', name: '', phone: '', email: '', birth_date: '', responsible_name: '',
    address_street: '', address_neighborhood: '', address_city: '', address_state: '', address_cep: '',
    referring_type: '' as 'Spontaneous' | 'Direct' | 'Medical' | '',
    referring_professional_name: '', referring_professional_specialty: '',
    nf_full_name: '', nf_cpf: '', nf_address_street: '', nf_address_neighborhood: '',
    nf_address_city: '', nf_address_state: '', nf_address_cep: '', condition: '', categories: [] as string[],
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '--';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredPatients = useMemo(() => {
    const list = Array.isArray(patients) ? patients : [];
    const lowerSearch = searchTerm.toLowerCase().trim();
    return list.filter(p => {
      const name = p.name || '';
      const matchesSearch = lowerSearch === '' || name.toLowerCase().includes(lowerSearch);
      const pCategories = p.categories || [];
      const matchesTab = activeTab === 'Todos' || pCategories.includes(activeTab as any);
      return matchesSearch && matchesTab;
    });
  }, [patients, searchTerm, activeTab]);

  useEffect(() => {
    if (selectedPatient) {
      const freshData = patients.find(p => p.id === selectedPatient.id);
      if (freshData && JSON.stringify(freshData) !== JSON.stringify(selectedPatient)) {
        setSelectedPatient(freshData);
      }
    }
  }, [patients, selectedPatient]);

  const handleOpenEdit = (patient: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewPatientData({
      id: patient.id,
      name: patient.name,
      phone: patient.phone || '',
      email: patient.email || '',
      birth_date: patient.birth_date || '',
      responsible_name: patient.responsible_name || '',
      address_street: patient.address_street || '',
      address_neighborhood: patient.address_neighborhood || '',
      address_city: patient.address_city || '',
      address_state: patient.address_state || '',
      address_cep: patient.address_cep || '',
      referring_type: patient.referring_type || '',
      referring_professional_name: patient.referring_professional_name || '',
      referring_professional_specialty: patient.referring_professional_specialty || '',
      nf_full_name: patient.nf_full_name || '',
      nf_cpf: patient.nf_cpf || '',
      nf_address_street: patient.nf_address_street || '',
      nf_address_neighborhood: patient.nf_address_neighborhood || '',
      nf_address_city: patient.nf_address_city || '',
      nf_address_state: patient.nf_address_state || '',
      nf_address_cep: patient.nf_address_cep || '',
      condition: patient.condition || '',
      categories: patient.categories || [],
    });
    setNfUseMainAddress(
      !patient.nf_address_street || 
      patient.nf_address_street === patient.address_street
    );
    setShowAddModal(true);
  };

  const handleSaveNewPatient = async () => {
    if (!newPatientData.name.trim()) {
      alert("O nome do paciente é obrigatório.");
      return;
    }
    
    setIsSaving(true);
    const newId = isEditing ? newPatientData.id : crypto.randomUUID();
    
    const finalNfAddress = nfUseMainAddress ? {
      nf_address_street: newPatientData.address_street,
      nf_address_neighborhood: newPatientData.address_neighborhood,
      nf_address_city: newPatientData.address_city,
      nf_address_state: newPatientData.address_state,
      nf_address_cep: newPatientData.address_cep,
    } : {
      nf_address_street: newPatientData.nf_address_street,
      nf_address_neighborhood: newPatientData.nf_address_neighborhood,
      nf_address_city: newPatientData.nf_address_city,
      nf_address_state: newPatientData.nf_address_state,
      nf_address_cep: newPatientData.nf_address_cep,
    };

    const patientToSave: Patient = {
      id: newId,
      name: newPatientData.name.trim(),
      phone: newPatientData.phone,
      email: newPatientData.email,
      birth_date: newPatientData.birth_date,
      responsible_name: newPatientData.responsible_name,
      address_street: newPatientData.address_street,
      address_neighborhood: newPatientData.address_neighborhood,
      address_city: newPatientData.address_city,
      address_state: newPatientData.address_state,
      address_cep: newPatientData.address_cep,
      referring_type: newPatientData.referring_type || 'Spontaneous',
      referring_professional_name: newPatientData.referring_professional_name,
      referring_professional_specialty: newPatientData.referring_professional_specialty,
      nf_full_name: newPatientData.nf_full_name || newPatientData.name,
      nf_cpf: newPatientData.nf_cpf,
      ...finalNfAddress,
      condition: newPatientData.condition || (isEditing ? '' : 'Aguardando Avaliação'),
      last_visit: new Date().toISOString(),
      categories: newPatientData.categories as any,
      clinical_notes: selectedPatient?.clinical_notes || [],
    };

    try {
      setSearchTerm('');
      setActiveTab('Todos');
      await onSavePatient(patientToSave);
      setSelectedPatient(patientToSave);
      resetAddModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setAddStep(1);
    setNfUseMainAddress(true);
    setNewPatientData({
      id: '', name: '', phone: '', email: '', birth_date: '', responsible_name: '',
      address_street: '', address_neighborhood: '', address_city: '', address_state: '', address_cep: '',
      referring_type: '', referring_professional_name: '', referring_professional_specialty: '',
      nf_full_name: '', nf_cpf: '', nf_address_street: '', nf_address_neighborhood: '', 
      nf_address_city: '', nf_address_state: '', nf_address_cep: '', condition: '', categories: []
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] animate-fadeIn">
      
      {/* LISTA LATERAL */}
      <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-slate-50 space-y-4 bg-slate-50/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista de Pacientes</h3>
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[9px] font-black">{filteredPatients.length} Ativos</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['Todos', 'Escoliose', 'Oficina', 'Amputados'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat as FilterCategory)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-scroll p-4 space-y-3 bg-slate-50/10 scroll-smooth" style={{scrollbarWidth: 'auto'}}>
          <style>{`
            .flex-1::-webkit-scrollbar { width: 6px; }
            .flex-1::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
            .flex-1::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .flex-1::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `}</style>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  setSelectedPatient(p);
                  setActiveSection('Geral');
                }}
                className={`group p-5 rounded-[2rem] cursor-pointer transition-all border flex flex-col gap-3 ${selectedPatient?.id === p.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start w-full">
                   <div className="flex-1 min-w-0">
                     <h4 className="font-black text-sm truncate pr-2">{p.name}</h4>
                     <p className={`text-[9px] font-bold uppercase mt-0.5 ${selectedPatient?.id === p.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {p.condition || 'Prontuário Ativo'}
                     </p>
                   </div>
                   <div className="flex gap-1">
                      <button 
                        onClick={(e) => handleOpenEdit(p, e)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${selectedPatient?.id === p.id ? 'bg-white/20 hover:bg-white/40 text-white' : 'bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600'}`}
                        title="Editar"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      {isGestor && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeletePatient(p.id); }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${selectedPatient?.id === p.id ? 'bg-rose-400/30 hover:bg-rose-400 text-white' : 'bg-rose-50 hover:bg-rose-100 text-rose-400'}`}
                          title="Excluir"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      )}
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-300">
               <div className="text-4xl mb-4 opacity-20">🔎</div>
               <p className="text-[10px] font-black uppercase tracking-widest">Nenhum paciente encontrado</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-50 bg-white">
          <button onClick={() => setShowAddModal(true)} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Novo Cadastro (Recepção)</button>
        </div>
      </div>

      {/* DETALHES */}
      <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        {selectedPatient ? (
          <>
            <div className="p-8 border-b border-slate-50 bg-slate-50/20">
               <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="animate-fadeInLeft">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedPatient.name}</h2>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Idade: {calculateAge(selectedPatient.birth_date || '')} anos • Profissional: {selectedPatient.referring_professional_name || 'Allan (Interno)'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => setShowFullView(true)} className="bg-white border border-slate-200 text-slate-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      Ver Tudo
                    </button>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm ml-2">
                      {['Geral', 'Evoluções'].map(sec => (
                        <button key={sec} disabled={isReceptionist && sec !== 'Geral'} onClick={() => setActiveSection(sec as DetailSection)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeSection === sec ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 disabled:opacity-30'}`}>{sec}</button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
              {activeSection === 'Geral' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
                   <div className="space-y-8">
                      <section>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informações de Contato</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Telefone</p>
                               <p className="text-sm font-black text-slate-800">{selectedPatient.phone || '--'}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Responsável</p>
                               <p className="text-sm font-black text-slate-800">{selectedPatient.responsible_name || 'Próprio'}</p>
                            </div>
                         </div>
                      </section>
                      <section>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Endereço Residencial</h4>
                         <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100 shadow-inner">
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Logradouro</p>
                               <p className="text-sm font-black text-slate-800 leading-tight">{selectedPatient.address_street || 'Não informado'}</p>
                               <p className="text-[11px] text-slate-500 mt-2 font-bold">{selectedPatient.address_neighborhood} | {selectedPatient.address_city} - {selectedPatient.address_state}</p>
                               <p className="text-[10px] font-black text-indigo-500 mt-1">CEP: {selectedPatient.address_cep}</p>
                            </div>
                         </div>
                      </section>
                   </div>
                   
                   <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7v-2zm0 4h10v2H7v-2zm0-8h10v2H7V6z"/></svg>
                      </div>
                      <div className="relative z-10">
                         <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 tracking-[0.2em] border-b border-white/10 pb-4">Dados de Faturamento (NF)</h4>
                         <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Nome Completo para NF</p>
                               <p className="text-sm font-black text-white">{selectedPatient.nf_full_name || selectedPatient.name}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">CPF do Titular</p>
                               <p className="text-sm font-black text-white">{selectedPatient.nf_cpf || 'Não cadastrado'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Cidade de Emissão</p>
                               <p className="text-xs font-bold leading-relaxed">{selectedPatient.nf_address_city} - {selectedPatient.nf_address_state}</p>
                               <p className="text-[10px] text-indigo-400 font-black mt-1">{selectedPatient.nf_address_cep}</p>
                            </div>
                         </div>
                      </div>
                      <button onClick={(e) => handleOpenEdit(selectedPatient, e)} className="w-full bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-12 hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-900/40">Editar Prontuário</button>
                   </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 text-center animate-fadeIn bg-slate-50/10">
             <div className="w-44 h-44 bg-white rounded-[3.5rem] flex items-center justify-center text-7xl mb-10 shadow-inner border border-slate-50">📋</div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Gestão de Prontuários</h3>
             <p className="max-w-xs mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Selecione um paciente na lista lateral ao lado para visualizar os detalhes.</p>
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO TOTAL */}
      {showFullView && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[600] flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedPatient.name}</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">Ficha de Atendimento • {selectedPatient.id}</p>
                 </div>
                 <button onClick={() => setShowFullView(false)} className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-xl hover:text-slate-800 transition-all text-2xl">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <section className="space-y-6">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-6">Identificação</h5>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Idade</p>
                          <p className="text-sm font-black text-slate-800">{calculateAge(selectedPatient.birth_date || '')} anos ({selectedPatient.birth_date})</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Telefone</p>
                          <p className="text-sm font-black text-slate-800">{selectedPatient.phone || '--'}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Responsável</p>
                          <p className="text-sm font-black text-slate-800">{selectedPatient.responsible_name || 'Próprio'}</p>
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-6">Endereço Completo</h5>
                       <p className="text-sm font-black text-slate-800">{selectedPatient.address_street}</p>
                       <p className="text-sm font-bold text-slate-500">{selectedPatient.address_neighborhood}</p>
                       <p className="text-sm font-black text-indigo-600">{selectedPatient.address_city} - {selectedPatient.address_state}</p>
                       <p className="text-xs font-black text-slate-400">CEP: {selectedPatient.address_cep}</p>
                    </section>

                    <section className="space-y-6">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-6">Dados Fiscais</h5>
                       <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pagador</p>
                          <p className="text-sm font-black text-slate-800 mb-4">{selectedPatient.nf_full_name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">CPF</p>
                          <p className="text-sm font-black text-slate-800 mb-4">{selectedPatient.nf_cpf}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Cidade NF</p>
                          <p className="text-sm font-black text-indigo-600">{selectedPatient.nf_address_city} - {selectedPatient.nf_address_state}</p>
                       </div>
                    </section>
                 </div>
                 
                 <div className="pt-8 border-t border-slate-50">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Encaminhamento Clínico</h5>
                    <div className="flex gap-4">
                       <div className="bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100">
                          <p className="text-[9px] font-black text-indigo-400 uppercase">Modo de Chegada</p>
                          <p className="text-sm font-black text-indigo-900">
                            {selectedPatient.referring_type === 'Direct' ? 'Encaminhamento Direto' : 'Demanda Espontânea'}
                          </p>
                       </div>
                       {selectedPatient.referring_professional_name && (
                         <div className="bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100">
                            <p className="text-[9px] font-black text-indigo-400 uppercase">Profissional Prescritor</p>
                            <p className="text-sm font-black text-indigo-900">{selectedPatient.referring_professional_name} {selectedPatient.referring_professional_specialty ? `(${selectedPatient.referring_professional_specialty})` : ''}</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]">
             <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'Editar Prontuário' : 'Novo Atendimento'}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Passo {addStep} de 4</p>
                   </div>
                   <button onClick={resetAddModal} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm hover:text-slate-800 transition-colors">✕</button>
                </div>
                <div className="flex gap-2">
                   {[1, 2, 3, 4].map(step => (
                     <div key={step} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${addStep >= step ? 'bg-indigo-600 shadow-sm shadow-indigo-100' : 'bg-slate-200'}`}></div>
                   ))}
                </div>
             </div>

             <div className="p-10 flex-1 overflow-y-auto">
                {addStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                     <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">1. Identificação Principal</h4>
                     <input placeholder="Nome Completo do Paciente" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" value={newPatientData.name} onChange={e => setNewPatientData({...newPatientData, name: e.target.value})} />
                     <div className="grid grid-cols-2 gap-4">
                        <input type="date" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.birth_date} onChange={e => setNewPatientData({...newPatientData, birth_date: e.target.value})} />
                        <input placeholder="Telefone / WhatsApp" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} />
                     </div>
                     <input placeholder="E-mail" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.email} onChange={e => setNewPatientData({...newPatientData, email: e.target.value})} />
                  </div>
                )}
                {addStep === 2 && (
                   <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">2. Endereço do Paciente</h4>
                      <input placeholder="Logradouro e Número" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.address_street} onChange={e => setNewPatientData({...newPatientData, address_street: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                         <input placeholder="Bairro" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.address_neighborhood} onChange={e => setNewPatientData({...newPatientData, address_neighborhood: e.target.value})} />
                         <input placeholder="CEP" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.address_cep} onChange={e => setNewPatientData({...newPatientData, address_cep: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <input placeholder="Cidade" className="col-span-2 w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.address_city} onChange={e => setNewPatientData({...newPatientData, address_city: e.target.value})} />
                        <input placeholder="UF" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm text-center" maxLength={2} value={newPatientData.address_state} onChange={e => setNewPatientData({...newPatientData, address_state: e.target.value.toUpperCase()})} />
                      </div>
                   </div>
                )}
                {addStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                     <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">3. Encaminhamento Clínico</h4>
                     
                     {/* Campos de Profissional Primeiro (Sempre editáveis) */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nome do Profissional / Prescritor</label>
                          <input 
                            placeholder="Ex: Dr. Fulano de Tal" 
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                            value={newPatientData.referring_professional_name} 
                            onChange={e => setNewPatientData({...newPatientData, referring_professional_name: e.target.value})} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Especialidade</label>
                          <input 
                            placeholder="Ex: Ortopedista" 
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                            value={newPatientData.referring_professional_specialty} 
                            onChange={e => setNewPatientData({...newPatientData, referring_professional_specialty: e.target.value})} 
                          />
                        </div>
                     </div>

                     {/* Botões de Opção Separados (Não alteram o texto digitado) */}
                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Como o paciente chegou à clínica?</p>
                        <div className="flex gap-4">
                           <button 
                             type="button" 
                             onClick={() => setNewPatientData({...newPatientData, referring_type: 'Spontaneous'})}
                             className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase border transition-all ${newPatientData.referring_type === 'Spontaneous' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                           >
                             Demanda Espontânea
                           </button>
                           <button 
                             type="button" 
                             onClick={() => setNewPatientData({...newPatientData, referring_type: 'Direct'})}
                             className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase border transition-all ${newPatientData.referring_type === 'Direct' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                           >
                             Encaminhamento Direto
                           </button>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Setor de Atendimento:</p>
                        <div className="grid grid-cols-3 gap-3">
                           {['Escoliose', 'Oficina', 'Amputados'].map(cat => (
                             <button key={cat} type="button" onClick={() => {
                                  const cats = [...newPatientData.categories];
                                  if(cats.includes(cat)) setNewPatientData({...newPatientData, categories: cats.filter(c => c !== cat)});
                                  else setNewPatientData({...newPatientData, categories: [...cats, cat]});
                                }} className={`py-5 rounded-2xl text-[10px] font-black uppercase border transition-all ${newPatientData.categories.includes(cat) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{cat}</button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
                {addStep === 4 && (
                   <div className="space-y-6 animate-fadeIn">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">4. Dados Fiscais (NF)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Nome na NF" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.nf_full_name || newPatientData.name} onChange={e => setNewPatientData({...newPatientData, nf_full_name: e.target.value})} />
                        <input placeholder="CPF/CNPJ do Pagador" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm" value={newPatientData.nf_cpf} onChange={e => setNewPatientData({...newPatientData, nf_cpf: e.target.value})} />
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Endereço de Faturamento</p>
                         <div className="flex gap-4 mb-6">
                            <button type="button" onClick={() => setNfUseMainAddress(true)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${nfUseMainAddress ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-400'}`}>Igual Residencial</button>
                            <button type="button" onClick={() => setNfUseMainAddress(false)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${!nfUseMainAddress ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-400'}`}>Novo Endereço</button>
                         </div>

                         {!nfUseMainAddress && (
                            <div className="space-y-4 animate-fadeIn">
                               <input placeholder="Logradouro" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" value={newPatientData.nf_address_street} onChange={e => setNewPatientData({...newPatientData, nf_address_street: e.target.value})} />
                               <div className="grid grid-cols-2 gap-4">
                                  <input placeholder="Bairro" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" value={newPatientData.nf_address_neighborhood} onChange={e => setNewPatientData({...newPatientData, nf_address_neighborhood: e.target.value})} />
                                  <input placeholder="CEP" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" value={newPatientData.nf_address_cep} onChange={e => setNewPatientData({...newPatientData, nf_address_cep: e.target.value})} />
                               </div>
                               <div className="grid grid-cols-3 gap-4">
                                  <input placeholder="Cidade" className="col-span-2 w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm" value={newPatientData.nf_address_city} onChange={e => setNewPatientData({...newPatientData, nf_address_city: e.target.value})} />
                                  <input placeholder="UF" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm text-center" maxLength={2} value={newPatientData.nf_address_state} onChange={e => setNewPatientData({...newPatientData, nf_address_state: e.target.value.toUpperCase()})} />
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                )}
             </div>

             <div className="p-8 border-t border-slate-50 flex gap-4 bg-slate-50/30">
                {addStep > 1 && <button onClick={() => setAddStep(s => s - 1)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-slate-400 hover:bg-slate-100 transition-colors">Voltar</button>}
                {addStep < 4 ? (
                  <button onClick={() => setAddStep(s => s + 1)} disabled={addStep === 1 && !newPatientData.name} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50">Próximo</button>
                ) : (
                  <button onClick={handleSaveNewPatient} disabled={isSaving || !newPatientData.name} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-50">
                    {isSaving ? 'Gravando...' : 'Finalizar'}
                  </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
