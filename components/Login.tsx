import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';

interface LoginProps { onLogin: (user: User) => void; }

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('gestor@ortho.com');
  const [pass, setPass] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === '123456') {
      onLogin({ id: '1', email, name: 'Dr. Ricardo', role: UserRole.GESTOR });
    } else {
      alert("Senha incorreta. Use 123456");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-indigo-500/20">OP</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">OrtoPhysio Manager</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Acesso Restrito</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">E-mail</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Senha</label>
            <input 
              type="password" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
          >
            Entrar no Sistema
          </button>
        </form>
        <p className="text-center text-[9px] text-slate-300 font-bold mt-10 uppercase tracking-widest">© 2024 OrtoPhysio v3.1</p>
      </div>
    </div>
  );
};

export default Login;