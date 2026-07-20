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
import AdminStats from '../pages/admin/AdminStats';
import AdminTramites from '../pages/admin/AdminTramites';
import AdminMunicipalidades from '../pages/admin/AdminMunicipalidades';
import AdminUsers from '../pages/admin/AdminUsers';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user || (user.rol !== 'ADMIN_MUNICIPAL' && user.rol !== 'SUPER_ADMIN')) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function SuperAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user || user.rol !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function PublicAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (user && (user.rol === 'ADMIN_MUNICIPAL' || user.rol === 'SUPER_ADMIN')) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MunicipalidadProvider>
          <Routes>
          {/* ========== RUTAS CIUDADANO ========== */}
          <Route path="/" element={<AccesibilidadProvider><Layout /></AccesibilidadProvider>}>
            <Route index element={<Dashboard />} />
            <Route path="tramites" element={<Catalog />} />
            <Route path="tramite/:id" element={<TramiteDetail />} />
          </Route>

          {/* ========== RUTAS ADMIN ========== */}
          <Route path="/admin/login" element={<PublicAdminRoute><AccesibilidadProvider><AdminLogin /></AccesibilidadProvider></PublicAdminRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AccesibilidadProvider><AdminLayout /></AccesibilidadProvider></ProtectedRoute>}>
            <Route index element={<AdminStats />} />
            <Route path="tramites" element={<AdminTramites />} />
            <Route path="municipalidades" element={<SuperAdminRoute><AdminMunicipalidades /></SuperAdminRoute>} />
            <Route path="users" element={<SuperAdminRoute><AdminUsers /></SuperAdminRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </MunicipalidadProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
