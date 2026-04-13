import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddProduct from './pages/owner/AddProduct';
import Withdrawals from './pages/owner/Withdrawals';

import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  
  return children;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  let userName = '';
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    userName = u?.name || '';
  } catch(e) {}

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleLabel = () => {
    if (role === 'ADMIN') return { text: 'Admin', color: 'var(--info)' };
    if (role === 'OWNER') return { text: 'Seller', color: 'var(--secondary)' };
    if (role === 'CUSTOMER') return { text: 'Buyer', color: 'var(--primary)' };
    return null;
  };

  const roleInfo = getRoleLabel();

  return (
    <nav className="glass" style={{
      padding: '0.85rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
      background: scrolled 
        ? 'linear-gradient(135deg, rgba(10,8,20,0.95), rgba(15,12,30,0.92))'
        : 'linear-gradient(135deg, rgba(10,8,20,0.7), rgba(15,12,30,0.6))',
      backdropFilter: scrolled ? 'blur(30px)' : 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#fff',
          boxShadow: '0 4px 12px var(--primary-glow)',
        }}>
          F
        </div>
        <h2 style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          fontSize: '1.35rem',
          letterSpacing: '-0.02em',
        }}>
          FreshCart
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {token && roleInfo && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: roleInfo.color,
              boxShadow: `0 0 8px ${roleInfo.color}`,
              animation: 'pulseGlow 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {userName && `${userName} · `}<span style={{ color: roleInfo.color }}>{roleInfo.text}</span>
            </span>
          </div>
        )}
        {token && (
          <button className="btn-secondary" 
            style={{ 
              padding: '8px 20px', 
              fontSize: '0.85rem',
              borderColor: 'var(--danger)',
              color: 'var(--danger)',
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/customer">
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
            <Route path="cart" element={<ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>} />
            <Route path="checkout" element={<ProtectedRoute role="CUSTOMER"><Checkout /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute role="CUSTOMER"><OrderHistory /></ProtectedRoute>} />
          </Route>
          
          <Route path="/owner">
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<ProtectedRoute role="OWNER"><OwnerDashboard /></ProtectedRoute>} />
            <Route path="products/add" element={<ProtectedRoute role="OWNER"><AddProduct /></ProtectedRoute>} />
            <Route path="withdrawals" element={<ProtectedRoute role="OWNER"><Withdrawals /></ProtectedRoute>} />
          </Route>
          
          <Route path="/admin">
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
