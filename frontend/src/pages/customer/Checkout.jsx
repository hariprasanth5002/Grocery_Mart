import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { CheckCircle2, CreditCard, Wallet, AlertCircle } from 'lucide-react';

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
      const res = await api.get(`/orders/checkout/${custId}`); // Based on existing OrderController
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customer) return;
    setLoading(true);
    
    // Simulate payment processing time
    setTimeout(async () => {
      try {
        await api.post(`/orders/place/${customer.id}`, { address });
        setSuccess(true);
      } catch (err) {
        alert('Payment failed / Checkout error: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }, 1500); // realistic mock delay
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-card animate-slide-up" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle2 size={80} color="var(--primary)" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your order has been placed and is being processed.</p>
          <button className="btn-primary" onClick={() => navigate('/customer/orders')}>View My Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Checkout securely</h1>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
         <h3 style={{ marginBottom: '1rem' }}>Delivery Address</h3>
         <textarea className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
         <h3 style={{ marginBottom: '1rem' }}>Payment Method <span style={{fontSize: '0.8rem', color: 'var(--accent)'}}>(Mock Simulation)</span></h3>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <div 
              style={{ flex: 1, padding: '1.5rem', border: `2px solid ${paymentMethod === 'CREDIT_CARD' ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center' }}
              onClick={() => setPaymentMethod('CREDIT_CARD')}
            >
              <CreditCard size={32} style={{ marginBottom: '1rem', color: paymentMethod === 'CREDIT_CARD' ? 'var(--primary)' : 'var(--text-muted)' }} />
              <p>Card/Debit</p>
            </div>
            <div 
              style={{ flex: 1, padding: '1.5rem', border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center' }}
              onClick={() => setPaymentMethod('UPI')}
            >
              <Wallet size={32} style={{ marginBottom: '1rem', color: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-muted)' }} />
              <p>UPI / Wallet</p>
            </div>
         </div>
      </div>

      {cart && (
        <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Platform Fee (Mock)</span>
            <span>$0.00</span>
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
          <h2 style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
            <span>Total to Pay</span>
            <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
          </h2>

          <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '2rem' }} disabled={loading} onClick={handlePlaceOrder}>
            {loading ? 'Processing Payment...' : `Pay $${cart.totalAmount?.toFixed(2) || '0.00'} Now`}
          </button>
        </div>
      )}
    </div>
  );
}
