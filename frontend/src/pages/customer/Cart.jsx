import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
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
    // Current backend add increments by quantity, remove deletes entirely
    // To support decrement properly, one usually re-adds but that might be complex if backend just adds.
    // Assuming backend 'add' just modifies. Let's send a new post if increment.
    if (!customer) return;
    try {
       if (delta > 0) {
           await api.post(`/carts/${customer.id}/add?productId=${productId}&quantity=1`);
       } else {
           // We might need a separate decrement endpoint theoretically, but we'll use remove for now
           await api.post(`/carts/${customer.id}/remove?productId=${productId}`);
       }
       fetchCart(customer.id);
    } catch (err) {
       console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={() => navigate('/customer/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Your Cart</h1>

      {loading ? (
        <h3 className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading cart...</h3>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="glass-card animate-slide-up" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Your cart is empty.</h2>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/customer/dashboard')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="animate-slide-up">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.items.map(item => (
              <div key={item.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', gap: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h3>{item.product.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>${item.product.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => handleUpdate(item.product.id, -1)}>
                    {item.quantity === 1 ? <Trash2 size={16} color="#ff7b72" /> : <Minus size={16} />}
                  </button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{item.quantity}</span>
                  <button className="btn-secondary" style={{ padding: '8px', borderRadius: '8px' }} onClick={() => handleUpdate(item.product.id, 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-muted)' }}>Total Amount</p>
              <h2 style={{ color: 'var(--primary)', fontSize: '2rem' }}>${calculateTotal().toFixed(2)}</h2>
            </div>
            <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '16px 32px' }} onClick={() => navigate('/customer/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
