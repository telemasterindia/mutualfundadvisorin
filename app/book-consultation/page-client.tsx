"use client";
import Link from "next/link";
import { cloneElement, isValidElement, useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { CalendarDays, CheckCircle2, Clock, Loader2, Video, Phone } from "lucide-react";
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
  full_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: z.string().min(1, "Pick a time"),
  topic: z.string().max(80).optional().or(z.literal("")),
  mode: z.enum(["video", "phone"]),
  message: z.string().max(800).optional().or(z.literal("")),
});

const slots = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "4:30 PM", "6:00 PM"];
const topics = [
  "Goal planning",
  "Portfolio review",
  "SIP setup",
  "Tax-saving funds",
  "Retirement planning",
  "NRI investing",
];

const today = new Date();
const minDate = today.toISOString().slice(0, 10);
const maxDate = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10);

function getFundIntentContext() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const intent = params.get("intent");
  const fund = params.get("fund");

  if (!fund || (intent !== "invest" && intent !== "sip")) return null;

  const code = params.get("code");
  const nav = params.get("nav");
  const fundHouse = params.get("house");
  const category = params.get("category");
  const label = intent === "sip" ? "Start SIP" : "Invest";
  const topic = intent === "sip" ? "SIP setup" : "Portfolio review";
  const details = [
    `Intent: ${label}`,
    `Fund: ${fund}`,
    code ? `Scheme code: ${code}` : null,
    nav ? `Latest NAV: Rs. ${nav}` : null,
    fundHouse ? `Fund house: ${fundHouse}` : null,
    category ? `Category: ${category}` : null,
  ].filter(Boolean);

  return {
    topic,
    message: `${details.join("\n")}\n\nPlease call me to discuss suitability and next steps.`,
  };
}

function BookConsultation() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_date: minDate,
    preferred_time: "",
    topic: "",
    mode: "video" as "video" | "phone",
    message: "",
  });

  useEffect(() => {
    const context = getFundIntentContext();
    if (!context) return;

    setForm((current) => ({
      ...current,
      topic: current.topic || context.topic,
      message: current.message || context.message,
    }));
  }, []);

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
    const { error } = await supabase.from("consultations").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferred_date: parsed.data.preferred_date,
      preferred_time: parsed.data.preferred_time,
      topic: parsed.data.topic || null,
      mode: parsed.data.mode,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setDone(true);
    toast.success("Consultation requested. You'll receive a confirmation shortly.");
  };

  const modes = [
    { id: "video", label: "Video call", icon: Video, sub: "Google Meet" },
    { id: "phone", label: "Phone call", icon: Phone, sub: "We'll call you" },
  ] as const;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-primary" /> Free 30-minute consultation
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Book a session with a <span className="gradient-text">senior advisor</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Pick a slot that works for you. We'll send a confirmation with the meeting link or call
            schedule.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-10 glass rounded-3xl p-6 sm:p-8"
        >
          {done ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl gradient-bg shadow-glow">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">Consultation requested</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your slot on <b>{form.preferred_date}</b> at <b>{form.preferred_time}</b> is being
                confirmed. Check your email shortly.
              </p>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button className="rounded-full gradient-bg text-primary-foreground">
                    Go to dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  How would you like to meet?
                </Label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {modes.map((m) => {
                    const active = form.mode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, mode: m.id }))}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          active
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-border/70 bg-secondary/30 hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "gradient-bg text-primary-foreground" : "bg-primary/10 text-primary"}`}
                        >
                          <m.icon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold">{m.label}</div>
                          <div className="text-[11px] text-muted-foreground">{m.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.full_name}>
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    maxLength={80}
                  />
                </Field>
                <Field label="Mobile" error={errors.phone}>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
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
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Preferred date" error={errors.preferred_date}>
                  <Input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={form.preferred_date}
                    onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                  />
                </Field>
                <Field label="Preferred time" error={errors.preferred_time}>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setForm({ ...form, preferred_time: s })}
                        className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                          form.preferred_time === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <Clock className="mr-1 inline h-3 w-3" />
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <Field label="Topic" error={errors.topic}>
                <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="What would you like to discuss?" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Notes for the advisor (optional)" error={errors.message}>
                <Textarea
                  rows={3}
                  maxLength={800}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                  <CalendarDays className="mr-2 h-4 w-4" />
                )}
                Confirm consultation
              </Button>
            </form>
          )}
        </motion.div>
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
  return <BookConsultation />;
}
