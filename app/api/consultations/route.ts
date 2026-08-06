import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseServerEnv } from "@/integrations/supabase/env";

const consultationSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/),
  preferred_date: z.string().date(),
  preferred_time: z.string().trim().min(1).max(40),
  topic: z.string().trim().max(80).nullish(),
  mode: z.enum(["video", "phone"]),
  message: z.string().trim().max(800).nullish(),
});

export async function POST(request: Request) {
  try {
    const parsed = consultationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the submitted details." }, { status: 400 });
    }

    const { url, publishableKey } = getSupabaseServerEnv();
    const supabase = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("consultations").insert(parsed.data);

    if (error) {
      console.error("Consultation submission failed:", error.message);
      return NextResponse.json(
        { error: "We could not book your consultation. Please try again or contact us by email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Consultation submission failed:", error);
    return NextResponse.json(
      { error: "We could not book your consultation. Please try again or contact us by email." },
      { status: 500 },
    );
  }
}
