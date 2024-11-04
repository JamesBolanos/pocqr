// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vcpegfwuohwjmjwnedut.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGVnZnd1b2h3am1qd25lZHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2Nzg2MDcsImV4cCI6MjA0NjI1NDYwN30.EROXaOaCVIsXBm3iksXn4r5WKGR7jEk7iUwARDZ-u0U'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
