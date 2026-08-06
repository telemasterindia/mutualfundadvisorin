import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy | WealthMaster India",
  description:
    "Learn how WealthMaster India collects, uses, stores and protects information submitted through its website and consultation forms.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "1. Scope of this policy",
    body: [
      "This Privacy Policy applies to personal information collected through the WealthMaster India website, consultation forms, account features and communications with us. It explains what we collect, why we collect it, how it may be used or shared, and the choices available to you.",
      "By using this website or voluntarily submitting information, you acknowledge the practices described in this policy. Where consent is required, you may withdraw it by contacting us, subject to legal and operational requirements.",
    ],
  },
  {
    title: "2. Information we may collect",
    body: [
      "Information you provide may include your name, email address, telephone number, city, age range, financial goals, investment horizon, risk-related preferences, consultation details and messages sent to us.",
      "When you request transaction support, onboarding or another regulated financial service, information required for Know Your Customer (KYC) and compliance purposes may include your date of birth, gender, occupation, income range, tax status, Permanent Account Number (PAN), Aadhaar information where legally permitted, bank details, nominee details and supporting documents. We collect such information only when relevant to the service requested and applicable requirements.",
      "When account or portfolio features are used, we may process information needed to provide those features. Please never submit passwords, PINs or OTPs through contact forms, email or messaging services.",
      "We may automatically receive limited technical information such as device and browser type, IP address, pages visited, referring page, timestamps, cookie identifiers and diagnostic or security logs.",
    ],
  },
  {
    title: "3. Why we use your information",
    body: [
      "We use personal information to respond to enquiries, arrange consultations, provide requested tools or services, support KYC registration and verification, carry out compliance checks, process or facilitate authorized service requests, maintain client and regulatory records, prevent misuse, secure the website, troubleshoot issues and improve our content and user experience.",
      "We may use your registered contact details to send transaction updates, investment-related information, service notices, educational material or information we reasonably believe may be relevant to you. You may opt out of non-essential promotional communications at any time; service, transaction and legally required communications may still be sent.",
      "We process information only for a lawful purpose connected with the service you request, your consent, compliance with law, protection of legitimate rights or another basis permitted under applicable Indian law.",
    ],
  },
  {
    title: "4. Cookies and analytics",
    body: [
      "The website may use essential cookies or similar technologies to remember preferences, maintain sessions, support security and understand aggregate website usage. Third-party services used for hosting, analytics or embedded features may set their own cookies subject to their policies.",
      "You can restrict non-essential cookies through your browser settings. Some website features may not function correctly when essential cookies are disabled.",
    ],
  },
  {
    title: "5. Confidentiality and when information may be shared",
    body: [
      "Our relationship with users and clients is founded on trust. We treat personal and financial information as confidential and take reasonable measures to protect its confidentiality during collection, use, storage and transmission.",
      "We do not sell, rent or lease personal information. We may share limited information with technology, hosting, communication, KYC, registrar, transaction-processing, compliance or professional service providers that support our operations and are expected to handle it securely and only for the relevant purpose.",
      "Where you request a product or service offered through an Asset Management Company, registrar, transaction platform or duly licensed partner intermediary, relevant information may be shared as necessary to fulfil your authorized request and the applicable product terms.",
      "Information may be disclosed to government bodies, judicial authorities, regulators, law-enforcement agencies or another person where disclosure is required by law, regulation, court order or a binding legal obligation, or where reasonably necessary to protect users, our services and lawful rights.",
    ],
  },
  {
    title: "6. Retention and security",
    body: [
      "We retain personal information only for as long as reasonably necessary for the stated purpose, client servicing, dispute resolution, fraud prevention, backup cycles and applicable legal, tax or regulatory record-keeping obligations.",
      "We use reasonable physical, administrative, electronic and organizational safeguards designed to prevent unauthorized access, loss, misuse, alteration or disclosure. Access is intended to be limited to persons and service providers who need the information for an authorized purpose.",
      "No internet transmission, electronic communication or storage system is completely secure. Although we work to safeguard information, absolute security cannot be guaranteed, particularly for events beyond our reasonable control.",
    ],
  },
  {
    title: "7. Your privacy choices and rights",
    body: [
      "Subject to applicable law, you may request access to a summary of your personal information, correction of inaccurate or incomplete information, deletion of information that is no longer required, withdrawal of consent, or information about how a grievance can be raised.",
      "We may need to verify your identity before acting on a request. Some information may be retained where required by law or for establishing, exercising or defending legal claims. You may unsubscribe from non-essential marketing communications at any time.",
    ],
  },
  {
    title: "8. Children’s information",
    body: [
      "Our services are intended for adults capable of making financial decisions. We do not knowingly seek personal information from children. A parent or lawful guardian who believes a child has provided information may contact us to request appropriate action.",
    ],
  },
  {
    title: "9. External links and third parties",
    body: [
      "This website may link to AMCs, registrars, market-data providers, partner intermediaries or other third-party websites. Once you leave our website, we do not control the external website or how it handles information. Its content, accuracy, availability, privacy and security practices are governed by its own terms and policies.",
      "A link does not necessarily mean that WealthMaster India endorses every statement, service or opinion on the external website. You should review the relevant privacy notice before providing personal information. Any third-party link to this website is also outside our control unless expressly authorized by us.",
    ],
  },
  {
    title: "10. Changes to this policy",
    body: [
      "We may update this Privacy Policy to reflect changes in our services, technology or legal requirements. The revised version will be posted on this page with an updated effective date. Material changes may also be communicated through an appropriate additional notice.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card/85 to-success/10 p-7 shadow-soft sm:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Privacy &amp; data protection
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            This policy explains how WealthMaster India handles personal information with care,
            transparency and appropriate safeguards.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Effective date: 30 July 2026 &nbsp;•&nbsp; Last updated: 30 July 2026
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
          <article className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-border/70 bg-card/75 p-6 shadow-soft sm:p-8"
              >
                <h2 className="font-display text-xl font-bold">{section.title}</h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          <aside className="h-fit rounded-3xl border border-border/70 bg-card/85 p-6 shadow-soft lg:sticky lg:top-28">
            <ShieldCheck className="h-6 w-6 text-success" />
            <h2 className="mt-4 font-display text-lg font-bold">Privacy contact</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              For a privacy request, concern or grievance, contact WealthMaster India and include
              enough detail for us to identify and address your request.
            </p>
            <a
              href="mailto:invest@mutualfundadvisor.in?subject=Privacy%20request"
              className="mt-5 flex items-center gap-2 break-all text-sm font-semibold text-primary hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" />
              invest@mutualfundadvisor.in
            </a>
            <Link
              href="/contact"
              className="mt-5 inline-flex text-sm font-semibold text-foreground hover:text-primary"
            >
              Visit contact page →
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
