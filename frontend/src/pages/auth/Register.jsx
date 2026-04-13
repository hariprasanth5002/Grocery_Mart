import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { UserPlus, ShoppingBag, Store, Mail, Lock, Phone, MapPin, Building2, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'CUSTOMER',
    address: '', pincode: '',
    shopName: '', shopAddress: '', businessType: '', gstNumber: '', bankDetails: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await api.post('/auth/register', formData);
      const { token, user } = resp.data;
      const role = user?.role;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      if (role === 'CUSTOMER') navigate('/customer/dashboard');
      else if (role === 'OWNER') navigate('/owner/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
      padding: '2rem 1rem',
      position: 'relative',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(270, 68%, 60%, 0.1), transparent)',
        top: '5%',
        left: '5%',
        filter: 'blur(60px)',
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(165, 82%, 51%, 0.08), transparent)',
        bottom: '10%',
        right: '8%',
        filter: 'blur(50px)',
        animation: 'float 9s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <form onSubmit={handleRegister} className="glass-card animate-slide-up" style={{ 
        width: '100%', 
        maxWidth: '520px', 
        padding: '3rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 32px var(--secondary-glow)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <UserPlus size={28} color="#fff" />
          </div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, var(--text-main), var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join FreshCart today
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
            animation: 'slideUp 0.3s ease',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Role Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <button type="button" 
            id="register-role-customer"
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${formData.role === 'CUSTOMER' ? 'var(--primary)' : 'var(--glass-border)'}`,
              background: formData.role === 'CUSTOMER' ? 'var(--primary-glow)' : 'transparent',
              color: formData.role === 'CUSTOMER' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
            onClick={() => setFormData({...formData, role: 'CUSTOMER'})}>
            <ShoppingBag size={22} />
            Buyer
          </button>
          <button type="button" 
            id="register-role-owner"
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: `2px solid ${formData.role === 'OWNER' ? 'var(--secondary)' : 'var(--glass-border)'}`,
              background: formData.role === 'OWNER' ? 'var(--secondary-glow)' : 'transparent',
              color: formData.role === 'OWNER' ? 'var(--secondary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
            onClick={() => setFormData({...formData, role: 'OWNER'})}>
            <Store size={22} />
            Seller
          </button>
        </div>

        {/* Common Fields */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Full Name</label>
          <input id="register-name" type="text" className="input-field" name="name" onChange={handleChange} placeholder="John Doe" required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Mail size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Email
          </label>
          <input id="register-email" type="email" className="input-field" name="email" onChange={handleChange} placeholder="you@example.com" required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Lock size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Password
          </label>
          <input id="register-password" type="password" className="input-field" name="password" onChange={handleChange} placeholder="Min 6 characters" required />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Phone size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Phone
          </label>
          <input id="register-phone" type="text" className="input-field" name="phone" onChange={handleChange} placeholder="+91 98765 43210" required />
        </div>

        {/* Customer fields */}
        {formData.role === 'CUSTOMER' && (
          <div className="animate-slide-up" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', marginBottom: '0.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <MapPin size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Delivery Address
              </label>
              <input id="register-address" type="text" className="input-field" name="address" onChange={handleChange} placeholder="123 Main St" required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pincode</label>
              <input id="register-pincode" type="text" className="input-field" name="pincode" onChange={handleChange} placeholder="600001" required />
            </div>
          </div>
        )}

        {/* Owner fields */}
        {formData.role === 'OWNER' && (
          <div className="animate-slide-up" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', marginBottom: '0.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Store size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Shop Name
              </label>
              <input id="register-shopname" type="text" className="input-field" name="shopName" onChange={handleChange} placeholder="Fresh Mart" required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <MapPin size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Shop Address
              </label>
              <input id="register-shopaddress" type="text" className="input-field" name="shopAddress" onChange={handleChange} placeholder="456 Market St" required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <Building2 size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Business Type
              </label>
              <input id="register-businesstype" type="text" className="input-field" name="businessType" onChange={handleChange} placeholder="Grocery / Organic" required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                <FileText size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />GST Number (Optional)
              </label>
              <input id="register-gst" type="text" className="input-field" name="gstNumber" onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
            </div>
          </div>
        )}

        <button id="register-submit" type="submit" className="btn-primary" style={{ 
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
              Creating Account...
            </>
          ) : (
            <>
              Create Account <ArrowRight size={18} />
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in <Sparkles size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </p>
      </form>
    </div>
  );
}
