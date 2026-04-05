import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const Layout = ({ children }) => {
  return (
    <div>
      {/* Navbar will go here */}
      <nav className="glass" style={{padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between'}}>
        <h2 style={{color: 'var(--primary)', fontWeight: 800}}>FreshCart</h2>
        <div>
           {localStorage.getItem('token') ? (
             <button className="btn-secondary" onClick={() => {
               localStorage.clear();
               window.location.href = '/login';
             }}>Logout</button>
           ) : null}
        </div>
      </nav>
      <main>
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
