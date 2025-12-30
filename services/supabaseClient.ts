
import { createClient } from '@supabase/supabase-js';

// 1. ENDEREÇO DO SEU PROJETO (Conforme identificado no seu print anterior)
const SUPABASE_URL = 'https://rolmywoyffnjujopaqkd.supabase.co'; 

// 2. SUA CHAVE API PÚBLICA (ANON)
// Esta chave permite que o seu aplicativo se comunique com o banco de dados de forma segura.
const SUPABASE_ANON_KEY = 'sb_publishable_7VsRzyXKhPJISXrVsES1AA_aOhZDWjT';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
