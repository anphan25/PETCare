import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oiabrlpuqkwmsplufkzo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1aSVYhXG-cMYSU2hh03iSQ_d3Rlc7Sv';

if (!supabaseUrl || !supabaseKey) {
  console.error("LỖI NẶNG: Không tìm thấy Key Supabase. Kiểm tra lại file .env!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
