import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, Phone, X, Sparkles } from "lucide-react";
import { CONTACT, waLink, mailLink } from "@/lib/contact";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const msg =
    "Hi WealthMaster India, I'd like to schedule an investment consultation with Amit Chadha.";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-strong w-72 rounded-3xl border border-border/60 p-4 shadow-elegant"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl gradient-bg shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div>
                <div className="text-sm font-semibold">Speak with Amit Chadha</div>
                <div className="text-[11px] text-muted-foreground">
                  Founder &amp; Investment Advisor · Mon–Sat
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <a
                href={waLink(msg)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-3 text-sm transition hover:border-success/40 hover:bg-success/5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-success text-white">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-[11px] text-muted-foreground">{CONTACT.whatsappDisplay}</div>
                </div>
              </a>
              <a
                href={mailLink("Mutual fund advisory enquiry")}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-[11px] text-muted-foreground">{CONTACT.email}</div>
                </div>
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium">Call Amit Chadha</div>
                  <div className="text-[11px] text-muted-foreground">{CONTACT.phone}</div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        aria-label="Contact advisor"
        className="grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-elegant transition hover:scale-105"
        style={{ boxShadow: "0 18px 40px -12px rgb(34 197 94 / 0.5)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "wa"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-destructive ring-2 ring-background" />
        )}
      </motion.button>
    </div>
  );
}
