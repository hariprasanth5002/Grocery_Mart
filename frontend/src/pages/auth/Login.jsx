import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await api.post('/auth/login', { email, password });
      const { token, user } = resp.data;
      const role = user?.role;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      if (role === 'CUSTOMER') navigate('/customer/dashboard');
      else if (role === 'OWNER') navigate('/owner/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '85vh',
      position: 'relative',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(165, 82%, 51%, 0.12), transparent)',
        top: '10%',
        right: '15%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(270, 68%, 60%, 0.1), transparent)',
        bottom: '15%',
        left: '10%',
        filter: 'blur(50px)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <form onSubmit={handleLogin} className="glass-card animate-slide-up" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '3rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 32px var(--primary-glow)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <LogIn size={28} color="#fff" />
          </div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, var(--text-main), var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to continue to FreshCart
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.85rem 1rem', 
            background: 'var(--danger-glow)', 
            border: '1px solid hsla(0, 78%, 62%, 0.3)', 
            color: 'hsl(0, 78%, 72%)', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '1.25rem', 
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideUp 0.3s ease',
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Email address
          </label>
          <input 
            id="login-email"
            type="email" 
            className="input-field" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
            required 
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Lock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Password
          </label>
          <input 
            id="login-password"
            type="password" 
            className="input-field" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
        </div>

        <button id="login-submit" type="submit" className="btn-primary" style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              Authenticating...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ 
            color: 'var(--primary)', 
            fontWeight: 600,
            transition: 'all 0.2s',
          }}>
            Create an account <Sparkles size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </p>
      </form>
    </div>
  );
}
