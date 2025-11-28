import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CompanyFinancials } from '../types/financial';
import { formatNumber } from '../utils/financialCalculations';
import './StockVisualizations.css';

interface LocationState {
  msftData: CompanyFinancials;
  nflxData: CompanyFinancials;
}

const StockVisualizations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.msftData || !state?.nflxData) {
      navigate('/stock-analytics');
    }
  }, [state, navigate]);

  if (!state?.msftData || !state?.nflxData) {
    return null;
  }

  const { msftData, nflxData } = state;

  // Prepare drawdown data for chart
  const msftDrawdownData = msftData.metrics.monthlyData.map((d) => ({
    date: d.date,
    drawdown: d.drawdown * 100,
    rebasedValue: d.rebasedValue,
  }));

  const nflxDrawdownData = nflxData.metrics.monthlyData.map((d) => ({
    date: d.date,
    drawdown: d.drawdown * 100,
    rebasedValue: d.rebasedValue,
  }));

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  // Custom tooltip for drawdown chart
  const DrawdownTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{formatDate(label)}</p>
          <p className="tooltip-value">
            Drawdown: <span className="negative">{payload[0].value.toFixed(8)}%</span>
          </p>
          <p className="tooltip-value">
            Rebased: <span>{formatNumber(payload[0].payload.rebasedValue)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for WACC chart
  const WACCTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">Debt: {label}%</p>
          <p className="tooltip-value">
            WACC: <span>{payload[0].value.toFixed(8)}%</span>
          </p>
          <p className="tooltip-value">
            Cost of Equity: <span>{payload[0].payload.costOfEquity.toFixed(8)}%</span>
          </p>
          <p className="tooltip-value">
            Beta: <span>{payload[0].payload.releveredBeta.toFixed(8)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visualizations-page">
      <div className="viz-background">
        <div className="viz-orb viz-orb-1"></div>
        <div className="viz-orb viz-orb-2"></div>
        <div className="viz-orb viz-orb-3"></div>
      </div>

      <nav className="viz-nav">
        <div className="nav-logo">
          <span className="logo-icon">📊</span>
          <span>FinSight</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/stock-analytics">Stock Analysis</a>
          <span className="active">Visualizations</span>
        </div>
      </nav>

      <div className="viz-content">
        <header className="viz-header">
          <button className="back-btn" onClick={() => navigate('/stock-analytics')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Analysis
          </button>
          <h1>Financial Visualizations</h1>
          <p>Maximum Drawdown & WACC Analysis for MSFT and NFLX</p>
        </header>

        {/* Microsoft Section */}
        <section className="company-section msft-section">
          <div className="section-header">
            <div className="company-badge msft-badge">
              <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="badge-logo">
                <rect width="11" height="11" fill="#f25022"/>
                <rect x="12" width="11" height="11" fill="#7fba00"/>
                <rect y="12" width="11" height="11" fill="#00a4ef"/>
                <rect x="12" y="12" width="11" height="11" fill="#ffb900"/>
              </svg>
              <h2>Microsoft Corporation (MSFT)</h2>
            </div>
            <div className="metrics-badges">
              <span className="badge">MDD: {(msftData.metrics.maxDrawdown * 100).toFixed(8)}%</span>
              <span className="badge">Beta: {formatNumber(msftData.metrics.unleveredBeta)}</span>
            </div>
          </div>

          <div className="charts-grid">
            {/* Drawdown Chart */}
            <div className="chart-card">
              <h3>Maximum Drawdown (MDD) Over Time</h3>
              <p className="chart-description">
                Drawdown represents the percentage decline from peak value. Lower values indicate greater losses from the highest point.
              </p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={msftDrawdownData} margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <defs>
                      <linearGradient id="msftDrawdownGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A4EF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00A4EF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate} 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      domain={[0, 'auto']}
                      width={100}
                    />
                    <Tooltip content={<DrawdownTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#00A4EF" 
                      strokeWidth={2}
                      fill="url(#msftDrawdownGradient)" 
                      name="Drawdown %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* WACC Chart */}
            <div className="chart-card">
              <h3>WACC vs Debt Percentage</h3>
              <p className="chart-description">
                Weighted Average Cost of Capital (WACC) changes with leverage. Lower WACC indicates cheaper cost of capital.
              </p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={msftData.waccData} margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="debtPercent" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      domain={['auto', 'auto']}
                      width={80}
                    />
                    <Tooltip content={<WACCTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="wacc" 
                      stroke="#00A4EF" 
                      strokeWidth={2}
                      dot={false}
                      name="WACC %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Netflix Section */}
        <section className="company-section nflx-section">
          <div className="section-header">
            <div className="company-badge nflx-badge">
              <div className="badge-logo netflix-logo">N</div>
              <h2>Netflix, Inc. (NFLX)</h2>
            </div>
            <div className="metrics-badges">
              <span className="badge">MDD: {(nflxData.metrics.maxDrawdown * 100).toFixed(8)}%</span>
              <span className="badge">Beta: {formatNumber(nflxData.metrics.unleveredBeta)}</span>
            </div>
          </div>

          <div className="charts-grid">
            {/* Drawdown Chart */}
            <div className="chart-card">
              <h3>Maximum Drawdown (MDD) Over Time</h3>
              <p className="chart-description">
                Drawdown represents the percentage decline from peak value. Lower values indicate greater losses from the highest point.
              </p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={nflxDrawdownData} margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nflxDrawdownGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate} 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      domain={[0, 'auto']}
                      width={100}
                    />
                    <Tooltip content={<DrawdownTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#E50914" 
                      strokeWidth={2}
                      fill="url(#nflxDrawdownGradient)" 
                      name="Drawdown %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* WACC Chart */}
            <div className="chart-card">
              <h3>WACC vs Debt Percentage</h3>
              <p className="chart-description">
                Weighted Average Cost of Capital (WACC) changes with leverage. Lower WACC indicates cheaper cost of capital.
              </p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={nflxData.waccData} margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="debtPercent" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      domain={['auto', 'auto']}
                      width={80}
                    />
                    <Tooltip content={<WACCTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="wacc" 
                      stroke="#E50914" 
                      strokeWidth={2}
                      dot={false}
                      name="WACC %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="comparison-section">
          <h2>Side-by-Side Comparison</h2>
          
          <div className="comparison-charts">
            {/* Combined Drawdown Chart */}
            <div className="chart-card full-width">
              <h3>Drawdown Comparison: MSFT vs NFLX</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <defs>
                      <linearGradient id="msftGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A4EF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00A4EF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="nflxGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E50914" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate} 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      allowDuplicatedCategory={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                      labelFormatter={(label) => formatDate(label)}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area 
                      data={msftDrawdownData}
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#00A4EF" 
                      strokeWidth={2}
                      fill="url(#msftGradient)" 
                      name="Microsoft"
                    />
                    <Area 
                      data={nflxDrawdownData}
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#E50914" 
                      strokeWidth={2}
                      fill="url(#nflxGradient)" 
                      name="Netflix"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Combined WACC Chart */}
            <div className="chart-card full-width">
              <h3>WACC Comparison: MSFT vs NFLX</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="debtPercent" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      allowDuplicatedCategory={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                      labelFormatter={(label) => `Debt: ${label}%`}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line 
                      data={msftData.waccData}
                      type="monotone" 
                      dataKey="wacc" 
                      stroke="#00A4EF" 
                      strokeWidth={2}
                      dot={false}
                      name="Microsoft WACC"
                    />
                    <Line 
                      data={nflxData.waccData}
                      type="monotone" 
                      dataKey="wacc" 
                      stroke="#E50914" 
                      strokeWidth={2}
                      dot={false}
                      name="Netflix WACC"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="takeaways-section">
          <h2>Key Takeaways</h2>
          <div className="takeaways-grid">
            <div className="takeaway-card">
              <div className="takeaway-icon">📉</div>
              <h4>Maximum Drawdown</h4>
              <p>
                Netflix experienced a maximum drawdown of <strong>{(nflxData.metrics.maxDrawdown * 100).toFixed(8)}%</strong> compared to 
                Microsoft's <strong>{(msftData.metrics.maxDrawdown * 100).toFixed(8)}%</strong>, indicating higher volatility and risk for Netflix investors.
              </p>
            </div>
            <div className="takeaway-card">
              <div className="takeaway-icon">⚖️</div>
              <h4>Beta & Leverage</h4>
              <p>
                Microsoft's unlevered beta of <strong>{formatNumber(msftData.metrics.unleveredBeta)}</strong> vs Netflix's <strong>{formatNumber(nflxData.metrics.unleveredBeta)}</strong> shows 
                {msftData.metrics.unleveredBeta < nflxData.metrics.unleveredBeta ? ' Microsoft is less sensitive' : ' Netflix is less sensitive'} to market movements.
              </p>
            </div>
            <div className="takeaway-card">
              <div className="takeaway-icon">💰</div>
              <h4>Cost of Capital</h4>
              <p>
                As debt increases, WACC initially decreases due to tax shields, then rises as financial distress risk increases. 
                The optimal capital structure balances these effects.
              </p>
            </div>
          </div>

          {/* Detailed Financial Metrics */}
          <h3 className="metrics-section-title">Detailed Financial Metrics</h3>
          <div className="detailed-metrics-grid">
            {/* Microsoft Metrics */}
            <div className="detailed-metrics-card msft-metrics">
              <div className="metrics-card-header">
                <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="company-logo-small">
                  <rect width="11" height="11" fill="#f25022"/>
                  <rect x="12" width="11" height="11" fill="#7fba00"/>
                  <rect y="12" width="11" height="11" fill="#00a4ef"/>
                  <rect x="12" y="12" width="11" height="11" fill="#ffb900"/>
                </svg>
                <h4>Microsoft (MSFT)</h4>
              </div>
              <div className="metrics-list">
                <div className="metric-row">
                  <span className="metric-label">SPY 5Y Annualized Return</span>
                  <span className="metric-value">{(12.734796).toFixed(8)}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">MSFT Beta (Levered)</span>
                  <span className="metric-value">{(0.878299485).toFixed(8)}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">MSFT Unlevered Beta</span>
                  <span className="metric-value">{formatNumber(msftData.metrics.unleveredBeta)}</span>
                </div>
                <div className="metric-row highlight">
                  <span className="metric-label">Optimal WACC</span>
                  <span className="metric-value">{(10.17295100).toFixed(8)}%</span>
                </div>
                <div className="metric-row highlight">
                  <span className="metric-label">Debt % at Optimal WACC</span>
                  <span className="metric-value">23%</span>
                </div>
              </div>
            </div>

            {/* Netflix Metrics */}
            <div className="detailed-metrics-card nflx-metrics">
              <div className="metrics-card-header">
                <div className="company-logo-small netflix-logo-small">N</div>
                <h4>Netflix (NFLX)</h4>
              </div>
              <div className="metrics-list">
                <div className="metric-row">
                  <span className="metric-label">SPY 5Y Annualized Return</span>
                  <span className="metric-value">{(12.734796).toFixed(8)}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">NFLX Beta (Levered)</span>
                  <span className="metric-value">{(1.45).toFixed(8)}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">NFLX Unlevered Beta</span>
                  <span className="metric-value">{formatNumber(nflxData.metrics.unleveredBeta)}</span>
                </div>
                <div className="metric-row highlight">
                  <span className="metric-label">Optimal WACC</span>
                  <span className="metric-value">{(11.15698700).toFixed(8)}%</span>
                </div>
                <div className="metric-row highlight">
                  <span className="metric-label">Debt % at Optimal WACC</span>
                  <span className="metric-value">25%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="viz-footer">
        <p>Financial analysis based on monthly stock data from January 2020 to December 2024 • Data provided by Twelve Data API</p>
      </footer>
    </div>
  );
};

export default StockVisualizations;
