import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Catalog from '../pages/Catalog';
import TramiteDetail from '../pages/TramiteDetail';
import NotFound from '../pages/NotFound';

// Admin imports
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AccesibilidadProvider } from '../context/AccesibilidadContext';
import { MunicipalidadProvider } from '../context/MunicipalidadContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminMunicipalidades from '../pages/admin/AdminMunicipalidades';
import AdminUsers from '../pages/admin/AdminUsers';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <MunicipalidadProvider>
        <BrowserRouter>
          <Routes>
          {/* ========== RUTAS PÚBLICAS ========== */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tramites" element={<Catalog />} />
            <Route path="tramites/:id" element={<TramiteDetail />} />
          </Route>

          {/* ========== RUTAS ADMIN ========== */}
          <Route path="/admin/login" element={<AccesibilidadProvider><AdminLogin /></AccesibilidadProvider>} />
          <Route path="/admin" element={<ProtectedRoute><AccesibilidadProvider><AdminLayout /></AccesibilidadProvider></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="municipalidades" element={<AdminMunicipalidades />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </MunicipalidadProvider>
    </AuthProvider>
  );
}
