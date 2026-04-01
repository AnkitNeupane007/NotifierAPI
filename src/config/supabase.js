// src/config/supabase.js
import { createClient } from "@supabase/supabase-js";
import { env } from "./envValidator.js";

// Initialize the native Supabase client
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false, // Not needed for a backend service
  },
});
export { supabase };
