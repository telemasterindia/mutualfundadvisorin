"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement, useId, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  investment_amount: z.coerce.number().min(0).max(1_000_000_000).optional(),
  goal: z.string().max(60).optional().or(z.literal("")),
  message: z.string().max(800).optional().or(z.literal("")),
});

const goals = [
  "Wealth creation",
  "Retirement",
  "Child education",
  "Home purchase",
  "Tax saving",
  "Emergency fund",
];

function GetStarted() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    investment_amount: "",
    goal: "",
    message: "",
  });

  const onChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city || null,
      investment_amount: parsed.data.investment_amount || 0,
      goal: parsed.data.goal || null,
      message: parsed.data.message || null,
      source: "get-started-form",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    toast.success("Request received. Our advisor will reach out within 24 hours.");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">Personalized advisory</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Start your <span className="gradient-text">wealth journey</span> with an expert
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Share a few details and a SEBI-aligned, advisor will craft a personalized SIP &
              portfolio plan for you.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Free 1-on-1 consultation with a senior advisor",
                "Personalized goal-based SIP plan",
                "Curated portfolio of 4-star+ rated funds",
                "Quarterly review & rebalancing support",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>Bank-grade encryption</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-3xl p-6 sm:p-8">
              {done ? (
                <div className="py-10 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl gradient-bg shadow-glow">
                    <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold">You're on the list</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A WealthMaster India advisor will reach out within 24 hours on the number you
                    provided.
                  </p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Link href="/book-consultation">
                      <Button className="rounded-full gradient-bg text-primary-foreground">
                        Book a consultation <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => router.push("/")}
                    >
                      Back home
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.full_name}>
                      <Input
                        value={form.full_name}
                        onChange={(e) => onChange("full_name", e.target.value)}
                        placeholder="Aarav Sharma"
                        maxLength={80}
                      />
                    </Field>
                    <Field label="Mobile (10-digit)" error={errors.phone}>
                      <Input
                        value={form.phone}
                        onChange={(e) =>
                          onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="99992 52122"
                        inputMode="numeric"
                      />
                    </Field>
                  </div>
                  <Field label="Email" error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="aarav@example.com"
                      maxLength={255}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City" error={errors.city}>
                      <Input
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        placeholder="Mumbai"
                        maxLength={80}
                      />
                    </Field>
                    <Field label="Monthly SIP amount (₹)" error={errors.investment_amount}>
                      <Input
                        type="number"
                        value={form.investment_amount}
                        onChange={(e) => onChange("investment_amount", e.target.value)}
                        placeholder="25000"
                        min={0}
                      />
                    </Field>
                  </div>
                  <Field label="Primary goal" error={errors.goal}>
                    <Select value={form.goal} onValueChange={(v) => onChange("goal", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {goals.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Anything we should know? (optional)" error={errors.message}>
                    <Textarea
                      value={form.message}
                      onChange={(e) => onChange("message", e.target.value)}
                      maxLength={800}
                      rows={3}
                      placeholder="Existing investments, risk preference, time horizon..."
                    />
                  </Field>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full gradient-bg text-primary-foreground shadow-glow hover:opacity-95"
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp className="mr-2 h-4 w-4" />
                    )}
                    Request my free consultation
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    By continuing you agree to be contacted by WealthMaster India. We never sell
                    your data.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {isValidElement(children)
        ? cloneElement(children as React.ReactElement<any>, { id })
        : children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function Page() {
  return <GetStarted />;
}
