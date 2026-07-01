export const investor = {
  name: "Aarav Sharma",
  email: "aarav@example.com",
  pan: "ABCDE1234F",
  joinedAt: "Mar 2022",
  riskProfile: "Aggressive",
};

export const portfolioStats = {
  totalValue: 2847250,
  invested: 2150000,
  gain: 697250,
  gainPercent: 32.43,
  xirr: 18.6,
  cagr: 16.8,
  todayChange: 18460,
  todayChangePercent: 0.65,
  oneDayPercent: 0.65,
  monthlySipTotal: 47500,
  goalProgress: 62,
  healthScore: 84,
  riskScore: 72, // 0-100 -> riskometer
};

export const portfolioGrowth = [
  { month: "Apr '25", value: 1620000, invested: 1500000 },
  { month: "May '25", value: 1685000, invested: 1547500 },
  { month: "Jun '25", value: 1742000, invested: 1595000 },
  { month: "Jul '25", value: 1810000, invested: 1642500 },
  { month: "Aug '25", value: 1895000, invested: 1690000 },
  { month: "Sep '25", value: 1978000, invested: 1737500 },
  { month: "Oct '25", value: 2120000, invested: 1785000 },
  { month: "Nov '25", value: 2256000, invested: 1832500 },
  { month: "Dec '25", value: 2398000, invested: 1880000 },
  { month: "Jan '26", value: 2510000, invested: 1927500 },
  { month: "Feb '26", value: 2640000, invested: 1975000 },
  { month: "Mar '26", value: 2780000, invested: 2055000 },
  { month: "Apr '26", value: 2847250, invested: 2150000 },
];

export const allocation = [
  { name: "Equity", value: 64, color: "var(--chart-1)" },
  { name: "Debt", value: 16, color: "var(--chart-2)" },
  { name: "Hybrid", value: 10, color: "var(--chart-3)" },
  { name: "Gold", value: 6, color: "var(--chart-4)" },
  { name: "International", value: 4, color: "var(--chart-5)" },
];

export const sectorAllocation = [
  { sector: "Financials", weight: 28 },
  { sector: "IT Services", weight: 19 },
  { sector: "Consumer", weight: 14 },
  { sector: "Energy", weight: 11 },
  { sector: "Healthcare", weight: 9 },
  { sector: "Auto", weight: 8 },
  { sector: "Capital Goods", weight: 6 },
  { sector: "Others", weight: 5 },
];

export type Holding = {
  fund: string;
  amc: string;
  amcShort: string;
  amcColor: string;
  category: "Equity" | "Debt" | "Hybrid" | "Gold" | "International";
  invested: number;
  current: number;
  units: number;
  return1y: number;
  xirr: number;
};

export const holdings: Holding[] = [
  {
    fund: "Parag Parikh Flexi Cap Fund",
    amc: "PPFAS Mutual Fund",
    amcShort: "PP",
    amcColor: "#1E5BAF",
    category: "Equity",
    invested: 360000,
    current: 512400,
    units: 6212.4,
    return1y: 24.6,
    xirr: 22.1,
  },
  {
    fund: "Axis Bluechip Fund",
    amc: "Axis Mutual Fund",
    amcShort: "AX",
    amcColor: "#97144D",
    category: "Equity",
    invested: 280000,
    current: 348600,
    units: 4970.5,
    return1y: 18.4,
    xirr: 14.8,
  },
  {
    fund: "Mirae Asset Large Cap Fund",
    amc: "Mirae Asset",
    amcShort: "MA",
    amcColor: "#0F6FB7",
    category: "Equity",
    invested: 240000,
    current: 296800,
    units: 3082.1,
    return1y: 16.1,
    xirr: 13.4,
  },
  {
    fund: "HDFC Small Cap Fund",
    amc: "HDFC Mutual Fund",
    amcShort: "HD",
    amcColor: "#ED232A",
    category: "Equity",
    invested: 220000,
    current: 318900,
    units: 2234.6,
    return1y: 32.5,
    xirr: 27.4,
  },
  {
    fund: "Kotak Emerging Equity",
    amc: "Kotak Mutual Fund",
    amcShort: "KO",
    amcColor: "#ED1C24",
    category: "Equity",
    invested: 180000,
    current: 246700,
    units: 2235.1,
    return1y: 26.8,
    xirr: 23.5,
  },
  {
    fund: "ICICI Pru Equity & Debt Fund",
    amc: "ICICI Prudential",
    amcShort: "IC",
    amcColor: "#F7941E",
    category: "Hybrid",
    invested: 240000,
    current: 285600,
    units: 1842.3,
    return1y: 14.2,
    xirr: 12.8,
  },
  {
    fund: "SBI Magnum Gilt Fund",
    amc: "SBI Mutual Fund",
    amcShort: "SB",
    amcColor: "#22409A",
    category: "Debt",
    invested: 320000,
    current: 354800,
    units: 6107.9,
    return1y: 8.2,
    xirr: 7.1,
  },
  {
    fund: "Nippon India Gold BeES",
    amc: "Nippon India MF",
    amcShort: "NI",
    amcColor: "#E2231A",
    category: "Gold",
    invested: 140000,
    current: 168400,
    units: 2698.7,
    return1y: 14.5,
    xirr: 11.9,
  },
  {
    fund: "Motilal Oswal Nasdaq 100 FoF",
    amc: "Motilal Oswal",
    amcShort: "MO",
    amcColor: "#0B3D91",
    category: "International",
    invested: 90000,
    current: 112050,
    units: 3420.8,
    return1y: 22.4,
    xirr: 18.2,
  },
  {
    fund: "ICICI Pru Technology Fund",
    amc: "ICICI Prudential",
    amcShort: "IC",
    amcColor: "#F7941E",
    category: "Equity",
    invested: 80000,
    current: 73000,
    units: 368.4,
    return1y: -8.6,
    xirr: -4.2,
  },
  {
    fund: "Aditya Birla SL Pharma & Healthcare",
    amc: "Aditya Birla SL",
    amcShort: "AB",
    amcColor: "#C8102E",
    category: "Equity",
    invested: 60000,
    current: 55400,
    units: 412.7,
    return1y: -5.2,
    xirr: -2.4,
  },
];

