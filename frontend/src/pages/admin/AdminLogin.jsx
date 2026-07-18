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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-slate-50 dark:bg-[#0c0d12]">
      {/* Animated mesh gradient background */}
      <div className="admin-login-bg absolute inset-0" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/10 blur-[80px] sm:blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tr from-purple-500/15 to-blue-400/10 blur-[60px] sm:blur-[100px] animate-float-medium pointer-events-none" />
      <div className="absolute top-[50%] left-[60%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full bg-gradient-to-bl from-cyan-400/10 to-blue-500/5 blur-[60px] sm:blur-[80px] animate-float-fast pointer-events-none" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="relative z-10 w-full max-w-[440px] mx-4 sm:mx-6">
        {/* Logo section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/25 mb-5 sm:mb-6 relative">
            <img src={logoSvg} alt="Muni-Go" className="h-8 sm:h-10 brightness-0 invert" />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/10 animate-pulse-subtle" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1.5">
            Panel de Administración
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Accede al sistema de gestión municipal
          </p>
        </div>

        {/* Login Card - Glassmorphism */}
        <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/50 dark:border-white/[0.08] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-900/5 dark:shadow-black/30">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200/80 dark:border-red-400/20 rounded-2xl flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder-slate-400/60 dark:placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all text-sm font-medium"
                  placeholder="Ingresa tu usuario"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder-slate-400/60 dark:placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all text-sm font-medium"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              {loading ? (
                <span className="flex items-center justify-center gap-2.5 relative z-10">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  Acceder al Panel
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 dark:text-slate-500/60 text-xs mt-7 font-medium">
          © 2026 Muni-Go — Acceso exclusivo para personal autorizado
        </p>
      </div>
    </div>
  );
}
