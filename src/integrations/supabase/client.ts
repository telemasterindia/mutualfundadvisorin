import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "./env";

function createSupabaseClient() {
  const { url, publishableKey } = getSupabaseBrowserEnv();

  return createClient(url, publishableKey, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = createSupabaseClient();
