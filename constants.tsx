
import { Patient, WorkshopOrder, WorkshopStatus, Appointment, InventoryItem, FinancialRecord } from './types';

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    email: 'joao@email.com', 
    lastVisit: '2023-11-20', 
    condition: 'Pós-operatório fêmur',
    categories: ['Amputados', 'Oficina'],
    clinicalNotes: [
      { id: 'n1', date: '2023-11-20', professional: 'Dr. Carlos', content: 'Paciente apresenta melhora na marcha. Amplitude de flexão em 90 graus.', type: 'Evolution' },
      { id: 'n2', date: '2023-11-15', professional: 'Dr. Carlos', content: 'Avaliação inicial: dor 7/10 na escala EVA.', type: 'Evaluation' }
    ]
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    phone: '(11) 91234-5678', 
    email: 'maria@email.com', 
    lastVisit: '2023-11-21', 
    condition: 'Escoliose severa', 
    categories: ['Escoliose', 'Oficina'], 
    clinicalNotes: [] 
  },
  { 
    id: '3', 
    name: 'Ricardo Oliveira', 
    phone: '(11) 99887-7665', 
    email: 'ricardo@email.com', 
    lastVisit: '2023-11-18', 
    condition: 'Amputação transtibial', 
    categories: ['Oficina'], 
    clinicalNotes: [] 
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Polipropileno 4mm', category: 'Resinas', quantity: 15, unit: 'Chapas', minQuantity: 5 },
  { id: 'inv2', name: 'Resina Acrílica', category: 'Resinas', quantity: 2, unit: 'Kg', minQuantity: 5 },
  { id: 'inv3', name: 'Pé Protético Carbono', category: 'Componentes', quantity: 3, unit: 'Un', minQuantity: 2 },
  { id: 'inv4', name: 'Velcro 50mm Black', category: 'Tecidos', quantity: 50, unit: 'Metros', minQuantity: 10 },
];

export const MOCK_ORDERS: WorkshopOrder[] = [
  { id: 'OS-001', patientId: '3', patientName: 'Ricardo Oliveira', product: 'Prótese Transtibial Carbono', status: WorkshopStatus.MANUFACTURING, deadline: '2023-12-05', price: 12500 },
  { id: 'OS-002', patientId: '2', patientName: 'Maria Santos', product: 'Colete Boston', status: WorkshopStatus.MOLDING, deadline: '2023-11-30', price: 2800 },
];

export const MOCK_FINANCE_RECORDS: FinancialRecord[] = [
  { id: 'f1', date: '2023-11-21', description: 'Mensalidade Fisioterapia - João', category: 'Serviços', value: 450, type: 'income' },
  { id: 'f2', date: '2023-11-20', description: 'Compra de Insumos Oficina', category: 'Suprimentos', value: 1200, type: 'expense' },
  { id: 'f3', date: '2023-11-19', description: 'Venda Prótese Ricardo', category: 'Produtos', value: 6500, type: 'income' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientId: '1', patientName: 'João Silva', time: '08:00', type: 'Physio', status: 'confirmed' },
  { id: 'a2', patientId: '3', patientName: 'Ricardo Oliveira', time: '10:30', type: 'Workshop', status: 'pending' },
  { id: 'a3', patientId: '2', patientName: 'Maria Santos', time: '14:00', type: 'Physio', status: 'confirmed' },
];

export const MOCK_FINANCE = [
  { date: 'Set', revenue: 42000, expenses: 28000 },
  { date: 'Out', revenue: 45000, expenses: 30000 },
  { date: 'Nov', revenue: 48000, expenses: 31000 },
];
