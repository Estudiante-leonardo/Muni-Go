import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../lib/constants';
import logoSvg from '../../assets/Logo-MuniGo.svg';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, { username, password });
      const { token, rol, nombreCompleto, municipalidadId } = res.data;
      login(token, { username: res.data.username, rol, nombreCompleto, municipalidadId });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-400/[0.06] rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-blue-400/[0.03] rounded-full blur-xl pointer-events-none" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoSvg} alt="Muni-Go" className="h-12 mx-auto brightness-0 invert mb-4" />
          <p className="text-blue-200/80 text-sm font-medium">Panel de Administración</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-white text-center mb-2">Iniciar Sesión</h2>
          <p className="text-blue-200/60 text-sm text-center mb-8">Ingresa tus credenciales de administrador</p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/15 border border-red-400/30 rounded-xl text-red-200 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all text-sm"
                placeholder="Ingresa tu usuario"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-200/70 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all text-sm"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-blue-700 font-extrabold rounded-xl text-sm shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Verificando...
                </span>
              ) : 'Acceder al Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-300/40 text-xs mt-6 font-medium">
          © 2026 Muni-Go — Acceso exclusivo para personal autorizado
        </p>
      </div>
    </div>
  );
}
