"use client";
import { Mail, Phone, MapPin, Loader2, MessageCircle } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cloneElement, isValidElement, useId, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT, waLink } from "@/lib/contact";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(1000),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

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
    setBusy(true);
    const { error } = await supabase.from("leads").insert({
      full_name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: `[${parsed.data.subject}] ${parsed.data.message}`,
      source: "contact-form",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Message sent. We'll reply within 24 hours.");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Contact WealthMaster India
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Speak with Amit Chadha.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Founder &amp; Investment Advisor, WealthMaster India — for Mutual Funds, SIPs, Insurance,
          PMS, AIF and Retirement Planning.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <a href={CONTACT.telHref} className="block">
              <Info
                icon={Phone}
                title={`Call Amit Chadha: ${CONTACT.phone}`}
                body="Mon–Sat, 9am–6pm IST"
              />
            </a>
            <Info icon={Mail} title="Email" body={CONTACT.email} />
            <a
              href={waLink(
                "Hi WealthMaster India, I'd like to schedule an investment consultation.",
              )}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Info icon={MessageCircle} title="WhatsApp" body={CONTACT.whatsappDisplay} />
            </a>
            <Info icon={MapPin} title="Visit us" body={CONTACT.address} />
          </div>

          <form className="glass rounded-3xl p-8 lg:col-span-3" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <div className="mt-4">
              <Field label="Email" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Subject" error={errors.subject}>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  maxLength={120}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Message" error={errors.message}>
                <Textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                />
              </Field>
            </div>
            <Button
              type="submit"
              disabled={busy || sent}
              size="lg"
              className="mt-6 gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sent ? "Message sent ✓" : "Send message"}
            </Button>
          </form>
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
    <div>
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5">
        {isValidElement(children)
          ? cloneElement(children as React.ReactElement<any>, { id })
          : children}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Info({ icon: Icon, title, body }: any) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{body}</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Contact />;
}
