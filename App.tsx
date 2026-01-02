import React, { useState, useEffect } from 'react';
import { AppView, User, Patient, WorkOrder, InventoryItem } from './types.ts';
import { isFirebaseReady } from './services/firebaseConfig.ts';
import { subscribeToCollection } from './services/dataService.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import PatientManagement from './components/PatientManagement.tsx';
import WorkshopManagement from './components/WorkshopManagement.tsx';
import InventoryManagement from './components/InventoryManagement.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Login from './components/Login.tsx';
import { MOCK_PATIENTS, MOCK_ORDERS, MOCK_INVENTORY } from './constants.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [orders, setOrders] = useState<WorkOrder[]>(MOCK_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

  useEffect(() => {
    if (isFirebaseReady) {
      const unsubPatients = subscribeToCollection('patients', (data) => {
        if (data.length > 0) setPatients(data);
      });
      const unsubOrders = subscribeToCollection('orders', (data) => {
        if (data.length > 0) setOrders(data);
      });
      const unsubInventory = subscribeToCollection('inventory', (data) => {
        if (data.length > 0) setInventory(data);
      });
      return () => { unsubPatients(); unsubOrders(); unsubInventory(); };
    }
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        currentView={view} 
        onViewChange={setView} 
        userRole={user.role} 
        userName={user.name} 
        onLogout={() => setUser(null)} 
      />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{view}</h1>
              {isFirebaseReady && <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" title="Conectado ao Cloud"></span>}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Painel OrtoPhysio Pro</p>
          </div>
        </header>

        <div className="animate-fadeIn">
          {view === 'dashboard' && (
            <Dashboard 
              patients={patients} 
              orders={orders} 
              onViewChange={setView} 
            />
          )}
          {view === 'patients' && (
            <PatientManagement 
              patients={patients} 
              userRole={user.role}
              onSavePatient={async () => {}} 
              onDeletePatient={async () => {}}
            />
          )}
          {view === 'workshop' && (
            <WorkshopManagement 
              orders={orders} 
              onUpdateOrder={async () => {}} 
            />
          )}
          {view === 'inventory' && (
            <InventoryManagement 
              items={inventory} 
              onUpdateInventory={async (item) => {}} 
            />
          )}
          {view === 'ai_insights' && <AIAssistant />}
        </div>
      </main>
    </div>
  );
};

export default App;