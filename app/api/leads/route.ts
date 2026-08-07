import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseServerEnv } from "@/integrations/supabase/env";
import { sendLeadNotification } from "@/lib/lead-notification";

const leadSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/),
  city: z.string().trim().max(100).nullish(),
  investment_amount: z.number().nonnegative().nullish(),
  goal: z.string().trim().max(120).nullish(),
  message: z.string().trim().max(2000).nullish(),
  source: z.string().trim().min(2).max(120),
});

export async function POST(request: Request) {
  try {
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the submitted details." }, { status: 400 });
    }

    const { url, publishableKey } = getSupabaseServerEnv();
    const supabase = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("leads").insert(parsed.data);

    if (error) {
      console.error("Lead submission failed:", error.message);
      return NextResponse.json(
        { error: "We could not submit your request. Please try again or contact us by email." },
        { status: 500 },
      );
    }

    const notificationSent = await sendLeadNotification(
      `New website lead: ${parsed.data.full_name}`,
      [
        ["Name", parsed.data.full_name],
        ["Email", parsed.data.email],
        ["Phone", parsed.data.phone],
        ["City", parsed.data.city],
        ["Investment amount", parsed.data.investment_amount],
        ["Goal", parsed.data.goal],
        ["Message", parsed.data.message],
        ["Source", parsed.data.source],
      ],
      parsed.data.email,
    );

    return NextResponse.json({ ok: true, notificationSent });
  } catch (error) {
    console.error("Lead submission failed:", error);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again or contact us by email." },
      { status: 500 },
    );
  }
}
