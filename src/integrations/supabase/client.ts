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

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
