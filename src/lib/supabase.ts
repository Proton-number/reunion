// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zkekgkqwibhroileoqvc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZWtna3F3aWJocm9pbGVvcXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDQ1NTMsImV4cCI6MjA3MzU4MDU1M30.PeKH21veJdc7LEw6KKe36jLdC_NRqcHsUWLwetSgdDE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
