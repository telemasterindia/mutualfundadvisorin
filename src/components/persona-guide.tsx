"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DISCLAIMER =
  "Mutual fund investments are subject to market risk. This is general guidance based on the details you've shared, not personalized investment advice. Please consult with our advisor before investing.";

type GoalOption = readonly [value: string, label: string];
type GoalGroup = { label: string; goals: readonly GoalOption[] };

const goalGroups = [
  {
    label: "Big purchases & milestones",
    goals: [
      ["home", "Buying a home"],
      ["home-renovation", "Home renovation"],
      ["vehicle", "Buying a vehicle"],
      ["marriage", "Marriage / wedding expenses"],
    ],
  },
  {
    label: "Education & growth",
    goals: [
      ["education", "Child's education"],
      ["self-education", "Higher education / upskilling for yourself"],
    ],
  },
  {
    label: "Work & business",
    goals: [["business", "Starting or growing a business"]],
  },
  {
    label: "Life & security",
    goals: [
      ["parking", "Emergency fund / short-term parking"],
      ["medical", "Medical / health expenses"],
      ["vacation", "Vacation / travel"],
      ["loan-repayment", "Loan repayment / prepayment"],
    ],
  },
  {
    label: "Long-term & income",
    goals: [
      ["wealth", "Wealth creation"],
      ["retirement", "Retirement"],
      ["income", "Regular income from investments"],
      ["tax", "Tax saving"],
      ["general", "General savings, no fixed goal yet"],
    ],
  },
] as const satisfies readonly GoalGroup[];

const goals = goalGroups.reduce<GoalOption[]>(
  (allGoals, group) => [...allGoals, ...group.goals],
  [],
);
const FIXED_DATE_GOALS = ["vehicle", "marriage", "home", "home-renovation"] as const;
const fixedDatePersonas: Record<(typeof FIXED_DATE_GOALS)[number], string> = {
  vehicle: "Vehicle Purchase Planner",
  marriage: "Wedding Fund Planner",
  home: "Home Purchase Planner",
  "home-renovation": "Home Renovation Planner",
};

type Risk = "conservative" | "moderate" | "aggressive";
type CapacityType = "monthly" | "lumpsum";
type EmploymentType = "salaried" | "self-employed" | "retired" | "student";
type Experience = "first-time" | "some" | "experienced";
type Residency = "resident" | "nri";

type Profile = {
  age: string;
  goal: string;
  horizon: string;
  risk: Risk | "";
  capacityType: CapacityType;
  capacity: string;
  employmentType: EmploymentType | "";
  experience: Experience | "";
  residency: Residency | "";
  existingInvestments: "yes" | "no" | "";
};

type Recommendation = {
  persona: string;
  categories: Array<{ name: string; why: string }>;
  calculator: { label: string; href: string; reason: string };
  note?: string;
  furtherReading?: { label: string; href: string };
};

