
import React from 'react';
import { MOCK_FINANCE } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const FinanceDashboard: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-200 text-white">
          <p className="text-emerald-100 text-sm font-medium">Receita Total Bruta</p>
          <h2 className="text-3xl font-bold mt-1">R$ 48.000,00</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-emerald-700/50 w-fit px-2 py-1 rounded">
             <span className="text-emerald-300">↑ 12.5%</span> vs mês anterior
          </div>
        </div>
        <div className="bg-rose-600 p-6 rounded-2xl shadow-lg shadow-rose-200 text-white">
          <p className="text-rose-100 text-sm font-medium">Despesas Fixas e Variáveis</p>
          <h2 className="text-3xl font-bold mt-1">R$ 31.000,00</h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-rose-700/50 w-fit px-2 py-1 rounded">
             <span className="text-rose-300">↓ 2.1%</span> vs mês anterior
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-blue-500">
          <p className="text-slate-400 text-sm font-medium">Margem Líquida</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-800">R$ 17.000,00</h2>
          <div className="mt-4 text-xs font-medium text-slate-500">
             Eficiência operacional: <span className="text-blue-600">35.4%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Comparativo Receita x Despesa</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FINANCE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Fluxo de Caixa (Tendência)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FINANCE}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
