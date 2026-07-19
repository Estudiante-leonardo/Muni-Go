import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AccesibilidadContext } from '../../context/AccesibilidadContext';
import { API_ENDPOINTS } from '../../lib/constants';
import logoSvg from '../../assets/Logo-MuniGo.svg';
import { Sun, Moon, Monitor, User, Lock, Eye, EyeOff, ShieldCheck, Users, FileText } from 'lucide-react';

const crossPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSetting } = useContext(AccesibilidadContext);

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

  const cycleDarkMode = () => {
    const modes = ['system', 'light', 'dark'];
    const next = modes[(modes.indexOf(settings.darkMode) + 1) % modes.length];
    updateSetting('darkMode', next);
  };

  const features = [
    { icon: FileText, text: 'Trámites' },
    { icon: ShieldCheck, text: 'Seguro' },
    { icon: Users, text: 'Usuarios' },
  ];

  return (
    <div className="admin-login-page min-h-screen font-sans flex flex-col lg:flex-row bg-slate-50 dark:bg-[#131419]">

      {/* ===== MOBILE: Full-screen gradient overlay ===== */}
      <div className="lg:hidden fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 -z-10" aria-hidden="true" />
      {/* Cross pattern */}
      <div className="lg:hidden fixed inset-0 opacity-[0.05] -z-10" style={crossPattern} aria-hidden="true" />
      {/* Dot grid pattern */}
      <div className="lg:hidden fixed inset-0 opacity-[0.03] -z-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
      {/* Radial glow */}
      <div className="lg:hidden fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none -z-10" aria-hidden="true" />
      {/* Decorative orbs */}
      <div className="lg:hidden fixed -top-20 -right-20 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl pointer-events-none -z-10" aria-hidden="true" />
      <div className="lg:hidden fixed top-1/3 -left-24 w-56 h-56 bg-indigo-400/[0.08] rounded-full blur-3xl pointer-events-none -z-10" aria-hidden="true" />
      <div className="lg:hidden fixed bottom-1/4 -right-16 w-40 h-40 bg-blue-300/[0.06] rounded-full blur-2xl pointer-events-none -z-10" aria-hidden="true" />
      <div className="lg:hidden fixed -bottom-20 left-1/4 w-48 h-48 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none -z-10" aria-hidden="true" />

      {/* ===== DESKTOP: Left gradient column ===== */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 flex-shrink-0 w-[45%] xl:w-[48%]">
        {/* Cross pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={crossPattern} aria-hidden="true" />
        {/* Blur orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.06] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/[0.08] rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col justify-between items-center p-6 xl:p-8 min-h-screen w-full text-center">
          {/* Top: Logo centered */}
          <div className="flex justify-center">
            <img src={logoSvg} alt="Muni-Go" className="h-10 brightness-0 invert" />
          </div>

          {/* Center: Content */}
          <div className="space-y-6">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/15 text-white/90 border border-white/20 uppercase tracking-wider">
              Acceso Administrativo
            </span>

            <h1 className="!text-white text-3xl xl:text-4xl font-black leading-tight">
              Panel de<br />Administración
            </h1>

            <p className="text-blue-100/70 text-sm font-medium max-w-sm mx-auto leading-relaxed">
              Sistema de gestión municipal para administradores autorizados. Controla trámites, usuarios y configuración del distrito.
            </p>

            <div className="space-y-3 pt-2 inline-flex flex-col items-center">
              {[
                { icon: FileText, text: 'Gestión de trámites municipales' },
                { icon: ShieldCheck, text: 'Acceso seguro y autorizado' },
                { icon: Users, text: 'Control de administradores' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="text-sm text-blue-100/80 font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Copyright centered */}
          <p className="text-xs text-blue-200/40 font-medium text-center">
            © 2026 Muni-Go — Plataforma Municipal
          </p>
        </div>
      </div>

      {/* ===== Content area ===== */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Desktop: dark mode toggle bar */}
        <div className="hidden lg:flex items-center justify-end px-8 py-5">
          <button
            onClick={cycleDarkMode}
            aria-label={`Modo: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          >
            {settings.darkMode === 'dark' ? <Moon size={16} /> : settings.darkMode === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
          </button>
        </div>

        {/* Mobile: dark mode toggle — absolute top right */}
        <div className="lg:hidden absolute top-4 right-4 z-20">
          <button
            onClick={cycleDarkMode}
            aria-label={`Modo: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`}
            className="p-2 bg-black/15 hover:bg-black/25 text-white rounded-xl transition-colors cursor-pointer"
          >
            {settings.darkMode === 'dark' ? <Moon size={16} /> : settings.darkMode === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8 lg:py-0">
          <div className="w-95% max-w-[400px] relative">
            {/* Mobile card background */}
            <div className="lg:hidden absolute -inset-5 sm:-inset-7 bg-white/95 dark:bg-[#1a1b23]/95 backdrop-blur-sm rounded-3xl" />

            <div className="relative space-y-7 text-center">

            {/* Logo + Badge mobile */}
            <div className="lg:hidden space-y-4">
              <img src={logoSvg} alt="Muni-Go" className="h-10 mx-auto dark:brightness-0 dark:invert" />
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/[0.08] uppercase tracking-wider">
                Acceso Administrativo
              </span>
            </div>

            {/* Welcome heading (visible on both mobile and desktop) */}
            <div>
              <h2 className="!text-slate-900 dark:!text-white text-2xl font-black mb-1">
                Bienvenido
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Ingresa tus credenciales para acceder
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200/80 dark:border-red-400/20 rounded-xl flex items-center gap-3 animate-fade-in text-left">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder-slate-400/60 dark:placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all text-sm font-medium"
                    placeholder="Ingresa tu usuario"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Lock className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder-slate-400/60 dark:placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all text-sm font-medium"
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
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 relative overflow-hidden group"
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

            {/* Footer */}
            <p className="text-center text-slate-400 dark:text-slate-500/60 text-xs font-medium">
              © 2026 Muni-Go — Acceso exclusivo para personal autorizado
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
