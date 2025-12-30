
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock Authentication Logic
    setTimeout(() => {
      const users: Record<string, User> = {
        'gestor@ortho.com': { id: '1', email: 'gestor@ortho.com', name: 'Dr. Ricardo (Gestor)', role: UserRole.GESTOR },
        'fisio@ortho.com': { id: '2', email: 'fisio@ortho.com', name: 'Dra. Ana (Fisioterapeuta)', role: UserRole.FISIOTERAPEUTA },
        'recepcao@ortho.com': { id: '3', email: 'recepcao@ortho.com', name: 'Carla (Secretária)', role: UserRole.RECEPCIONISTA },
        'tecnico@ortho.com': { id: '4', email: 'tecnico@ortho.com', name: 'Marcos (Técnico)', role: UserRole.TECNICO },
      };

      const user = users[email.toLowerCase()];

      if (user && password === '123456') {
        onLogin(user);
      } else {
        setError('E-mail ou senha incorretos. Tente gestor@ortho.com / 123456');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-fadeIn">
        <div className="bg-blue-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-black mb-4 shadow-xl">OP</div>
             <h1 className="text-white text-2xl font-black tracking-tight">OrthoPhysio Manager</h1>
             <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">Painel de Acesso Clínico</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold p-4 rounded-xl text-center uppercase tracking-wider animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail Corporativo</label>
              <input 
                type="email" 
                placeholder="nome@clinica.com"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Senha de Acesso</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Validando...' : 'Entrar no Sistema'}
          </button>

          <div className="text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase">Esqueceu sua senha? <span className="text-blue-600 cursor-pointer hover:underline">Solicite ao Gestor</span></p>
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">© 2024 OrthoPhysio • Versão 2.4.0 • Enterprise Cloud</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
