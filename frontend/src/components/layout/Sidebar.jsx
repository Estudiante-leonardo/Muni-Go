import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isMenuOpen, setIsMenuOpen, onOpenFaq }) {
  const location = useLocation();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen, setIsMenuOpen]);

  const isDashboard = location.pathname === '/';
  const isCatalog = location.pathname.startsWith('/tramites');

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#16171d] border-r border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-lg text-slate-850 dark:text-white">Muni<span className="text-blue-600">Go</span></span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú lateral"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDashboard
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
          >
            Inicio / Dashboard
          </Link>
          <Link
            to="/tramites"
            onClick={() => setIsMenuOpen(false)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCatalog && location.pathname === '/tramites'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
          >
            Catálogo de Trámites
          </Link>
          <button
            onClick={() => { setIsMenuOpen(false); if (onOpenFaq) onOpenFaq(); }}
            className="w-full text-left block px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Preguntas Frecuentes
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Contacto
          </a>
        </nav>
      </aside>
    </>
  );
}
