"use client";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, PrimaryButton } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
});

function ResetPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ password: fd.get("password") });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(undefined);
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter a strong password to secure your account."
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <span className="text-xs font-medium">New password</span>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="At least 8 characters"
              className="flex h-11 w-full rounded-md border border-input bg-background pl-9 pr-10 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
        <PrimaryButton disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}

export default function Page() {
  return <ResetPage />;
}
