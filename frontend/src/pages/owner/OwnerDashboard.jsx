import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Package, DollarSign, TrendingUp, Plus, Edit, Trash2, BarChart3, Store, Truck, XCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const fetchOwnerProfile = async () => {
    try {
      const res = await api.get(`/owners/user/${user.id}`);
      setOwner(res.data);
      fetchProducts(res.data.id);
      fetchAnalytics(res.data.id);
      fetchOrderItems(res.data.id);
    } catch (err) {
      console.error('Failed to resolve owner profile:', err);
      setLoading(false);
    }
  };

  const fetchProducts = async (ownerId) => {
    try {
      const res = await api.get(`/products/owner/${ownerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to grab products:', err);
    }
  };

  const fetchAnalytics = async (ownerId) => {
    try {
      const res = await api.get(`/owners/${ownerId}/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to grab analytics:', err);
    } 
  };

  const fetchOrderItems = async (ownerId) => {
    try {
      const res = await api.get(`/orders/owner/${ownerId}`);
      setOrderItems(res.data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error('Failed to get order items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(productId);
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      fetchAnalytics(owner.id);
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleShipItem = async (itemId) => {
    setProcessingOrder(itemId);
    try {
      await api.post(`/orders/items/${itemId}/ship`);
      fetchOrderItems(owner.id);
    } catch (err) {
      alert('Shipping failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleRejectItem = async (itemId) => {
    const reason = prompt('Reason for rejection (this will refund the user):');
    if (reason === null) return;
    setProcessingOrder(itemId);
    try {
      await api.post(`/orders/items/${itemId}/reject`, { reason });
      fetchOrderItems(owner.id);
      fetchAnalytics(owner.id); // update wallet
    } catch (err) {
      alert('Reject failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingOrder(null);
    }
  };

  const stats = [
    {
      label: 'Total Sales',
      value: `$${analytics?.totalSales?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'hsl(210, 100%, 56%)',
      bg: 'rgba(52, 152, 219, 0.12)',
    },
    {
      label: 'Wallet Balance',
      value: `$${analytics?.walletBalance?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'var(--primary)',
      bg: 'rgba(46, 204, 113, 0.12)',
    },
    {
      label: 'Total Products',
      value: analytics?.totalProducts || 0,
      icon: Package,
      color: 'var(--secondary)',
      bg: 'rgba(155, 89, 182, 0.12)',
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* Hero Header */}
      <div className="animate-slide-up" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.05), rgba(165, 82, 51, 0.03))',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--secondary-glow), transparent)',
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Store size={16} color="var(--secondary)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seller Dashboard</span>
          </div>
          <h1 style={{ 
            background: 'linear-gradient(135deg, var(--secondary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 800,
          }}>
            {owner ? owner.shopName : 'Shop Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Welcome back, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button id="nav-withdrawals" className="btn-secondary" onClick={() => navigate('/owner/withdrawals')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} /> Wallet
          </button>
          <button id="nav-add-product" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/owner/products/add')}>
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5rem' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: 'var(--secondary)', fontWeight: 600 }}>Loading Dashboard...</h3>
        </div>
      ) : (
        <div className="animate-slide-up">
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card stat-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="stat-icon" style={{ background: stat.bg }}>
                    <Icon size={28} color={stat.color} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem', fontWeight: 500 }}>{stat.label}</p>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{stat.value}</h2>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <button 
              className={`btn-secondary ${activeTab === 'products' ? '' : 'inactive-tab'}`}
              style={{ borderColor: activeTab === 'products' ? 'var(--secondary)' : 'transparent', color: activeTab === 'products' ? 'var(--secondary)' : 'var(--text-muted)', boxShadow: 'none' }}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} style={{ marginRight: '8px' }} />
              My Products
            </button>
            <button 
              className={`btn-secondary ${activeTab === 'orders' ? '' : 'inactive-tab'}`}
              style={{ borderColor: activeTab === 'orders' ? 'var(--secondary)' : 'transparent', color: activeTab === 'orders' ? 'var(--secondary)' : 'var(--text-muted)', boxShadow: 'none' }}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={18} style={{ marginRight: '8px' }} />
              Orders & History
              {orderItems.filter(o => (o.status || 'PENDING') === 'PENDING').length > 0 && (
                <span style={{ background: 'var(--danger)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', marginLeft: '8px' }}>
                  {orderItems.filter(o => (o.status || 'PENDING') === 'PENDING').length} New
                </span>
              )}
            </button>
          </div>

          {activeTab === 'products' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {products.map((product, idx) => (
                  <div key={product.id} className="glass-card animate-slide-up" style={{ 
                    padding: '0',
                    animationDelay: `${Math.min(idx * 0.06, 0.4)}s`,
                    opacity: deletingId === product.id ? 0.4 : 1,
                    transition: 'opacity 0.3s ease',
                  }}>
                    <div style={{ height: '180px', background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.05))', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', overflow: 'hidden' }}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Package size={40} color="var(--text-muted)" style={{ opacity: 0.4 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{product.name}</span>
                        <span style={{ 
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}>${product.price.toFixed(2)}</span>
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Stock: {product.stockQuantity}</p>
                      
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '9px', fontSize: '0.88rem' }}>
                          <Edit size={15} /> Edit
                        </button>
                        <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '9px', fontSize: '0.88rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingId === product.id}>
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="animate-fade-in" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 2rem' }}>
                    <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <h3>No products listed yet</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Click "New Product" to get started</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {orderItems.length === 0 ? (
                <div className="animate-fade-in glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 2rem' }}>
                  <Store size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <h3>No incoming orders yet</h3>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>When customers buy your products, they will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orderItems.map((item) => (
                    <div key={item.id} className="glass-card animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                           {item.product.imageUrl && <img src={item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8081${item.product.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.product.name} (x{item.quantity})</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subtotal: <strong style={{ color: 'var(--text-secondary)' }}>${item.subtotal.toFixed(2)}</strong></p>
                          {item.order && item.order.customerName && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                              <Store size={12} style={{ display: 'inline', marginRight: '4px' }} /> Ordered by: {item.order.customerName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {(item.status || 'PENDING').toUpperCase() === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-primary" 
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }} 
                              onClick={() => handleShipItem(item.id)}
                              disabled={processingOrder === item.id}>
                              <Truck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }}/> Ship
                            </button>
                            <button className="btn-secondary" 
                              style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} 
                              onClick={() => handleRejectItem(item.id)}
                              disabled={processingOrder === item.id}>
                              <XCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }}/> Reject
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                              background: (item.status || '').includes('REJECTED') ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                              color: (item.status || '').includes('REJECTED') ? 'var(--danger)' : 'var(--success)'
                            }}>
                              {(item.status || '').includes('REJECTED') ? <XCircle size={14}/> : <CheckCircle2 size={14}/>}
                              {item.status}
                            </span>
                            {item.deliveryDate && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Est. Delivery: {item.deliveryDate}</p>}
                            {item.rejectionReason && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Reason: {item.rejectionReason}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
