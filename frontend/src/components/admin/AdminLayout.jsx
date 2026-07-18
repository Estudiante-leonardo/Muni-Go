import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoSvg from '../../assets/Logo-MuniGo.svg';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131419] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#16171d] border-r border-slate-200 dark:border-slate-800 flex flex-col p-5 flex-shrink-0 hidden lg:flex">
        {/* Logo */}
        <div className="mb-8">
          <img src={logoSvg} alt="Muni-Go" className="h-8 dark:brightness-0 dark:invert" />
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
            Panel de Administración
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Panel Principal
          </NavLink>

          {user?.rol === 'SUPER_ADMIN' && (
            <NavLink to="/admin/users" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
              Administradores
            </NavLink>
          )}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.nombreCompleto?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.nombreCompleto}</p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                {user?.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Municipal'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-[#16171d] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <img src={logoSvg} alt="Muni-Go" className="h-7 dark:brightness-0 dark:invert" />
          <button onClick={handleLogout} className="text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer">
            Salir
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
