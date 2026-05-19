'use client';

import { useState } from 'react';

export default function ProgramPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const CORRECT_PASSWORD = 'Xk7Qm9Pz2R';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Nesprávné heslo');
    }
  };

  if (isAuthenticated) {
    return (
      <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <iframe
          src="/podniky-bez-webu-program.html"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Podniky bez webu"
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030303',
      padding: '1rem'
    }}>
      <div style={{
        background: '#0e0e0e',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#f2f0ed',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px'
        }}>
          Program
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#666',
          marginBottom: '1.5rem',
          fontFamily: 'monospace'
        }}>
          Zadejte heslo pro přístup
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            style={{
              width: '100%',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#f2f0ed',
              padding: '12px 14px',
              fontSize: '14px',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
          />
          {error && (
            <p style={{
              color: '#ef4444',
              fontSize: '12px',
              marginBottom: '1rem',
              fontFamily: 'monospace'
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6d28d9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#7c3aed'}
          >
            Otevřít
          </button>
        </form>
      </div>
    </div>
  );
}
