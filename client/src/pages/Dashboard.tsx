import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, DollarSign, Activity, Globe, Users, Building2, Award } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="dashboard bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header with User Info */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-10 py-5" style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.1)' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp size={30} className="text-indigo-400" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.5))' }} />
              <span style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>Investment Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 ml-11">
              Welcome back, <span className="text-indigo-400 font-semibold">{user?.firstName || 'Investor'}</span>!
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/stock-analytics')}
              className="stock-analytics-btn"
            >
              <BarChart3 size={18} />
              <span>Stock Analytics</span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-10 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="page-header mb-8">
            <h1>Investment Dashboard</h1>
            <p>Your portfolio overview and performance metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats mb-8">
            <div className="stat-box">
              <div className="stat-icon blue">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Portfolio Value</div>
                <div className="stat-value">$1,247,890.50</div>
                <div className="stat-change positive">
                  <TrendingUp size={16} />
                  <span>+12.5% this month</span>
                </div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon green">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Returns</div>
                <div className="stat-value">+$247,890</div>
                <div className="stat-change positive">
                  <TrendingUp size={16} />
                  <span>+24.8% YTD</span>
                </div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon purple">
                <BarChart3 size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Active Investments</div>
                <div className="stat-value">12</div>
                <div className="stat-change neutral">
                  <Activity size={16} />
                  <span>3 new this week</span>
                </div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon orange">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Today's Change</div>
                <div className="stat-value">+$12,450</div>
                <div className="stat-change positive">
                  <TrendingUp size={16} />
                  <span>+1.02%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid mb-8">
            <div className="chart-card large">
              <div className="chart-header">
                <h3>Portfolio Performance</h3>
                <div className="time-filters">
                  <button className="time-btn">1D</button>
                  <button className="time-btn">1W</button>
                  <button className="time-btn active">1M</button>
                  <button className="time-btn">3M</button>
                  <button className="time-btn">1Y</button>
                </div>
              </div>
              <div className="chart-content">
                <svg className="performance-chart" viewBox="0 0 800 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                    <linearGradient id="dashLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d="M 0,250 L 50,240 L 100,230 L 150,220 L 200,210 L 250,200 L 300,180 L 350,160 L 400,150 L 450,140 L 500,120 L 550,100 L 600,90 L 650,70 L 700,60 L 750,50 L 800,40 L 800,300 L 0,300 Z"
                    fill="url(#dashGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d="M 0,250 L 50,240 L 100,230 L 150,220 L 200,210 L 250,200 L 300,180 L 350,160 L 400,150 L 450,140 L 500,120 L 550,100 L 600,90 L 650,70 L 700,60 L 750,50 L 800,40"
                    fill="none"
                    stroke="url(#dashLine)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Asset Allocation</h3>
              </div>
              <div className="allocation-content">
                <div className="allocation-item">
                  <div className="allocation-label">
                    <span className="color-dot blue"></span>
                    <span>Stocks</span>
                  </div>
                  <div className="allocation-value">60%</div>
                </div>
                <div className="allocation-bar">
                  <div className="allocation-fill blue" style={{ width: '60%' }}></div>
                </div>

                <div className="allocation-item">
                  <div className="allocation-label">
                    <span className="color-dot green"></span>
                    <span>Bonds</span>
                  </div>
                  <div className="allocation-value">25%</div>
                </div>
                <div className="allocation-bar">
                  <div className="allocation-fill green" style={{ width: '25%' }}></div>
                </div>

                <div className="allocation-item">
                  <div className="allocation-label">
                    <span className="color-dot purple"></span>
                    <span>Real Estate</span>
                  </div>
                  <div className="allocation-value">10%</div>
                </div>
                <div className="allocation-bar">
                  <div className="allocation-fill purple" style={{ width: '10%' }}></div>
                </div>

                <div className="allocation-item">
                  <div className="allocation-label">
                    <span className="color-dot orange"></span>
                    <span>Cash</span>
                  </div>
                  <div className="allocation-value">5%</div>
                </div>
                <div className="allocation-bar">
                  <div className="allocation-fill orange" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="holdings-card mb-8">
            <div className="holdings-header">
              <h3>Recent Investments</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="holdings-table">
              <div className="table-header">
                <div className="table-cell">Asset</div>
                <div className="table-cell">Shares</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Change</div>
                <div className="table-cell">Value</div>
              </div>
              
              <div className="table-row">
                <div className="table-cell">
                  <div className="asset-info">
                    <div className="asset-icon blue">AAPL</div>
                    <div>
                      <div className="asset-name">Apple Inc.</div>
                      <div className="asset-symbol">Technology</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">150</div>
                <div className="table-cell">$182.45</div>
                <div className="table-cell positive">+2.34%</div>
                <div className="table-cell">$27,367.50</div>
              </div>

              <div className="table-row">
                <div className="table-cell">
                  <div className="asset-info">
                    <div className="asset-icon green">MSFT</div>
                    <div>
                      <div className="asset-name">Microsoft Corp.</div>
                      <div className="asset-symbol">Technology</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">200</div>
                <div className="table-cell">$378.92</div>
                <div className="table-cell positive">+1.87%</div>
                <div className="table-cell">$75,784.00</div>
              </div>

              <div className="table-row">
                <div className="table-cell">
                  <div className="asset-info">
                    <div className="asset-icon purple">TSLA</div>
                    <div>
                      <div className="asset-name">Tesla Inc.</div>
                      <div className="asset-symbol">Automotive</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">75</div>
                <div className="table-cell">$248.50</div>
                <div className="table-cell negative">-0.92%</div>
                <div className="table-cell">$18,637.50</div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="sync-success">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h4>Account Synced Successfully</h4>
              <p>Your user data has been synchronized with the backend database.</p>
            </div>
          </div>

          {/* Invesco Assets Under Management Section */}
          <div className="invesco-aum-section">
            <div className="aum-header">
              <h2>Invesco - Assets Under Management</h2>
              <p>Global investment management excellence since 1935</p>
            </div>
            
            <div className="aum-stats-grid">
              <div className="aum-stat-card">
                <div className="aum-stat-icon">
                  <DollarSign size={28} />
                </div>
                <div className="aum-stat-value">$1.85T</div>
                <div className="aum-stat-label">Total AUM</div>
                <div className="aum-stat-desc">Assets under management as of Q3 2024</div>
              </div>
              
              <div className="aum-stat-card">
                <div className="aum-stat-icon globe">
                  <Globe size={28} />
                </div>
                <div className="aum-stat-value">25+</div>
                <div className="aum-stat-label">Countries</div>
                <div className="aum-stat-desc">Global presence across major financial markets</div>
              </div>
              
              <div className="aum-stat-card">
                <div className="aum-stat-icon users">
                  <Users size={28} />
                </div>
                <div className="aum-stat-value">8,500+</div>
                <div className="aum-stat-label">Employees</div>
                <div className="aum-stat-desc">Investment professionals worldwide</div>
              </div>
              
              <div className="aum-stat-card">
                <div className="aum-stat-icon award">
                  <Award size={28} />
                </div>
                <div className="aum-stat-value">150+</div>
                <div className="aum-stat-label">ETFs</div>
                <div className="aum-stat-desc">Exchange-traded funds globally</div>
              </div>
            </div>

            <div className="aum-details-grid">
              <div className="aum-detail-card">
                <h4><Building2 size={20} /> Investment Capabilities</h4>
                <ul>
                  <li><span>Equity:</span> $687B in global equity strategies</li>
                  <li><span>Fixed Income:</span> $412B across bond markets</li>
                  <li><span>Alternatives:</span> $198B in real estate, private credit</li>
                  <li><span>Multi-Asset:</span> $289B in balanced solutions</li>
                  <li><span>Money Market:</span> $264B in liquidity solutions</li>
                </ul>
              </div>
              
              <div className="aum-detail-card">
                <h4><Globe size={20} /> Regional AUM Distribution</h4>
                <div className="region-bars">
                  <div className="region-item">
                    <div className="region-info">
                      <span>Americas</span>
                      <span>$1.12T (60%)</span>
                    </div>
                    <div className="region-bar">
                      <div className="region-fill americas" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="region-item">
                    <div className="region-info">
                      <span>EMEA</span>
                      <span>$481B (26%)</span>
                    </div>
                    <div className="region-bar">
                      <div className="region-fill emea" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                  <div className="region-item">
                    <div className="region-info">
                      <span>Asia Pacific</span>
                      <span>$259B (14%)</span>
                    </div>
                    <div className="region-bar">
                      <div className="region-fill apac" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="aum-highlights">
              <div className="highlight-item">
                <span className="highlight-number">#6</span>
                <span className="highlight-text">Largest retail asset manager in the US</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">#4</span>
                <span className="highlight-text">Largest ETF provider globally</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">89</span>
                <span className="highlight-text">Years of investment excellence</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
