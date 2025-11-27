import { User } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export default function Profile() {
  const { user } = useUser();

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
            Profile
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '1.1rem'
          }}>
            Manage your personal information and investment preferences
          </p>
        </div>
        <div style={{
          padding: '3rem',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem', 
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user?.fullName || 'User'}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
                }}
              />
            )}
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                {user?.fullName}
              </h2>
              <p style={{ color: '#94a3b8' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)'
            }}>
              <User size={40} style={{ color: '#ffffff' }} />
            </div>
            <p style={{ color: '#94a3b8' }}>Update your profile information, avatar, and investment goals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
