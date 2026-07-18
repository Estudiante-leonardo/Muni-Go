import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Catalog from '../pages/Catalog';
import TramiteDetail from '../pages/TramiteDetail';
import NotFound from '../pages/NotFound';

// Admin imports
import { AuthProvider, useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== RUTAS PÚBLICAS (sin cambios) ========== */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tramites" element={<Catalog />} />
            <Route path="tramites/:id" element={<TramiteDetail />} />
          </Route>

          {/* ========== RUTAS ADMIN (layout separado) ========== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
