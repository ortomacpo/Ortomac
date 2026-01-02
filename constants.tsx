
import { Patient, WorkOrder, WorkshopStatus, InventoryItem } from './types.ts';

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    email: 'joao@email.com', 
    last_visit: '2023-11-20', 
    condition: 'Pós-operatório fêmur',
    categories: ['Amputados', 'Oficina']
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    phone: '(11) 91234-5678', 
    email: 'maria@email.com', 
    last_visit: '2023-11-21', 
    condition: 'Escoliose severa', 
    categories: ['Escoliose', 'Oficina']
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Polipropileno 4mm', category: 'Resinas', quantity: 15, unit: 'Chapas', min_quantity: 5 },
  { id: 'inv2', name: 'Resina Acrílica', category: 'Resinas', quantity: 2, unit: 'Kg', min_quantity: 5 },
  { id: 'inv3', name: 'Pé Protético Carbono', category: 'Componentes', quantity: 3, unit: 'Un', min_quantity: 2 }
];

export const MOCK_ORDERS: WorkOrder[] = [
  { id: 'OS-001', patient_id: '1', patient_name: 'João Silva', product: 'Prótese Transtibial Carbono', status: WorkshopStatus.MANUFACTURING, deadline: '2023-12-05', price: 12500 }
];

// Added MOCK_FINANCE for FinanceDashboard
export const MOCK_FINANCE = [
  { date: 'Set', revenue: 42000, expenses: 28000 },
  { date: 'Out', revenue: 45000, expenses: 30000 },
  { date: 'Nov', revenue: 48000, expenses: 31000 },
];
