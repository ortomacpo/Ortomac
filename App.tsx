
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, UserRole, Patient, WorkshopOrder, InventoryItem, Appointment, User, WorkshopStatus } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
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
import ScoliosisRecord from './components/ScoliosisRecord.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedScoliosisPatientId, setSelectedScoliosisPatientId] = useState<string | null>(null);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [orders, setOrders] = useState<WorkshopOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ortho_session');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('ortho_session'); }
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    
    try {
      const { data: pData, error: pError } = await supabase.from('patients').select('*').order('name');
      if (pError) throw pError;
      
      if (pData) {
        setPatients(pData.map(p => {
          const meta = p.metadata || {};
          return { 
            ...p, 
            ...meta,
            // Prioriza colunas reais, mas aceita dados do metadado se a coluna for nula
            id: p.id,
            name: p.name,
            pending_physio_eval: p.pending_physio_eval ?? meta.pending_physio_eval ?? false,
            pending_workshop_eval: p.pending_workshop_eval ?? meta.pending_workshop_eval ?? false,
            scoliosis_record: p.scoliosis_record || meta.scoliosis_record || null
          };
        }));
      }

      const { data: oData, error: oError } = await supabase.from('workshop_orders').select('*').order('created_at', { ascending: false });
      if (oError) throw oError;
      if (oData) setOrders(oData);

      const { data: iData, error: iError } = await supabase.from('inventory').select('*').order('name');
      if (iError) throw iError;
      if (iData) setInventory(iData);

      const { data: aData, error: aError } = await supabase.from('appointments').select('*').order('appointment_date');
      if (aError) throw aError;
      if (aData) setAppointments(aData);
    } catch (e: any) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
      const channel = supabase.channel('app-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchAllData())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [currentUser, fetchAllData]);

  const handleSavePatient = async (patient: Patient) => {
    try {
      console.log("🚀 [SISTEMA] Iniciando salvamento resiliente...");
      
      const cleanPatient = JSON.parse(JSON.stringify(patient));
      
      // Lista mínima de campos que costumam ser colunas padrão
      // Removi 'pending_physio_eval' e outros para evitar o erro PGRST204
      const essentialFields = ['id', 'name', 'phone', 'email', 'condition', 'last_visit'];
      
      const payload: any = {};
      const metadata: any = {};

      // Separa o que é essencial do que é estendido
      Object.keys(cleanPatient).forEach(key => {
        if (essentialFields.includes(key)) {
          payload[key] = cleanPatient[key];
        } else {
          metadata[key] = cleanPatient[key];
        }
      });
      
      // Agrupa tudo o mais em metadata para garantir que o Supabase aceite
      payload.metadata = metadata;

      console.log("📤 [SISTEMA] Enviando payload:", payload);

      const { error } = await supabase.from('patients').upsert(payload);
      
      if (error) {
        const errorMsg = `ERRO TÉCNICO (${error.code}): ${error.message}. Dica: Verifique se a coluna 'metadata' (do tipo JSONB) existe na sua tabela 'patients'.`;
        console.error("❌ [ERRO SUPABASE]", error);
        alert(errorMsg);
        return false;
      }

      console.log("✅ [SISTEMA] Salvo com sucesso!");
      await fetchAllData();
      return true;
    } catch (e: any) {
      const msg = `Falha Crítica: ${e.message}`;
      console.error("❌ [FALHA GERAL]", e);
      alert(msg);
      return false;
    }
  };

  const openScoliosisRecord = (patientId: string) => {
    setSelectedScoliosisPatientId(patientId);
    setCurrentView(AppView.SCOLIOSIS_RECORD);
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
          {currentView === AppView.DASHBOARD && <Dashboard onViewChange={setCurrentView} onOpenScoliosis={openScoliosisRecord} patients={patients} orders={orders} appointments={appointments} userRole={currentUser.role} />}
          {currentView === AppView.PATIENTS && <PatientManagement userRole={currentUser.role} patients={patients} onSavePatient={handleSavePatient} onDeletePatient={async (id) => { await supabase.from('patients').delete().eq('id', id); fetchAllData(); }} onOpenScoliosis={openScoliosisRecord} />}
          {currentView === AppView.WORKSHOP && <WorkshopManagement userRole={currentUser.role} orders={orders} patients={patients} onSaveOrder={async (o) => { await supabase.from('workshop_orders').upsert(o); fetchAllData(); }} />}
          {currentView === AppView.INVENTORY && <InventoryManagement items={inventory} onUpdateInventory={async (i) => { await supabase.from('inventory').upsert(i); fetchAllData(); }} />}
          {currentView === AppView.FINANCES && <FinanceDashboard />}
          {currentView === AppView.INDICATORS && <IndicatorsView />}
          {currentView === AppView.AI_INSIGHTS && <AIAssistant />}
          {currentView === AppView.CALENDAR && <CalendarView appointments={appointments} onUpdateAppointments={async (a) => { await supabase.from('appointments').upsert(a); fetchAllData(); }} patients={patients} />}
          
          {currentView === AppView.SCOLIOSIS_RECORD && (
            (() => {
                const targetPatient = selectedScoliosisPatientId 
                    ? patients.find(p => p.id === selectedScoliosisPatientId)
                    : patients.find(p => p.pending_physio_eval && p.categories?.includes('Escoliose'));

                return targetPatient ? (
                    <ScoliosisRecord 
                        patient={targetPatient} 
                        onSave={handleSavePatient} 
                        onBack={() => {
                          setCurrentView(AppView.DASHBOARD);
                          setSelectedScoliosisPatientId(null);
                        }} 
                    />
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                        <p className="font-black text-slate-400 uppercase tracking-widest">Nenhuma avaliação selecionada ou pendente para Escoliose.</p>
                        <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mt-6 text-indigo-600 font-black uppercase text-[10px] tracking-widest">Voltar ao Painel</button>
                    </div>
                );
            })()
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