function buildRecommendationLegacy(profile: Profile): Recommendation {
  const age = Number(profile.age);
  const years = Number(profile.horizon);
  const risk = profile.risk as Risk;
  const goal = goals.find(([value]) => value === profile.goal)?.[1] ?? profile.goal;
  const shortTerm = years <= 3 || profile.goal === "parking";
  const nearRetirement = profile.goal === "retirement" && (age >= 50 || years <= 7);

  if (profile.residency === "nri") {
    return {
      persona: "NRI Investor",
      categories: [
        {
          name: "Aggressive hybrid funds",
          why: "A general starting point combining equity and debt, with substantial market risk; it is not tailored to NRI tax or location rules.",
        },
        {
          name: "Large-cap equity funds",
          why: "A general starting point for diversified exposure to established companies, while remaining exposed to equity-market declines.",
        },
        {
          name: "Balanced advantage funds",
          why: "A general starting point with dynamic equity and debt exposure; allocation changes can reduce but do not remove volatility.",
        },
      ],
      calculator: {
        label: "Goal SIP calculator",
        href: "/calculator#goal-sip",
        reason: `Use a general estimate for ${goal.toLowerCase()}, then confirm currency, tax and repatriation assumptions separately.`,
      },
      note: "Tax treatment and repatriation rules for NRIs differ and aren't covered here — this is exactly the kind of thing to confirm with an advisor before investing.",
    };
  }

  if (profile.employmentType === "retired" || profile.goal === "income") {
    return {
      persona: "Retiree Income Seeker",
      categories: [
        {
          name: "Conservative hybrid funds",
          why: "A measured income-oriented mix led by debt with limited equity exposure, but income and capital are not guaranteed.",
        },
        {
          name: "Short-duration debt funds",
          why: "Can support a lower-volatility allocation, while still carrying interest-rate, liquidity and credit risk.",
        },
      ],
      calculator: {
        label: "Retirement calculator",
        href: "/calculator#retirement",
        reason:
          "Use the retirement calculator as a starting estimate for corpus needs; it does not yet model a detailed withdrawal plan.",
      },
    };
  }

  if (shortTerm) {
    return {
      persona:
        profile.goal === "parking" ? "Short-Term Capital Preserver" : "Near-Term Goal Protector",
      categories: [
        {
          name: "Liquid funds",
          why: `Designed for short holding periods and liquidity; they still carry market and credit risk.`,
        },
        {
          name: "Ultra-short duration funds",
          why: `May suit a ${years}-year horizon better than equity, subject to interest-rate and credit risk.`,
        },
      ],
      calculator: {
        label: profile.capacityType === "lumpsum" ? "Lumpsum calculator" : "Goal SIP calculator",
        href: profile.capacityType === "lumpsum" ? "/calculator#lumpsum" : "/calculator#goal-sip",
        reason: `Estimate whether your ${profile.capacityType === "monthly" ? "monthly contribution" : "available amount"} is aligned with your ${goal.toLowerCase()} timeline.`,
      },
    };
  }

  if (nearRetirement || risk === "conservative") {
    return {
      persona:
        profile.experience === "first-time" && risk !== "aggressive"
          ? "First-Time Independent Investor"
          : nearRetirement
            ? "Pre-Retirement Capital Protector"
            : "Steady and Conservative Planner",
      categories: [
        {
          name: "Conservative hybrid funds",
          why: "Primarily debt-oriented with limited equity exposure for measured growth and lower volatility than equity funds.",
        },
        {
          name: "Short-duration debt funds",
          why: "Can support the lower-volatility portion of a goal portfolio, while still carrying interest-rate and credit risk.",
        },
      ],
      calculator: {
        label: profile.goal === "retirement" ? "Retirement calculator" : "Goal SIP calculator",
        href: profile.goal === "retirement" ? "/calculator#retirement" : "/calculator#goal-sip",
        reason: `Check the gap between your planned contribution and the amount needed for ${goal.toLowerCase()}.`,
      },
      furtherReading:
        profile.experience === "first-time" && risk !== "aggressive"
          ? { label: "Start with: What is a mutual fund?", href: "/learn/what-is-a-mutual-fund" }
          : undefined,
    };
  }

  if (profile.goal === "tax") {
    return {
      persona: "First-Time Tax-Saving Investor",
      categories: [
        {
          name: "ELSS equity funds",
          why: "Eligible for Section 80C treatment under current tax rules and has a statutory three-year lock-in, with equity-market risk.",
        },
      ],
      calculator: {
        label: "SIP calculator",
        href: "/calculator#sip",
        reason:
          "Illustrate how a regular monthly investment may build over your chosen horizon using adjustable assumptions.",
      },
    };
  }

  if (risk === "aggressive" && years >= 7) {
    if (profile.experience === "experienced") {
      return {
        persona: "Experienced Growth Seeker",
        categories: [
          {
            name: "Flexi-cap equity funds",
            why: `Offer diversified equity exposure across company sizes for your ${years}-year horizon, with significant market risk.`,
          },
          {
            name: "Large & mid-cap funds",
            why: "Combine established and mid-sized companies, with meaningful volatility and possible prolonged declines.",
          },
          {
            name: "Sectoral/thematic funds",
            why: "Concentrated in one sector or theme, which can mean sharper swings than diversified equity funds.",
          },
        ],
        calculator: {
          label: profile.goal === "retirement" ? "Retirement calculator" : "SIP calculator",
          href: profile.goal === "retirement" ? "/calculator#retirement" : "/calculator#sip",
          reason: `Stress-test disciplined contributions toward ${goal.toLowerCase()} without treating assumed returns as guaranteed.`,
        },
      };
    }
    if (profile.experience === "first-time" && age <= 26) {
      return {
        persona: "First Job SIP Starter",
        categories: [
          {
            name: "Flexi-cap equity funds",
            why: "A diversified starting category across company sizes, while still exposed to substantial equity-market risk.",
          },
          {
            name: "Index funds",
            why: "A simpler rules-based approach to broad-market exposure, with tracking difference and full market volatility.",
          },
        ],
        calculator: {
          label: "SIP calculator",
          href: "/calculator#sip",
          reason:
            "Start with a manageable monthly habit and test how it may build over time using adjustable assumptions.",
        },
      };
    }
    return {
      persona: age <= 35 ? "Young Aggressive Wealth Builder" : "Long-Term Growth Seeker",
      categories: [
        {
          name: "Flexi-cap equity funds",
          why: `Offer diversified equity exposure across company sizes for your ${years}-year horizon.`,
        },
        {
          name: "Large & mid-cap funds",
          why: "Combine established companies with higher-growth mid-sized businesses, with meaningful volatility.",
        },
        {
          name: "Mid-cap funds",
          why: "May complement a long horizon and aggressive risk appetite, but can experience sharp and prolonged declines.",
        },
      ],
      calculator: {
        label: profile.goal === "retirement" ? "Retirement calculator" : "SIP calculator",
        href: profile.goal === "retirement" ? "/calculator#retirement" : "/calculator#sip",
        reason: `See how disciplined investing could progress toward ${goal.toLowerCase()} over ${years} years without treating assumed returns as guaranteed.`,
      },
    };
  }

  if (profile.employmentType === "self-employed") {
    return {
      persona: "Self-Employed Flexible Investor",
      categories: [
        {
          name: "Flexi-cap equity funds",
          why: "Provide diversified long-term equity exposure, but values can fluctuate sharply when markets fall.",
        },
        {
          name: "Balanced advantage funds",
          why: "Adjust equity and debt exposure dynamically, which can moderate but not eliminate market risk.",
        },
      ],
      calculator: {
        label: "SIP calculator",
        href: "/calculator#sip",
        reason:
          "Model a base SIP and consider adding lump-sum contributions when irregular income allows.",
      },
    };
  }

  return {
    persona: "Balanced Long-Term Builder",
    categories: [
      {
        name: "Aggressive hybrid funds",
        why: "Blend equity growth potential with a debt allocation, while still carrying substantial market risk.",
      },
      {
        name: "Large-cap equity funds",
        why: `Provide diversified exposure to established companies for your ${years}-year goal.`,
      },
      {
        name: "Balanced advantage funds",
        why: "Dynamically adjust equity and debt exposure; the strategy can reduce but does not remove volatility.",
      },
    ],
    calculator: {
      label: profile.goal === "retirement" ? "Retirement calculator" : "Goal SIP calculator",
      href: profile.goal === "retirement" ? "/calculator#retirement" : "/calculator#goal-sip",
      reason: `Turn your ${goal.toLowerCase()} target into a practical contribution estimate.`,
    },
  };
}

