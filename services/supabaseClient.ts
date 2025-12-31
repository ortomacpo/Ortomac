
import { createClient } from '@supabase/supabase-js';

// As variáveis devem ser configuradas no ambiente do projeto
const supabaseUrl = (window as any).process?.env?.SUPABASE_URL || '';
const supabaseKey = (window as any).process?.env?.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
