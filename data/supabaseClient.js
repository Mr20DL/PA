import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config(); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Verifica si las variables están cargadas
if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Variables de Supabase no definidas en .env");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);