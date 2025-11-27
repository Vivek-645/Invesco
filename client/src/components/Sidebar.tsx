/**
 * Sidebar Component
 * 
 * A modern, collapsible sidebar with React Router integration.
 * Features:
 * - Smooth collapse/expand animation
 * - Active route highlighting
 * - Tooltips when collapsed
 * - localStorage persistence
 * - Responsive (drawer mode on mobile)
 * - Accessibility (keyboard navigation, ARIA labels)
 * - Badge support for notifications
 * 
 * Usage in Dashboard.tsx:
 * ```tsx
 * import Sidebar from '../components/Sidebar';
 * 
 * <div className="flex">
 *   <Sidebar />
 *   <main className="flex-1">{...your content...}</main>
 * </div>
 * ```
 */

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import {
  MdDashboard,
  MdShowChart,
  MdDescription,
  MdSettings,
  MdPerson,
  MdMenu,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdAdminPanelSettings,
} from 'react-icons/md';

// Route definitions
export interface SidebarRoute {
  path: string;
  label: string;
  icon: React.ReactElement;
  badge?: number;
  adminOnly?: boolean;
}

const routes: SidebarRoute[] = [
  { path: '/dashboard', label: 'Overview', icon: <MdDashboard size={24} /> },
  { path: '/analytics', label: 'Analytics', icon: <MdShowChart size={24} /> },
  { path: '/reports', label: 'Reports', icon: <MdDescription size={24} />, badge: 3 },
  { path: '/admin', label: 'Admin Panel', icon: <MdAdminPanelSettings size={24} />, adminOnly: true },
  { path: '/settings', label: 'Settings', icon: <MdSettings size={24} /> },
  { path: '/profile', label: 'Profile', icon: <MdPerson size={24} /> },
];

const STORAGE_KEY = 'sidebar-collapsed';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Sidebar() {
  // Load collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const location = useLocation();
  const { getToken } = useAuth();

  // Fetch user role from backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.data.user.role || 'user');
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, [getToken]);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut: Ctrl+B to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev: boolean) => !prev);
  };

  const toggleMobile = () => {
    setIsMobileOpen((prev: boolean) => !prev);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg shadow-lg md:hidden hover:bg-slate-800 transition-colors"
        style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <MdClose size={24} className="text-white" /> : <MdMenu size={24} className="text-white" />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '72px' : '240px',
          x: isMobileOpen || window.innerWidth >= 768 ? 0 : '-100%',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 z-40
          flex flex-col shadow-2xl backdrop-blur-xl
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.15)'
        }}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50 bg-slate-900/50">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            {!isCollapsed && (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}>
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="font-bold text-white whitespace-nowrap tracking-wide" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>INVESCO</span>
              </>
            )}
          </motion.div>

          {/* Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapse();
              }
            }}
            className={`
              p-2 rounded-lg hover:bg-slate-800/50 transition-all
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isCollapsed ? 'mx-auto' : ''}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expand (Ctrl+B)' : 'Collapse (Ctrl+B)'}
          >
            {isCollapsed ? (
              <MdChevronRight size={20} className="text-slate-400 hover:text-white transition-colors" />
            ) : (
              <MdChevronLeft size={20} className="text-slate-400 hover:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {routes.filter(route => !route.adminOnly || userRole === 'admin').map((route) => (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `
                    relative flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-300 group
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/50'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `
                  }
                  style={({ isActive }: { isActive: boolean }) => 
                    isActive ? { boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' } : {}
                  }
                  title={isCollapsed ? route.label : undefined}
                >
                  {/* Icon */}
                  <span className="flex-shrink-0">{route.icon}</span>

                  {/* Label (hidden when collapsed) */}
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex-1 font-medium whitespace-nowrap"
                    >
                      {route.label}
                    </motion.span>
                  )}

                  {/* Badge */}
                  {route.badge && !isCollapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15 }}
                      className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg"
                      style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)' }}
                    >
                      {route.badge}
                    </motion.span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
                      {route.label}
                      {route.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-gradient-to-r from-red-500 to-pink-500 rounded-full" style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                          {route.badge}
                        </span>
                      )}
                      <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-slate-500 text-center"
            >
              <p className="flex items-center justify-center gap-1">
                <span className="text-indigo-400">⌘</span> Press Ctrl+B to toggle
              </p>
            </motion.div>
          ) : (
            <div className="w-8 h-8 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full" style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }} />
          )}
        </div>
      </motion.aside>

      {/* Spacer for main content (desktop only) */}
      <motion.div
        animate={{ width: isCollapsed ? '72px' : '240px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block flex-shrink-0"
      />
    </>
  );
}
