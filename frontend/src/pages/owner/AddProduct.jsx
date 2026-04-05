import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: ''
  });
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
      await api.post(`/products/owner/${owner.id}`, formData);
      navigate('/owner/dashboard');
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={() => navigate('/owner/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="glass-card animate-slide-up" style={{ padding: '3rem' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={24} /> List New Product
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Product Name</label>
          <input type="text" className="input-field" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
          <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} rows={3} required />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Price ($)</label>
            <input type="number" step="0.01" className="input-field" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Stock Quantity</label>
            <input type="number" className="input-field" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
          <select className="input-field" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Meat">Meat & Poultry</option>
            <option value="Pantry">Pantry</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Image Path or URL (e.g. /uploads/apple.jpg or https://...)</label>
          <input type="text" className="input-field" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
          {loading ? 'Adding Product...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
}
