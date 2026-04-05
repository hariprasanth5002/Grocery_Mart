import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      // Fetch balance from analytics
      const userRes = await api.get(`/owners/user/${user.id}`);
      const ownerId = userRes.data.id;
      
      const statRes = await api.get(`/owners/${ownerId}/analytics`);
      setWalletBalance(statRes.data.walletBalance);

      // Fetch withdrawal history
      const histRes = await api.get(`/withdrawals/my`);
      // Sort newest first
      const sorted = histRes.data.sort((a,b) => b.id - a.id);
      setWithdrawals(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) > walletBalance) {
      return alert("Insufficient balance.");
    }
    setRequesting(true);
    try {
      await api.post('/withdrawals/request', { amount: parseFloat(amount) });
      setAmount('');
      fetchOwnerData(); // refresh data
    } catch (err) {
      alert('Withdrawal request failed: ' + (err.response?.data || err.message));
    } finally {
      setRequesting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle2 color="#2ecc71" size={18} />;
    if (status === 'REJECTED') return <XCircle color="#e74c3c" size={18} />;
    return <Clock color="#f1c40f" size={18} />;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={() => navigate('/owner/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(46, 204, 113, 0.1)', borderColor: 'rgba(46, 204, 113, 0.3)' }}>
         <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <DollarSign size={16} color="var(--primary)" /> Available Wallet Balance
            </p>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>${walletBalance.toFixed(2)}</h1>
         </div>
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Request Withdrawal</h3>
        <form onSubmit={handleRequest} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Amount ($)</label>
            <input 
              type="number" 
              step="0.01" 
              className="input-field" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              max={walletBalance} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={requesting || walletBalance <= 0 || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}>
            {requesting ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Withdrawal History</h2>
      
      {loading ? (
        <p className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading records...</p>
      ) : withdrawals.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
          No withdrawal history found.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           {withdrawals.map((w) => (
             <div key={w.id} className="glass-card animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>${w.amount.toFixed(2)}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(w.requestDate).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: w.status === 'APPROVED' ? '#2ecc71' : w.status === 'REJECTED' ? '#e74c3c' : '#f1c40f' }}>
                   {getStatusIcon(w.status)}
                   <span style={{ fontWeight: 600 }}>{w.status}</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
