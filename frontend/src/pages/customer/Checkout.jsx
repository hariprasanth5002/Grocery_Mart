import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { CheckCircle2, CreditCard, Wallet, Shield, Sparkles } from 'lucide-react';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const res = await api.get(`/customers/user/${user.id}`);
      setCustomer(res.data);
      setAddress(res.data.address);
      fetchCart(res.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async (custId) => {
    try {
      const res = await api.get(`/orders/checkout/${custId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customer) return;
    setLoading(true);
    
    setTimeout(async () => {
      try {
        await api.post(`/orders/place/${customer.id}`, { address });
        setSuccess(true);
      } catch (err) {
        alert('Payment failed / Checkout error: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh' }}>
        <div className="glass-card animate-bounce-in" style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-glow), rgba(46, 204, 113, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <CheckCircle2 size={48} color="var(--primary)" />
          </div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
          }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
            Your order has been placed and is being processed. You'll receive updates soon.
          </p>
          <button id="view-orders-after-checkout" className="btn-primary" style={{ padding: '14px 32px' }} onClick={() => navigate('/customer/orders')}>
            <Sparkles size={16} style={{ marginRight: '6px' }} /> View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 className="animate-slide-up" style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <Shield size={28} color="var(--primary)" /> Secure Checkout
      </h1>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          📍 Delivery Address
        </h3>
        <textarea id="checkout-address" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="Enter your delivery address" />
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem', animationDelay: '0.1s' }}>
        <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>
          💳 Payment Method <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 500, marginLeft: '0.5rem' }}>(Mock Simulation)</span>
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { id: 'CREDIT_CARD', icon: CreditCard, label: 'Card / Debit', color: 'var(--info)' },
            { id: 'UPI', icon: Wallet, label: 'UPI / Wallet', color: 'var(--secondary)' },
          ].map(method => (
            <div 
              key={method.id}
              id={`payment-${method.id.toLowerCase()}`}
              style={{ 
                flex: 1, 
                padding: '1.5rem', 
                border: `2px solid ${paymentMethod === method.id ? method.color : 'var(--glass-border)'}`, 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer', 
                textAlign: 'center',
                background: paymentMethod === method.id ? `${method.color}11` : 'transparent',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setPaymentMethod(method.id)}
            >
              <method.icon size={32} style={{ marginBottom: '0.75rem', color: paymentMethod === method.id ? method.color : 'var(--text-muted)', transition: 'color 0.3s' }} />
              <p style={{ fontWeight: 600, color: paymentMethod === method.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{method.label}</p>
            </div>
          ))}
        </div>
      </div>

      {cart && (
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', animationDelay: '0.2s' }}>
          <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>🧾 Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Platform Fee</span>
              <span style={{ color: 'var(--success)' }}>Free ✨</span>
            </p>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total to Pay</span>
              <span style={{ 
                fontSize: '1.6rem', 
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <button id="place-order-btn" className="btn-primary" style={{ 
            width: '100%', 
            padding: '1rem', 
            fontSize: '1.15rem', 
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }} disabled={loading} onClick={handlePlaceOrder}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                Processing Payment...
              </>
            ) : (
              <>
                <Shield size={18} /> Pay ${cart.totalAmount?.toFixed(2) || '0.00'} Now
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
