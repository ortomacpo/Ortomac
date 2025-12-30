
import React from 'react';
import { InventoryItem } from '../types';

interface InventoryManagementProps {
  items: InventoryItem[];
  onUpdateInventory: (items: InventoryItem[]) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ items, onUpdateInventory }) => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Estoque de Materiais</h2>
          <p className="text-sm text-slate-500">Controle de insumos da oficina e clínica</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-100 transition hover:bg-emerald-700">
          + ADICIONAR ITEM
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total de Itens</p>
            <p className="text-2xl font-bold text-slate-800">{items.length}</p>
         </div>
         <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm">
            <p className="text-[10px] font-bold text-rose-400 uppercase">Estoque Baixo</p>
            <p className="text-2xl font-bold text-rose-600">
              {items.filter(i => i.quantity <= i.min_quantity).length}
            </p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Quantidade</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Ref: {item.id}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.quantity} {item.unit}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                    item.quantity <= item.min_quantity 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.quantity <= item.min_quantity ? 'REPOR URGENTE' : 'ESTÁVEL'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
