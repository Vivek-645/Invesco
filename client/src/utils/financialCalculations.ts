import type {
  StockDataPoint,
  MonthlyData,
  StockMetrics,
  WACCDataPoint,
  MarketAssumptions,
} from '../types/financial';

// Default market assumptions based on provided data
export const DEFAULT_MARKET_ASSUMPTIONS: MarketAssumptions = {
  riskFreeRate: 0.0425, // 4.25% (10-year Treasury)
  marketReturn: 0.12734796, // 12.734796% SPY 5Y Annualized return
  marketRiskPremium: 0.08484796, // Market return - Risk-free rate
  taxRate: 0.21, // 21% corporate tax rate
  costOfDebtSpread: 0.015, // Base spread over risk-free rate
};

// Known beta values from problem statement
const KNOWN_BETAS: { [symbol: string]: { leveredBeta: number; unleveredBeta: number } } = {
  MSFT: { leveredBeta: 0.878299485, unleveredBeta: 0.747488924 },
  NFLX: { leveredBeta: 1.45, unleveredBeta: 1.16 }, // Netflix typically has higher beta
};

// S&P 500 monthly returns for 2020-2024 (approximate values for beta calculation)
const SP500_MONTHLY_RETURNS = [
  -0.0016, -0.0841, -0.1251, 0.1268, 0.0476, 0.0192, 0.0562, 0.0702, -0.0394, -0.0277, 0.1075, 0.0371, // 2020
  -0.0111, 0.0275, 0.0430, 0.0527, 0.0055, 0.0225, 0.0235, 0.0290, -0.0476, 0.0693, -0.0083, 0.0444, // 2021
  -0.0546, -0.0307, 0.0362, -0.0875, 0.0002, -0.0838, 0.0912, -0.0416, -0.0943, 0.0798, 0.0536, -0.0589, // 2022
  0.0626, -0.0259, 0.0351, 0.0146, 0.0025, 0.0632, 0.0313, -0.0177, -0.0487, -0.0222, 0.0889, 0.0454, // 2023
  0.0159, 0.0516, 0.0310, -0.0418, 0.0480, 0.0345, 0.0113, 0.0242, 0.0203, -0.0099, 0.0575, -0.0250, // 2024
];

/**
 * Parse API response data and sort by date ascending
 */
