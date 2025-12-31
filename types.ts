
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
  AI_INSIGHTS = 'ai_insights',
  SCOLIOSIS_RECORD = 'scoliosis_record'
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

export interface ScoliosisData {
  // Anamnese
  main_complaint?: string;
  life_habits?: string;
  history_current_past?: string;
  family_history?: string;
  past_treatments?: string;
  
  // Checklist de Saúde
  has_surgeries?: boolean;
  has_diabetes?: boolean;
  has_fractures?: boolean;
  has_cardiac_issues?: boolean;
  has_allergies?: boolean;
  has_others?: boolean;

  // Exame Clínico
  pain_type?: string;
  medication?: string;
  eva_scale?: number; 

  // Maturidade & Hábitos
  has_breasts?: boolean;
  has_axillary_hair?: boolean;
  menstruation_obs?: string;
  worsening_factors?: string;
  improvement_factors?: string;
  sleep_obs?: string;
  physical_activity_obs?: string;
  activity_frequency?: string;
  activity_duration?: string;
  chronological_age?: number;

  // Ângulo de Cobb
  risser_scale?: number; 
  cobb_toracica?: number;
  cobb_lombar?: number;
  cobb_toracolombar?: number;

  // Avaliação Postural / Testes Específicos
  inc_cervical_c7?: number;
  inc_toracica_t12_1?: number;
  inc_resultado_1?: number;
  inc_toracica_t12_2?: number;
  inc_sacro_s1?: number;
  inc_resultado_2?: number;

  rot_sentado_d?: number;
  rot_sentado_e?: number;
  rot_superior_d?: number;
  rot_superior_e?: number;
  rot_inferior_d?: number;
  rot_inferior_e?: number;
  equi_unipodal_d?: number;
  equi_unipodal_e?: number;

  // Novos Testes
  scoliometer_toracica?: number;
  scoliometer_lombar?: number;
  
  mmii_real_mid?: number;
  mmii_real_mie?: number;
  mmii_aparente_mid?: number;
  mmii_aparente_mie?: number;

  adams_side_d?: boolean;
  adams_side_e?: boolean;
  
  lumbar_flexibility_cm?: number;

  abdominal_strength_g3?: string;
  abdominal_strength_g4?: string;
  abdominal_strength_g5?: string;
  
  oblique_right?: string;
  oblique_left?: string;
  lower_abdominal_sim?: boolean;

  // Diagnósticos e Planos Finais (Última Imagem)
  physio_diagnosis?: string;
  physio_plan?: string;

  // Campos Adicionais
  apex_level?: string;
  adams_test_mm?: number;
  rotation_degrees?: number;
  treatment_goal?: string;
  photo_urls?: string[];
  is_finished?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birth_date?: string;
  responsible_name?: string;
  responsible_cpf?: string;
  triagem_obs?: string;
  address_street?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_cep?: string;
  referring_type?: 'Spontaneous' | 'Direct' | 'Medical' | ''; 
  referring_professional_name?: string;
  referring_professional_specialty?: string;
  nf_full_name?: string;
  nf_cpf?: string;
  nf_address_street?: string;
  nf_address_neighborhood?: string;
  nf_address_city?: string;
  nf_address_state?: string;
  nf_address_cep?: string;
  
  last_visit: string;
  condition: string;
  categories: string[]; 
  clinical_notes: ClinicalNote[];
  waiting_status?: WaitingStatus;

  // Flags de Notificação
  pending_physio_eval?: boolean;
  pending_workshop_eval?: boolean;
  
  // Dados Especializados
  scoliosis_record?: ScoliosisData;
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
