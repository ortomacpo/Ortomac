
import { createClient } from '@supabase/supabase-js';

// NOTA: Certifique-se de que estas informações batem com o seu painel do Supabase -> Settings -> API
const SUPABASE_URL = 'https://rolmywoyffnjujopaqkd.supabase.co'; 

// Importante: Se a sua chave começar com 'sb_publishable', verifique se ela é a chave 'anon/public'
const SUPABASE_ANON_KEY = 'sb_publishable_7VsRzyXKhPJISXrVsES1AA_aOhZDWjT';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
