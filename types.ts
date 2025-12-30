
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
  productType: string;
  measurements: string;
  materialsUsed: string;
  technicalNotes: string;
  lastAdjustmentDate: string;
}

export interface ScoliosisEvaluation {
  evaluationDate?: string;
  birthplace?: string;
  maritalStatus?: string;
  gender?: string;
  profession?: string;
  phone2?: string;
  fullAddress?: string;
  weight?: string;
  height?: string;
  mainComplaint?: string;
  habits?: string;
  history?: string; 
  personalFamilyHistory?: string;
  treatments?: string;
  healthCheck?: {
    surgery: boolean;
    diabetes: boolean;
    fractures: boolean;
    cardiac: boolean;
    allergies: boolean;
    others: boolean;
  };
  painType?: string;
  painLocation?: string;
  medication?: string;
  evaScale?: number;
  
  // Radiologia
  curves: ScoliosisCurve[];
  risser?: string;
  
  // Maturação Sexual
  breasts?: boolean;
  axillaryHair?: boolean;
  menarcheAge?: string;
  menstruationStatus?: string;

  // Fatores e Hábitos
  worseningFactors?: string;
  improvementFactors?: string;
  sleepQuality?: string;
  sleepPosition?: string;
  physicalActivity?: {
    type: string;
    frequency: string;
    duration: string;
  };
  progressFactor?: string;

  // Avaliação Postural (Flechas)
  sagittalArrows?: {
    cervical: string;
    lumbar: string;
  };
  trunkShift?: string;

  // Testes Físicos
  scoliosometer?: {
    thoracic: string;
    lumbar: string;
    thoracolumbar: string;
  };
  inclinometer?: {
    cervicalC7: string;
    thoracicT12_1: string;
    result1: string;
    thoracicT12_2: string;
    sacroS1: string;
    result2: string;
  };
  rotations?: {
    sitting: { d: string; e: string };
    superior: { d: string; e: string };
    inferior: { d: string; e: string };
    unipodal: { d: string; e: string };
  };
  mmiiMeasurement?: {
    real: { mid: string; mie: string };
    apparent: { mid: string; mie: string };
  };
  adamsTest?: {
    side: 'D' | 'E' | 'Ambos' | '';
    resultCm: string;
    level: string;
  };
  muscleForce?: string;
  abdominalTest?: {
    obliqueRight: string;
    obliqueLeft: string;
    inferiorAbdominal: boolean;
  };
  physioDiagnosis?: string;
  physioPlan?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  lastVisit: string;
  condition: string;
  categories: ('Amputados' | 'Escoliose' | 'Oficina')[];
  clinicalNotes: ClinicalNote[];
  scoliosisData?: ScoliosisEvaluation;
  workshopData?: WorkshopEvaluation;
  waitingStatus?: WaitingStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Resinas' | 'Metais' | 'Tecidos' | 'Componentes' | 'Outros';
  quantity: number;
  unit: string;
  minQuantity: number;
}

export interface WorkshopOrder {
  id: string;
  patientId: string;
  patientName: string;
  product: string;
  status: WorkshopStatus;
  deadline: string;
  price: number;
  materialsUsed?: { itemId: string; qty: number }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  type: 'Physio' | 'Workshop';
  status: 'confirmed' | 'pending' | 'completed';
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
}

export interface KPI {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}
