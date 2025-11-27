import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div style={{ 
      padding: '3rem 2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Settings
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '1.1rem'
          }}>
            Customize your dashboard preferences and account settings
          </p>
        </div>
        <div style={{
          padding: '3rem',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          textAlign: 'center' as const
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.6)'
          }}>
            <SettingsIcon size={40} style={{ color: '#ffffff' }} />
          </div>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>Account Settings</h3>
          <p style={{ color: '#94a3b8' }}>Manage notifications, security, and application preferences.</p>
        </div>
      </div>
    </div>
  );
}