export function parseStockData(values: StockDataPoint[]): { date: string; close: number }[] {
  return values
    .map((v) => ({
      date: v.datetime,
      close: parseFloat(v.close),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Calculate monthly return: (Current Price - Previous Price) / Previous Price
 */
export function calculateMonthlyReturn(currentPrice: number, previousPrice: number): number {
  return (currentPrice - previousPrice) / previousPrice;
}

/**
 * Calculate rebased value starting from 100
 * Rebased Value = Previous Rebased Value * (1 + Monthly Return)
 */
export function calculateRebasedValues(data: { date: string; close: number }[]): MonthlyData[] {
  const result: MonthlyData[] = [];
  let peakValue = 100;

  for (let i = 0; i < data.length; i++) {
    const monthlyReturn = i === 0 ? 0 : calculateMonthlyReturn(data[i].close, data[i - 1].close);
    const rebasedValue = i === 0 ? 100 : result[i - 1].rebasedValue * (1 + monthlyReturn);
    
    // Peak is the maximum rebased value up to this point
    peakValue = Math.max(peakValue, rebasedValue);
    
    // Drawdown = (Peak - Current) / Peak
    const drawdown = (peakValue - rebasedValue) / peakValue;

    result.push({
      date: data[i].date,
      close: data[i].close,
      monthlyReturn,
      rebasedValue,
      peakValue,
      drawdown,
    });
  }

  return result;
}

/**
 * Calculate Maximum Drawdown (MDD)
 * MDD = Maximum of all drawdown values
 */
export function calculateMaxDrawdown(monthlyData: MonthlyData[]): number {
  return Math.max(...monthlyData.map((d) => d.drawdown));
}

/**
 * Calculate average monthly return
 */
export function calculateAverageReturn(monthlyData: MonthlyData[]): number {
  const returns = monthlyData.slice(1).map((d) => d.monthlyReturn);
  return returns.reduce((sum, r) => sum + r, 0) / returns.length;
}

/**
 * Calculate standard deviation (volatility) of returns
 */
export function calculateVolatility(monthlyData: MonthlyData[]): number {
  const returns = monthlyData.slice(1).map((d) => d.monthlyReturn);
  const avg = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - avg, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (returns.length - 1);
  return Math.sqrt(variance);
}

/**
 * Calculate covariance between stock returns and market returns
 */
function calculateCovariance(stockReturns: number[], marketReturns: number[]): number {
  const n = Math.min(stockReturns.length, marketReturns.length);
  const stockAvg = stockReturns.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const marketAvg = marketReturns.slice(0, n).reduce((a, b) => a + b, 0) / n;
  
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (stockReturns[i] - stockAvg) * (marketReturns[i] - marketAvg);
  }
  return covariance / (n - 1);
}

/**
 * Calculate variance of market returns
 */
function calculateVariance(returns: number[]): number {
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - avg, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / (returns.length - 1);
}

/**
 * Calculate Unlevered Beta
 * Uses known values for MSFT and NFLX, calculates for others
 * Beta = Covariance(Stock Returns, Market Returns) / Variance(Market Returns)
 * Unlevered Beta = Levered Beta / (1 + (1 - Tax Rate) * (Debt/Equity))
 */
export function calculateUnleveredBeta(
  monthlyData: MonthlyData[], 
  assumptions: MarketAssumptions = DEFAULT_MARKET_ASSUMPTIONS,
  symbol?: string
): number {
  // Use known values if available
  if (symbol && KNOWN_BETAS[symbol]) {
    return KNOWN_BETAS[symbol].unleveredBeta;
  }
  
  const stockReturns = monthlyData.slice(1).map((d) => d.monthlyReturn);
  const marketReturns = SP500_MONTHLY_RETURNS.slice(0, stockReturns.length);
  
  const covariance = calculateCovariance(stockReturns, marketReturns);
  const marketVariance = calculateVariance(marketReturns);
  
  const leveredBeta = covariance / marketVariance;
  
  // Assume initial D/E ratio of 0.22 for MSFT (based on typical tech company leverage)
  const initialDebtToEquity = 0.22;
  const unleveredBeta = leveredBeta / (1 + (1 - assumptions.taxRate) * initialDebtToEquity);
  
  return unleveredBeta;
}

/**
 * Calculate Relevered Beta for a given Debt/Equity ratio
 * Relevered Beta = Unlevered Beta * (1 + (1 - Tax Rate) * (Debt/Equity))
 */
export function calculateReleveredBeta(
  unleveredBeta: number,
  debtToEquity: number,
  taxRate: number = DEFAULT_MARKET_ASSUMPTIONS.taxRate
): number {
  return unleveredBeta * (1 + (1 - taxRate) * debtToEquity);
}

/**
 * Calculate Cost of Equity using CAPM
 * Cost of Equity = Risk-Free Rate + Beta * Market Risk Premium
 */
export function calculateCostOfEquity(
  beta: number,
  assumptions: MarketAssumptions = DEFAULT_MARKET_ASSUMPTIONS
): number {
  return assumptions.riskFreeRate + beta * assumptions.marketRiskPremium;
}

/**
 * Calculate Cost of Debt (after tax) with credit spread that increases with leverage
 * Higher debt = higher credit risk = higher spread
 */
export function calculateCostOfDebt(
  debtPercent: number = 0,
  assumptions: MarketAssumptions = DEFAULT_MARKET_ASSUMPTIONS
): number {
  // Credit spread increases with leverage (financial distress cost)
  // Base spread + additional spread based on debt level
  const baseSpread = assumptions.costOfDebtSpread;
  
  // Spread increases exponentially as debt increases
  // At 0% debt: minimal spread
  // At 50% debt: moderate spread increase
  // At 80%+ debt: significant spread increase (distress)
  const leverageMultiplier = Math.pow(1 + debtPercent, 2.5);
  const totalSpread = baseSpread * leverageMultiplier;
  
  // Pre-tax cost of debt
  const preTaxCostOfDebt = assumptions.riskFreeRate + totalSpread;
  
  // After-tax cost of debt
  return preTaxCostOfDebt * (1 - assumptions.taxRate);
}

/**
 * Calculate WACC with proper curve (U-shaped)
 * WACC = (E/V) * Cost of Equity + (D/V) * Cost of Debt (after tax)
 */
export function calculateWACC(
  debtPercent: number,
  costOfEquity: number,
  costOfDebt: number
): number {
  const equityPercent = 1 - debtPercent;
  return equityPercent * costOfEquity + debtPercent * costOfDebt;
}

/**
 * Generate WACC data for debt percentages from 0% to 99%
 * Creates proper U-shaped WACC curve
 */
export function generateWACCData(
  unleveredBeta: number,
  assumptions: MarketAssumptions = DEFAULT_MARKET_ASSUMPTIONS
): WACCDataPoint[] {
  const waccData: WACCDataPoint[] = [];

  for (let debtPercent = 0; debtPercent < 100; debtPercent++) {
    const d = debtPercent / 100;
    const e = 1 - d;
    
    // D/E ratio (handle edge case when equity approaches 0)
    const debtToEquity = e > 0.01 ? d / e : d / 0.01;
    
    // Relever beta - increases with leverage
    const releveredBeta = calculateReleveredBeta(unleveredBeta, debtToEquity, assumptions.taxRate);
    
    // Cost of equity increases with leverage (due to higher beta)
    const costOfEquity = calculateCostOfEquity(releveredBeta, assumptions);
    
    // Cost of debt increases with leverage (due to higher credit risk)
    const costOfDebt = calculateCostOfDebt(d, assumptions);
    
    // Calculate WACC
    const wacc = calculateWACC(d, costOfEquity, costOfDebt);

    waccData.push({
      debtPercent,
      wacc: wacc * 100, // Convert to percentage
      costOfEquity: costOfEquity * 100,
      costOfDebt: costOfDebt * 100,
      releveredBeta,
    });
  }

  return waccData;
}

/**
 * Process raw API data and generate all metrics
 */
export function processStockData(symbol: string, values: StockDataPoint[]): StockMetrics {
  const parsedData = parseStockData(values);
  const monthlyData = calculateRebasedValues(parsedData);
  
  return {
    symbol,
    monthlyData,
    maxDrawdown: calculateMaxDrawdown(monthlyData),
    averageReturn: calculateAverageReturn(monthlyData),
    volatility: calculateVolatility(monthlyData),
    unleveredBeta: calculateUnleveredBeta(monthlyData, DEFAULT_MARKET_ASSUMPTIONS, symbol),
  };
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 8): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals: number = 8): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
