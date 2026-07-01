"use client";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, Field, PrimaryButton } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: fd.get("email") });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(undefined);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? "We've sent a reset link to your email."
          : "Enter your email and we'll send a reset link."
      }
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          <div className="text-sm">
            <div className="font-medium">Email sent successfully</div>
            <div className="mt-1 text-muted-foreground">
              The reset link will expire in 30 minutes. Don't see it? Check your spam folder.
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={error}
          />
          <PrimaryButton disabled={loading}>
            {loading ? "Sending link…" : "Send reset link"}
          </PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}

export default function Page() {
  return <ForgotPage />;
}
