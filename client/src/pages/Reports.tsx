import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div style={{ 
      padding: '3rem 2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Reports
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '1.1rem'
            }}>
              Generate and download comprehensive investment reports
            </p>
          </div>
          <span style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
            color: '#ffffff',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: '700',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
          }}>
            3 new
          </span>
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
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)'
          }}>
            <FileText size={40} style={{ color: '#ffffff' }} />
          </div>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>Custom Reports</h3>
          <p style={{ color: '#94a3b8' }}>Create and export detailed portfolio reports with custom date ranges.</p>
        </div>
      </div>
    </div>
  );
}
