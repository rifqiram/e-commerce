'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for register
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = type === 'login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check role
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(returnUrl);
      }
      
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && <div style={{ color: 'red', background: '#ffebee', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
      
      {type === 'register' && (
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
          <input 
            type="text" value={name} onChange={e => setName(e.target.value)} required 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} 
          />
        </div>
      )}
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
        <input 
          type="email" value={email} onChange={e => setEmail(e.target.value)} required 
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} 
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
        <input 
          type="password" value={password} onChange={e => setPassword(e.target.value)} required 
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }} 
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', marginTop: '0.5rem', width: '100%' }}>
        {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
}
