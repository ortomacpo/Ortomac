
import React, { useState, useMemo } from 'react';
import { Patient, UserRole } from '../types.ts';

interface PatientManagementProps {
  userRole: UserRole;
  patients: Patient[];
  onSavePatient: (patient: Patient) => Promise<void | boolean>;
  onDeletePatient: (id: string) => Promise<void>;
  onOpenScoliosis: (patientId: string) => void;
}

type FilterCategory = 'Todos' | 'Escoliose' | 'Amputados' | 'Oficina';
type FormTab = 'identificacao' | 'endereco' | 'encaminhamento' | 'faturamento' | 'clinico';

const PatientManagement: React.FC<PatientManagementProps> = ({ userRole, patients, onSavePatient, onDeletePatient, onOpenScoliosis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterCategory>('Todos');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<FormTab>('identificacao');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [billingAddressMode, setBillingAddressMode] = useState<'same' | 'new'>('same');

  const [newPatientData, setNewPatientData] = useState<any>({
    id: '', name: '', phone: '', email: '', birth_date: '', 
    responsible_name: '', responsible_cpf: '', triagem_obs: '',
    address_street: '', address_neighborhood: '', address_city: '', address_state: '', address_cep: '',
    referring_type: 'Spontaneous', referring_professional_name: '', referring_professional_specialty: '',
    nf_full_name: '', nf_cpf: '', nf_address_street: '', nf_address_neighborhood: '',
    nf_address_city: '', nf_address_state: '', nf_address_cep: '',
    condition: '', categories: [] as string[],
  });

  const filteredPatients = useMemo(() => {
    const list = Array.isArray(patients) ? patients : [];
    const lowerSearch = searchTerm.toLowerCase().trim();
    return list.filter(p => {
      const name = p.name || '';
      const matchesSearch = lowerSearch === '' || name.toLowerCase().includes(lowerSearch);
      const pCategories = p.categories || [];
      const matchesTab = activeTab === 'Todos' || pCategories.includes(activeTab);
      return matchesSearch && matchesTab;
    });
  }, [patients, searchTerm, activeTab]);

  const handleOpenEdit = (patient: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewPatientData({ ...patient });
    setBillingAddressMode(patient.nf_address_street ? 'new' : 'same');
    setShowAddModal(true);
    setActiveFormTab('identificacao');
  };

  const handleSaveNewPatient = async () => {
    if (!newPatientData.name.trim()) return alert("O nome do paciente é obrigatório!");
    
    setIsSaving(true);
    try {
      const newId = isEditing ? newPatientData.id : crypto.randomUUID();
      
      const finalPatientData = { ...newPatientData };
      if (billingAddressMode === 'same') {
        finalPatientData.nf_address_street = '';
        finalPatientData.nf_address_neighborhood = '';
        finalPatientData.nf_address_city = '';
        finalPatientData.nf_address_state = '';
        finalPatientData.nf_address_cep = '';
      }

      const categories = finalPatientData.categories || [];
      const isEscoliose = categories.includes('Escoliose');
      const isFisioDest = categories.some((c: string) => c === 'Escoliose' || c === 'Amputados');
      const isOficinaDest = categories.includes('Oficina');

      const patientToSave: any = {
        ...finalPatientData,
        id: newId,
        last_visit: new Date().toISOString(),
        pending_physio_eval: isFisioDest ? true : (isEditing ? finalPatientData.pending_physio_eval : false),
        pending_workshop_eval: isOficinaDest ? true : (isEditing ? finalPatientData.pending_workshop_eval : false),
      };

      await onSavePatient(patientToSave);
      
      const savedId = patientToSave.id;
      resetAddModal();
      
      // Feedback visual de sucesso e redirecionamento se necessário
      if (isEscoliose) {
        onOpenScoliosis(savedId);
      } else {
        alert("Paciente cadastrado com sucesso!");
      }
    } catch (err: any) {
      console.error("Erro no formulário:", err);
      alert("Houve um erro ao processar o cadastro. Detalhes: " + (err.message || "Erro de conexão"));
    } finally {
      setIsSaving(false);
    }
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setActiveFormTab('identificacao');
    setBillingAddressMode('same');
    setNewPatientData({
      id: '', name: '', phone: '', email: '', birth_date: '', responsible_name: '',
      responsible_cpf: '', triagem_obs: '',
      address_street: '', address_neighborhood: '', address_city: '', address_state: '', address_cep: '',
      referring_type: 'Spontaneous', referring_professional_name: '', referring_professional_specialty: '',
      nf_full_name: '', nf_cpf: '', nf_address_street: '', nf_address_neighborhood: '', 
      nf_address_city: '', nf_address_state: '', nf_address_cep: '', condition: '', categories: []
    });
  };

  const toggleCategory = (category: string) => {
    const current = newPatientData.categories || [];
    if (current.includes(category)) {
      setNewPatientData({...newPatientData, categories: current.filter((c: string) => c !== category)});
    } else {
      setNewPatientData({...newPatientData, categories: [...current, category]});
    }
  };

  const tabs: FormTab[] = ['identificacao', 'endereco', 'encaminhamento', 'faturamento', 'clinico'];
  const currentStep = tabs.indexOf(activeFormTab) + 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] animate-fadeIn">
      
      {/* LISTA DE PACIENTES */}
      <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50 space-y-4 bg-slate-50/30">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prontuários Ativos</h3>
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest">NUVEM</span>
          </div>
          <div className="relative">
            <input type="text" placeholder="Localizar paciente..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {filteredPatients.map(p => (
            <div key={p.id} onClick={() => setSelectedPatient(p)} className={`p-5 rounded-[2rem] cursor-pointer transition-all border ${selectedPatient?.id === p.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
              <h4 className="font-black text-sm truncate">{p.name}</h4>
              <p className={`text-[9px] font-bold uppercase mt-0.5 ${selectedPatient?.id === p.id ? 'text-indigo-400' : 'text-slate-400'}`}>{p.phone || 'Sem telefone'}</p>
            </div>
          ))}
          {filteredPatients.length === 0 && (
            <div className="py-10 text-center text-slate-300 uppercase text-[10px] font-black tracking-widest opacity-50">Nenhum paciente encontrado</div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-50">
          <button onClick={() => { setIsEditing(false); setShowAddModal(true); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Novo Registro</button>
        </div>
      </div>

      {/* DETALHES DO PACIENTE */}
      <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
        {selectedPatient ? (
          <div className="p-12 space-y-12 overflow-y-auto scrollbar-hide">
             <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{selectedPatient.name}</h2>
                   <div className="flex flex-wrap gap-2 mt-4">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${selectedPatient.referring_type === 'Spontaneous' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                         {selectedPatient.referring_type === 'Spontaneous' ? 'Entrada Espontânea' : 'Encaminhamento Direto'}
                      </span>
                      {selectedPatient.categories?.map((c: string) => (
                        <span key={c} className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[9px] font-black uppercase">{c}</span>
                      ))}
                      {selectedPatient.pending_physio_eval && <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase">Avaliação Clínica Pendente</span>}
                      {selectedPatient.pending_workshop_eval && <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase">Aguardando Oficina</span>}
                   </div>
                </div>
                <div className="flex gap-4">
                  {(userRole === UserRole.GESTOR || userRole === UserRole.FISIOTERAPEUTA) && selectedPatient.categories?.includes('Escoliose') && (
                    <button 
                      onClick={() => onOpenScoliosis(selectedPatient.id)}
                      className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      Prontuário Especializado
                    </button>
                  )}
                  <button onClick={(e) => handleOpenEdit(selectedPatient, e)} className="bg-white text-slate-400 p-4 rounded-2xl hover:text-indigo-600 transition-all border border-slate-200 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                  {userRole === UserRole.GESTOR && (
                    <button onClick={() => { if(confirm('Excluir paciente permanentemente?')) onDeletePatient(selectedPatient.id); }} className="bg-white text-rose-400 p-4 rounded-2xl hover:text-rose-600 transition-all border border-slate-200 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">Identificação & Contato</h4>
                      <div className="space-y-4">
                         <div><label className="text-[8px] font-black text-slate-300 uppercase">Telefone</label><p className="font-black text-slate-700">{selectedPatient.phone || '--'}</p></div>
                         <div><label className="text-[8px] font-black text-slate-300 uppercase">Residência</label>
                            <p className="font-bold text-slate-600 text-xs">
                               {selectedPatient.address_street || 'Não informado'} {selectedPatient.address_city ? `- ${selectedPatient.address_city}` : ''} {selectedPatient.address_state ? `, ${selectedPatient.address_state}` : ''}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-100">
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">Referência Profissional</h4>
                      <div className="space-y-4">
                         <p><span className="text-slate-400 font-black text-[8px] block uppercase">Profissional Solicitante</span> {selectedPatient.referring_professional_name || 'Nenhum registro'}</p>
                         <p><span className="text-slate-400 font-black text-[8px] block uppercase">Especialidade</span> {selectedPatient.referring_professional_specialty || 'Não informado'}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Diagnóstico Principal</h4>
                      <p className="font-black text-xl text-indigo-300">{selectedPatient.condition || 'Sem diagnóstico inicial'}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Notas de Triagem</h4>
                      <p className="text-sm font-medium text-slate-600 italic">
                         {selectedPatient.triagem_obs || "Sem observações registradas."}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
             <div className="text-[10rem]">📁</div>
             <p className="font-black uppercase tracking-[0.5em] text-sm">Selecione um Paciente</p>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-3xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-fadeInUp">
             
             {/* HEADER COM PROGRESSO */}
             <div className="p-8 px-12 pt-10">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Novo Atendimento</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">PASSO {currentStep} DE 5</p>
                   </div>
                   <button onClick={resetAddModal} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all border border-slate-100 shadow-sm">✕</button>
                </div>
                
                <div className="flex gap-2 h-2 mb-4">
                   {tabs.map((_, i) => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                   ))}
                </div>
             </div>

             <div className="px-12 pb-12 flex-1 overflow-y-auto">
                {activeFormTab === 'identificacao' && (
                  <div className="space-y-8 animate-fadeIn pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Nome Completo</label>
                           <input placeholder="Ex: João Silva" className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all" value={newPatientData.name} onChange={e => setNewPatientData({...newPatientData, name: e.target.value})} />
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">WhatsApp</label>
                           <input placeholder="(00) 00000-0000" className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} />
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Nascimento</label>
                           <input type="date" className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm uppercase outline-none" value={newPatientData.birth_date} onChange={e => setNewPatientData({...newPatientData, birth_date: e.target.value})} />
                        </div>
                     </div>
                  </div>
                )}

                {activeFormTab === 'endereco' && (
                  <div className="space-y-6 animate-fadeIn pt-4">
                     <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-4">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Rua/Logradouro</label>
                           <input placeholder="Rua..." className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.address_street} onChange={e => setNewPatientData({...newPatientData, address_street: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">CEP</label>
                           <input placeholder="00000-000" className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.address_cep} onChange={e => setNewPatientData({...newPatientData, address_cep: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Bairro</label>
                           <input placeholder="Bairro..." className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.address_neighborhood} onChange={e => setNewPatientData({...newPatientData, address_neighborhood: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Cidade</label>
                           <input placeholder="Cidade..." className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.address_city} onChange={e => setNewPatientData({...newPatientData, address_city: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-2 block">Estado</label>
                           <input placeholder="UF" className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" value={newPatientData.address_state} onChange={e => setNewPatientData({...newPatientData, address_state: e.target.value})} />
                        </div>
                     </div>
                  </div>
                )}

                {activeFormTab === 'encaminhamento' && (
                  <div className="space-y-10 animate-fadeIn pt-4">
                     <div className="space-y-4">
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">O paciente veio por:</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <button 
                             onClick={() => setNewPatientData({...newPatientData, referring_type: 'Spontaneous'})}
                             className={`p-8 rounded-[2.5rem] border-2 transition-all text-center ${newPatientData.referring_type === 'Spontaneous' ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-50' : 'border-slate-50 text-slate-300 bg-slate-50/30'}`}
                           >
                              <p className={`text-[11px] font-black uppercase tracking-widest ${newPatientData.referring_type === 'Spontaneous' ? 'text-indigo-600' : ''}`}>Demanda Espontânea</p>
                           </button>
                           <button 
                             onClick={() => setNewPatientData({...newPatientData, referring_type: 'Direct'})}
                             className={`p-8 rounded-[2.5rem] border-2 transition-all text-center ${newPatientData.referring_type === 'Direct' ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-50' : 'border-slate-50 text-slate-300 bg-slate-50/30'}`}
                           >
                              <p className={`text-[11px] font-black uppercase tracking-widest ${newPatientData.referring_type === 'Direct' ? 'text-indigo-600' : ''}`}>Encaminhamento Direto</p>
                           </button>
                        </div>
                     </div>

                     <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação do Profissional Solicitante</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <input placeholder="Nome do Médico/Fisioterapeuta" className="w-full p-6 bg-white border border-slate-200 rounded-[2rem] font-black text-sm shadow-sm outline-none" value={newPatientData.referring_professional_name} onChange={e => setNewPatientData({...newPatientData, referring_professional_name: e.target.value})} />
                           </div>
                           <div>
                              <input placeholder="Especialidade" className="w-full p-6 bg-white border border-slate-200 rounded-[2rem] font-black text-sm shadow-sm outline-none" value={newPatientData.referring_professional_specialty} onChange={e => setNewPatientData({...newPatientData, referring_professional_specialty: e.target.value})} />
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeFormTab === 'faturamento' && (
                  <div className="space-y-12 animate-fadeIn pt-4">
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">4. DADOS FISCAIS (NF)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input 
                             placeholder="Nome para Nota Fiscal" 
                             className="w-full p-7 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" 
                             value={newPatientData.nf_full_name} 
                             onChange={e => setNewPatientData({...newPatientData, nf_full_name: e.target.value})} 
                           />
                           <input 
                             placeholder="CPF/CNPJ do Pagador" 
                             className="w-full p-7 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none" 
                             value={newPatientData.nf_cpf} 
                             onChange={e => setNewPatientData({...newPatientData, nf_cpf: e.target.value})} 
                           />
                        </div>
                     </div>

                     <div className="p-10 border border-slate-100 rounded-[3.5rem] bg-slate-50/30 space-y-8">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">ENDEREÇO DE FATURAMENTO</h5>
                        <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-lg mx-auto">
                           <button 
                             onClick={() => setBillingAddressMode('same')}
                             className={`flex-1 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${billingAddressMode === 'same' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                             IGUAL RESIDENCIAL
                           </button>
                           <button 
                             onClick={() => setBillingAddressMode('new')}
                             className={`flex-1 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${billingAddressMode === 'new' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                             NOVO ENDEREÇO
                           </button>
                        </div>

                        {billingAddressMode === 'new' && (
                           <div className="grid grid-cols-6 gap-4 mt-6 animate-fadeIn">
                              <div className="col-span-4">
                                 <input placeholder="Rua/Av..." className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" value={newPatientData.nf_address_street} onChange={e => setNewPatientData({...newPatientData, nf_address_street: e.target.value})} />
                              </div>
                              <div className="col-span-2">
                                 <input placeholder="CEP" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" value={newPatientData.nf_address_cep} onChange={e => setNewPatientData({...newPatientData, nf_address_cep: e.target.value})} />
                              </div>
                              <div className="col-span-2">
                                 <input placeholder="Bairro" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" value={newPatientData.nf_address_neighborhood} onChange={e => setNewPatientData({...newPatientData, nf_address_neighborhood: e.target.value})} />
                              </div>
                              <div className="col-span-2">
                                 <input placeholder="Cidade" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" value={newPatientData.nf_address_city} onChange={e => setNewPatientData({...newPatientData, nf_address_city: e.target.value})} />
                              </div>
                              <div className="col-span-2">
                                 <input placeholder="Estado (UF)" className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm" value={newPatientData.nf_address_state} onChange={e => setNewPatientData({...newPatientData, nf_address_state: e.target.value})} />
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                )}

                {activeFormTab === 'clinico' && (
                  <div className="space-y-12 animate-fadeIn pt-4">
                     <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">SETOR DE ATENDIMENTO:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {['Escoliose', 'Oficina', 'Amputados'].map((sector) => (
                             <button
                               key={sector}
                               type="button"
                               onClick={() => toggleCategory(sector)}
                               className={`py-8 rounded-[2.5rem] border transition-all text-[12px] font-black uppercase tracking-widest ${
                                 newPatientData.categories?.includes(sector)
                                   ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500'
                                   : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:bg-slate-100'
                               }`}
                             >
                               {sector}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
             </div>

             <div className="p-12 border-t border-slate-50 bg-slate-50/20 flex gap-6">
                <button 
                  onClick={() => {
                    if (currentStep > 1) {
                      setActiveFormTab(tabs[currentStep - 2]);
                    } else {
                      resetAddModal();
                    }
                  }} 
                  className="flex-1 py-7 bg-white border border-slate-200 rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all shadow-sm"
                >
                  {currentStep === 1 ? 'CANCELAR' : 'VOLTAR'}
                </button>
                
                {activeFormTab !== 'clinico' ? (
                   <button 
                     onClick={() => setActiveFormTab(tabs[currentStep])} 
                     className="flex-1 py-7 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                   >
                     PRÓXIMA ETAPA ➔
                   </button>
                ) : (
                   <button 
                     onClick={handleSaveNewPatient} 
                     disabled={isSaving} 
                     className="flex-1 py-7 bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-600 transition-all"
                   >
                     {isSaving ? 'SALVANDO...' : 'FINALIZAR'}
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
