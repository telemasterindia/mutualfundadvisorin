"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AuthShell, Field, PrimaryButton, GoogleButton, Divider } from "@/components/auth-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));

  useEffect(() => {
    if (user) router.replace(redirectTo);
  }, [redirectTo, user, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) {
      const fe: any = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(
        error.code === "email_not_confirmed"
          ? "Please verify your email first, then sign in again."
          : error.message,
      );
      return;
    }
    toast.success("Welcome back!");
    router.replace(redirectTo);
  };

  const onGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(redirectTo),
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to access your portfolio"
      footer={
        <>
          New to WealthMaster India?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field
          id="email"
          name="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Password</span>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
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
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Checkbox /> Keep me signed in
        </label>

        <PrimaryButton disabled={loading}>
          {loading ? "Signing in…" : "Login to dashboard"}
        </PrimaryButton>

        <Divider />
        <GoogleButton onClick={onGoogle} />
      </form>
    </AuthShell>
  );
}

export default function Page() {
  return <LoginPage />;
}

function sanitizeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
