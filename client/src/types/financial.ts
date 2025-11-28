// Types for financial analytics

export interface StockDataPoint {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface StockAPIResponse {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: StockDataPoint[];
  status: string;
}

export interface MonthlyData {
  date: string;
  close: number;
  monthlyReturn: number;
  rebasedValue: number;
  peakValue: number;
  drawdown: number;
}

export interface StockMetrics {
  symbol: string;
  monthlyData: MonthlyData[];
  maxDrawdown: number;
  averageReturn: number;
  volatility: number;
  unleveredBeta: number;
}

export interface WACCDataPoint {
  debtPercent: number;
  wacc: number;
  costOfEquity: number;
  costOfDebt: number;
  releveredBeta: number;
}

export interface CompanyFinancials {
  symbol: string;
  companyName: string;
  metrics: StockMetrics;
  waccData: WACCDataPoint[];
  color: string;
}

// Market assumptions for WACC calculations
export interface MarketAssumptions {
  riskFreeRate: number; // 10-year Treasury rate
  marketReturn: number; // Expected market return
  marketRiskPremium: number; // Market return - Risk-free rate
  taxRate: number; // Corporate tax rate
  costOfDebtSpread: number; // Spread over risk-free rate for debt
}
