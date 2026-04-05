import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Shield, CheckCircle2, XCircle, Clock, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals/all');
      const sorted = res.data.sort((a,b) => b.id - a.id);
      setWithdrawals(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this withdrawal?`)) return;
    try {
      await api.post(`/withdrawals/${id}/${action}`);
      fetchWithdrawals();
    } catch (err) {
      alert(`Failed to ${action}: ` + (err.response?.data || err.message));
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle2 color="#2ecc71" size={18} />;
    if (status === 'REJECTED') return <XCircle color="#e74c3c" size={18} />;
    return <Clock color="#f1c40f" size={18} />;
  };

  const pendingCount = withdrawals.filter(w => w.status === 'PENDING').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Shield size={40} color="var(--accent)" />
          <div>
            <h1 style={{ color: 'var(--primary)' }}>Admin Center</h1>
            <p style={{ color: 'var(--text-muted)' }}>Platform Overview & Approvals</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <h2 style={{ color: 'var(--text-main)' }}>{user.name}</h2>
           <p style={{ color: 'var(--accent)' }}>System Administrator</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f1c40f' }}>
           <Clock size={40} color="#f1c40f" />
           <div>
              <h2>{pendingCount}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Pending Approvals</p>
           </div>
        </div>
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary)', animationDelay: '0.1s' }}>
           <UserCheck size={40} color="var(--primary)" />
           <div>
              <h2>{withdrawals.length}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Total Requests Processed</p>
           </div>
        </div>
      </div>

      <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Withdrawal Queue</h2>

      {loading ? (
        <p className="animate-pulse" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading platform data...</p>
      ) : withdrawals.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No withdrawal requests found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {withdrawals.map((w) => (
            <div key={w.id} className="glass-card animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Request #{w.id} • {new Date(w.requestDate).toLocaleString()}</p>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Owner ID: {w.ownerId} requested <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${w.amount.toFixed(2)}</span>
                </h3>
                {w.processedDate && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Processed: {new Date(w.processedDate).toLocaleString()}</p>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: w.status === 'APPROVED' ? '#2ecc71' : w.status === 'REJECTED' ? '#e74c3c' : '#f1c40f' }}>
                  {getStatusIcon(w.status)}
                  <span style={{ fontWeight: 600 }}>{w.status}</span>
                </div>
                
                {w.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" style={{ padding: '8px 16px', background: '#2ecc71', fontSize: '0.85rem' }} onClick={() => handleAction(w.id, 'approve')}>
                      Approve
                    </button>
                    <button className="btn-secondary" style={{ padding: '8px 16px', borderColor: '#e74c3c', color: '#e74c3c', fontSize: '0.85rem' }} onClick={() => handleAction(w.id, 'reject')}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
