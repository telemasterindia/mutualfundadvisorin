export function getSupabaseBrowserEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  assertSupabaseEnv({ url, publishableKey });

  return { url: url!, publishableKey: publishableKey! };
}

export function getSupabaseServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  assertSupabaseEnv({ url, publishableKey });

  return { url: url!, publishableKey: publishableKey! };
}

export function getSupabaseAdminEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    const missing = [
      ...(!url ? ["SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!serviceRoleKey ? ["SUPABASE_SERVICE_ROLE_KEY"] : []),
    ];

    throw new Error(`Missing Supabase admin environment variable(s): ${missing.join(", ")}.`);
  }

  return { url: url!, serviceRoleKey: serviceRoleKey! };
}

function assertSupabaseEnv({ url, publishableKey }: { url?: string; publishableKey?: string }) {
  if (!url || !publishableKey) {
    const missing = [
      ...(!url ? ["NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!publishableKey ? ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];

    throw new Error(`Missing Supabase environment variable(s): ${missing.join(", ")}.`);
  }
}
