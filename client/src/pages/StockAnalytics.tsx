import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StockAPIResponse, CompanyFinancials } from '../types/financial';
import { processStockData, generateWACCData, formatPercent, formatNumber } from '../utils/financialCalculations';
import './StockAnalytics.css';

const MSFT_API = 'https://api.twelvedata.com/time_series?apikey=9249ed2bee884a949b4b22ee7c328b24&symbol=MSFT&interval=1month&country=United%20States&exchange=NASDAQ&type=stock&outputsize=500&start_date=2020-01-01%2000:00:00&end_date=2024-12-31%2023:59:00&format=json';
const NFLX_API = 'https://api.twelvedata.com/time_series?apikey=9249ed2bee884a949b4b22ee7c328b24&symbol=NFLX&interval=1month&type=stock&country=United%20States&exchange=NASDAQ&outputsize=500&start_date=2020-01-01%2000:00:00&end_date=2024-12-31%2023:59:00&format=json';

const StockAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msftData, setMsftData] = useState<CompanyFinancials | null>(null);
  const [nflxData, setNflxData] = useState<CompanyFinancials | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [msftResponse, nflxResponse] = await Promise.all([
          fetch(MSFT_API),
          fetch(NFLX_API),
        ]);

        if (!msftResponse.ok || !nflxResponse.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const msftJson: StockAPIResponse = await msftResponse.json();
        const nflxJson: StockAPIResponse = await nflxResponse.json();

        if (msftJson.status === 'error' || nflxJson.status === 'error') {
          throw new Error('API returned an error');
        }

        // Process MSFT data
        const msftMetrics = processStockData('MSFT', msftJson.values);
        const msftWaccData = generateWACCData(msftMetrics.unleveredBeta);
        setMsftData({
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          metrics: msftMetrics,
          waccData: msftWaccData,
          color: '#00A4EF',
        });

        // Process NFLX data
        const nflxMetrics = processStockData('NFLX', nflxJson.values);
        const nflxWaccData = generateWACCData(nflxMetrics.unleveredBeta);
        setNflxData({
          symbol: 'NFLX',
          companyName: 'Netflix, Inc.',
          metrics: nflxMetrics,
          waccData: nflxWaccData,
          color: '#E50914',
        });

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVisualize = () => {
    if (msftData && nflxData) {
      navigate('/stock-visualizations', { state: { msftData, nflxData } });
    }
  };

  if (loading) {
    return (
      <div className="stock-analytics-page">
        <div className="analytics-background">
          <div className="analytics-orb analytics-orb-1"></div>
          <div className="analytics-orb analytics-orb-2"></div>
          <div className="analytics-orb analytics-orb-3"></div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-analytics-page">
        <div className="analytics-background">
          <div className="analytics-orb analytics-orb-1"></div>
          <div className="analytics-orb analytics-orb-2"></div>
          <div className="analytics-orb analytics-orb-3"></div>
        </div>
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-analytics-page">
      <div className="analytics-background">
        <div className="analytics-orb analytics-orb-1"></div>
        <div className="analytics-orb analytics-orb-2"></div>
        <div className="analytics-orb analytics-orb-3"></div>
      </div>

      <nav className="analytics-nav">
        <div className="nav-logo">
          <span className="logo-icon">📊</span>
          <span>FinSight</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/stock-analytics" className="active">Stock Analysis</a>
        </div>
      </nav>

      <div className="analytics-content">
        <header className="analytics-header">
          <h1>Stock Comparison Dashboard</h1>
          <p>Comprehensive financial analysis of Microsoft (MSFT) and Netflix (NFLX) from 2020-2024</p>
        </header>

        <div className="comparison-grid">
          {/* Microsoft Card */}
          <div className="stock-card msft-card">
            <div className="card-header">
              <div className="company-logo msft-logo">
                <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="11" height="11" fill="#f25022"/>
                  <rect x="12" width="11" height="11" fill="#7fba00"/>
                  <rect y="12" width="11" height="11" fill="#00a4ef"/>
                  <rect x="12" y="12" width="11" height="11" fill="#ffb900"/>
                </svg>
              </div>
              <div className="company-info">
                <h2>Microsoft</h2>
                <span className="symbol">NASDAQ: MSFT</span>
              </div>
            </div>
            
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Max Drawdown</span>
                <span className="metric-value negative">{formatPercent(msftData?.metrics.maxDrawdown || 0)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Monthly Return</span>
                <span className={`metric-value ${(msftData?.metrics.averageReturn || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(msftData?.metrics.averageReturn || 0)}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Volatility</span>
                <span className="metric-value">{formatPercent(msftData?.metrics.volatility || 0)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Unlevered Beta</span>
                <span className="metric-value">{formatNumber(msftData?.metrics.unleveredBeta || 0)}</span>
              </div>
            </div>

            <div className="price-summary">
              <div className="price-item">
                <span>Starting Price (Jan 2020)</span>
                <span>${formatNumber(msftData?.metrics.monthlyData[0]?.close || 0)}</span>
              </div>
              <div className="price-item">
                <span>Ending Price (Dec 2024)</span>
                <span>${formatNumber(msftData?.metrics.monthlyData[msftData?.metrics.monthlyData.length - 1]?.close || 0)}</span>
              </div>
              <div className="price-item highlight">
                <span>Total Return</span>
                <span className="positive">
                  {formatPercent((msftData?.metrics.monthlyData[msftData?.metrics.monthlyData.length - 1]?.rebasedValue || 100) / 100 - 1)}
                </span>
              </div>
            </div>
          </div>

          {/* Netflix Card */}
          <div className="stock-card nflx-card">
            <div className="card-header">
              <div className="company-logo nflx-logo">
                <span className="netflix-n">N</span>
              </div>
              <div className="company-info">
                <h2>Netflix</h2>
                <span className="symbol">NASDAQ: NFLX</span>
              </div>
            </div>
            
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Max Drawdown</span>
                <span className="metric-value negative">{formatPercent(nflxData?.metrics.maxDrawdown || 0)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Monthly Return</span>
                <span className={`metric-value ${(nflxData?.metrics.averageReturn || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(nflxData?.metrics.averageReturn || 0)}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Volatility</span>
                <span className="metric-value">{formatPercent(nflxData?.metrics.volatility || 0)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Unlevered Beta</span>
                <span className="metric-value">{formatNumber(nflxData?.metrics.unleveredBeta || 0)}</span>
              </div>
            </div>

            <div className="price-summary">
              <div className="price-item">
                <span>Starting Price (Jan 2020)</span>
                <span>${formatNumber(nflxData?.metrics.monthlyData[0]?.close || 0)}</span>
              </div>
              <div className="price-item">
                <span>Ending Price (Dec 2024)</span>
                <span>${formatNumber(nflxData?.metrics.monthlyData[nflxData?.metrics.monthlyData.length - 1]?.close || 0)}</span>
              </div>
              <div className="price-item highlight">
                <span>Total Return</span>
                <span className="positive">
                  {formatPercent((nflxData?.metrics.monthlyData[nflxData?.metrics.monthlyData.length - 1]?.rebasedValue || 100) / 100 - 1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="comparison-summary">
          <h3>Key Comparison Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📉</div>
              <h4>Risk Profile</h4>
              <p>
                {(msftData?.metrics.maxDrawdown || 0) < (nflxData?.metrics.maxDrawdown || 0)
                  ? 'Microsoft shows lower maximum drawdown, indicating less downside risk during market stress.'
                  : 'Netflix experienced a higher maximum drawdown, reflecting greater volatility during market corrections.'}
              </p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <h4>Performance</h4>
              <p>
                {((msftData?.metrics.monthlyData[msftData?.metrics.monthlyData.length - 1]?.rebasedValue || 100)) >
                 ((nflxData?.metrics.monthlyData[nflxData?.metrics.monthlyData.length - 1]?.rebasedValue || 100))
                  ? 'Microsoft delivered stronger total returns over the 2020-2024 period.'
                  : 'Netflix outperformed Microsoft in total returns during 2020-2024.'}
              </p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">⚖️</div>
              <h4>Beta Analysis</h4>
              <p>
                {(msftData?.metrics.unleveredBeta || 0) < (nflxData?.metrics.unleveredBeta || 0)
                  ? 'Microsoft has a lower unlevered beta, suggesting less sensitivity to market movements.'
                  : 'Netflix has a lower unlevered beta, indicating more stability relative to market swings.'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta-section">
          <button className="visualize-btn" onClick={handleVisualize} disabled={!msftData || !nflxData}>
            <span>Get Visualization</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <p className="cta-hint">View detailed charts including Maximum Drawdown and WACC analysis</p>
        </div>
      </div>

      <footer className="analytics-footer">
        <p>Data provided by Twelve Data API • Analysis period: January 2020 - December 2024</p>
      </footer>
    </div>
  );
};

export default StockAnalytics;
