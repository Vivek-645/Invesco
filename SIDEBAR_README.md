# Modern Collapsible Sidebar - Implementation Guide

## 🎯 Overview

A production-ready, accessible, and animated collapsible sidebar component for React + TypeScript dashboards with React Router integration.

## ✨ Features

- ✅ **Smooth Animations** - Powered by Framer Motion
- ✅ **Active Route Highlighting** - NavLink integration with visual feedback
- ✅ **Collapse/Expand** - Persistent state via localStorage
- ✅ **Responsive Design** - Desktop fixed sidebar + mobile drawer with backdrop
- ✅ **Accessibility** - Keyboard navigation, ARIA labels, focus management
- ✅ **Tooltips** - Show labels when collapsed (hover)
- ✅ **Badge Support** - Notification badges on menu items
- ✅ **Keyboard Shortcut** - Ctrl+B (or Cmd+B) to toggle
- ✅ **Modern UI** - Tailwind CSS styling with gradient accents

## 📦 Dependencies

```bash
npm install react-icons framer-motion react-router-dom
```

## 🚀 Quick Start

### 1. Import and Use in App.tsx

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
// ... other imports

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### 2. Update Your Dashboard Layout

Remove any existing sidebar/header navigation and let the Sidebar component handle it:

```tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Optional: Top header with user info */}
      <header className="sticky top-0 bg-white border-b px-8 py-4">
        <h1>Dashboard Title</h1>
      </header>
      
      {/* Your dashboard content */}
      <main className="p-8">
        {/* Dashboard widgets, charts, etc. */}
      </main>
    </div>
  );
}
```

## 🎨 Customization

### Adding New Routes

Edit `Sidebar.tsx` and modify the `routes` array:

```tsx
const routes: SidebarRoute[] = [
  { path: '/dashboard', label: 'Overview', icon: <MdDashboard size={24} /> },
  { path: '/analytics', label: 'Analytics', icon: <MdShowChart size={24} /> },
  { path: '/reports', label: 'Reports', icon: <MdDescription size={24} />, badge: 3 },
  { path: '/new-page', label: 'New Page', icon: <MdNewIcon size={24} /> }, // Add here
];
```

### Changing Colors

The sidebar uses Tailwind classes. To change the theme:

```tsx
// Active route gradient (lines ~170-175)
bg-gradient-to-r from-blue-500 to-purple-600  // Change colors here

// Hover states
hover:bg-gray-100  // Change hover background

// Logo/brand colors (lines ~130-135)
from-blue-500 to-purple-600  // Brand gradient
```

### Adjusting Width

```tsx
// In Sidebar.tsx, line ~122
animate={{
  width: isCollapsed ? '72px' : '240px',  // Change these values
}}
```

## ⌨️ Keyboard Navigation

- **Tab** - Navigate between menu items
- **Enter/Space** - Activate focused item
- **Ctrl+B** (Cmd+B on Mac) - Toggle sidebar
- **Arrow Keys** - Navigate (native browser behavior)

## 📱 Responsive Behavior

### Desktop (≥768px)
- Sidebar is fixed on the left
- Main content adjusts automatically
- Collapse/expand changes sidebar width

### Mobile (<768px)
- Sidebar is hidden by default
- Menu button (top-left) opens drawer
- Dark backdrop when open
- Closes automatically on route change

## 🔧 State Management

### LocalStorage Persistence

The sidebar automatically persists its collapsed/expanded state:

```tsx
// Key: 'sidebar-collapsed'
// Value: true | false
```

Clear it programmatically:
```tsx
localStorage.removeItem('sidebar-collapsed');
```

### Exporting State (Optional)

To use sidebar state in other components, convert to Context:

```tsx
// SidebarContext.tsx
export const SidebarContext = createContext({ isCollapsed: false });

// In Sidebar.tsx
<SidebarContext.Provider value={{ isCollapsed }}>
  {/* sidebar content */}
</SidebarContext.Provider>

// In other components
const { isCollapsed } = useContext(SidebarContext);
```

## 🎯 Accessibility Checklist

- ✅ ARIA labels on interactive elements
- ✅ `aria-expanded` on toggle button
- ✅ Keyboard focus visible (blue ring)
- ✅ Logical tab order
- ✅ Tooltips accessible via hover and focus
- ✅ Semantic HTML (`<nav>`, `<button>`, etc.)
- ✅ Screen reader friendly

## 🧪 Testing

### Manual Testing Checklist

1. ✅ Click toggle button collapses/expands sidebar
2. ✅ Refresh page maintains collapsed state
3. ✅ Active route is highlighted correctly
4. ✅ Mobile menu opens/closes with button
5. ✅ Backdrop click closes mobile menu
6. ✅ Route change closes mobile menu
7. ✅ Ctrl+B keyboard shortcut works
8. ✅ Tooltips show on hover when collapsed
9. ✅ Badges display correctly
10. ✅ Focus visible when tabbing

### Unit Test Example (Optional)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

test('sidebar toggles on button click', () => {
  render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
  
  const toggleBtn = screen.getByLabelText(/expand sidebar|collapse sidebar/i);
  fireEvent.click(toggleBtn);
  
  // Check if state changed (implementation-specific assertion)
});
```

## 🐛 Troubleshooting

### Issue: Sidebar not showing
**Solution:** Ensure BrowserRouter wraps your App and Tailwind CSS is configured.

### Issue: Routes not working
**Solution:** Check that React Router is installed and routes are defined in App.tsx.

### Issue: Tooltips not appearing
**Solution:** Tooltips only show when sidebar is collapsed. Try collapsing first.

### Issue: Mobile menu not closing
**Solution:** Verify route changes are triggering the useEffect (line ~76).

### Issue: Icons not showing
**Solution:** Install react-icons: `npm install react-icons`

## 📊 Performance Notes

- **Framer Motion** adds ~45KB gzipped
- **React Icons** tree-shakes unused icons
- **LocalStorage** operations are synchronous but fast (<1ms)
- **Animation duration:** 300ms (configurable on line ~122)

## 🎨 Design Inspiration

- Modern SaaS dashboards (Vercel, Linear, Notion)
- Material Design navigation patterns
- Apple macOS sidebar aesthetics
- Tailwind UI components

## 📝 File Structure

```
src/
├── components/
│   └── Sidebar.tsx          # Main sidebar component (300+ lines)
├── pages/
│   ├── Dashboard.tsx        # Example page
│   ├── Analytics.tsx        # Example page
│   ├── Reports.tsx          # Example page
│   ├── Settings.tsx         # Example page
│   └── Profile.tsx          # Example page
└── App.tsx                  # Router setup
```

## 🔮 Future Enhancements

Consider adding:
- Dark mode support
- Nested menu items (accordion)
- Search functionality
- Drag-to-resize
- Custom animations per route
- Multi-level menus
- Pinning favorite routes

## 📄 License

Free to use in your projects. Attribution appreciated but not required.

---

**Questions?** Check the inline comments in `Sidebar.tsx` for detailed explanations of each section.
