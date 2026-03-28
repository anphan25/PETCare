import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oiabrlpuqkwmsplufkzo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1aSVYhXG-cMYSU2hh03iSQ_d3Rlc7Sv';

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase credentials not found. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