export const sips = [
  {
    fund: "Parag Parikh Flexi Cap",
    amc: "PPFAS",
    amcColor: "#1E5BAF",
    amount: 15000,
    day: 5,
    nextDate: "5 Jun 2026",
    daysLeft: 4,
    status: "Active",
  },
  {
    fund: "Axis Bluechip Fund",
    amc: "Axis",
    amcColor: "#97144D",
    amount: 10000,
    day: 7,
    nextDate: "7 Jun 2026",
    daysLeft: 6,
    status: "Active",
  },
  {
    fund: "Mirae Asset Large Cap",
    amc: "Mirae",
    amcColor: "#0F6FB7",
    amount: 7500,
    day: 10,
    nextDate: "10 Jun 2026",
    daysLeft: 9,
    status: "Active",
  },
  {
    fund: "HDFC Small Cap Fund",
    amc: "HDFC",
    amcColor: "#ED232A",
    amount: 10000,
    day: 15,
    nextDate: "15 Jun 2026",
    daysLeft: 14,
    status: "Active",
  },
  {
    fund: "ICICI Pru Technology",
    amc: "ICICI",
    amcColor: "#F7941E",
    amount: 5000,
    day: 20,
    nextDate: "20 Jun 2026",
    daysLeft: 19,
    status: "Paused",
  },
];

export const transactions = [
  {
    id: 1,
    fund: "Parag Parikh Flexi Cap",
    amc: "PPFAS",
    amcColor: "#1E5BAF",
    type: "SIP",
    amount: 15000,
    units: 182.4,
    nav: 82.24,
    date: "5 May 2026",
  },
  {
    id: 2,
    fund: "Axis Bluechip Fund",
    amc: "Axis",
    amcColor: "#97144D",
    type: "SIP",
    amount: 10000,
    units: 142.6,
    nav: 70.12,
    date: "7 May 2026",
  },
  {
    id: 3,
    fund: "Mirae Asset Large Cap",
    amc: "Mirae",
    amcColor: "#0F6FB7",
    type: "SIP",
    amount: 7500,
    units: 77.9,
    nav: 96.3,
    date: "10 May 2026",
  },
  {
    id: 4,
    fund: "HDFC Small Cap Fund",
    amc: "HDFC",
    amcColor: "#ED232A",
    type: "SIP",
    amount: 10000,
    units: 70.05,
    nav: 142.78,
    date: "15 May 2026",
  },
  {
    id: 5,
    fund: "Kotak Emerging Equity",
    amc: "Kotak",
    amcColor: "#ED1C24",
    type: "Buy",
    amount: 25000,
    units: 226.5,
    nav: 110.35,
    date: "18 May 2026",
  },
  {
    id: 6,
    fund: "Nippon India Gold BeES",
    amc: "Nippon",
    amcColor: "#E2231A",
    type: "Buy",
    amount: 15000,
    units: 240.4,
    nav: 62.4,
    date: "22 May 2026",
  },
  {
    id: 7,
    fund: "ICICI Pru Technology",
    amc: "ICICI",
    amcColor: "#F7941E",
    type: "Redeem",
    amount: 12000,
    units: 60.5,
    nav: 198.2,
    date: "25 May 2026",
  },
];

