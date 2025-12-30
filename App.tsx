
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
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const fetchData = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const [pRes, oRes, iRes, aRes] = await Promise.all([
        supabase.from('patients').select('*').order('name'),
        supabase.from('workshop_orders').select('*').order('deadline', { ascending: false }),
        supabase.from('inventory').select('*').order('name'),
        supabase.from('appointments').select('*').order('time')
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

  const handleSavePatient = async (patient: Patient) => {
    setIsSyncing(true);
    try {
      // Garantimos que o objeto enviado respeita o esquema snake_case
      const { error } = await supabase.from('patients').upsert(patient);
      if (error) throw error;
      await fetchData(); // Recarrega para garantir sincronia
    } catch (error: any) {
      console.error("Erro Supabase:", error);
      alert("Falha ao salvar no servidor. Verifique se todas as colunas existem no banco.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    const role = currentUser.role;
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />;
      case AppView.PATIENTS: return <PatientManagement userRole={role} patients={patients} onSavePatient={handleSavePatient} />;
      case AppView.WORKSHOP: return <WorkshopManagement userRole={role} orders={orders} onUpdateOrders={setOrders} />;
      case AppView.INVENTORY: return <InventoryManagement items={inventory} onUpdateInventory={setInventory} />;
      case AppView.FINANCES: return <FinanceDashboard />;
      case AppView.INDICATORS: return <IndicatorsView />;
      case AppView.AI_INSIGHTS: return <AIAssistant />;
      case AppView.CALENDAR: return <CalendarView appointments={appointments} onUpdateAppointments={setAppointments} />;
      default: return <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-['Inter']">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={currentUser.role} onLogout={handleLogout} userName={currentUser.name} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="animate-fadeInLeft">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter capitalize">{currentView.replace('_', ' ')}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{isSyncing ? "Sincronizando..." : "Conectado"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2.5 pr-5 rounded-2.5xl border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">{currentUser.name.charAt(0)}</div>
             <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">{currentUser.role}</p>
                <p className="text-xs font-black text-slate-800">{currentUser.name.split(' ')[0]}</p>
             </div>
          </div>
        </header>
        <div className="animate-fadeInUp">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
