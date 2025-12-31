
import { Patient, WorkOrder, WorkshopStatus, Appointment, InventoryItem, FinancialRecord } from './types';

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    email: 'joao@email.com', 
    last_visit: '2023-11-20', 
    condition: 'Pós-operatório fêmur',
    categories: ['Amputados', 'Oficina'],
    clinical_notes: [
      { id: 'n1', date: '2023-11-20', professional: 'Dr. Carlos', content: 'Paciente apresenta melhora na marcha. Amplitude de flexão em 90 graus.', type: 'Evolution' },
      { id: 'n2', date: '2023-11-15', professional: 'Dr. Carlos', content: 'Avaliação inicial: dor 7/10 na escala EVA.', type: 'Evaluation' }
    ]
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    phone: '(11) 91234-5678', 
    email: 'maria@email.com', 
    last_visit: '2023-11-21', 
    condition: 'Escoliose severa', 
    categories: ['Escoliose', 'Oficina'], 
    clinical_notes: [] 
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Polipropileno 4mm', category: 'Resinas', quantity: 15, stock: 15, unit: 'Chapas', min_quantity: 5, minStock: 5, minQuantity: 5 },
  { id: 'inv2', name: 'Resina Acrílica', category: 'Resinas', quantity: 2, stock: 2, unit: 'Kg', min_quantity: 5, minStock: 5, minQuantity: 5 },
  { id: 'inv3', name: 'Pé Protético Carbono', category: 'Componentes', quantity: 3, stock: 3, unit: 'Un', min_quantity: 2, minStock: 2, minQuantity: 2 }
];

export const MOCK_ORDERS: WorkOrder[] = [
  { id: 'OS-001', patient_id: '3', patient_name: 'Ricardo Oliveira', product: 'Prótese Transtibial Carbono', status: WorkshopStatus.MANUFACTURING, deadline: '2023-12-05', price: 12500 }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patient_id: '1', patient_name: 'João Silva', time: '08:00', appointment_date: '2023-11-22', type: 'Physio', status: 'confirmed' },
  { id: 'a3', patient_id: '2', patient_name: 'Maria Santos', time: '14:00', appointment_date: '2023-11-22', type: 'Physio', status: 'confirmed' }
];

export const MOCK_FINANCE: FinancialRecord[] = [
  { date: 'Set', revenue: 42000, expenses: 28000 },
  { date: 'Out', revenue: 45000, expenses: 30000 },
  { date: 'Nov', revenue: 48000, expenses: 31000 },
];
