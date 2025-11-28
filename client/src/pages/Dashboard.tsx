import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const getAuthToken = async () => {
    const token = await getToken();
    if (!token) throw new Error('No authentication token available');
    return token;
  };

  return (
    <div className="dashboard bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header with User Info */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4" style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={28} className="text-indigo-400" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.5))' }} />
                <span style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>Investment Dashboard</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Welcome back, <span className="text-indigo-400 font-semibold">{user?.firstName || 'Investor'}</span>!
              </p>
            </div>
            <button
              onClick={() => navigate('/stock-analytics')}
              className="stock-analytics-btn"
            >
              <BarChart3 size={18} />
              <span>Stock Analytics</span>
            </button>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="page-header">
            <h1>Investment Dashboard</h1>
            <p>Your portfolio overview and performance metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats">
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
          <div className="charts-grid">
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
          <div className="holdings-card">
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
        </div>
      </main>

      {/* AI Chat Widget */}
      <ChatWidget 
        apiBaseUrl={import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000'}
        getAuthToken={getAuthToken}
      />
    </div>
  );
}
