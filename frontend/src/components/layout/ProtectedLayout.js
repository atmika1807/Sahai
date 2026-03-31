import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
