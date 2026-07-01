import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Wait for auth state to fully resolve before deciding anything
    if (loading) {
      setChecking(true);
      return;
    }

    if (!user || !session) {
      router.push("/login");
      return;
    }

    let cancelled = false;
    setChecking(true);

    (async () => {
      // Ensure the session token is fresh before issuing RLS-bound queries.
      // This avoids the "row not visible" race where the access token hasn't
      // been hydrated yet on hard refresh.
      try {
        await supabase.auth.getSession();
      } catch {
        /* no-op */
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "advisor"]);

      if (cancelled) return;

      if (error) {
        console.error("[RequireAdmin] role lookup failed", error);
        setIsAdmin(false);
      } else {
        setIsAdmin((data?.length ?? 0) > 0);
      }
      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, session?.access_token, loading, router]);

  if (loading || checking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="glass max-w-md rounded-3xl p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-warning/15 text-warning">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have CRM permissions yet. Ask an existing admin to grant you the
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-xs">admin</code>
            or
            <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-xs">advisor</code>
            role.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
