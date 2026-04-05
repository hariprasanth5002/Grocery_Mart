import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Package, Calendar, MapPin, ArrowLeft } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const res = await api.get(`/customers/user/${user.id}`);
      fetchOrders(res.data.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchOrders = async (custId) => {
    try {
      const res = await api.get(`/orders/customer/${custId}`);
      // Sort orders by ID descending (newest first realistically)
      const sorted = res.data.sort((a,b) => b.id - a.id);
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={() => navigate('/customer/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Order History</h1>

      {loading ? (
        <h3 className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading your orders...</h3>
      ) : orders.length === 0 ? (
        <div className="glass-card animate-slide-up" style={{ padding: '4rem', textAlign: 'center' }}>
          <Package size={60} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--text-muted)' }}>No orders found.</h2>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/customer/dashboard')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order, idx) => (
            <div key={order.id} className="glass-card animate-slide-up" style={{ padding: '2rem', animationDelay: `${idx * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={20} color="var(--primary)" /> Order #{order.id}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> {new Date(order.orderDate).toLocaleDateString()}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {order.customerName}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' }}>
                      {order.status || 'PROCESSING'}
                   </div>
                   <h3 style={{ color: 'var(--text-main)' }}>${order.totalAmount.toFixed(2)}</h3>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.orderItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '50px', height: '50px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                        {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500 }}>{item.product.name}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
