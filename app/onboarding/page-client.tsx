"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  IndianRupee,
  Target,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-chrome";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "About you", icon: User },
  { id: 2, title: "Your goals", icon: Target },
  { id: 3, title: "Risk & SIP", icon: IndianRupee },
  { id: 4, title: "Confirm", icon: ShieldCheck },
];

const goals = [
  "Wealth creation",
  "Retirement",
  "Child education",
  "Home purchase",
  "Tax saving",
  "Emergency fund",
];
const risks = [
  { id: "conservative", label: "Conservative", desc: "Stable returns, low volatility" },
  { id: "moderate", label: "Moderate", desc: "Balanced equity & debt" },
  { id: "aggressive", label: "Aggressive", desc: "High equity, long horizon" },
];

function Onboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    pan: "",
    city: "",
    goal: "",
    target_amount: "",
    target_year: "",
    risk_profile: "moderate",
    monthly_sip: "",
  });

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    const [profileRes, leadRes] = await Promise.all([
      supabase.from("profiles").upsert({
        id: user.id,
        full_name: form.full_name || null,
        phone: form.phone || null,
        pan: form.pan?.toUpperCase() || null,
        risk_profile: form.risk_profile,
      }),
      supabase.from("leads").insert({
        full_name: form.full_name || user.email?.split("@")[0] || "Investor",
        email: user.email!,
        phone: form.phone || "0000000000",
        city: form.city || null,
        investment_amount: Number(form.monthly_sip) || 0,
        goal: form.goal || null,
        message: `Onboarding · Target ${form.target_amount} by ${form.target_year} · Risk ${form.risk_profile}`,
        source: "onboarding",
        status: "qualified",
      }),
    ]);
    setSubmitting(false);
    if (profileRes.error) return toast.error(profileRes.error.message);
    if (leadRes.error) console.warn(leadRes.error);
    toast.success("Welcome aboard! Your advisor will reach out shortly.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className={`flex flex-col items-center ${i === 0 ? "" : "flex-1"}`}>
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition ${
                      done
                        ? "gradient-bg text-primary-foreground shadow-glow"
                        : active
                          ? "border-2 border-primary bg-primary/10 text-primary"
                          : "border border-border bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <div
                    className={`mt-2 text-[10px] font-medium uppercase tracking-wider ${active || done ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.title}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-2 mb-6 h-0.5 flex-1 rounded-full ${done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 glass rounded-3xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <Header
                    title="Tell us about yourself"
                    sub="Basic info to set up your investor profile."
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name (as per PAN)">
                      <Input
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        maxLength={80}
                      />
                    </Field>
                    <Field label="Mobile">
                      <Input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                          })
                        }
                        placeholder="99992 52122"
                        inputMode="numeric"
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="PAN number">
                      <Input
                        value={form.pan}
                        onChange={(e) =>
                          setForm({ ...form, pan: e.target.value.toUpperCase().slice(0, 10) })
                        }
                        placeholder="ABCDE1234F"
                      />
                    </Field>
                    <Field label="City">
                      <Input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Mumbai"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <Header
                    title="What's your primary goal?"
                    sub="We'll map a personalized SIP plan."
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    {goals.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, goal: g })}
                        className={`rounded-2xl border p-3 text-left text-sm transition ${
                          form.goal === g
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <div className="font-medium">{g}</div>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Target corpus (₹)">
                      <Input
                        type="number"
                        value={form.target_amount}
                        onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                        placeholder="5000000"
                      />
                    </Field>
                    <Field label="Target year">
                      <Input
                        type="number"
                        value={form.target_year}
                        onChange={(e) => setForm({ ...form, target_year: e.target.value })}
                        placeholder="2040"
                        min={new Date().getFullYear() + 1}
                        max={2080}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Header title="Risk profile & SIP" sub="Helps us match the right portfolio." />
                  <div className="grid gap-2 sm:grid-cols-3">
                    {risks.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setForm({ ...form, risk_profile: r.id })}
                        className={`rounded-2xl border p-3 text-left transition ${
                          form.risk_profile === r.id
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <div className="text-sm font-semibold">{r.label}</div>
                        <div className="text-[11px] text-muted-foreground">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                  <Field label="Planned monthly SIP (₹)">
                    <Input
                      type="number"
                      value={form.monthly_sip}
                      onChange={(e) => setForm({ ...form, monthly_sip: e.target.value })}
                      placeholder="25000"
                    />
                  </Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <Header
                    title="Almost done"
                    sub="Review and submit. An advisor will reach out within 24 hours."
                  />
                  <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Row k="Name" v={form.full_name || "—"} />
                      <Row k="Mobile" v={form.phone || "—"} />
                      <Row k="PAN" v={form.pan || "—"} />
                      <Row k="City" v={form.city || "—"} />
                      <Row k="Goal" v={form.goal || "—"} />
                      <Row
                        k="Target"
                        v={
                          form.target_amount
                            ? `₹${Number(form.target_amount).toLocaleString("en-IN")} by ${form.target_year}`
                            : "—"
                        }
                      />
                      <Row k="Risk" v={form.risk_profile} />
                      <Row
                        k="Monthly SIP"
                        v={
                          form.monthly_sip
                            ? `₹${Number(form.monthly_sip).toLocaleString("en-IN")}`
                            : "—"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" />
                    <span>
                      Your data is protected with bank-grade encryption. WealthMaster India will
                      never share it with third parties.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between gap-2">
            <Button variant="outline" className="rounded-full" onClick={back} disabled={step === 1}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button className="rounded-full gradient-bg text-primary-foreground" onClick={next}>
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={submitting}
                className="rounded-full gradient-bg text-primary-foreground shadow-glow"
                onClick={submit}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Submit & continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-medium capitalize">{v}</div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAuth>
      <Onboarding />
    </RequireAuth>
  );
}
