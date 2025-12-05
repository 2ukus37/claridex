import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esdklxghavldvwunxwmr.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  role: 'doctor' | 'patient';
  full_name?: string;
}
