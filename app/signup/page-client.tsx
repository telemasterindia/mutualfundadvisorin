"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, Field, PrimaryButton, GoogleButton, Divider } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(72)
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
});

function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.name, phone: parsed.data.phone },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Welcome to WealthMaster India!");
      router.push("/dashboard");
    } else {
      toast.success("Check your email to confirm your account.");
    }
  };

  const onGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <AuthShell
      title="Start your wealth journey"
      subtitle="Personalized advisory · Goal-based investing · Long-term wealth"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field
          id="name"
          name="name"
          label="Full name"
          icon={User}
          placeholder="Aarav Sharma"
          error={errors.name}
        />
        <Field
          id="email"
          name="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <Field
          id="phone"
          name="phone"
          label="Mobile"
          icon={Phone}
          placeholder="9999252122"
          inputMode="numeric"
          maxLength={10}
          error={errors.phone}
        />
        <div>
          <span className="text-xs font-medium">Password</span>
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
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            8+ chars with an uppercase letter and a number
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground">
          By creating an account you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>

        <PrimaryButton disabled={loading}>
          {loading ? "Creating account…" : "Create free account"}
        </PrimaryButton>

        <Divider />
        <GoogleButton onClick={onGoogle} label="Sign up with Google" />
      </form>
    </AuthShell>
  );
}

export default function Page() {
  return <SignupPage />;
}
