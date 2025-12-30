
import React, { useState } from 'react';
import { getGeminiAnalysis } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const analysis = await getGeminiAnalysis(prompt);
    setResult(analysis);
    setLoading(false);
  };

  const quickPrompts = [
    "Reduzir lead-time da oficina",
    "Protocolo Escoliose Risser 3",
    "Fidelização de pacientes",
    "Otimizar estoque resina"
  ];

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto space-y-8">
      <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <svg className="w-48 h-48 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">✨</div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Cérebro OrtoPhysio</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Inteligência Estratégica & Clínica</p>
            </div>
          </div>

          <div className="relative group">
            <textarea
              className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all min-h-[160px] text-lg font-medium resize-none"
              placeholder="Digite sua dúvida ou peça uma análise estratégica..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleAnalysis}
              disabled={loading}
              className="absolute bottom-6 right-6 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-900/40 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Processando...</span>
                </div>
              ) : 'Analisar Agora'}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="text-[9px] uppercase font-black tracking-widest px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm animate-fadeInUp">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">💡</div>
            <h3 className="font-black text-slate-800 text-xl tracking-tight">Diagnóstico Inteligente</h3>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {result}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-md">Análise baseada em parâmetros clínicos internacionais e dados internos da clínica.</p>
            <div className="flex gap-2">
               <button className="px-6 py-3 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-xl hover:bg-slate-100 transition-colors">Ignorar</button>
               <button className="px-6 py-3 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors">Aplicar Recomendações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
