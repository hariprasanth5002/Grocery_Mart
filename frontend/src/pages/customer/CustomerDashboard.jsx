import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Search, ShoppingCart, Plus, Tag, Leaf, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const res = await api.get(`/customers/user/${user.id}`);
      setCustomer(res.data);
      fetchCart(res.data.id);
    } catch (err) {
      console.error("Failed to load customer profile", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (custId) => {
    try {
      const res = await api.get(`/carts/${custId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!customer) return;
    setAddingId(productId);
    try {
      await api.post(`/carts/${customer.id}/add?productId=${productId}&quantity=1`);
      fetchCart(customer.id);
    } catch (err) {
      alert('Failed to add to cart: ' + (err.response?.data?.message || err.message));
    } finally {
      setTimeout(() => setAddingId(null), 300);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const cartItemCount = cart?.items?.length || 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* Hero Header */}
      <div className="animate-slide-up" style={{ 
        marginBottom: '2.5rem',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(165, 82, 51, 0.05), rgba(270, 68, 60, 0.03))',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-20px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow), transparent)',
          opacity: 0.3,
          animation: 'float 5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Leaf size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fresh & Organic</span>
            </div>
            <h1 style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem',
              fontWeight: 800,
            }}>
              Welcome, {user.name} 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Discover fresh groceries delivered to your door</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', top: 13, left: 14, color: 'var(--text-muted)' }} size={18} />
              <input 
                id="product-search"
                type="text" 
                placeholder="Search groceries..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.75rem', width: '280px' }}
              />
            </div>
            <button id="nav-cart" className="btn-secondary animate-wiggle" style={{ position: 'relative', padding: '12px 16px' }} onClick={() => navigate('/customer/cart')}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: -6, 
                  right: -6, 
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: 22, 
                  height: 22, 
                  fontSize: 11, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px var(--primary-glow)',
                  animation: 'bounceIn 0.4s ease',
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
            <button id="nav-orders" className="btn-secondary" onClick={() => navigate('/customer/orders')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} /> My Orders
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '5rem' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading fresh items...</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map((product, idx) => (
            <div key={product.id} className="glass-card animate-slide-up" style={{ 
              padding: '0', 
              display: 'flex', 
              flexDirection: 'column',
              animationDelay: `${Math.min(idx * 0.06, 0.4)}s`,
            }}>
              {/* Image container */}
              <div style={{ 
                height: '170px', 
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.05))', 
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0', 
                overflow: 'hidden', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                position: 'relative',
              }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <Tag size={40} color="var(--text-muted)" />
                )}
                {/* Category badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.72rem',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {product.category}
                </span>
                {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(231, 76, 60, 0.85)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.7rem',
                    color: '#fff',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <Zap size={10} /> Low Stock
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.3rem', fontSize: '1.05rem', fontWeight: 700 }}>
                  {product.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '1rem', lineHeight: 1.4, flex: 1 }}>
                  {product.description || 'Fresh and organic premium quality.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ 
                    fontSize: '1.35rem', 
                    fontWeight: 800, 
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>${product.price.toFixed(2)}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: product.stockQuantity > 0 ? 'var(--text-muted)' : 'var(--danger)',
                    fontWeight: 500,
                  }}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                  </span>
                </div>
                <button 
                  id={`add-to-cart-${product.id}`}
                  className={product.stockQuantity > 0 ? "btn-primary" : "btn-secondary"} 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stockQuantity === 0 || addingId === product.id}
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '11px',
                    fontSize: '0.9rem',
                    transform: addingId === product.id ? 'scale(0.96)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  {addingId === product.id ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="animate-fade-in" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '5rem 2rem' }}>
              <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <h3>No products found matching "{search}"</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
