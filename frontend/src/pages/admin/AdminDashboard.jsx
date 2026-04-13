import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Shield, CheckCircle2, XCircle, Clock, UserCheck, AlertTriangle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
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
    setProcessingId(id);
    try {
      await api.post(`/withdrawals/${id}/${action}`);
      fetchWithdrawals();
    } catch (err) {
      alert(`Failed to ${action}: ` + (err.response?.data || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusInfo = (status) => {
    if (status === 'COMPLETED' || status === 'APPROVED') return { color: 'var(--success)', icon: CheckCircle2, label: 'Approved' };
    if (status === 'REJECTED') return { color: 'var(--danger)', icon: XCircle, label: 'Rejected' };
    return { color: 'var(--accent)', icon: Clock, label: 'Pending' };
  };

  const pendingCount = withdrawals.filter(w => w.status === 'PENDING').length;
  const approvedCount = withdrawals.filter(w => w.status === 'COMPLETED' || w.status === 'APPROVED').length;
  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  const stats = [
    { label: 'Pending Approvals', value: pendingCount, icon: Clock, color: 'var(--accent)', bg: 'rgba(38, 100, 64, 0.08)', borderColor: 'var(--accent)' },
    { label: 'Approved Requests', value: approvedCount, icon: CheckCircle2, color: 'var(--success)', bg: 'rgba(46, 204, 113, 0.08)', borderColor: 'var(--success)' },
    { label: 'Total Volume', value: `$${totalAmount.toFixed(2)}`, icon: BarChart3, color: 'var(--info)', bg: 'rgba(52, 152, 219, 0.08)', borderColor: 'var(--info)' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Hero Header */}
      <div className="animate-slide-up" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        padding: '2rem 2.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(155, 89, 182, 0.04))',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-20px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(210, 100%, 56%, 0.1), transparent)',
          animation: 'float 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--info), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)',
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ 
              background: 'linear-gradient(135deg, var(--info), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.8rem',
              fontWeight: 800,
            }}>Admin Center</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Platform Overview & Approvals</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ color: 'var(--text-main)', fontWeight: 700 }}>{user.name}</h3>
          <p style={{ color: 'var(--info)', fontSize: '0.85rem', fontWeight: 500 }}>System Administrator</p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card stat-card animate-slide-up" style={{ 
              borderLeft: `4px solid ${stat.borderColor}`,
              animationDelay: `${idx * 0.1}s`,
            }}>
              <div className="stat-icon" style={{ background: stat.bg }}>
                <Icon size={28} color={stat.color} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.4rem', fontWeight: 500 }}>{stat.label}</p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ 
        background: 'linear-gradient(135deg, var(--info), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1.5rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <AlertTriangle size={22} color="var(--accent)" /> Withdrawal Queue
      </h2>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '1.5rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading platform data...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
          <CheckCircle2 size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No withdrawal requests found. All clear! 🎉</p>
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
                padding: '1.5rem',
                animationDelay: `${Math.min(idx * 0.05, 0.4)}s`,
                opacity: processingId === w.id ? 0.5 : 1,
                transition: 'opacity 0.3s ease',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div style={{ minWidth: '200px' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Request #{w.id} • {new Date(w.requestedAt || w.requestDate).toLocaleString()}
                  </p>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Owner #{w.owner?.id || w.ownerId || 'N/A'}</span>
                    <span style={{ 
                      fontSize: '1.2rem',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                    }}>${w.amount.toFixed(2)}</span>
                  </h3>
                  {(w.processedAt || w.processedDate) && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Processed: {new Date(w.processedAt || w.processedDate).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
                  
                  {w.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        id={`approve-${w.id}`}
                        className="btn-primary" 
                        style={{ 
                          padding: '8px 18px', 
                          fontSize: '0.85rem',
                          background: 'linear-gradient(135deg, var(--success), hsl(145, 65%, 40%))',
                          boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                        }} 
                        onClick={() => handleAction(w.id, 'approve')}
                        disabled={processingId === w.id}
                      >
                        <CheckCircle2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Approve
                      </button>
                      <button 
                        id={`reject-${w.id}`}
                        className="btn-secondary" 
                        style={{ padding: '8px 18px', borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.85rem' }} 
                        onClick={() => handleAction(w.id, 'reject')}
                        disabled={processingId === w.id}
                      >
                        <XCircle size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