function buildRecommendation(profile: Profile): Recommendation {
  const age = Number(profile.age);
  const years = Number(profile.horizon);
  const risk = profile.risk as Risk;
  const goal = goals.find(([value]) => value === profile.goal)?.[1] ?? profile.goal;
  const shortTerm = years <= 3 || profile.goal === "parking";
  const nearRetirement = profile.goal === "retirement" && (age >= 50 || years <= 7);
  const nriNote =
    "Tax treatment and repatriation rules for NRIs differ and aren't covered here — confirm this with an advisor before investing.";

  const addNriNote = (recommendation: Recommendation): Recommendation =>
    profile.residency === "nri"
      ? {
          ...recommendation,
          note: recommendation.note ? `${recommendation.note} ${nriNote}` : nriNote,
        }
      : recommendation;

  const useExistingBranch = (overrides: Partial<Profile> = {}) =>
    buildRecommendationLegacy({
      ...profile,
      residency: "resident",
      existingInvestments: "",
      ...overrides,
    });

  const recommendation = (() => {
    if (profile.goal === "tax") {
      return addNriNote(
        useExistingBranch({
          goal: "tax",
          risk: "moderate",
          horizon: String(Math.max(4, years)),
          employmentType: "salaried",
        }),
      );
    }

    if (shortTerm) {
      return addNriNote({
        persona:
          profile.goal === "parking" ? "Short-Term Capital Preserver" : "Near-Term Goal Protector",
        categories: [
          {
            name: "Liquid funds",
            why: `Designed for short holding periods and liquidity; they still carry market and credit risk.`,
          },
          {
            name: "Ultra-short duration funds",
            why: `May suit a ${years}-year horizon better than equity, subject to interest-rate and credit risk.`,
          },
        ],
        calculator: {
          label: profile.capacityType === "lumpsum" ? "Lumpsum calculator" : "Goal SIP calculator",
          href: profile.capacityType === "lumpsum" ? "/calculator#lumpsum" : "/calculator#goal-sip",
          reason: `Estimate whether your ${profile.capacityType === "monthly" ? "monthly contribution" : "available amount"} is aligned with your ${goal.toLowerCase()} timeline.`,
        },
      });
    }

    if (
      FIXED_DATE_GOALS.includes(profile.goal as (typeof FIXED_DATE_GOALS)[number]) &&
      years >= 4 &&
      years < 7
    ) {
      const fixedGoal = profile.goal as (typeof FIXED_DATE_GOALS)[number];

      return addNriNote({
        persona: fixedDatePersonas[fixedGoal],
        categories: [
          {
            name: "Large-cap equity funds",
            why: "Can add measured growth potential through established companies, but equity values may still fall materially before the goal date.",
          },
          {
            name: "Conservative hybrid funds",
            why: "Lean toward debt with limited equity exposure for greater stability, while still carrying interest-rate, credit and market risk.",
          },
        ],
        calculator: {
          label: "Goal SIP calculator",
          href: "/calculator#goal-sip",
          reason: `Estimate the contribution needed for ${goal.toLowerCase()} over a fixed ${years}-year timeline using cautious assumptions.`,
        },
        note: `Because ${goal.toLowerCase()} has a fixed timeline of about ${years} years, we've weighted this toward capital protection rather than your stated risk appetite — a market dip right before you need the money would matter more here than the extra growth potential.`,
      });
    }

    if (nearRetirement || risk === "conservative") {
      const conservativeRecommendation = useExistingBranch({
        employmentType: "salaried",
        goal: profile.goal === "income" ? "general" : profile.goal,
      });

      if (profile.goal === "income") {
        conservativeRecommendation.calculator.reason =
          "Check the gap between your planned contribution and the amount needed for regular income from investments.";
      }

      return addNriNote(conservativeRecommendation);
    }

    if (profile.employmentType === "retired") {
      return useExistingBranch({ employmentType: "retired", goal: "income" });
    }

    if (profile.goal === "income") {
      return {
        persona: "Passive Income Builder",
        categories: [
          {
            name: "Conservative hybrid funds",
            why: "Can support the gradual building of a supplementary income-oriented portfolio, but income and capital are not guaranteed.",
          },
          {
            name: "Short-duration debt funds",
            why: "May provide a relatively lower-volatility base for future income needs, while retaining interest-rate, liquidity and credit risk.",
          },
        ],
        calculator: {
          label: "Goal SIP calculator",
          href: "/calculator#goal-sip",
          reason:
            "Estimate a regular contribution toward a future supplementary-income corpus using adjustable assumptions.",
        },
      };
    }

    if (profile.residency === "nri") {
      return buildRecommendationLegacy({ ...profile, existingInvestments: "" });
    }

    if (risk === "aggressive" && years >= 7) {
      return useExistingBranch();
    }

    if (risk === "aggressive" && years >= 4 && years < 7) {
      return {
        persona: "Growth-Focused Mid-Horizon Investor",
        categories: [
          {
            name: "Large & mid-cap funds",
            why: "Offer a mix of established and growing companies, but a four-to-six-year horizon can still experience significant volatility and capital loss.",
          },
          {
            name: "Flexi-cap funds",
            why: "Allow allocation across company sizes, while remaining fully exposed to equity-market declines over a relatively shorter growth horizon.",
          },
        ],
        calculator: {
          label: "Goal SIP calculator",
          href: "/calculator#goal-sip",
          reason: `Test whether regular contributions could support ${goal.toLowerCase()} over ${years} years using cautious return assumptions.`,
        },
      };
    }

    if (profile.employmentType === "self-employed") {
      return useExistingBranch({ employmentType: "self-employed" });
    }

    return useExistingBranch();
  })();

  if (profile.existingInvestments !== "yes") return recommendation;

  const overlapNote =
    "Since you already invest in mutual funds, it's worth checking these categories against what you already hold to avoid unnecessary overlap.";

  return {
    ...recommendation,
    note: recommendation.note ? `${recommendation.note} ${overlapNote}` : overlapNote,
  };
}

