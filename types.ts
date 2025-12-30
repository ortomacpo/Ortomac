
export enum UserRole {
  GESTOR = 'Gestor',
  FISIOTERAPEUTA = 'Fisioterapeuta',
  RECEPCIONISTA = 'Recepcionista',
  TECNICO = 'Técnico Ortopédico'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  PATIENTS = 'patients',
  WORKSHOP = 'workshop',
  INVENTORY = 'inventory',
  CALENDAR = 'calendar',
  FINANCES = 'finances',
  INDICATORS = 'indicators',
  AI_INSIGHTS = 'ai_insights'
}

export enum WorkshopStatus {
  MEASURING = 'Medição',
  MOLDING = 'Moldagem',
  MANUFACTURING = 'Fabricação',
  FINISHING = 'Acabamento',
  READY = 'Pronto',
  DELIVERED = 'Entregue'
}

export type WaitingStatus = 'None' | 'Waiting Physio' | 'Waiting Workshop' | 'Waiting Both';

export interface ClinicalNote {
  id: string;
  date: string;
  professional: string;
  content: string;
  type: 'Evolution' | 'Evaluation' | 'SOAP';
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birth_date?: string;
  responsible_name?: string;
  address_street?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_cep?: string;
  // Encaminhamento e Chegada
  referring_type?: 'Spontaneous' | 'Direct' | 'Medical'; 
  referring_professional_name?: string;
  referring_professional_specialty?: string;
  // Dados Fiscais (NF)
  nf_full_name?: string;
  nf_cpf?: string;
  nf_address_street?: string;
  nf_address_neighborhood?: string;
  nf_address_city?: string;
  nf_address_state?: string;
  nf_address_cep?: string;
  
  last_visit: string;
  condition: string;
  categories: ('Amputados' | 'Escoliose' | 'Oficina')[];
  clinical_notes: ClinicalNote[];
  waiting_status?: WaitingStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Resinas' | 'Metais' | 'Tecidos' | 'Componentes' | 'Outros';
  quantity: number;
  unit: string;
  min_quantity: number;
}

export interface WorkshopOrder {
  id: string;
  patient_id: string;
  patient_name: string;
  product: string;
  status: WorkshopStatus;
  deadline: string;
  price: number;
  materials_used?: { itemId: string; qty: number }[];
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  time: string;
  type: 'Physio' | 'Workshop';
  status: 'confirmed' | 'pending' | 'completed';
  appointment_date?: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
}
