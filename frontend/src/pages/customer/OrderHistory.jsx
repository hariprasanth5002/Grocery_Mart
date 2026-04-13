import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Package, Calendar, MapPin, ArrowLeft, Clock, CheckCircle2, Truck } from 'lucide-react';

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
      const sorted = res.data.sort((a,b) => b.id - a.id);
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const s = (status || 'PROCESSING').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') return { color: 'var(--success)', icon: CheckCircle2, label: s };
    if (s === 'SHIPPED' || s === 'IN_TRANSIT') return { color: 'var(--info)', icon: Truck, label: s };
    return { color: 'var(--accent)', icon: Clock, label: s };
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn-secondary animate-slide-left" onClick={() => navigate('/customer/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        Order History
      </h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5rem' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: 'var(--text-muted)' }}>Loading your orders...</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card animate-bounce-in" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <Package size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
          <h2 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start shopping to see your orders here</p>
          <button className="btn-primary" onClick={() => navigate('/customer/dashboard')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order, idx) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={order.id} className="glass-card animate-slide-up" style={{ padding: '2rem', animationDelay: `${Math.min(idx * 0.08, 0.4)}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                      <Package size={20} color="var(--primary)" /> Order #{order.id}
                    </h3>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} /> {order.customerName}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '5px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: statusInfo.color,
                      background: `${statusInfo.color}18`,
                      border: `1px solid ${statusInfo.color}30`,
                      marginBottom: '0.5rem',
                    }}>
                      <StatusIcon size={14} /> {statusInfo.label}
                    </div>
                    <h3 style={{ 
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                    }}>${order.totalAmount.toFixed(2)}</h3>
                  </div>
                </div>

                <hr />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.orderItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05))', 
                          borderRadius: 'var(--radius-xs)',
                          overflow: 'hidden',
                        }}>
                          {item.product.imageUrl && (
                            <img src={item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8081${item.product.imageUrl}`} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {item.product.name}
                            {item.status && item.status.toUpperCase() !== 'PENDING' && (
                              <span style={{
                                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                                background: item.status.includes('REJECTED') ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
                                color: item.status.includes('REJECTED') ? 'var(--danger)' : 'var(--success)'
                              }}>
                                {item.status}
                              </span>
                            )}
                          </p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity}
                            {item.deliveryDate && <span> • Arriving: {item.deliveryDate}</span>}
                            {item.rejectionReason && <span> • Reason: {item.rejectionReason}</span>}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