export function PersonaGuide() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Profile>({
    age: "",
    goal: "",
    horizon: "",
    risk: "",
    capacityType: "monthly",
    capacity: "",
    employmentType: "",
    experience: "",
    residency: "",
    existingInvestments: "",
  });

  const recommendation = useMemo(
    () => (submitted ? buildRecommendation(profile) : null),
    [profile, submitted],
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const age = Number(profile.age);
    const horizon = Number(profile.horizon);
    const capacity = Number(profile.capacity);

    if (
      !profile.age ||
      !profile.goal ||
      !profile.horizon ||
      !profile.risk ||
      !profile.employmentType ||
      !profile.experience ||
      !profile.residency
    ) {
      setError(
        "Please complete your age, goal, horizon, risk appetite, employment, experience and residency before I suggest categories.",
      );
      return;
    }
    if (age < 18 || age > 100 || horizon < 1 || horizon > 60) {
      setError("Please enter a valid age and an investment horizon between 1 and 60 years.");
      return;
    }
    if (profile.capacity && (!Number.isFinite(capacity) || capacity < 0)) {
      setError("Please enter a valid investment amount, or leave it blank.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  function reset() {
    setSubmitted(false);
    setError("");
  }

  const goalLabel = goals.find(([value]) => value === profile.goal)?.[1];
  const capacityText = profile.capacity
    ? `${profile.capacityType === "monthly" ? "Rs. " : "a Rs. "}${Number(profile.capacity).toLocaleString("en-IN")}${profile.capacityType === "monthly" ? "/month" : " lump sum"}`
    : "an amount you are still deciding";

  return (
    <div id="persona-advisor" className="mx-auto max-w-4xl scroll-mt-28">
      <section className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-elegant">
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-bg text-primary-foreground shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Find your investor persona</div>
              <div className="text-[11px] text-muted-foreground">
                Category guidance in about a minute
              </div>
            </div>
          </div>
          <Bot className="h-5 w-5 text-primary" />
        </div>

        <div className="overflow-y-auto p-5">
          {!recommendation ? (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Tell me a little about your goal. I’ll suggest suitable mutual fund categories—not
                individual schemes.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="guide-age">Your age *</Label>
                  <Input
                    id="guide-age"
                    inputMode="numeric"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    placeholder="e.g. 32"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="guide-horizon">Horizon (years) *</Label>
                  <Input
                    id="guide-horizon"
                    inputMode="numeric"
                    value={profile.horizon}
                    onChange={(e) => setProfile({ ...profile, horizon: e.target.value })}
                    placeholder="e.g. 10"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label>Primary goal *</Label>
                <Select
                  value={profile.goal}
                  onValueChange={(goal) => setProfile({ ...profile, goal })}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Choose your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalGroups.map((group) => (
                      <SelectGroup key={group.label}>
                        <SelectLabel className="text-xs text-muted-foreground">
                          {group.label}
                        </SelectLabel>
                        {group.goals.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk appetite *</Label>
                <Select
                  value={profile.risk}
                  onValueChange={(risk) => setProfile({ ...profile, risk: risk as Risk })}
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="How much fluctuation can you accept?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative — prefer stability</SelectItem>
                    <SelectItem value="moderate">Moderate — accept some ups and downs</SelectItem>
                    <SelectItem value="aggressive">
                      Aggressive — accept large fluctuations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Employment type *</Label>
                  <Select
                    value={profile.employmentType}
                    onValueChange={(employmentType) =>
                      setProfile({ ...profile, employmentType: employmentType as EmploymentType })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Choose employment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salaried">Salaried</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Where do you currently reside? *</Label>
                  <Select
                    value={profile.residency}
                    onValueChange={(residency) =>
                      setProfile({ ...profile, residency: residency as Residency })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Choose residency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Resident Indian</SelectItem>
                      <SelectItem value="nri">NRI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>How much mutual fund experience do you have? *</Label>
                <Select
                  value={profile.experience}
                  onValueChange={(experience) =>
                    setProfile({ ...profile, experience: experience as Experience })
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Choose your experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-time">First-time investor</SelectItem>
                    <SelectItem value="some">Some experience</SelectItem>
                    <SelectItem value="experienced">Experienced investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Do you already invest in mutual funds? (optional)</Label>
                <Select
                  value={profile.existingInvestments}
                  onValueChange={(existingInvestments) =>
                    setProfile({
                      ...profile,
                      existingInvestments: existingInvestments as "yes" | "no",
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5 w-full">
                    <SelectValue placeholder="Choose if you want to share" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guide-capacity">Investment capacity (optional)</Label>
                <div className="mt-1.5 grid grid-cols-[125px_1fr] gap-2">
                  <Select
                    value={profile.capacityType}
                    onValueChange={(capacityType) =>
                      setProfile({ ...profile, capacityType: capacityType as CapacityType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly SIP</SelectItem>
                      <SelectItem value="lumpsum">Lump sum</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="guide-capacity"
                    inputMode="numeric"
                    value={profile.capacity}
                    onChange={(e) => setProfile({ ...profile, capacity: e.target.value })}
                    placeholder="Amount in Rs."
                  />
                </div>
              </div>
              {error ? (
                <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{error}</p>
              ) : null}
              <Button type="submit" className="w-full rounded-full">
                Show my profile <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-sm">
              <section>
                <h3 className="font-display text-base font-bold">Your Profile</h3>
                <p className="mt-1 leading-6 text-muted-foreground">
                  You’re {profile.age}, planning for {goalLabel?.toLowerCase()} over{" "}
                  {profile.horizon} years, with a {profile.risk} risk appetite and {capacityText}.
                </p>
              </section>
              <section>
                <h3 className="font-display text-base font-bold">Suggested Persona</h3>
                <div className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  {recommendation.persona}
                </div>
              </section>
              <section>
                <h3 className="font-display text-base font-bold">Recommended Fund Categories</h3>
                <ul className="mt-2 space-y-3">
                  {recommendation.categories.map((category) => (
                    <li key={category.name} className="rounded-2xl bg-secondary/50 p-3">
                      <div className="font-semibold">{category.name}</div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{category.why}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-display text-base font-bold">Try This Next</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {recommendation.calculator.reason}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
                  <Link href={recommendation.calculator.href}>
                    {recommendation.calculator.label}
                  </Link>
                </Button>
                {recommendation.furtherReading ? (
                  <Link
                    href={recommendation.furtherReading.href}
                    className="ml-3 text-xs font-medium text-primary"
                  >
                    {recommendation.furtherReading.label}
                  </Link>
                ) : null}
              </section>
              {recommendation.note ? (
                <p className="rounded-2xl bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground">
                  {recommendation.note}
                </p>
              ) : null}
              <section>
                <h3 className="font-display text-base font-bold">Next Step</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Talk to our advisor for a personalized, scheme-level recommendation based on your
                  complete circumstances.
                </p>
                <Button asChild className="mt-3 w-full rounded-full">
                  <Link href="/book-consultation">Book free consultation</Link>
                </Button>
              </section>
              <p className="border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground">
                {DISCLAIMER}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mx-auto flex items-center gap-1 text-xs font-medium text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start again
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
