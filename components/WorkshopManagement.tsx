
import React, { useState } from 'react';
import { WorkshopStatus, WorkshopOrder, UserRole, Patient } from '../types';

interface WorkshopManagementProps {
  userRole: UserRole;
  orders: WorkshopOrder[];
  patients: Patient[];
  onSaveOrder: (order: WorkshopOrder) => Promise<void>;
}

const WorkshopManagement: React.FC<WorkshopManagementProps> = ({ userRole, orders, patients, onSaveOrder }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    product: '',
    deadline: '',
    price: 0,
    technical_notes: ''
  });

  const columns = [
    { id: 'prep', title: 'Medição & Molde', statuses: [WorkshopStatus.MEASURING, WorkshopStatus.MOLDING], color: 'indigo' },
    { id: 'prod', title: 'Fabricação / Acabamento', statuses: [WorkshopStatus.MANUFACTURING, WorkshopStatus.FINISHING], color: 'amber' },
    { id: 'ready', title: 'Entrega Finalizada', statuses: [WorkshopStatus.READY, WorkshopStatus.DELIVERED], color: 'emerald' }
  ];

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.product) return;
    
    setIsSaving(true);
    const patient = patients.find(p => p.id === formData.patient_id);
    
    const newOrder: WorkshopOrder = {
      id: `OS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      patient_id: formData.patient_id,
      patient_name: patient?.name || 'Não identificado',
      product: formData.product,
      status: WorkshopStatus.MEASURING,
      deadline: formData.deadline,
      price: Number(formData.price)
    };

    try {
      await onSaveOrder(newOrder);
      setShowAddModal(false);
      setFormData({ patient_id: '', product: '', deadline: '', price: 0, technical_notes: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderStatus = async (order: WorkshopOrder, nextStatus: WorkshopStatus) => {
    const updated = { ...order, status: nextStatus };
    await onSaveOrder(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Chão de Fábrica Ortomac</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gerenciamento Técnico de Produção</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          Abrir Ordem de Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
        {columns.map(col => (
          <div key={col.id} className="bg-slate-100/40 rounded-[3rem] p-8 flex flex-col border border-slate-50/50">
             <div className="flex justify-between items-center mb-10 px-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{col.title}</h3>
                <span className={`bg-white text-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm border border-slate-100`}>
                  {orders.filter(o => col.statuses.includes(o.status)).length}
                </span>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                {orders.filter(o => col.statuses.includes(o.status)).map(order => (
                  <div 
                    key={order.id} 
                    className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 bg-${col.color}-500 transition-all`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{order.id}</span>
                      <div className="flex gap-2">
                        {new Date(order.deadline) < new Date() && order.status !== WorkshopStatus.DELIVERED && (
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        )}
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase border ${new Date(order.deadline) < new Date() ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                           Até {new Date(order.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{order.product}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.patient_name}</p>
                    
                    <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-5">
                       <span className={`text-[9px] font-black uppercase text-${col.color}-600 bg-${col.color}-50 px-2 py-1 rounded-lg`}>
                         {order.status}
                       </span>
                       <div className="flex gap-1">
                          <button 
                            title="Avançar Status"
                            onClick={(e) => {
                              e.stopPropagation();
                              const statusOrder = [
                                WorkshopStatus.MEASURING, WorkshopStatus.MOLDING, 
                                WorkshopStatus.MANUFACTURING, WorkshopStatus.FINISHING, 
                                WorkshopStatus.READY, WorkshopStatus.DELIVERED
                              ];
                              const nextIdx = statusOrder.indexOf(order.status) + 1;
                              if(nextIdx < statusOrder.length) updateOrderStatus(order, statusOrder[nextIdx]);
                            }}
                            className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5-5 5M6 7l5 5-5 5"/></svg>
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
                
                {orders.filter(o => col.statuses.includes(o.status)).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale select-none">
                    <div className="text-7xl mb-6">📦</div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Sem OS nesta etapa</p>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[400] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-fadeInUp">
             <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nova Ordem de Serviço</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">✕</button>
             </div>
             
             <form onSubmit={handleCreateOrder} className="p-10 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Paciente</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={formData.patient_id}
                    onChange={e => setFormData({...formData, patient_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione o paciente...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Produto / Serviço</label>
                  <input 
                    placeholder="Ex: Órtese TLSO, Palmilha de Apoio..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                    value={formData.product}
                    onChange={e => setFormData({...formData, product: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Prazo de Entrega</label>
                    <input 
                      type="date"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Valor Estimado (R$)</label>
                    <input 
                      type="number"
                      className="w-full p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl font-black"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-indigo-100"
                  >
                    {isSaving ? 'Gerando OS...' : 'Confirmar OS'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopManagement;
