import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, CheckCircle2, XCircle, ArrowLeft, Wallet, TrendingDown } from 'lucide-react';

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
      const userRes = await api.get(`/owners/user/${user.id}`);
      const ownerId = userRes.data.id;
      
      const statRes = await api.get(`/owners/${ownerId}/analytics`);
      setWalletBalance(statRes.data.walletBalance);

      const histRes = await api.get(`/withdrawals/my`);
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
      fetchOwnerData();
    } catch (err) {
      alert('Withdrawal request failed: ' + (err.response?.data || err.message));
    } finally {
      setRequesting(false);
    }
  };

  const getStatusInfo = (status) => {
    if (status === 'APPROVED') return { color: 'var(--success)', icon: CheckCircle2, label: 'Approved' };
    if (status === 'REJECTED') return { color: 'var(--danger)', icon: XCircle, label: 'Rejected' };
    return { color: 'var(--accent)', icon: Clock, label: 'Pending' };
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
      <button className="btn-secondary animate-slide-left" onClick={() => navigate('/owner/dashboard')} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Wallet Balance Card */}
      <div className="glass-card animate-slide-up" style={{ 
        padding: '2.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.06), rgba(155, 89, 182, 0.04))',
        borderColor: 'rgba(46, 204, 113, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow), transparent)',
          opacity: 0.4,
          animation: 'float 5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <Wallet size={16} color="var(--primary)" /> Available Balance
          </p>
          <h1 style={{ 
            fontSize: '2.8rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}>${walletBalance.toFixed(2)}</h1>
        </div>
      </div>

      {/* Request Form */}
      <div className="glass-card animate-slide-up" style={{ padding: '2rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <TrendingDown size={18} color="var(--secondary)" /> Request Withdrawal
        </h3>
        <form onSubmit={handleRequest} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <DollarSign size={13} style={{ marginRight: '3px', verticalAlign: 'middle' }} /> Amount
            </label>
            <input 
              id="withdrawal-amount"
              type="number" 
              step="0.01" 
              className="input-field" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              max={walletBalance} 
              placeholder="0.00"
              required 
            />
          </div>
          <button id="submit-withdrawal" type="submit" className="btn-primary" style={{ padding: '14px 28px' }} disabled={requesting || walletBalance <= 0 || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}>
            {requesting ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} /> Processing...
              </>
            ) : 'Submit Request'}
          </button>
        </form>
      </div>

      <h2 style={{ 
        background: 'linear-gradient(135deg, var(--secondary), var(--primary-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1.5rem',
        fontWeight: 800,
      }}>Withdrawal History</h2>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading records...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <DollarSign size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No withdrawal history found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
           {withdrawals.map((w, idx) => {
             const statusInfo = getStatusInfo(w.status);
             const StatusIcon = statusInfo.icon;
             return (
               <div key={w.id} className="glass-card animate-slide-up" style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center', 
                 padding: '1.25rem 1.5rem',
                 animationDelay: `${Math.min(idx * 0.05, 0.3)}s`,
               }}>
                 <div>
                   <h3 style={{ 
                     marginBottom: '0.3rem', 
                     fontSize: '1.15rem',
                     fontWeight: 700,
                     background: 'linear-gradient(135deg, var(--text-main), var(--text-secondary))',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                   }}>${w.amount.toFixed(2)}</h3>
                   <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(w.requestDate).toLocaleString()}</p>
                 </div>
                 <div style={{ 
                   display: 'inline-flex', 
                   alignItems: 'center', 
                   gap: '0.35rem',
                   padding: '5px 14px',
                   borderRadius: 'var(--radius-pill)',
                   fontSize: '0.78rem',
                   fontWeight: 600,
                   color: statusInfo.color,
                   background: `${statusInfo.color}18`,
                   border: `1px solid ${statusInfo.color}30`,
                 }}>
                   <StatusIcon size={14} />
                   {statusInfo.label}
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
