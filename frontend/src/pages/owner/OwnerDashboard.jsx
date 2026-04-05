import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Package, DollarSign, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      fetchAnalytics(owner.id); // Refresh analytics count
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)' }}>{owner ? owner.shopName : 'Shop Dashboard'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/owner/withdrawals')}>Wallet / Withdrawals</button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/owner/products/add')}>
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {loading ? (
        <h3 className="animate-pulse" style={{ color: 'var(--primary)', textAlign: 'center', marginTop: '5rem' }}>Loading Dashboard...</h3>
      ) : (
        <div className="animate-slide-up">
          {/* STATS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(52, 152, 219, 0.2)', borderRadius: 'var(--radius-pill)' }}>
                <TrendingUp size={32} color="#3498db" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Sales (Est)</p>
                <h2 style={{ fontSize: '2rem' }}>${analytics?.totalSales?.toFixed(2) || '0.00'}</h2>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(46, 204, 113, 0.2)', borderRadius: 'var(--radius-pill)' }}>
                <DollarSign size={32} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Wallet Balance</p>
                <h2 style={{ fontSize: '2rem' }}>${analytics?.walletBalance?.toFixed(2) || '0.00'}</h2>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(155, 89, 182, 0.2)', borderRadius: 'var(--radius-pill)' }}>
                <Package size={32} color="#9b59b6" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Products</p>
                <h2 style={{ fontSize: '2rem' }}>{analytics?.totalProducts || 0}</h2>
              </div>
            </div>
          </div>

          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Your Products</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', overflow: 'hidden' }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Package size={40} color="var(--text-muted)" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    {product.name}
                    <span style={{ color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Stock: {product.stockQuantity}</p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '10px' }}>
                      <Edit size={16} /> Edit
                    </button>
                    <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '10px', borderColor: '#ff7b72', color: '#ff7b72' }} onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
                You haven't listed any products yet.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
