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
  {
    slug: "how-to-choose-a-mutual-fund",
    title: "How to Choose a Mutual Fund for Your Goal",
    description:
      "A practical framework for narrowing schemes without chasing rankings or recent returns.",
    category: "Choosing funds",
    readingTime: "7 min read",
    sections: [
      {
        heading: "Begin with the goal, not the fund",
        paragraphs: [
          "Define what the money is for, when it may be needed and how flexible that date is. A fund can only be considered suitable in relation to a goal and an investor's circumstances.",
          "Money required soon generally has less time to recover from market falls. A longer horizon may allow more volatility, but it does not make an unsuitable scheme appropriate.",
        ],
      },
      {
        heading: "Select the asset category",
        paragraphs: [
          "Decide the broad mix of equity, debt and other assets before comparing individual schemes. Asset allocation usually has a larger influence on risk than choosing between two funds in the same category.",
        ],
        bullets: [
          "Equity-oriented funds can suit long-term growth goals but may fall sharply.",
          "Debt funds may reduce volatility but still carry credit and interest-rate risk.",
          "Hybrid funds combine assets, with risk depending on their actual allocation.",
        ],
      },
      {
        heading: "Compare like with like",
        paragraphs: [
          "Compare schemes in the same category using consistent periods. Review the benchmark, portfolio, expense ratio, concentration, management approach and performance across rising and falling markets.",
          "A five-star rating or top one-year return is not a complete selection method. Rankings change and can encourage buying after unusually strong performance.",
        ],
      },
      {
        heading: "Check the documents",
        paragraphs: [
          "Read the scheme objective, riskometer, portfolio disclosures and exit-load terms. Confirm that you understand where the scheme can invest and what could cause losses.",
        ],
      },
      {
        heading: "Keep the portfolio manageable",
        paragraphs: [
          "Owning several similar funds may create duplication rather than useful diversification. Choose only as many schemes as you can understand and review consistently.",
        ],
      },
    ],
  },
  {
    slug: "mutual-fund-riskometer-explained",
    title: "The Mutual Fund Riskometer, Explained",
    description:
      "Learn what a scheme's risk label communicates, what can make it change and what it cannot tell you.",
    category: "Understanding risk",
    readingTime: "5 min read",
    sections: [
      {
        heading: "What the Riskometer does",
        paragraphs: [
          "The Riskometer places a mutual fund scheme on a risk scale based on characteristics of its portfolio. It offers a quick starting point for comparing broad risk levels.",
          "It is not a prediction of future return or a guarantee that losses will stay within a fixed limit.",
        ],
      },
      {
        heading: "Risk can change",
        paragraphs: [
          "A scheme's label can change when its holdings, market conditions or assessed risk characteristics change. Review current disclosures rather than relying on the label shown when you first invested.",
        ],
      },
      {
        heading: "Look beyond one label",
        paragraphs: [
          "Two schemes with the same broad risk label can behave differently. Consider their assets, concentration, credit quality, interest-rate sensitivity and historical drawdowns.",
        ],
        bullets: [
          "Volatility: how widely values may move.",
          "Credit risk: the possibility that an issuer may not repay as expected.",
          "Liquidity risk: difficulty selling an investment at a reasonable price.",
          "Concentration risk: heavy exposure to a few securities, sectors or themes.",
        ],
      },
      {
        heading: "Match risk with capacity",
        paragraphs: [
          "Risk tolerance is how comfortable you feel with losses; risk capacity is how much loss your financial plan can withstand. Both matter, and they are not always the same.",
        ],
      },
    ],
  },
  {
    slug: "expense-ratio-exit-load-and-tax",
    title: "Expense Ratio, Exit Load and Tax: The Costs to Know",
    description: "Understand the main costs that can affect a mutual fund investor's net outcome.",
    category: "Costs and tax",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Expense ratio",
        paragraphs: [
          "The expense ratio represents recurring scheme expenses and is reflected in NAV rather than billed separately. Even a small annual difference can matter over a long holding period.",
          "Compare expenses within the same category and plan type. The cheapest scheme is not automatically the most suitable.",
        ],
      },
      {
        heading: "Exit load",
        paragraphs: [
          "Some schemes charge an exit load when units are redeemed within a specified period. The structure varies, so check the latest scheme terms before investing or redeeming.",
        ],
      },
      {
        heading: "Taxation",
        paragraphs: [
          "Tax treatment can depend on asset composition, holding period, transaction type and current law. Distributions and capital gains may be treated differently.",
          "Tax rules change. Use current official guidance or consult a qualified tax professional for decisions involving your circumstances.",
        ],
      },
      {
        heading: "Focus on what you keep",
        paragraphs: [
          "Headline returns do not show the whole investor experience. Consider expenses, loads, taxes, timing and behaviour when estimating a realistic net outcome.",
        ],
      },
    ],
  },
  {
    slug: "asset-allocation-and-diversification",
    title: "Asset Allocation and Diversification for Beginners",
    description:
      "See how spreading money across asset classes can shape portfolio risk and why more funds is not always better.",
    category: "Portfolio basics",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Two related ideas",
        paragraphs: [
          "Asset allocation is the division of money among categories such as equity, debt and cash. Diversification spreads exposure within and across those categories.",
          "The aim is not to eliminate every loss, but to avoid allowing one investment or type of risk to determine the entire outcome.",
        ],
      },
      {
        heading: "Your allocation is personal",
        paragraphs: [
          "A suitable mix depends on the goal, time horizon, income stability, emergency reserves and capacity to accept a fall in value. Copying another investor's allocation can produce the wrong risk level.",
        ],
      },
      {
        heading: "Overlap can hide concentration",
        paragraphs: [
          "Several funds may own many of the same companies or bonds. The number of schemes is therefore a poor measure of diversification by itself.",
        ],
      },
      {
        heading: "Rebalancing",
        paragraphs: [
          "Market movements can push a portfolio away from its intended mix. Rebalancing periodically restores the target allocation by redirecting new investments or buying and selling assets.",
          "Before selling, consider exit loads, taxes and whether the original plan or your circumstances have genuinely changed.",
        ],
      },
    ],
  },
  {
    slug: "common-mutual-fund-mistakes",
    title: "7 Common Mutual Fund Mistakes to Avoid",
    description:
      "Recognise return chasing, unnecessary switching, over-diversification and other habits that can weaken a plan.",
    category: "Investor behaviour",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Mistakes often look reasonable at first",
        paragraphs: [
          "Many poor outcomes come from repeatable behaviour rather than one obviously bad choice. A simple written plan can create discipline when markets become exciting or frightening.",
        ],
      },
      {
        heading: "Seven habits to watch",
        paragraphs: ["Review your decisions for these common patterns:"],
        bullets: [
          "Choosing a fund only because it recently topped a return table.",
          "Investing without linking the money to a goal and time horizon.",
          "Treating a SIP as protection against all losses.",
          "Owning many overlapping schemes in the name of diversification.",
          "Stopping long-term investments during every market decline.",
          "Switching frequently based on short performance periods.",
          "Ignoring expenses, exit loads, taxes and liquidity needs.",
        ],
      },
      {
        heading: "Use a review process",
        paragraphs: [
          "Review at sensible intervals and focus on whether the goal, asset allocation or scheme fundamentals changed. Daily market movement alone rarely provides enough information for a long-term decision.",
        ],
      },
      {
        heading: "Know when to seek help",
        paragraphs: [
          "Consider qualified professional help when your needs involve several goals, taxation, irregular cash flows or risks you do not fully understand. Ask how the professional is registered and compensated.",
        ],
      },
    ],
  },
];

export function getLearningArticle(slug: string) {
  return learningArticles.find((article) => article.slug === slug);
}
