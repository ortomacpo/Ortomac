
import React, { useState, useEffect } from 'react';
import { AppView, UserRole, Patient, WorkshopOrder, InventoryItem, Appointment, User } from './types';
import { supabase } from './services/supabaseClient';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import WorkshopManagement from './components/WorkshopManagement';
import InventoryManagement from './components/InventoryManagement';
import FinanceDashboard from './components/FinanceDashboard';
import IndicatorsView from './components/IndicatorsView';
import AIAssistant from './components/AIAssistant';
import CalendarView from './components/CalendarView';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [orders, setOrders] = useState<WorkshopOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ortho_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchData = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    
    try {
      const [pRes, oRes, iRes, aRes] = await Promise.all([
        supabase.from('patients').select('*').order('name'),
        supabase.from('workshop_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').order('name'),
        supabase.from('appointments').select('*').order('appointment_date')
      ]);

      if (pRes.data) setPatients(pRes.data);
      if (oRes.data) setOrders(oRes.data);
      if (iRes.data) setInventory(iRes.data);
      if (aRes.data) setAppointments(aRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'workshop_orders' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchData())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ortho_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ortho_session');
  };

  const handleUpdatePatients = async (newPatients: Patient[]) => {
    setPatients(newPatients);
    const lastPatient = newPatients.find(p => !patients.some(op => op.id === p.id && JSON.stringify(op) === JSON.stringify(p)));
    if (lastPatient) await supabase.from('patients').upsert(lastPatient);
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    const role = currentUser.role;
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />;
      case AppView.PATIENTS: return <PatientManagement userRole={role} patients={patients} onUpdatePatients={handleUpdatePatients} />;
      case AppView.WORKSHOP: return <WorkshopManagement userRole={role} orders={orders} onUpdateOrders={setOrders} />;
      case AppView.INVENTORY: return <InventoryManagement items={inventory} onUpdateInventory={setInventory} />;
      case AppView.FINANCES: return role !== UserRole.GESTOR ? <AccessRestricted /> : <FinanceDashboard />;
      case AppView.INDICATORS: return role !== UserRole.GESTOR ? <AccessRestricted /> : <IndicatorsView />;
      case AppView.AI_INSIGHTS: return <AIAssistant />;
      case AppView.CALENDAR: return <CalendarView appointments={appointments} onUpdateAppointments={setAppointments} />;
      default: return <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-['Inter']">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        userRole={currentUser.role} 
        onLogout={handleLogout}
        userName={currentUser.name}
      />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="animate-fadeInLeft">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter capitalize">
              {currentView.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                {isSyncing ? "Sincronizando com a Nuvem..." : "Sistema Online & Seguro"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 animate-fadeIn">
             <div className="hidden md:flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm mr-2">
                <button onClick={() => setCurrentView(AppView.PATIENTS)} className="p-2 hover:bg-slate-50 rounded-xl transition-all" title="Novo Paciente">
                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                </button>
                <div className="w-px h-8 bg-slate-100 mx-1 self-center"></div>
                <button onClick={() => setCurrentView(AppView.CALENDAR)} className="p-2 hover:bg-slate-50 rounded-xl transition-all" title="Agenda">
                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </button>
             </div>
             
             <div className="flex items-center gap-4 bg-white p-2.5 pr-5 rounded-2.5xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                   {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">{currentUser.role}</p>
                   <p className="text-xs font-black text-slate-800">{currentUser.name.split(' ')[0]}</p>
                </div>
             </div>
          </div>
        </header>
        
        <div className="animate-fadeInUp">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const AccessRestricted = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 text-3xl mb-6">🔒</div>
    <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Área de Acesso Restrito</h3>
    <p className="text-sm text-slate-400 max-w-xs font-medium">Apenas gestores da OrtoPhysio podem acessar o módulo estratégico e financeiro.</p>
    <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Voltar ao Painel</button>
  </div>
);

export default App;
