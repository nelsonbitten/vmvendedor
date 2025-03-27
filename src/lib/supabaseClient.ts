import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzxdjjczgbluvjnjkmve.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6eGRqamN6Z2JsdXZqbmprbXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzAwNjcsImV4cCI6MjA1ODUwNjA2N30.CPKpq7kjKxJsLUGU_CP55rnhtMgmr9DjxspBqaK1xfM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
