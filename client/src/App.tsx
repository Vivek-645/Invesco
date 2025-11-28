import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SyncUserToBackend } from './components/SyncUserToBackend';
import ChatWidget from './components/ChatWidget';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import StockAnalytics from './pages/StockAnalytics';
import StockVisualizations from './pages/StockVisualizations';
import Sidebar from './components/Sidebar';

function AppRoutes() {

  return (
    <Routes>
      {/* Public route - Landing page (when signed out) */}
      <Route
        path="/"
        element={
          <>
            <SignedOut>
              <LandingPage />
            </SignedOut>
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
          </>
        }
      />

      {/* Protected routes - Dashboard with sidebar (when signed in) */}
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />
      <Route
        path="/analytics"
        element={
          <SignedIn>
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1">
                <Analytics />
              </main>
            </div>
          </SignedIn>
        }
      />
      <Route
        path="/reports"
        element={
          <SignedIn>
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1">
                <Reports />
              </main>
            </div>
          </SignedIn>
        }
      />
      <Route
        path="/settings"
        element={
          <SignedIn>
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1">
                <Settings />
              </main>
            </div>
          </SignedIn>
        }
      />
      <Route
        path="/profile"
        element={
          <SignedIn>
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1">
                <Profile />
              </main>
            </div>
          </SignedIn>
        }
      />

      {/* Redirect any unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Stock Analytics Routes (Public) */}
      <Route path="/stock-analytics" element={<StockAnalytics />} />
      <Route path="/stock-visualizations" element={<StockVisualizations />} />
    </Routes>
  );
}

function GlobalChatWidget() {
  const { getToken } = useAuth();
  
  const getAuthToken = async () => {
    const token = await getToken();
    return token || '';
  };

  return (
    <ChatWidget 
      apiBaseUrl={import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000'}
      getAuthToken={getAuthToken}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Auto-sync user to backend when signed in */}
      <SignedIn>
        <SyncUserToBackend />
        <GlobalChatWidget />
      </SignedIn>

      <AppRoutes />
    </BrowserRouter>
  );
}