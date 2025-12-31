
import { createClient } from '@supabase/supabase-js';

// URL do projeto do usuário
const SUPABASE_URL = 'https://rolmywoyffnjujopaqkd.supabase.co'; 

// A chave 'anon' pública necessária para o client-side
const SUPABASE_ANON_KEY = 'sb_publishable_7VsRzyXKhPJISXrVsES1AA_aOhZDWjT';

// Criação do cliente com tratamento de erro inicial
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase: Credenciais ausentes no arquivo de serviço.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
