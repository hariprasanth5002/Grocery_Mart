import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

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
      const { token, role, user } = resp.data;
      
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
      <form onSubmit={handleRegister} className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.75rem' }}>Create Account</h2>
        
        {error && (
          <div style={{ padding: '0.75rem', background: '#e74c3c33', border: '1px solid #e74c3c', color: '#ff7b72', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button type="button" 
                  className={formData.role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'} 
                  style={{flex: 1}} 
                  onClick={() => setFormData({...formData, role: 'CUSTOMER'})}>
            Buyer
          </button>
          <button type="button" 
                  className={formData.role === 'OWNER' ? 'btn-primary' : 'btn-secondary'} 
                  style={{flex: 1}} 
                  onClick={() => setFormData({...formData, role: 'OWNER'})}>
            Seller
          </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
          <input type="text" className="input-field" name="name" onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
          <input type="email" className="input-field" name="email" onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
          <input type="password" className="input-field" name="password" onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone Number</label>
          <input type="text" className="input-field" name="phone" onChange={handleChange} required />
        </div>

        {formData.role === 'CUSTOMER' && (
          <div className="animate-slide-up">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Delivery Address</label>
              <input type="text" className="input-field" name="address" onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pincode</label>
              <input type="text" className="input-field" name="pincode" onChange={handleChange} required />
            </div>
          </div>
        )}

        {formData.role === 'OWNER' && (
          <div className="animate-slide-up">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Shop Name</label>
              <input type="text" className="input-field" name="shopName" onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Shop Address</label>
              <input type="text" className="input-field" name="shopAddress" onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Business Type</label>
              <input type="text" className="input-field" name="businessType" onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>GST Number (Optional)</label>
              <input type="text" className="input-field" name="gstNumber" onChange={handleChange} />
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
          {loading ? 'Registering...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
}
