import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

export default function Navbar({ setIsMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const isDashboard = location.pathname === '/';
  const isCatalog = location.pathname === '/tramites';
  const isDetail = location.pathname.startsWith('/tramites/') && params.id;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl focus:outline-none transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isDetail ? (
            <button
              onClick={() => navigate('/tramites')}
              className="flex items-center text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-350 dark:hover:text-blue-400 transition-colors border-l border-slate-200 dark:border-slate-700 pl-4 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Catálogo
            </button>
          ) : (
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
              <div>
                <span className="font-bold text-xl text-slate-850 dark:text-white tracking-tight">Muni<span className="text-blue-600">Go</span></span>
                <span className="text-[10px] text-slate-400 block font-bold -mt-1 uppercase tracking-wide">TRÁMITES MUNICIPALES</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isDetail && (
            <div className="hidden md:flex items-center space-x-1.5 mr-2">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${isDashboard
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
              >
                Inicio
              </Link>
              <Link
                to="/tramites"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${isCatalog
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
              >
                Catálogo
              </Link>
            </div>
          )}
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-355 rounded-full border border-slate-200 dark:border-slate-700">
            Ventanilla Única
          </span>
        </div>
      </div>
    </header>
  );
}
