
import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryManagementProps {
  items: InventoryItem[];
  onUpdateInventory: (item: InventoryItem) => Promise<void>;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ items, onUpdateInventory }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Resinas', quantity: 0, unit: 'Un', min_quantity: 1 });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: formData.name,
      category: formData.category as any,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      min_quantity: Number(formData.min_quantity)
    };
    await onUpdateInventory(newItem);
    setIsSaving(false);
    setShowAddModal(false);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Almoxarifado Ortomac</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Controle de Insumos & Matéria-Prima</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-50 hover:bg-emerald-700 transition-all">
          + Entrada de Material
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Material</th>
              <th className="px-8 py-5">Categoria</th>
              <th className="px-8 py-5">Qtd Atual</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition cursor-default group">
                <td className="px-8 py-6 font-black text-slate-800 text-sm">{item.name}</td>
                <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.category}</td>
                <td className="px-8 py-6 font-black text-slate-700">{item.quantity} {item.unit}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                    item.quantity <= item.min_quantity 
                    ? 'bg-rose-50 text-rose-600 border-rose-100' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {item.quantity <= item.min_quantity ? 'Reposição Urgente' : 'Estoque Saudável'}
                  </span>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-xs opacity-50 italic">Nenhum material cadastrado no banco.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-fadeInUp">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Novo Material</h3>
             <form onSubmit={handleSave} className="space-y-5">
                <input placeholder="Nome do Material" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                   {['Resinas', 'Metais', 'Tecidos', 'Componentes', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                   <input type="number" placeholder="Qtd" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                   <input placeholder="Unidade (Ex: Kg, Un)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                </div>
                <button disabled={isSaving} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-50 mt-4">Confirmar Entrada</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
