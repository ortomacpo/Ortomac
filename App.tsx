
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserRole, Patient, WorkshopOrder, InventoryItem, Appointment, User, WorkshopStatus } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { MOCK_PATIENTS } from './constants.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import PatientManagement from './components/PatientManagement.tsx';
import WorkshopManagement from './components/WorkshopManagement.tsx';
import InventoryManagement from './components/InventoryManagement.tsx';
import FinanceDashboard from './components/FinanceDashboard.tsx';
import IndicatorsView from './components/IndicatorsView.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import CalendarView from './components/CalendarView.tsx';
import Login from './components/Login.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [orders, setOrders] = useState<WorkshopOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 1. CARREGAMENTO DA SESSÃO
  useEffect(() => {
    const savedUser = localStorage.getItem('ortho_session');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('ortho_session'); }
    }
  }, []);

  // 2. FUNÇÃO MESTRA DE SINCRONIZAÇÃO
  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    
    try {
      // Busca Pacientes
      const { data: pData } = await supabase.from('patients').select('*').order('name');
      if (pData) setPatients(pData.map(p => ({ ...p, ...(p.metadata || {}) })));

      // Busca Oficina
      const { data: oData } = await supabase.from('workshop_orders').select('*').order('created_at', { ascending: false });
      if (oData) setOrders(oData);

      // Busca Estoque
      const { data: iData } = await supabase.from('inventory').select('*').order('name');
      if (iData) setInventory(iData);

      // Busca Agenda
      const { data: aData } = await supabase.from('appointments').select('*').order('appointment_date');
      if (aData) setAppointments(aData);

      setSyncError(null);
    } catch (e: any) {
      console.error("Erro ao carregar dados:", e);
      setSyncError("Erro de Conexão");
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
      
      // Ativa o Realtime para todas as tabelas principais
      const channel = supabase.channel('app-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchAllData())
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [currentUser, fetchAllData]);

  // FUNÇÕES DE SALVAMENTO PARA CADA ÁREA
  const handleSavePatient = async (patient: Patient) => {
    const { clinical_notes, ...rest } = patient;
    const anchorFields = ['id', 'name', 'phone', 'email', 'condition', 'last_visit'];
    const payload: any = {};
    const metadata: any = {};

    Object.keys(rest).forEach(key => {
      if (anchorFields.includes(key)) payload[key] = (rest as any)[key];
      else metadata[key] = (rest as any)[key];
    });
    payload.metadata = metadata;

    await supabase.from('patients').upsert(payload);
    fetchAllData();
  };

  const handleSaveOrder = async (order: WorkshopOrder) => {
    await supabase.from('workshop_orders').upsert(order);
    fetchAllData();
  };

  const handleSaveAppointment = async (app: Appointment) => {
    await supabase.from('appointments').upsert(app);
    fetchAllData();
  };

  const handleUpdateInventory = async (item: InventoryItem) => {
    await supabase.from('inventory').upsert(item);
    fetchAllData();
  };

  if (!currentUser) return <Login onLogin={(u) => { setCurrentUser(u); localStorage.setItem('ortho_session', JSON.stringify(u)); }} />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-['Inter']">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} userRole={currentUser.role} onLogout={() => { setCurrentUser(null); localStorage.removeItem('ortho_session'); }} userName={currentUser.name} />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="animate-fadeInLeft">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter capitalize">{currentView.replace('_', ' ')}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                {isSyncing ? "Atualizando..." : "Sistema Online • Sincronizado"}
              </p>
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

        <div className="animate-fadeInUp">
          {currentView === AppView.DASHBOARD && <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />}
          {currentView === AppView.PATIENTS && <PatientManagement userRole={currentUser.role} patients={patients} onSavePatient={handleSavePatient} onDeletePatient={async (id) => { await supabase.from('patients').delete().eq('id', id); fetchAllData(); }} />}
          {currentView === AppView.WORKSHOP && <WorkshopManagement userRole={currentUser.role} orders={orders} patients={patients} onSaveOrder={handleSaveOrder} />}
          {currentView === AppView.INVENTORY && <InventoryManagement items={inventory} onUpdateInventory={handleUpdateInventory} />}
          {currentView === AppView.FINANCES && <FinanceDashboard />}
          {currentView === AppView.INDICATORS && <IndicatorsView />}
          {currentView === AppView.AI_INSIGHTS && <AIAssistant />}
          {currentView === AppView.CALENDAR && <CalendarView appointments={appointments} onUpdateAppointments={handleSaveAppointment} patients={patients} />}
        </div>
      </main>
    </div>
  );
};

export default App;
