import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Search, ShoppingCart, Plus, Minus, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role');
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
    try {
      await api.post(`/carts/${customer.id}/add?productId=${productId}&quantity=1`);
      fetchCart(customer.id);
    } catch (err) {
      alert('Failed to add to cart: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Bar Navigation Add-on */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)' }}>Welcome, {user.name}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search groceries..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', width: '300px' }}
            />
          </div>
          <button className="btn-secondary" style={{ position: 'relative' }} onClick={() => navigate('/customer/cart')}>
            <ShoppingCart size={20} />
            {cart && cart.items?.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--accent)', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {cart.items.length}
              </span>
            )}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/customer/orders')}>My Orders</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '5rem' }}>
           <h2 className="animate-pulse" style={{ color: 'var(--primary)' }}>Loading fresh items...</h2>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="glass-card animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '150px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Tag size={40} color="var(--text-muted)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>{product.category}</span>
                <h3 style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {product.name}
                  <span style={{ color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{product.description || 'Fresh and organic.'}</p>
                <div style={{ fontSize: '0.8rem', color: product.stockQuantity > 0 ? 'var(--text-muted)' : '#ff7b72', marginBottom: '1rem' }}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                </div>
              </div>
              <button 
                className={product.stockQuantity > 0 ? "btn-primary" : "btn-secondary"} 
                onClick={() => handleAddToCart(product.id)}
                disabled={product.stockQuantity === 0}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>
              No products found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
