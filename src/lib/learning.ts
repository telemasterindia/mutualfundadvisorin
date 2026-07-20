export type LearningArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
};

export const learningArticles: LearningArticle[] = [
  {
    slug: "what-is-a-mutual-fund",
    title: "What Is a Mutual Fund and How Does It Work?",
    description:
      "A plain-language introduction to pooling, units, NAV, fund categories, costs and market risk.",
    category: "Mutual fund basics",
    readingTime: "6 min read",
    sections: [
      {
        heading: "The basic idea",
        paragraphs: [
          "A mutual fund pools money from many investors and invests it according to a stated objective. A professional fund-management team makes investment decisions within the scheme's mandate.",
          "In return for the money invested, each investor receives units. The value of those units changes with the value of the scheme's underlying investments.",
        ],
      },
      {
        heading: "Understanding NAV",
        paragraphs: [
          "Net Asset Value, or NAV, is the per-unit value of a mutual fund scheme after accounting for its assets and liabilities. NAV is generally declared at the end of each business day.",
          "A lower NAV does not automatically mean that a scheme is cheaper or has more growth potential. Suitability depends on the scheme's objective, portfolio, risks, costs and your needs.",
        ],
      },
      {
        heading: "Common categories",
        paragraphs: ["Mutual funds are grouped by what they invest in and how they are managed."],
        bullets: [
          "Equity funds primarily invest in shares and can experience significant market volatility.",
          "Debt funds invest in fixed-income instruments and carry interest-rate and credit risks.",
          "Hybrid funds combine asset classes in different proportions.",
          "Index funds and ETFs aim to track a specified market index, subject to tracking difference.",
        ],
      },
      {
        heading: "Costs and risks",
        paragraphs: [
          "Schemes charge expenses that are reflected in NAV. Other costs and taxes may apply depending on the scheme and transaction. Read the Scheme Information Document, Key Information Memorandum and current disclosures.",
          "Mutual funds do not guarantee returns unless a guarantee is explicitly structured and disclosed. Market movements can cause losses, including loss of principal.",
        ],
      },
      {
        heading: "Before investing",
        paragraphs: [
          "Start with your goal, time horizon, ability to tolerate loss, liquidity needs and understanding of the product. A scheme's past performance is not a promise of future results.",
        ],
      },
    ],
  },
  {
    slug: "sip-vs-lump-sum",
    title: "SIP vs Lump Sum: Which Approach Should You Consider?",
    description:
      "Compare regular and one-time investing without treating either approach as universally superior.",
    category: "Ways to invest",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Two ways to invest",
        paragraphs: [
          "A Systematic Investment Plan, or SIP, invests a chosen amount at regular intervals. A lump-sum investment places an available amount into a scheme at one time.",
          "These are methods of investing, not separate mutual fund products. The underlying scheme and its risks still matter.",
        ],
      },
      {
        heading: "When a SIP may be considered",
        paragraphs: [
          "A SIP can align naturally with monthly income and encourage regular investing. Because purchases happen on different dates, the investor buys more units when NAV is lower and fewer when it is higher. This does not eliminate market risk or assure a profit.",
        ],
        bullets: [
          "You invest from recurring income.",
          "You prefer a regular and automated habit.",
          "Your goal and investment horizon support continued contributions.",
        ],
      },
      {
        heading: "When lump sum may be considered",
        paragraphs: [
          "A lump sum may be relevant when investible money is already available. It gives the full amount market exposure immediately, which also means the result can be more sensitive to market movement soon after investment.",
        ],
        bullets: [
          "You have surplus funds available now.",
          "You have considered near-term liquidity needs.",
          "The chosen scheme and level of volatility suit your situation.",
        ],
      },
      {
        heading: "There is no universal winner",
        paragraphs: [
          "The decision depends on cash flow, time horizon, risk tolerance, the asset category and the role of the investment in your plan. Splitting an available amount over time can reduce timing anxiety but can also leave part of the money uninvested during a rising market.",
        ],
      },
      {
        heading: "Use realistic assumptions",
        paragraphs: [
          "Calculator results are illustrations. Actual returns will vary and may be negative. Avoid selecting a method only because an assumed return produces an attractive future value.",
        ],
      },
    ],
  },
  {
    slug: "direct-vs-regular-mutual-funds",
    title: "Direct vs Regular Mutual Funds: Understanding the Difference",
    description: "Learn how plan types differ in distribution, expenses and investor support.",
    category: "Plan types",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Same scheme, different plan",
        paragraphs: [
          "Direct and regular plans belong to the same mutual fund scheme and generally share the same portfolio and fund manager. They have separate NAVs because their expense structures differ.",
        ],
      },
      {
        heading: "Direct plans",
        paragraphs: [
          "Direct plans are purchased without a distributor. They generally have a lower expense ratio because distributor commission is not included. The investor takes responsibility for scheme selection, transactions, documentation and ongoing review, or separately engages an appropriate professional.",
        ],
      },
      {
        heading: "Regular plans",
        paragraphs: [
          "Regular plans are purchased through a Mutual Fund Distributor. The scheme's expenses include distributor commission, so the expense ratio is generally higher than the direct plan of the same scheme.",
          "Depending on the service arrangement, a distributor may assist with education, paperwork, transactions and ongoing service. The scope should be understood clearly.",
        ],
      },
      {
        heading: "Commission disclosure",
        paragraphs: [
          "Commission can vary by asset-management company, scheme and period. Ask for the applicable commission disclosure and understand how the distributor is compensated before investing.",
        ],
      },
      {
        heading: "How to compare",
        paragraphs: [
          "Cost matters, but the decision also involves the help you need, your ability to evaluate schemes and whether you will maintain the plan independently.",
        ],
        bullets: [
          "Compare the same scheme and option when reviewing expense ratios and NAVs.",
          "Understand what service is included with a regular plan.",
          "Do not assume that either plan type removes investment risk.",
          "Review scheme documents and suitability before proceeding.",
        ],
      },
    ],
  },
];

export function getLearningArticle(slug: string) {
  return learningArticles.find((article) => article.slug === slug);
}
