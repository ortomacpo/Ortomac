
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserRole, Patient, WorkshopOrder, InventoryItem, Appointment, User, WorkshopStatus } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { MOCK_PATIENTS, MOCK_ORDERS, MOCK_INVENTORY, MOCK_APPOINTMENTS } from './constants.tsx';
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

  // Carregar sessão e dados iniciais do LocalStorage (Fallback imediato)
  useEffect(() => {
    const savedUser = localStorage.getItem('ortho_session');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ortho_session');
      }
    }

    // Tentar carregar dados salvos localmente antes mesmo do fetch
    const localPatients = localStorage.getItem('ortho_patients');
    const localOrders = localStorage.getItem('ortho_orders');
    const localInventory = localStorage.getItem('ortho_inventory');

    if (localPatients) setPatients(JSON.parse(localPatients));
    if (localOrders) setOrders(JSON.parse(localOrders));
    if (localInventory) setInventory(JSON.parse(localInventory));
  }, []);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const [pRes, oRes, iRes, aRes] = await Promise.all([
        supabase.from('patients').select('*').order('name'),
        supabase.from('workshop_orders').select('*').order('deadline', { ascending: false }),
        supabase.from('inventory').select('*').order('name'),
        supabase.from('appointments').select('*').order('time')
      ]);
      
      // Se houver dados no banco, priorizamos eles e atualizamos o cache local
      if (pRes.data && pRes.data.length > 0) {
        setPatients(pRes.data);
        localStorage.setItem('ortho_patients', JSON.stringify(pRes.data));
      } else if (pRes.error) {
        console.warn("Supabase Patients Error (usando cache local):", pRes.error.message);
      }

      if (oRes.data && oRes.data.length > 0) {
        setOrders(oRes.data);
        localStorage.setItem('ortho_orders', JSON.stringify(oRes.data));
      }

      if (iRes.data && iRes.data.length > 0) {
        setInventory(iRes.data);
        localStorage.setItem('ortho_inventory', JSON.stringify(iRes.data));
      }

      if (aRes.data && aRes.data.length > 0) {
        setAppointments(aRes.data);
      } else {
        // Se a agenda estiver vazia no banco, usamos os mocks para demonstração
        if (appointments.length === 0) setAppointments(MOCK_APPOINTMENTS);
      }

      // Se tudo estiver vazio (primeira vez), carrega os Mocks
      if (!localDataExists() && (!pRes.data || pRes.data.length === 0)) {
        setPatients(MOCK_PATIENTS);
        setOrders(MOCK_ORDERS);
        setInventory(MOCK_INVENTORY);
      }

    } catch (error) {
      console.error("Erro geral de carregamento:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser]);

  const localDataExists = () => {
    return !!localStorage.getItem('ortho_patients');
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
           if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
             const updatedPatient = payload.new as Patient;
             setPatients(prev => {
               const filtered = prev.filter(p => p.id !== updatedPatient.id);
               const newList = [updatedPatient, ...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
               localStorage.setItem('ortho_patients', JSON.stringify(newList));
               return newList;
             });
           } else if (payload.eventType === 'DELETE') {
             setPatients(prev => {
               const newList = prev.filter(p => p.id !== payload.old.id);
               localStorage.setItem('ortho_patients', JSON.stringify(newList));
               return newList;
             });
           }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [currentUser, fetchData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ortho_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ortho_session');
    // Não removemos os dados da clínica para permitir uso offline/persistente
  };

  const handleSavePatient = async (patient: Patient) => {
    // 1. Atualização Optimista (Estado e LocalStorage imediato)
    setPatients(prev => {
      const filtered = prev.filter(p => p.id !== patient.id);
      const newList = [patient, ...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      localStorage.setItem('ortho_patients', JSON.stringify(newList));
      return newList;
    });

    // 2. Persistência em Nuvem
    try {
      const { error } = await supabase.from('patients').upsert(patient, { onConflict: 'id' });
      if (error) {
        console.error("Erro Supabase:", error.message);
        // Opcional: alert(`Nota: Salvo localmente, mas houve erro na nuvem: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Erro Crítico Supabase:", error);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este prontuário permanentemente?")) return;
    
    setPatients(prev => {
      const newList = prev.filter(p => p.id !== id);
      localStorage.setItem('ortho_patients', JSON.stringify(newList));
      return newList;
    });

    try {
      const { error } = await supabase.from('patients').delete().eq('id', id);
      if (error) throw error;
    } catch (error: any) {
      console.error(`Erro ao deletar da nuvem: ${error.message}`);
      // Se deu erro na nuvem, podemos forçar um refetch para garantir consistência
      fetchData();
    }
  };

  const handleSaveOrder = async (order: WorkshopOrder) => {
    setOrders(prev => {
      const newList = [order, ...prev.filter(o => o.id !== order.id)];
      localStorage.setItem('ortho_orders', JSON.stringify(newList));
      return newList;
    });

    setIsSyncing(true);
    try {
      const { error } = await supabase.from('workshop_orders').upsert(order, { onConflict: 'id' });
      if (error) throw error;
    } catch (error: any) {
      console.warn(`Erro ao salvar ordem na nuvem: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    const role = currentUser.role;
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onViewChange={setCurrentView} patients={patients} orders={orders} appointments={appointments} />;
      case AppView.PATIENTS: return <PatientManagement userRole={role} patients={patients} onSavePatient={handleSavePatient} onDeletePatient={handleDeletePatient} />;
      case AppView.WORKSHOP: return <WorkshopManagement userRole={role} orders={orders} patients={patients} onSaveOrder={handleSaveOrder} />;
      case AppView.INVENTORY: return <InventoryManagement items={inventory} onUpdateInventory={(newInv) => {
        setInventory(newInv);
        localStorage.setItem('ortho_inventory', JSON.stringify(newInv));
      }} />;
      case AppView.FINANCES: return <FinanceDashboard />;
      case AppView.INDICATORS: return <IndicatorsView />;
      case AppView.AI_INSIGHTS: return <AIAssistant />;
      case AppView.CALENDAR: return <CalendarView appointments={appointments} onUpdateAppointments={(newApp) => {
        setAppointments(newApp);
        // Opcional: Persistir agenda no banco/local se necessário
      }} />;
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
