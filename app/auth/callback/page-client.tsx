"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function finishSignIn() {
      const next = sanitizeRedirectPath(searchParams.get("next"));
      const code = searchParams.get("code");
      const oauthError =
        searchParams.get("error_description") || searchParams.get("error") || null;

      if (oauthError) {
        toast.error(oauthError);
        router.replace("/login");
        return;
      }

      if (!code) {
        const { data } = await supabase.auth.getSession();
        router.replace(data.session ? next : "/login");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (error) {
        toast.error(error.message);
        router.replace("/login");
        return;
      }

      router.replace(next);
    }

    finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Finishing Google sign-in...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return <AuthCallbackPage />;
}

function sanitizeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
