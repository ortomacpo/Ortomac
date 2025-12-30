
import { Patient, WorkshopOrder, WorkshopStatus, Appointment, InventoryItem, FinancialRecord } from './types';

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    email: 'joao@email.com', 
    // Fix: Changed lastVisit to last_visit
    last_visit: '2023-11-20', 
    condition: 'Pós-operatório fêmur',
    categories: ['Amputados', 'Oficina'],
    // Fix: Changed clinicalNotes to clinical_notes
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
    // Fix: Changed lastVisit to last_visit
    last_visit: '2023-11-21', 
    condition: 'Escoliose severa', 
    categories: ['Escoliose', 'Oficina'], 
    // Fix: Changed clinicalNotes to clinical_notes
    clinical_notes: [] 
  },
  { 
    id: '3', 
    name: 'Ricardo Oliveira', 
    phone: '(11) 99887-7665', 
    email: 'ricardo@email.com', 
    // Fix: Changed lastVisit to last_visit
    last_visit: '2023-11-18', 
    condition: 'Amputação transtibial', 
    categories: ['Oficina'], 
    // Fix: Changed clinicalNotes to clinical_notes
    clinical_notes: [] 
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  // Fix: Changed minQuantity to min_quantity for all items
  { id: 'inv1', name: 'Polipropileno 4mm', category: 'Resinas', quantity: 15, unit: 'Chapas', min_quantity: 5 },
  { id: 'inv2', name: 'Resina Acrílica', category: 'Resinas', quantity: 2, unit: 'Kg', min_quantity: 5 },
  { id: 'inv3', name: 'Pé Protético Carbono', category: 'Componentes', quantity: 3, unit: 'Un', min_quantity: 2 },
  { id: 'inv4', name: 'Velcro 50mm Black', category: 'Tecidos', quantity: 50, unit: 'Metros', min_quantity: 10 },
];

export const MOCK_ORDERS: WorkshopOrder[] = [
  // Fix: Changed patientId to patient_id and patientName to patient_name
  { id: 'OS-001', patient_id: '3', patient_name: 'Ricardo Oliveira', product: 'Prótese Transtibial Carbono', status: WorkshopStatus.MANUFACTURING, deadline: '2023-12-05', price: 12500 },
  { id: 'OS-002', patient_id: '2', patient_name: 'Maria Santos', product: 'Colete Boston', status: WorkshopStatus.MOLDING, deadline: '2023-11-30', price: 2800 },
];

export const MOCK_FINANCE_RECORDS: FinancialRecord[] = [
  { id: 'f1', date: '2023-11-21', description: 'Mensalidade Fisioterapia - João', category: 'Serviços', value: 450, type: 'income' },
  { id: 'f2', date: '2023-11-20', description: 'Compra de Insumos Oficina', category: 'Suprimentos', value: 1200, type: 'expense' },
  { id: 'f3', date: '2023-11-19', description: 'Venda Prótese Ricardo', category: 'Produtos', value: 6500, type: 'income' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Fix: Changed patientId to patient_id and patientName to patient_name
  { id: 'a1', patient_id: '1', patient_name: 'João Silva', time: '08:00', type: 'Physio', status: 'confirmed' },
  { id: 'a2', patient_id: '3', patient_name: 'Ricardo Oliveira', time: '10:30', type: 'Workshop', status: 'pending' },
  { id: 'a3', patient_id: '2', patient_name: 'Maria Santos', time: '14:00', type: 'Physio', status: 'confirmed' },
];

export const MOCK_FINANCE = [
  { date: 'Set', revenue: 42000, expenses: 28000 },
  { date: 'Out', revenue: 45000, expenses: 30000 },
  { date: 'Nov', revenue: 48000, expenses: 31000 },
];
