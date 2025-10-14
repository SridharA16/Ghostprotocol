import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scwcuibrijawazbpglwz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjd2N1aWJyaWphd2F6YnBnbHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjY5MDgsImV4cCI6MjA2MzYwMjkwOH0.KSVbzMGv2dNODuQNmU_6m02kHP-YOxUxlGgRQGCJiPQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);