
export type AppView = 'dashboard' | 'patients' | 'workshop' | 'inventory' | 'ai_insights';

export enum UserRole {
  GESTOR = 'GESTOR',
  RECEPCIONISTA = 'RECEPCIONISTA',
  FISIOTERAPEUTA = 'FISIOTERAPEUTA',
  TECNICO = 'TECNICO'
}

export interface User { id: string; name: string; email: string; role: UserRole; }

// Fixed: Added ClinicalNote interface to support patient history tracking
export interface ClinicalNote {
  id: string;
  date: string;
  professional: string;
  content: string;
  type: 'Evolution' | 'Evaluation' | string;
}

// Fixed: Added ScoliosisData interface for clinical assessment records
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
  // Fixed: Added support for clinical notes and specialized assessment records
  clinical_notes?: ClinicalNote[];
  scoliosis_record?: ScoliosisData;
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
  unit: string;
  min_quantity: number;
  // Fixed: Added stock tracking properties used throughout the application
  stock?: number;
  minStock?: number;
  minQuantity?: number;
}

// Fixed: Added Appointment interface to handle clinical scheduling
export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  time: string;
  appointment_date: string;
  type: 'Physio' | 'Workshop' | string;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
}

// Fixed: Added FinancialRecord interface for business reporting
export interface FinancialRecord {
  date: string;
  revenue: number;
  expenses: number;
}