export type Goal = {
  id: string;
  name: string;
  icon: "retirement" | "education" | "home" | "car" | "travel";
  target: number;
  current: number;
  monthlySip: number;
  targetYear: number;
  yearsLeft: number;
  onTrack: boolean;
  color: string;
};

export const goals: Goal[] = [
  {
    id: "g1",
    name: "Retirement Corpus",
    icon: "retirement",
    target: 30000000,
    current: 1240000,
    monthlySip: 22000,
    targetYear: 2050,
    yearsLeft: 24,
    onTrack: true,
    color: "#1E5BAF",
  },
  {
    id: "g2",
    name: "Child's Education",
    icon: "education",
    target: 5000000,
    current: 680000,
    monthlySip: 12000,
    targetYear: 2038,
    yearsLeft: 12,
    onTrack: true,
    color: "#0F8A5F",
  },
  {
    id: "g3",
    name: "Dream Home Down Payment",
    icon: "home",
    target: 4000000,
    current: 520000,
    monthlySip: 18000,
    targetYear: 2031,
    yearsLeft: 5,
    onTrack: false,
    color: "#F7941E",
  },
  {
    id: "g4",
    name: "World Tour Fund",
    icon: "travel",
    target: 1500000,
    current: 407250,
    monthlySip: 6000,
    targetYear: 2029,
    yearsLeft: 3,
    onTrack: true,
    color: "#7A2BC4",
  },
];

export const news = [
  {
    title: "Sensex hits all-time high, crosses 84,500 as IT stocks rally",
    time: "2h ago",
    source: "Mint",
  },
  {
    title: "RBI MPC keeps repo rate unchanged at 6.50% for ninth time",
    time: "5h ago",
    source: "ET Markets",
  },
  {
    title: "Mutual fund SIP inflows cross ₹26,400 Cr in May 2026",
    time: "8h ago",
    source: "Moneycontrol",
  },
  {
    title: "Top 5 flexi-cap funds delivering 22%+ CAGR over 3 years",
    time: "1d ago",
    source: "Value Research",
  },
  {
    title: "SEBI proposes lower expense ratio cap for large MF schemes",
    time: "1d ago",
    source: "Business Standard",
  },
];

export type Fund = {
  id: string;
  name: string;
  category: string;
  risk: "Low" | "Moderate" | "High" | "Very High";
  nav: number;
  return1y: number;
  return3y: number;
  return5y: number;
  aum: string;
  rating: number;
};

export const funds: Fund[] = [
  {
    id: "1",
    name: "Axis Bluechip Fund",
    category: "Large Cap",
    risk: "Moderate",
    nav: 70.12,
    return1y: 18.4,
    return3y: 14.2,
    return5y: 13.8,
    aum: "₹35,420 Cr",
    rating: 5,
  },
  {
    id: "2",
    name: "Parag Parikh Flexi Cap",
    category: "Flexi Cap",
    risk: "High",
    nav: 82.45,
    return1y: 24.6,
    return3y: 22.1,
    return5y: 19.7,
    aum: "₹68,210 Cr",
    rating: 5,
  },
  {
    id: "3",
    name: "Mirae Asset Large Cap",
    category: "Large Cap",
    risk: "Moderate",
    nav: 96.3,
    return1y: 16.1,
    return3y: 13.4,
    return5y: 14.2,
    aum: "₹40,180 Cr",
    rating: 4,
  },
  {
    id: "4",
    name: "HDFC Small Cap Fund",
    category: "Small Cap",
    risk: "Very High",
    nav: 142.78,
    return1y: 32.5,
    return3y: 27.4,
    return5y: 22.6,
    aum: "₹28,940 Cr",
    rating: 5,
  },
  {
    id: "5",
    name: "ICICI Pru Technology",
    category: "Sectoral",
    risk: "Very High",
    nav: 198.2,
    return1y: 28.9,
    return3y: 19.8,
    return5y: 24.3,
    aum: "₹12,560 Cr",
    rating: 4,
  },
  {
    id: "6",
    name: "SBI Magnum Gilt Fund",
    category: "Debt",
    risk: "Low",
    nav: 58.1,
    return1y: 8.2,
    return3y: 6.9,
    return5y: 7.4,
    aum: "₹8,420 Cr",
    rating: 4,
  },
  {
    id: "7",
    name: "Kotak Emerging Equity",
    category: "Mid Cap",
    risk: "High",
    nav: 110.35,
    return1y: 26.8,
    return3y: 23.5,
    return5y: 20.1,
    aum: "₹42,830 Cr",
    rating: 5,
  },
  {
    id: "8",
    name: "Nippon India Gold BeES",
    category: "Gold ETF",
    risk: "Moderate",
    nav: 62.4,
    return1y: 14.5,
    return3y: 11.2,
    return5y: 12.8,
    aum: "₹9,210 Cr",
    rating: 4,
  },
];
