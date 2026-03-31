import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/layout/ProtectedLayout';

import Landing     from './pages/Landing';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Chat        from './pages/Chat';
import Journal     from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import './styles/globals.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif' } }} />
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/chat"      element={<ProtectedLayout><Chat /></ProtectedLayout>} />
          <Route path="/journal"   element={<ProtectedLayout><Journal /></ProtectedLayout>} />
          <Route path="/mood"      element={<ProtectedLayout><MoodTracker /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
