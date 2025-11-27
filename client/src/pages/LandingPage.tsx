import { SignInButton } from '@clerk/clerk-react';
import { TrendingUp, BarChart3, PieChart, LineChart, Shield, Sparkles, ChevronRight } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <div className="logo-section">
            <TrendingUp className="logo-icon" size={32} />
            <span className="logo-text">INVESCO</span>
          </div>
          <SignInButton mode="modal">
            <button className="signin-btn">
              <span>Sign In</span>
              <ChevronRight size={18} />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Floating Elements */}
          <div className="floating-element element-1">
            <BarChart3 size={24} />
          </div>
          <div className="floating-element element-2">
            <PieChart size={20} />
          </div>
          <div className="floating-element element-3">
            <LineChart size={22} />
          </div>

          {/* Main Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Premium Investment Management</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your
              <span className="gradient-text"> Financial Future</span>
            </h1>
            
            <p className="hero-subtitle">
              Experience next-generation wealth management with cutting-edge technology, 
              data-driven insights, and personalized investment strategies designed for 
              the modern investor.
            </p>

            <div className="hero-cta">
              <SignInButton mode="modal">
                <button className="cta-primary">
                  <span>Get Started</span>
                  <ChevronRight size={20} />
                </button>
              </SignInButton>
              <button className="cta-secondary">
                <span>Learn More</span>
              </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">$50B+</div>
                <div className="stat-label">Assets Under Management</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">15K+</div>
                <div className="stat-label">Global Clients</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">98%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Glass Morphism Card with Chart */}
          <div className="hero-visual">
            <div className="glass-card">
              <div className="card-header">
                <h3>Portfolio Performance</h3>
                <div className="performance-badge positive">
                  <TrendingUp size={16} />
                  <span>+24.5%</span>
                </div>
              </div>
              
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  <path
                    className="chart-line"
                    d="M 0,150 L 50,140 L 100,130 L 150,125 L 200,100 L 250,90 L 300,70 L 350,50 L 400,30"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0,150 L 50,140 L 100,130 L 150,125 L 200,100 L 250,90 L 300,70 L 350,50 L 400,30 L 400,200 L 0,200 Z"
                    fill="url(#chartGradient)"
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="chart-point point-1"></div>
                <div className="chart-point point-2"></div>
                <div className="chart-point point-3"></div>
              </div>

              <div className="metrics-row">
                <div className="metric">
                  <span className="metric-label">Total Value</span>
                  <span className="metric-value">$1,247,890</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Today</span>
                  <span className="metric-value positive">+$12,450</span>
                </div>
              </div>
            </div>

            {/* Additional Floating Cards */}
            <div className="mini-card card-1">
              <Shield size={20} className="card-icon" />
              <div className="card-text">
                <div className="card-title">Secure</div>
                <div className="card-subtitle">Bank-level encryption</div>
              </div>
            </div>

            <div className="mini-card card-2">
              <TrendingUp size={20} className="card-icon" />
              <div className="card-text">
                <div className="card-title">Growth</div>
                <div className="card-subtitle">24.5% avg. returns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">
            Why Choose <span className="gradient-text">Invesco</span>
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={28} />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Real-time market insights powered by AI and machine learning algorithms</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={28} />
              </div>
              <h3>Secure & Trusted</h3>
              <p>Bank-grade security with multi-layer encryption and regulatory compliance</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={28} />
              </div>
              <h3>Proven Returns</h3>
              <p>Consistent portfolio growth with diversified investment strategies</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={28} />
              </div>
              <h3>Personalized Service</h3>
              <p>Dedicated advisors and custom investment plans tailored to your goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Start Your Investment Journey?</h2>
            <p>Join thousands of successful investors managing their wealth with Invesco</p>
            <SignInButton mode="modal">
              <button className="cta-final">
                <span>Get Started Now</span>
                <ChevronRight size={20} />
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <TrendingUp size={24} />
              <span>INVESCO</span>
            </div>
            <p className="footer-text">
              © 2025 Invesco. Premium Investment Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
