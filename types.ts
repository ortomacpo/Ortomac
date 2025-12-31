
export type AppView = 'dashboard' | 'patients' | 'workshop' | 'inventory' | 'calendar' | 'finances' | 'indicators' | 'ai_insights';

export enum UserRole {
  GESTOR = 'GESTOR',
  RECEPCIONISTA = 'RECEPCIONISTA',
  FISIOTERAPEUTA = 'FISIOTERAPEUTA',
  TECNICO = 'TECNICO'
}

export interface User { id: string; name: string; email: string; role: UserRole; }

// Interface for Scoliosis clinical data
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
  clinical_notes?: any[];
  scoliosis_record?: ScoliosisData;
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
  updatedAt?: any;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  // Added properties used in components and mock data
  stock?: number;
  minStock?: number;
  minQuantity?: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  time: string;
  appointment_date: string;
  type: 'Physio' | 'Workshop';
  status: string;
}

// Interface for financial history records
export interface FinancialRecord {
  date: string;
  revenue: number;
  expenses: number;
}
