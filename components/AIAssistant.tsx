import React, { useState } from 'react';
import { getGeminiAnalysis } from '../services/geminiService.ts';

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

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl">✨</div>
          <h2 className="text-3xl font-black">Cérebro OrtoPhysio</h2>
        </div>
        <textarea
          className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-slate-500 focus:outline-none min-h-[120px] mb-6"
          placeholder="Ex: Como otimizar o tempo de cura da resina em próteses transtibiais?"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button 
          onClick={handleAnalysis} 
          disabled={loading}
          className="bg-indigo-600 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all"
        >
          {loading ? 'Consultando...' : 'Analisar'}
        </button>
      </div>
      {result && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-fadeIn">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Diagnóstico da IA</h3>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;