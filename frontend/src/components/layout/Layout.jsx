import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PanelChatbot from '../PanelChatbot';
import FaqModal from '../FaqModal';
import AccessibilityPanel from '../accessibility/AccessibilityPanel';
import { MunicipalidadProvider } from '../../context/MunicipalidadContext';
import { AccesibilidadProvider } from '../../context/AccesibilidadContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  
  const params = useParams();
  const location = useLocation();
  const isDetail = !!params.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Programmatically move focus to the hamburger menu to start the tab order from the top
    const hamburger = document.getElementById('hamburger-menu');
    if (hamburger) {
      hamburger.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <MunicipalidadProvider>
      <AccesibilidadProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#131419] motion-reduce:transition-none transition-colors duration-300 flex flex-col font-sans text-left relative">
      
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} onOpenFaq={() => setIsFaqOpen(true)} />
      
      <Navbar setIsMenuOpen={setIsMenuOpen} />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <Outlet context={{ onOpenFaq: () => setIsFaqOpen(true) }} />
      </main>

      <div className={`${isDetail ? 'lg:hidden' : ''}`}>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={isChatOpen ? "Cerrar asistente de IA" : "Abrir asistente de IA"}
          className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-750 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isChatOpen ? 'hidden' : ''}`}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L1 17l1.338-3.123C1.582 12.868 1 11.5 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>

        <div className={`fixed z-[60] bg-white dark:bg-[#16171d] flex flex-col transition-all duration-150 overflow-hidden inset-0 w-full h-full lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[380px] lg:h-[520px] lg:rounded-2xl lg:shadow-2xl lg:border border-slate-200 dark:border-slate-800
          ${isChatOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[120%] opacity-0 pointer-events-none'}
        `}>
          {isChatOpen && <PanelChatbot onClose={() => setIsChatOpen(false)} />}
        </div>
      </div>

      <footer className="bg-white dark:bg-[#16171d] border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4">
          <div className="flex space-x-6">
            <button onClick={() => setIsFaqOpen(true)} className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">
              Preguntas Frecuentes
            </button>
            <button onClick={() => setIsFaqOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 cursor-pointer">
              Contacto
            </button>
          </div>
          <p className="text-xs text-slate-405 dark:text-slate-500 font-bold">
            &copy; 2026 Municipalidad Virtual - Plataforma Muni-Go. Todos los derechos reservados.
          </p>
        </div>
      </footer>
      
      <AccessibilityPanel />
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </div>
      </AccesibilidadProvider>
    </MunicipalidadProvider>
  );
}
