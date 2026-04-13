import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const res = await api.get(`/customers/user/${user.id}`);
      setCustomer(res.data);
      fetchCart(res.data.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCart = async (custId) => {
    try {
      const res = await api.get(`/carts/${custId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId, delta) => {
    if (!customer) return;
    setUpdatingId(productId);
    try {
       if (delta > 0) {
           await api.post(`/carts/${customer.id}/add?productId=${productId}&quantity=1`);
       } else {
           await api.post(`/carts/${customer.id}/remove?productId=${productId}`);
       }
       fetchCart(customer.id);
    } catch (err) {
       console.error(err);
    } finally {
       setTimeout(() => setUpdatingId(null), 200);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      <button id="back-to-shop" className="btn-secondary animate-slide-left" onClick={() => navigate('/customer/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <h1 className="animate-slide-up" style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: 800,
      }}>
        Your Cart
      </h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5rem' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: 'var(--text-muted)' }}>Loading cart...</h3>
        </div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="glass-card animate-bounce-in" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <h2 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add some fresh items to get started</p>
          <button className="btn-primary" onClick={() => navigate('/customer/dashboard')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="animate-slide-up">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cart.items.map((item, idx) => (
              <div key={item.id} className="glass-card" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.25rem 1.5rem', 
                gap: '1.5rem',
                animationDelay: `${idx * 0.05}s`,
                transition: 'all 0.3s ease',
                opacity: updatingId === item.product.id ? 0.6 : 1,
              }}>
                <div style={{ 
                  width: '72px', 
                  height: '72px', 
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.1))', 
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8081${item.product.imageUrl}`} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.product.name}</h3>
                  <p style={{ 
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700, 
                    fontSize: '1.05rem',
                    marginTop: '0.25rem',
                  }}>${item.product.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: 'var(--radius-sm)', minWidth: '36px' }} onClick={() => handleUpdate(item.product.id, -1)}>
                    {item.quantity === 1 ? <Trash2 size={15} color="var(--danger)" /> : <Minus size={15} />}
                  </button>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: 'var(--radius-sm)', minWidth: '36px' }} onClick={() => handleUpdate(item.product.id, 1)}>
                    <Plus size={15} />
                  </button>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', minWidth: '80px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Footer */}
          <div className="glass-card" style={{ 
            marginTop: '2rem', 
            padding: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(20,18,30,0.9), var(--bg-card))',
            borderColor: 'rgba(255,255,255,0.1)',
          }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Amount</p>
              <h2 style={{ 
                fontSize: '2.2rem', 
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
              }}>${calculateTotal().toFixed(2)}</h2>
            </div>
            <button id="proceed-checkout" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }} onClick={() => navigate('/customer/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
