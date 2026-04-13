import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Image, Layers, DollarSign, Hash, Type } from 'lucide-react';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const fetchOwnerProfile = async () => {
    try {
      const res = await api.get(`/owners/user/${user.id}`);
      setOwner(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!owner) return;
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('product', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      await api.post(`/products/owner/${owner.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/owner/dashboard');
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '620px', margin: '0 auto' }}>
      <button className="btn-secondary animate-slide-left" onClick={() => navigate('/owner/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="glass-card animate-slide-up" style={{ padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px var(--secondary-glow)',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <Package size={24} color="#fff" />
          </div>
          <h2 style={{ 
            background: 'linear-gradient(135deg, var(--secondary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem',
            fontWeight: 800,
          }}>List New Product</h2>
        </div>

        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Type size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Product Name
          </label>
          <input id="product-name" type="text" className="input-field" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Organic Bananas" required />
        </div>

        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>Description</label>
          <textarea id="product-desc" className="input-field" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe your product..." required />
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.4rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <DollarSign size={13} style={{ marginRight: '3px', verticalAlign: 'middle' }} /> Price
            </label>
            <input id="product-price" type="number" step="0.01" className="input-field" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <Hash size={13} style={{ marginRight: '3px', verticalAlign: 'middle' }} /> Stock
            </label>
            <input id="product-stock" type="number" className="input-field" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" required />
          </div>
        </div>

        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Layers size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Category
          </label>
          <select id="product-category" className="input-field" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Fruits">🍎 Fruits</option>
            <option value="Vegetables">🥦 Vegetables</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Bakery">🍞 Bakery</option>
            <option value="Meat">🥩 Meat & Poultry</option>
            <option value="Pantry">🫙 Pantry</option>
          </select>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <Image size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Upload Image
          </label>
          <input 
            id="product-image" 
            type="file" 
            accept="image/*"
            className="input-field" 
            onChange={(e) => setImageFile(e.target.files[0])} 
            style={{ padding: '10px' }}
          />
        </div>

        <button id="submit-product" type="submit" className="btn-primary" style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> Publishing...
            </>
          ) : (
            'Publish Product'
          )}
        </button>
      </form>
    </div>
  );
}
