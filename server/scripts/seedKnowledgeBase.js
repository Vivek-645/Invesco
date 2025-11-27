require('dotenv').config();
const { connectDB, closeDB } = require('../db');
const { ingestDocument } = require('../services/ragService');

// Sample investment knowledge base articles
const knowledgeBase = [
  {
    title: 'Portfolio Diversification Basics',
    content: `
Portfolio diversification is a fundamental investment strategy that involves spreading your investments across various asset classes, sectors, and geographic regions to reduce risk. The key principle is "don't put all your eggs in one basket."

Key Benefits of Diversification:
1. Risk Reduction: By holding different types of investments, you reduce the impact of any single investment's poor performance on your overall portfolio.
2. Smoother Returns: Different assets perform well at different times, helping to smooth out portfolio volatility.
3. Long-term Growth: Diversified portfolios tend to provide more stable long-term returns.

Asset Allocation Guidelines:
- Stocks (Equities): 60-70% for growth-oriented portfolios
- Bonds (Fixed Income): 20-30% for stability and income
- Alternative Investments: 5-15% for additional diversification
- Cash and Equivalents: 5-10% for liquidity

Geographic Diversification:
- Domestic (US) Markets: 60-70%
- International Developed Markets: 20-25%
- Emerging Markets: 5-10%

Sector Diversification:
Spread investments across different sectors like technology, healthcare, finance, consumer goods, energy, and real estate to avoid concentration risk.

Rebalancing:
Review and rebalance your portfolio at least annually to maintain your target asset allocation as market movements shift your portfolio composition.
    `,
    metadata: {
      category: 'investment_basics',
      tags: ['diversification', 'portfolio', 'risk_management', 'asset_allocation'],
      source: 'knowledge_base',
      author: 'Investment Education Team',
    },
  },
  {
    title: 'Understanding Risk Tolerance and Investment Goals',
    content: `
Risk tolerance is your ability and willingness to endure market volatility and potential losses in pursuit of investment returns. Understanding your risk tolerance is crucial for building an appropriate investment portfolio.

Factors Affecting Risk Tolerance:
1. Time Horizon: Longer investment periods generally allow for higher risk tolerance
2. Financial Situation: Income stability, emergency funds, and debt levels
3. Investment Experience: Knowledge and comfort with market fluctuations
4. Emotional Capacity: Ability to stay committed during market downturns
5. Age and Life Stage: Younger investors can typically accept more risk

Risk Tolerance Categories:

Conservative Investor:
- Primary goal: Capital preservation
- Can tolerate: 5-10% portfolio decline
- Typical allocation: 70% bonds, 25% stocks, 5% alternatives
- Time horizon: Short-term (1-5 years)

Moderate Investor:
- Primary goal: Balance of growth and stability
- Can tolerate: 10-20% portfolio decline
- Typical allocation: 50% stocks, 40% bonds, 10% alternatives
- Time horizon: Medium-term (5-10 years)

Aggressive Investor:
- Primary goal: Maximum growth
- Can tolerate: 20-30%+ portfolio decline
- Typical allocation: 80% stocks, 15% alternatives, 5% bonds
- Time horizon: Long-term (10+ years)

Setting Investment Goals:
1. Define specific objectives (retirement, home purchase, education)
2. Establish timeline for each goal
3. Quantify required returns
4. Assess risk capacity for each goal
5. Create dedicated portfolio strategies

Remember: Risk tolerance can change over time based on life circumstances, so reassess regularly.
    `,
    metadata: {
      category: 'investment_basics',
      tags: ['risk_tolerance', 'investment_goals', 'portfolio_planning'],
      source: 'knowledge_base',
      author: 'Investment Education Team',
    },
  },
  {
    title: 'Tax-Efficient Investing Strategies',
    content: `
Tax efficiency is a critical component of investment planning that can significantly impact your after-tax returns. Understanding tax implications helps maximize wealth accumulation.

Tax-Advantaged Accounts:

401(k) and Traditional IRA:
- Contributions are tax-deductible
- Investments grow tax-deferred
- Withdrawals taxed as ordinary income
- Best for: Pre-tax contributions and tax-deferred growth

Roth IRA and Roth 401(k):
- Contributions made with after-tax dollars
- Investments grow tax-free
- Qualified withdrawals are tax-free
- Best for: Tax-free retirement income

Health Savings Account (HSA):
- Triple tax advantage: deductible contributions, tax-free growth, tax-free withdrawals for medical expenses
- Can be used as supplemental retirement account
- Best for: Healthcare costs and long-term savings

Tax-Loss Harvesting:
Strategy to offset capital gains by selling investments at a loss. Key considerations:
- Can offset up to $3,000 of ordinary income annually
- Unused losses carry forward indefinitely
- Wash sale rule: Cannot repurchase same security within 30 days
- Best implemented in taxable accounts

Asset Location Strategy:
Place investments in accounts based on tax efficiency:

Tax-Efficient (Taxable Accounts):
- Index funds and ETFs (low turnover)
- Tax-managed funds
- Municipal bonds (for high-income investors)
- Long-term growth stocks

Tax-Inefficient (Tax-Advantaged Accounts):
- Actively managed funds (high turnover)
- REITs (high dividend distributions)
- Corporate bonds (interest taxed as ordinary income)
- High-yield bonds

Capital Gains Considerations:
- Long-term gains (held >1 year): 0%, 15%, or 20% tax rates
- Short-term gains (held <1 year): Taxed as ordinary income (up to 37%)
- Strategy: Hold investments for at least one year when possible

Dividend Tax Rates:
- Qualified dividends: 0%, 15%, or 20% (same as long-term capital gains)
- Non-qualified dividends: Taxed as ordinary income
- Look for qualified dividend-paying stocks in taxable accounts

Estate Planning and Gifting:
- Annual gift exclusion: $17,000 per recipient (2023)
- Lifetime gift and estate tax exemption: $12.92 million (2023)
- Step-up in basis at death eliminates capital gains tax for heirs

Tax-efficient investing can add 0.5% to 2% annually to after-tax returns over the long term.
    `,
    metadata: {
      category: 'tax_planning',
      tags: ['taxes', 'tax_efficiency', 'retirement_accounts', 'capital_gains'],
      source: 'knowledge_base',
      author: 'Tax Planning Team',
    },
  },
  {
    title: 'Market Analysis and Economic Indicators',
    content: `
Understanding economic indicators and market analysis helps investors make informed decisions about portfolio positioning and asset allocation.

Key Economic Indicators:

Gross Domestic Product (GDP):
- Measures total economic output
- Growth >3%: Strong economy
- Growth 2-3%: Moderate growth
- Growth <2%: Slow growth
- Negative growth (2 consecutive quarters): Recession
Impact: Strong GDP growth typically supports stock market gains

Unemployment Rate:
- Percentage of labor force without jobs
- Below 4%: Strong employment
- 4-6%: Normal range
- Above 6%: Weak employment
Impact: Low unemployment supports consumer spending and economic growth

Inflation Rate (CPI):
- Measures price changes in consumer goods
- Target: 2% annual inflation
- Above 3%: Rising inflation concerns
- Below 1%: Deflation risk
Impact: High inflation erodes purchasing power; affects bond values and interest rates

Federal Funds Rate:
- Interest rate banks charge each other for overnight loans
- Set by Federal Reserve
- Influences all other interest rates
Impact: Higher rates slow economy, lower rates stimulate growth

Market Indicators:

Price-to-Earnings (P/E) Ratio:
- Measures stock valuation (price divided by earnings per share)
- S&P 500 historical average: 15-16
- Above 20: Potentially overvalued
- Below 15: Potentially undervalued
- Forward P/E uses projected earnings

Market Sentiment Indicators:
- VIX (Volatility Index): Measures expected market volatility
  * Below 15: Low volatility/complacency
  * 15-25: Normal range
  * Above 25: Elevated fear/uncertainty
- Put-Call Ratio: Measures bearish vs bullish options trading
- Consumer Confidence Index: Measures consumer optimism

Yield Curve:
- Plots interest rates across different maturity dates
- Normal: Long-term rates higher than short-term
- Inverted: Short-term rates higher (often precedes recession)
- Flat: Transition period

Sector Rotation:
Economic Expansion: Technology, consumer discretionary, industrials
Peak: Energy, materials
Contraction: Healthcare, utilities, consumer staples
Trough: Financials, real estate

Leading vs Lagging Indicators:
Leading (predict future): Stock market, housing permits, manufacturing orders
Coincident (current state): GDP, employment, personal income
Lagging (confirm trends): Unemployment rate, corporate profits, interest rates

Using This Information:
1. Monitor multiple indicators, not just one
2. Consider global economic trends
3. Understand correlation doesn't equal causation
4. Focus on long-term trends rather than short-term noise
5. Use indicators to inform, not dictate, investment decisions

Remember: Markets are forward-looking and often react before economic data confirms trends.
    `,
    metadata: {
      category: 'market_analysis',
      tags: ['economic_indicators', 'market_analysis', 'gdp', 'inflation', 'interest_rates'],
      source: 'knowledge_base',
      author: 'Market Research Team',
    },
  },
  {
    title: 'Investment Account Types and Selection Guide',
    content: `
Choosing the right investment accounts is crucial for tax efficiency and achieving your financial goals. Different account types offer unique benefits and limitations.

Retirement Accounts:

Traditional IRA:
- Contribution Limit (2023): $6,500 ($7,500 if age 50+)
- Tax Treatment: Tax-deductible contributions, tax-deferred growth, taxable withdrawals
- Income Limits: Phase-outs for high earners if covered by workplace plan
- Required Minimum Distributions (RMDs): Begin at age 73
- Best For: Current tax deduction, expect lower tax bracket in retirement

Roth IRA:
- Contribution Limit (2023): $6,500 ($7,500 if age 50+)
- Tax Treatment: After-tax contributions, tax-free growth, tax-free withdrawals
- Income Limits: Phase-outs begin at $138,000 (single), $218,000 (married)
- No RMDs: Can pass to heirs tax-free
- Best For: Tax-free retirement income, estate planning

401(k) / 403(b):
- Contribution Limit (2023): $22,500 ($30,000 if age 50+)
- Employer Match: Free money (typically 3-6% of salary)
- Tax Treatment: Traditional or Roth options available
- Vesting: May need to stay with employer to keep full match
- Best For: Employer match, high contribution limits

SEP IRA (Self-Employed):
- Contribution Limit: Up to 25% of compensation or $66,000 (2023)
- Flexible: Contributions not required every year
- Best For: Self-employed, small business owners

Health Savings Account (HSA):
- Contribution Limit (2023): $3,850 (individual), $7,750 (family)
- Triple Tax Advantage: Deductible, tax-free growth, tax-free medical withdrawals
- Portable: Stays with you regardless of employment
- Best For: Healthcare costs, supplemental retirement savings

Taxable Brokerage Accounts:

Individual Brokerage Account:
- No contribution limits
- No tax benefits on contributions
- Capital gains and dividends taxed annually
- Flexibility: Withdraw anytime without penalties
- Best For: Goals before retirement, after maxing tax-advantaged accounts

Joint Brokerage Account:
- Shared ownership between two people
- Right of survivorship passes assets to surviving owner
- Both owners can trade
- Best For: Couples, shared financial goals

Trust Accounts:
- Managed by trustee for beneficiaries
- Estate planning benefits
- Potential tax advantages
- Best For: Estate planning, asset protection, multi-generational wealth

Education Accounts:

529 College Savings Plan:
- Contribution Limits: Varies by state (typically $300,000+)
- Tax Treatment: Tax-free growth and withdrawals for qualified education expenses
- State Tax Benefits: Many states offer tax deductions
- Flexibility: Can change beneficiaries
- Best For: College savings, K-12 tuition ($10,000 annual limit)

Coverdell Education Savings Account (ESA):
- Contribution Limit: $2,000 per year per beneficiary
- Income Limits: Phase-outs for high earners
- Broader Use: K-12 and college expenses
- Best For: Education expenses with more investment options than 529

Custodial Accounts (UGMA/UTMA):
- No contribution limits
- Assets belong to minor, irrevocable transfer
- Taxed at child's rate (up to limits)
- Impact: May affect financial aid eligibility
- Best For: Flexible gifts to minors

Account Selection Strategy:

Priority Order:
1. 401(k) to employer match (free money)
2. HSA if eligible (triple tax advantage)
3. IRA (Roth or Traditional based on tax situation)
4. Max out 401(k) to limit
5. Taxable brokerage for additional savings

Consider Your Situation:
- Time horizon for each goal
- Expected tax bracket in retirement
- Need for flexibility vs tax benefits
- Estate planning objectives
- Income and contribution limits

Professional Guidance:
Consult with financial advisor or tax professional to optimize account selection based on your unique circumstances.
    `,
    metadata: {
      category: 'account_types',
      tags: ['retirement_accounts', 'ira', '401k', 'hsa', 'brokerage', 'education_savings'],
      source: 'knowledge_base',
      author: 'Financial Planning Team',
    },
  },
];

async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    // Ingest each document
    let successCount = 0;
    let failCount = 0;

    for (const doc of knowledgeBase) {
      try {
        console.log(`📄 Ingesting: ${doc.title}`);
        const result = await ingestDocument(doc.content, {
          ...doc.metadata,
          title: doc.title,
        });
        console.log(`   ✓ Created ${result.chunksCreated} chunks\n`);
        successCount++;
      } catch (error) {
        console.error(`   ✗ Failed to ingest "${doc.title}":`, error.message, '\n');
        failCount++;
      }
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Seeding Complete!`);
    console.log(`   ✓ Success: ${successCount} documents`);
    console.log(`   ✗ Failed: ${failCount} documents`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Close database connection
    await closeDB();
    console.log('✓ Database connection closed');

  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed script
seedKnowledgeBase();
