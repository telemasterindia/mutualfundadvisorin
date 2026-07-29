import { NextResponse } from "next/server";
import { buildAdvisorMarketIdeas } from "@/lib/advisor-market";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const risk = params.get("risk");
  const horizon = Number(params.get("horizon"));
  const experience = params.get("experience") ?? "first-time";
  const capacity = Number(params.get("capacity"));
  const capacityType = params.get("capacityType") === "lumpsum" ? "lumpsum" : "monthly";

  if (
    !["conservative", "moderate", "aggressive"].includes(risk ?? "") ||
    !Number.isFinite(horizon) ||
    horizon < 1 ||
    horizon > 60
  ) {
    return NextResponse.json({ error: "Invalid advisor profile." }, { status: 400 });
  }

  try {
    const ideas = await buildAdvisorMarketIdeas({
      risk: risk as "conservative" | "moderate" | "aggressive",
      horizon,
      experience,
      capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : null,
      capacityType,
    });
    return NextResponse.json(ideas, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch {
    return NextResponse.json(
      { error: "Current performance data is temporarily unavailable." },
      { status: 502 },
    );
  }
}
