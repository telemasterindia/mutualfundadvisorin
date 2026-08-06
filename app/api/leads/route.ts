import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseServerEnv } from "@/integrations/supabase/env";

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead submission failed:", error);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again or contact us by email." },
      { status: 500 },
    );
  }
}
