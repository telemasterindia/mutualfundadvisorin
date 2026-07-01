"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  IndianRupee,
  Activity,
  Bell,
  CalendarClock,
  Search,
  Phone,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  Clock,
  Plus,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  AlertTriangle,
  Filter,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { SiteHeader } from "@/components/site-chrome";
import { RequireAdmin } from "@/components/require-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChartTooltip, inr, inrShort } from "@/components/chart-tooltip";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT, waLink, mailLink } from "@/lib/contact";
import { toast } from "sonner";

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string | null;
  investment_amount: number;
  goal: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
};
type Consultation = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  topic: string | null;
  mode: string;
  status: string;
  created_at: string;
};
type FollowUp = {
  id: string;
  lead_id: string | null;
  due_date: string;
  note: string | null;
  completed: boolean;
  created_at: string;
};
type Note = { id: string; lead_id: string | null; content: string; created_at: string };
type Meeting = {
  id: string;
  title: string;
  scheduled_at: string;
  duration_min: number;
  mode: string;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-warning/15 text-warning",
  qualified: "bg-chart-5/15 text-chart-5",
  converted: "bg-success/15 text-success",
  lost: "bg-destructive/15 text-destructive",
};

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

function AdminCRM() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [consults, setConsults] = useState<Consultation[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const refresh = async () => {
    setLoading(true);
    const [l, c, f, m, n] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500),
      supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("follow_ups").select("*").order("due_date", { ascending: true }).limit(200),
      supabase.from("meetings").select("*").order("scheduled_at", { ascending: true }).limit(200),
      supabase
        .from("investor_notes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    setLeads((l.data as Lead[]) ?? []);
    setConsults((c.data as Consultation[]) ?? []);
    setFollowUps((f.data as FollowUp[]) ?? []);
    setMeetings((m.data as Meeting[]) ?? []);
    setNotes((n.data as Note[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        if (statusFilter !== "all" && l.status !== statusFilter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return [l.full_name, l.email, l.phone, l.city, l.goal].some((v) =>
          v?.toLowerCase().includes(q),
        );
      }),
    [leads, search, statusFilter],
  );

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7);
    const newLeads = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const qualified = leads.filter((l) => l.status === "qualified").length;
    const totalSip = leads
      .filter((l) => ["qualified", "converted"].includes(l.status))
      .reduce((s, l) => s + Number(l.investment_amount || 0), 0);
    return {
      total: leads.length,
      newLeads,
      converted,
      qualified,
      totalSip,
      conversion: leads.length ? Math.round((converted / leads.length) * 100) : 0,
      pendingFollowUps: followUps.filter((f) => !f.completed).length,
      upcomingMeetings: meetings.filter((m) => new Date(m.scheduled_at) >= new Date()).length,
    };
  }, [leads, followUps, meetings]);

  // Chart data: leads per day last 14 days
  const trend = useMemo(() => {
    const days: { day: string; leads: number; sip: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d.getTime() + 86400000);
      const dayLeads = leads.filter((l) => {
        const dt = new Date(l.created_at);
        return dt >= d && dt < next;
      });
      days.push({
        day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        leads: dayLeads.length,
        sip: dayLeads.reduce((s, l) => s + Number(l.investment_amount || 0), 0),
      });
    }
    return days;
  }, [leads]);

  const statusBreakdown = useMemo(
    () =>
      STATUSES.map((s, i) => ({
        name: s,
        value: leads.filter((l) => l.status === s).length,
        color: [
          "var(--chart-1)",
          "var(--chart-3)",
          "var(--chart-5)",
          "var(--chart-2)",
          "var(--chart-4)",
        ][i],
      })).filter((x) => x.value > 0),
    [leads],
  );

  const sourceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => map.set(l.source || "other", (map.get(l.source || "other") || 0) + 1));
    return [...map.entries()].map(([source, count]) => ({ source, count }));
  }, [leads]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Admin · CRM
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              Lead & investor command centre
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={refresh}>
              <Activity className="mr-1.5 h-3.5 w-3.5" /> Refresh
            </Button>
            <Button
              size="sm"
              className="rounded-full gradient-bg text-primary-foreground shadow-glow"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New lead
            </Button>
          </div>
        </motion.div>

        {/* KPI strip */}
        <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <KPI
            icon={Users}
            label="Total leads"
            value={stats.total.toString()}
            sub={`+${stats.newLeads} this week`}
          />
          <KPI
            icon={Briefcase}
            label="Active investors"
            value={(stats.qualified + stats.converted).toString()}
            sub={`${stats.conversion}% conversion`}
            tone="success"
          />
          <KPI
            icon={IndianRupee}
            label="SIP inflows (committed)"
            value={inrShort(stats.totalSip)}
            sub="Monthly"
            tone="success"
          />
          <KPI
            icon={CalendarClock}
            label="Pending follow-ups"
            value={stats.pendingFollowUps.toString()}
            sub={`${stats.upcomingMeetings} meetings ahead`}
            tone={stats.pendingFollowUps > 0 ? "warn" : undefined}
          />
        </div>

        {/* Charts */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Lead activity"
              subtitle="Last 14 days"
              action={
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
                  <TrendingUp className="h-3 w-3" /> Trending up
                </span>
              }
            />
            <div className="h-60">
              <ResponsiveContainer>
                <AreaChart data={trend} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip valueFormatter={(v: number) => `${v} leads`} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#ag)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Funnel" subtitle="By status" />
            {statusBreakdown.length === 0 ? (
              <Empty msg="No leads yet" />
            ) : (
              <>
                <div className="relative h-44">
                  <ResponsiveContainer>
                    <RPieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {statusBreakdown.map((s, i) => (
                          <Cell key={i} fill={s.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip valueFormatter={(v: number) => `${v}`} />} />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1.5 text-xs">
                  {statusBreakdown.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 capitalize">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </div>
                      <span className="font-semibold num">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-5 rounded-full bg-secondary/60 p-1">
            <TabsTrigger value="leads" className="rounded-full text-xs">
              Leads{" "}
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">
                {leads.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="consultations" className="rounded-full text-xs">
              Consultations{" "}
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">
                {consults.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="followups" className="rounded-full text-xs">
              Follow-ups{" "}
              <span className="ml-1 rounded-full bg-warning/15 px-1.5 text-[10px] text-warning">
                {stats.pendingFollowUps}
              </span>
            </TabsTrigger>
            <TabsTrigger value="meetings" className="rounded-full text-xs">
              Meetings{" "}
              <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">
                {meetings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full text-xs">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* LEADS */}
          <TabsContent value="leads" className="mt-5">
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, city..."
                    className="pl-9 rounded-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] rounded-full">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 -mx-2 overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 pb-3 text-left font-medium">Lead</th>
                      <th className="px-3 pb-3 text-left font-medium">Goal · City</th>
                      <th className="px-3 pb-3 text-right font-medium">Monthly SIP</th>
                      <th className="px-3 pb-3 text-left font-medium">Status</th>
                      <th className="px-3 pb-3 text-left font-medium">Source</th>
                      <th className="px-3 pb-3 text-left font-medium">Created</th>
                      <th className="px-3 pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10">
                          <Empty msg="No leads match filter" />
                        </td>
                      </tr>
                    )}
                    {filtered.map((l) => (
                      <tr key={l.id} className="hover:bg-secondary/40">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-bg text-xs font-bold text-primary-foreground">
                              {l.full_name
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium">{l.full_name}</div>
                              <div className="truncate text-[11px] text-muted-foreground">
                                {l.email} · {l.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <div>{l.goal || <span className="text-muted-foreground">—</span>}</div>
                          <div className="text-[11px] text-muted-foreground">{l.city || "—"}</div>
                        </td>
                        <td className="px-3 py-3 text-right num">
                          {Number(l.investment_amount) > 0 ? inr(Number(l.investment_amount)) : "—"}
                        </td>
                        <td className="px-3 py-3">
                          <StatusSelect lead={l} onChanged={refresh} />
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{l.source}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {new Date(l.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-1">
                            <a
                              href={waLink(
                                `Hi ${l.full_name}, this is WealthMaster India advisor.`,
                              )}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full text-success"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                            <a href={`tel:${l.phone}`}>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                            <a
                              href={mailLink(
                                `Re: Your enquiry with WealthMaster India`,
                                `Hi ${l.full_name},\n\n`,
                              )}
                            >
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <Mail className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setActiveLead(l)}
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* CONSULTATIONS */}
          <TabsContent value="consultations" className="mt-5">
            <Card>
              <CardHeader title="Consultation requests" subtitle={`${consults.length} requests`} />
              {consults.length === 0 ? (
                <Empty msg="No consultation requests yet" />
              ) : (
                <div className="-mx-2 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-3 pb-3 text-left font-medium">Investor</th>
                        <th className="px-3 pb-3 text-left font-medium">Date · Time</th>
                        <th className="px-3 pb-3 text-left font-medium">Mode</th>
                        <th className="px-3 pb-3 text-left font-medium">Topic</th>
                        <th className="px-3 pb-3 text-left font-medium">Status</th>
                        <th className="px-3 pb-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {consults.map((c) => (
                        <tr key={c.id} className="hover:bg-secondary/40">
                          <td className="px-3 py-3">
                            <div className="font-medium">{c.full_name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {c.email} · {c.phone}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm">
                            <div className="font-medium">
                              {new Date(c.preferred_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {c.preferred_time}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs capitalize">
                            {c.mode.replace("_", " ")}
                          </td>
                          <td className="px-3 py-3 text-xs">{c.topic || "—"}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                                c.status === "confirmed"
                                  ? "bg-success/15 text-success"
                                  : c.status === "completed"
                                    ? "bg-primary/15 text-primary"
                                    : "bg-warning/15 text-warning"
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-end gap-1">
                              <a
                                href={waLink(
                                  `Hi ${c.full_name}, confirming your consultation on ${c.preferred_date} at ${c.preferred_time}.`,
                                )}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full text-success"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                onClick={async () => {
                                  const { error } = await supabase
                                    .from("consultations")
                                    .update({ status: "confirmed" })
                                    .eq("id", c.id);
                                  if (error) toast.error(error.message);
                                  else {
                                    toast.success("Confirmed");
                                    refresh();
                                  }
                                }}
                              >
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Confirm
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* FOLLOW UPS */}
          <TabsContent value="followups" className="mt-5">
            <FollowUpsPanel followUps={followUps} leads={leads} onRefresh={refresh} />
          </TabsContent>

          {/* MEETINGS */}
          <TabsContent value="meetings" className="mt-5">
            <Card>
              <CardHeader title="Scheduled meetings" subtitle={`${meetings.length} total`} />
              {meetings.length === 0 ? (
                <Empty msg="Schedule your first meeting" />
              ) : (
                <div className="space-y-3">
                  {meetings.map((m) => {
                    const dt = new Date(m.scheduled_at);
                    const upcoming = dt >= new Date();
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-3"
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-center text-primary">
                          <div>
                            <div className="text-[9px] uppercase">
                              {dt.toLocaleString("en-IN", { month: "short" })}
                            </div>
                            <div className="text-sm font-bold leading-none num">{dt.getDate()}</div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{m.title}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}{" "}
                            · {m.duration_min} min · {m.mode}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            upcoming
                              ? "bg-primary/15 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {upcoming ? "Upcoming" : "Past"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity" className="mt-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title={
                    (
                      <span className="inline-flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" /> Notifications
                      </span>
                    ) as any
                  }
                  subtitle="Recent system events"
                />
                <div className="space-y-3">
                  {leads.slice(0, 6).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-start gap-3 rounded-2xl border border-border/60 p-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">New lead: {l.full_name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {l.email} · via {l.source}
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(l.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && <Empty msg="No activity yet" />}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title={
                    (
                      <span className="inline-flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" /> Investor notes
                      </span>
                    ) as any
                  }
                  subtitle={`${notes.length} notes logged`}
                />
                <div className="space-y-3">
                  {notes.slice(0, 8).map((n) => {
                    const lead = leads.find((l) => l.id === n.lead_id);
                    return (
                      <div key={n.id} className="rounded-2xl border border-border/60 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold">
                            {lead?.full_name || "Investor"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(n.created_at).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{n.content}</p>
                      </div>
                    );
                  })}
                  {notes.length === 0 && <Empty msg="No notes yet — open a lead to add one" />}
                </div>

                <Card className="mt-4 !p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="text-xs">
                      <div className="font-medium">Source breakdown</div>
                      <div className="mt-2 h-32">
                        <ResponsiveContainer>
                          <BarChart data={sourceBreakdown}>
                            <XAxis
                              dataKey="source"
                              stroke="var(--muted-foreground)"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                              content={<ChartTooltip valueFormatter={(v: number) => `${v}`} />}
                            />
                            <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </Card>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <LeadDrawer lead={activeLead} onClose={() => setActiveLead(null)} onChanged={refresh} />
    </div>
  );
}

/* ---------- Sub components ---------- */

function KPI({ icon: Icon, label, value, sub, tone }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-hover rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            tone === "warn"
              ? "bg-warning/15 text-warning"
              : tone === "success"
                ? "bg-success/15 text-success"
                : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-xl font-bold num">{value}</div>
      <div
        className={`mt-0.5 text-[11px] ${
          tone === "warn"
            ? "text-warning"
            : tone === "success"
              ? "text-success"
              : "text-muted-foreground"
        }`}
      >
        {sub}
      </div>
    </motion.div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl p-5 sm:p-6 ${className}`}>{children}</div>;
}

function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="font-display text-base font-semibold">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="grid place-items-center py-10 text-center text-sm text-muted-foreground">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="mt-3">{msg}</p>
    </div>
  );
}

function StatusSelect({ lead, onChanged }: { lead: Lead; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Select
      value={lead.status}
      onValueChange={async (v) => {
        setBusy(true);
        const { error } = await supabase.from("leads").update({ status: v }).eq("id", lead.id);
        setBusy(false);
        if (error) toast.error(error.message);
        else {
          toast.success("Status updated");
          onChanged();
        }
      }}
    >
      <SelectTrigger
        className={`h-7 rounded-full border-0 px-2.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[lead.status] || "bg-secondary"}`}
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <SelectValue />}
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize text-xs">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FollowUpsPanel({
  followUps,
  leads,
  onRefresh,
}: {
  followUps: FollowUp[];
  leads: Lead[];
  onRefresh: () => void;
}) {
  const [leadId, setLeadId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!leadId || !date) return toast.error("Select a lead and date");
    setBusy(true);
    const { error } = await supabase
      .from("follow_ups")
      .insert({ lead_id: leadId, due_date: date, note: note || null });
    setBusy(false);
    if (error) return toast.error(error.message);
    setNote("");
    toast.success("Follow-up scheduled");
    onRefresh();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Follow-up reminders"
          subtitle={`${followUps.filter((f) => !f.completed).length} pending · ${followUps.filter((f) => f.completed).length} done`}
        />
        {followUps.length === 0 ? (
          <Empty msg="No follow-ups scheduled" />
        ) : (
          <div className="divide-y divide-border">
            {followUps.map((f) => {
              const lead = leads.find((l) => l.id === f.lead_id);
              const due = new Date(f.due_date);
              const overdue = !f.completed && due < today;
              return (
                <div key={f.id} className="flex items-center gap-3 py-3">
                  <button
                    onClick={async () => {
                      const { error } = await supabase
                        .from("follow_ups")
                        .update({ completed: !f.completed })
                        .eq("id", f.id);
                      if (error) toast.error(error.message);
                      else onRefresh();
                    }}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                      f.completed
                        ? "border-success bg-success text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {f.completed && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-medium ${f.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {lead?.full_name || "Lead"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {f.note || "Follow-up call"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-medium ${overdue ? "text-destructive" : "text-foreground"}`}
                    >
                      <Clock className="mr-1 inline h-3 w-3" />
                      {due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </div>
                    {overdue && <div className="text-[10px] text-destructive">Overdue</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Schedule a follow-up" subtitle="Stay on top of your pipeline" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Lead</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.slice(0, 100).map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.full_name} · {l.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Due date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Note (optional)</Label>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={400}
              placeholder="Discuss SIP top-up, share scheme deck..."
            />
          </div>
          <Button
            onClick={create}
            disabled={busy}
            className="w-full rounded-full gradient-bg text-primary-foreground"
          >
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarClock className="mr-2 h-4 w-4" />
            )}
            Add reminder
          </Button>
        </div>
      </Card>
    </div>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onChanged,
}: {
  lead: Lead | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [note, setNote] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("10:00");
  const [busy, setBusy] = useState(false);

  if (!lead) return null;

  const addNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("investor_notes")
      .insert({ lead_id: lead.id, content: note });
    setBusy(false);
    if (error) return toast.error(error.message);
    setNote("");
    toast.success("Note saved");
    onChanged();
  };

  const scheduleMeeting = async () => {
    if (!meetingDate) return toast.error("Pick a date");
    setBusy(true);
    const dt = new Date(`${meetingDate}T${meetingTime}:00`);
    const { error } = await supabase.from("meetings").insert({
      lead_id: lead.id,
      title: `Advisory call with ${lead.full_name}`,
      scheduled_at: dt.toISOString(),
      duration_min: 30,
      mode: "video",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Meeting scheduled");
    onChanged();
  };

  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-xs font-bold text-primary-foreground">
              {lead.full_name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span>{lead.full_name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-3 text-sm">
            <Row k="Email" v={lead.email} />
            <Row k="Phone" v={lead.phone} />
            <Row k="City" v={lead.city || "—"} />
            <Row k="Goal" v={lead.goal || "—"} />
            <Row
              k="Monthly SIP"
              v={Number(lead.investment_amount) > 0 ? inr(Number(lead.investment_amount)) : "—"}
            />
            <Row k="Source" v={lead.source} />
          </div>

          {lead.message && (
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-3 text-sm">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Message
              </div>
              <p className="mt-1 text-muted-foreground">{lead.message}</p>
            </div>
          )}

          <div>
            <Label className="text-xs font-medium text-muted-foreground">
              Add an investor note
            </Label>
            <Textarea
              className="mt-1.5"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              placeholder="Spoke about retirement goal, suggested PPFAS Flexi Cap..."
            />
            <Button size="sm" disabled={busy} onClick={addNote} className="mt-2 rounded-full">
              <Plus className="mr-1 h-3.5 w-3.5" /> Save note
            </Button>
          </div>

          <div className="rounded-2xl border border-border/60 p-3">
            <div className="text-xs font-semibold">Schedule a meeting</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              disabled={busy}
              onClick={scheduleMeeting}
              className="mt-2 w-full rounded-full gradient-bg text-primary-foreground"
            >
              <CalendarClock className="mr-1 h-3.5 w-3.5" /> Schedule meeting
            </Button>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <a
            href={waLink(`Hi ${lead.full_name}, this is your WealthMaster India advisor.`)}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full rounded-full">
              <MessageCircle className="mr-1 h-4 w-4 text-success" /> WhatsApp
            </Button>
          </a>
          <a
            href={mailLink(`Re: Your WealthMaster India enquiry`, `Hi ${lead.full_name},\n\n`)}
            className="flex-1"
          >
            <Button variant="outline" className="w-full rounded-full">
              <Mail className="mr-1 h-4 w-4" /> Email
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 text-sm font-medium">{v}</div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAdmin>
      <AdminCRM />
    </RequireAdmin>
  );
}
