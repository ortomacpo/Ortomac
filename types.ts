
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

export type ScoliosisCurveType = 'Torácica' | 'Lombar' | 'Toracolombar';

export interface ScoliosisCurve {
  type: ScoliosisCurveType;
  degrees: string;
}

export interface WorkshopEvaluation {
  product_type: string;
  measurements: string;
  materials_used: string;
  technical_notes: string;
  last_adjustment_date: string;
}

export interface ScoliosisEvaluation {
  evaluation_date?: string;
  birthplace?: string;
  marital_status?: string;
  gender?: string;
  profession?: string;
  phone2?: string;
  full_address?: string;
  weight?: string;
  height?: string;
  main_complaint?: string;
  habits?: string;
  history?: string; 
  personal_family_history?: string;
  treatments?: string;
  health_check?: {
    surgery: boolean;
    diabetes: boolean;
    fractures: boolean;
    cardiac: boolean;
    allergies: boolean;
    others: boolean;
  };
  pain_type?: string;
  pain_location?: string;
  medication?: string;
  eva_scale?: number;
  
  curves: ScoliosisCurve[];
  risser?: string;
  
  breasts?: boolean;
  axillary_hair?: boolean;
  menarche_age?: string;
  menstruation_status?: string;

  worsening_factors?: string;
  improvement_factors?: string;
  sleep_quality?: string;
  sleep_position?: string;
  physical_activity?: {
    type: string;
    frequency: string;
    duration: string;
  };
  progress_factor?: string;

  sagittal_arrows?: {
    cervical: string;
    lumbar: string;
  };
  trunk_shift?: string;

  scoliosometer?: {
    thoracic: string;
    lumbar: string;
    thoracolumbar: string;
  };
  inclinometer?: {
    cervical_c7: string;
    thoracic_t12_1: string;
    result1: string;
    thoracic_t12_2: string;
    sacro_s1: string;
    result2: string;
  };
  rotations?: {
    sitting: { d: string; e: string };
    superior: { d: string; e: string };
    inferior: { d: string; e: string };
    unipodal: { d: string; e: string };
  };
  mmii_measurement?: {
    real: { mid: string; mie: string };
    apparent: { mid: string; mie: string };
  };
  adams_test?: {
    side: 'D' | 'E' | 'Ambos' | '';
    result_cm: string;
    level: string;
  };
  muscle_force?: string;
  abdominal_test?: {
    oblique_right: string;
    oblique_left: string;
    inferior_abdominal: boolean;
  };
  physio_diagnosis?: string;
  physio_plan?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birth_date?: string;
  last_visit: string;
  condition: string;
  categories: ('Amputados' | 'Escoliose' | 'Oficina')[];
  clinical_notes: ClinicalNote[];
  scoliosis_data?: ScoliosisEvaluation;
  workshop_data?: WorkshopEvaluation;
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
