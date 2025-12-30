
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const IndicatorsView: React.FC = () => {
  const kpis = [
    { label: 'Taxa de Retorno', value: '8.2%', trend: 'down', desc: 'Recalibragens pós-entrega' },
    { label: 'Ocupação Clínica', value: '74%', trend: 'up', desc: 'Uso das salas de fisio' },
    { label: 'Lead Time Oficina', value: '12 dias', trend: 'down', desc: 'Média de fabricação' },
    { label: 'Ticket Médio', value: 'R$ 1.250', trend: 'up', desc: 'Valor médio por venda' }
  ];

  const pieData = [
    { name: 'Próteses', value: 400 },
    { name: 'Órteses', value: 300 },
    { name: 'Fisioterapia', value: 300 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{kpi.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  kpi.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {kpi.trend === 'up' ? '↑' : '↓'}
                </span>
             </div>
             <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
             <p className="text-[10px] text-slate-500 mt-2">{kpi.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Faturamento por Segmento</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
               {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                     <span className="text-xs font-medium text-slate-600">{item.name}</span>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Eficiência da Oficina (Dias)</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{m:'Set', d:14}, {m:'Out', d:13}, {m:'Nov', d:12}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="m" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Bar dataKey="d" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default IndicatorsView;
