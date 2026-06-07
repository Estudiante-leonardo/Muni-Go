import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import logoSvg from '../../assets/Logo-MuniGo.svg';

export default function Sidebar({ isMenuOpen, setIsMenuOpen, onOpenFaq }) {
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMenuOpen) return;
      
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      } else if (e.key === 'Tab') {
        const firstElement = document.getElementById('close-sidebar');
        const lastElement = document.getElementById('last-sidebar-link');

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isMenuOpen) {
      setTimeout(() => {
        document.getElementById('close-sidebar')?.focus();
      }, 50);
    } else {
      setTimeout(() => {
        document.getElementById('hamburger-menu')?.focus();
      }, 50);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
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
        inert={!isMenuOpen ? true : undefined}
        aria-hidden={!isMenuOpen}
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#16171d] border-r border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img src={logoSvg} alt="Muni-Go" className="h-7 w-auto object-contain dark:brightness-0 dark:invert" />
          </div>
          <button
            id="close-sidebar"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú lateral"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" />
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
          <button
            id="last-sidebar-link"
            onClick={() => setIsMenuOpen(false)}
            className="w-full text-left block px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            Contacto
          </button>
        </nav>
      </aside>
    </>
  );
}
