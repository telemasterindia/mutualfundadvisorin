import type { TooltipProps } from "recharts";

export function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function inrShort(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${n}`;
}

export function ChartTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-popover/95 px-3 py-2 text-xs shadow-elegant backdrop-blur-md">
      {label && <div className="mb-1 font-medium text-muted-foreground">{label}</div>}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="capitalize text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-semibold num text-foreground">
              {valueFormatter ? valueFormatter(Number(p.value)) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
