"use client";

import { supabase } from "@/integrations/supabase/client";

type Submission = Record<string, unknown>;

async function submitWithFallback(
  endpoint: "/api/leads" | "/api/consultations",
  table: "leads" | "consultations",
  submission: Submission,
) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    if (response.ok) return;
  } catch {
    // Fall through to the direct public insert when the server endpoint is unreachable.
  }

  const { error } = await supabase.from(table).insert(submission);
  if (error) throw error;
}

export const submitLead = (submission: Submission) =>
  submitWithFallback("/api/leads", "leads", submission);

export const submitConsultation = (submission: Submission) =>
  submitWithFallback("/api/consultations", "consultations", submission);
