import { useState, useEffect, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccesibilidadContext } from '../../context/AccesibilidadContext';
import logoSvg from '../../assets/Logo-MuniGo.svg';
import axios from 'axios';
import { API_ENDPOINTS } from '../../lib/constants';
import { Sun, Moon, Monitor, UserCog } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useContext(AccesibilidadContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [municipalidades, setMunicipalidades] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    axios.get(API_ENDPOINTS.MUNICIPALIDADES)
      .then(res => setMunicipalidades(res.data))
      .catch(() => {});
  }, []);

  const getDistrictName = () => {
    if (user?.rol === 'SUPER_ADMIN') {
      return 'Acceso Global';
    }
    const localMapping = {
      1: 'Carabayllo',
      2: 'Comas',
      3: 'Los Olivos',
      4: 'San Martín de Porres',
      5: 'Miraflores'
    };
    if (localMapping[user?.municipalidadId]) {
      return localMapping[user?.municipalidadId];
    }
    const muni = municipalidades.find(m => m.id === user?.municipalidadId);
    return muni ? muni.nombre.replace('Municipalidad de ', '') : `Distrito ${user?.municipalidadId}`;
  };

  const cycleDarkMode = () => {
    const modes = ['system', 'light', 'dark'];
    const next = modes[(modes.indexOf(settings.darkMode) + 1) % modes.length];
    updateSetting('darkMode', next);
  };

  const darkModeIcon = settings.darkMode === 'dark' ? <Moon size={16} /> : settings.darkMode === 'light' ? <Sun size={16} /> : <Monitor size={16} />;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/[0.04]'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
    }`;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#131419] flex font-sans relative">
      {/* Subtle animated background for the whole admin area */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-400/[0.02] to-indigo-500/[0.01] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-purple-400/[0.015] to-blue-400/[0.01] blur-[80px] animate-float-medium" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-[280px] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border-r border-slate-200/80 dark:border-white/[0.06] flex flex-col p-5 flex-shrink-0 overflow-y-auto hidden lg:flex relative z-10">
        {/* Logo */}
        <div className="mb-8 px-1 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={logoSvg} alt="Muni-Go" className="h-9 dark:brightness-0 dark:invert" />
          </div>
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
            Panel de Administración
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-grow">
          <p className="text-[10px] font-bold text-slate-400/60 dark:text-slate-600 uppercase tracking-[0.15em] px-4 mb-2">
            Menú Principal
          </p>
          <NavLink to="/admin" end className={linkClass} onClick={() => setMobileMenuOpen(false)}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Panel Principal
          </NavLink>

          {user?.rol === 'SUPER_ADMIN' && (
            <>
              <NavLink to="/admin/municipalidades" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Municipalidades
              </NavLink>
              <NavLink to="/admin/users" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                <UserCog className="w-[18px] h-[18px]" />
                Administradores
              </NavLink>
            </>
          )}
        </nav>

        {/* Dark mode toggle + User info card & Logout */}
        <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-5 mt-4 mb-0">
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tema</span>
            <button onClick={cycleDarkMode} aria-label={`Modo: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer">
              {darkModeIcon}
            </button>
          </div>
          <div className="bg-slate-50/80 dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200/50 dark:border-white/[0.04]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-blue-500/20 ring-2 ring-white/80 dark:ring-white/10">
                {user?.nombreCompleto?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate text-left">{user?.nombreCompleto}</p>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user?.rol === 'SUPER_ADMIN' ? 'bg-purple-500' : 'bg-blue-500'} animate-pulse`} />
                    <p className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wide">
                      {user?.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Municipal'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 truncate block text-center ${
                    user?.rol === 'SUPER_ADMIN'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>
                    {getDistrictName()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-500/8 hover:bg-red-100 dark:hover:bg-red-500/15 border border-red-200/50 dark:border-red-500/15 rounded-xl transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.06] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <img src={logoSvg} alt="Muni-Go" className="h-8 dark:brightness-0 dark:invert" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={cycleDarkMode} aria-label={`Modo: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer">
              {darkModeIcon}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white/95 dark:bg-[#1a1b22]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.06] z-50 p-5 flex flex-col animate-slide-in-left shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <img src={logoSvg} alt="Muni-Go" className="h-7 dark:brightness-0 dark:invert" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-1.5 flex-1">
                <p className="text-[10px] font-bold text-slate-400/60 dark:text-slate-600 uppercase tracking-[0.15em] px-4 mb-2">
                  Menú Principal
                </p>
                <NavLink to="/admin" end className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Panel Principal
                </NavLink>

                {user?.rol === 'SUPER_ADMIN' && (
                  <>
                    <NavLink to="/admin/municipalidades" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      Municipalidades
                    </NavLink>
                    <NavLink to="/admin/users" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                      <UserCog className="w-[18px] h-[18px]" />
                      Administradores
                    </NavLink>
                  </>
                )}
              </nav>

              <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-4">
                <div className="flex items-center justify-between px-1 mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tema</span>
                  <button onClick={cycleDarkMode} aria-label={`Modo: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer">
                    {darkModeIcon}
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user?.nombreCompleto?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.nombreCompleto}</p>
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      {user?.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Municipal'}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 truncate block text-center ${
                      user?.rol === 'SUPER_ADMIN'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      {getDistrictName()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 rounded-xl transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
