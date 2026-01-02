
export type AppView = 'dashboard' | 'patients' | 'workshop' | 'inventory' | 'ai_insights';

export enum UserRole {
  GESTOR = 'GESTOR',
  RECEPCIONISTA = 'RECEPCIONISTA',
  FISIOTERAPEUTA = 'FISIOTERAPEUTA',
  TECNICO = 'TECNICO'
}

export interface User { id: string; name: string; email: string; role: UserRole; }

// Added ClinicalNote for patient evolution and history
export interface ClinicalNote {
  id: string;
  date: string;
  professional: string;
  content: string;
  type: 'Evolution' | 'Evaluation' | string;
}

// Added ScoliosisData for specialized clinical assessment
export interface ScoliosisData {
  main_complaint?: string;
  cobb_toracica?: number;
  cobb_lombar?: number;
  risser_scale?: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  last_visit: string;
  condition: string;
  categories: string[];
  clinical_notes?: ClinicalNote[]; // Fix: Added missing clinical_notes property
  scoliosis_record?: ScoliosisData; // Fix: Added missing scoliosis_record property
  pending_physio_eval?: boolean;
}

export enum WorkshopStatus {
  MEASURING = 'Measuring',
  MOLDING = 'Molding',
  MANUFACTURING = 'Manufacturing',
  FINISHING = 'Finishing',
  READY = 'Ready',
  DELIVERED = 'Delivered'
}

export interface WorkOrder {
  id: string;
  patient_id: string;
  patient_name: string;
  product: string;
  status: WorkshopStatus | string;
  deadline: string;
  price?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  stock?: number; // Fix: Added missing stock property
  unit: string;
  min_quantity: number;
  minStock?: number; // Fix: Added missing minStock property
  minQuantity?: number; // Fix: Added missing minQuantity property
}

// Fix: Added missing Appointment type for the calendar system
export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  time: string;
  appointment_date: string;
  type: 'Physio' | 'Workshop' | string;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
}

// Fix: Added missing FinancialRecord type for indicators and dashboards
export interface FinancialRecord {
  date: string;
  revenue: number;
  expenses: number;
}
