import React, { useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MunicipalidadContext } from '../../context/MunicipalidadContext';
import logo from '../../assets/Logo.jpeg';

export default function Navbar({ setIsMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const { municipalidades, selectedMunicipalidadId, setSelectedMunicipalidadId } = useContext(MunicipalidadContext);

  const isDashboard = location.pathname === '/';
  const isCatalog = location.pathname === '/tramites';
  const isDetail = location.pathname.startsWith('/tramites/') && params.id;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
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
              className="flex items-center text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-350 dark:hover:text-blue-400 transition-colors border-l border-slate-200 dark:border-slate-700 pl-2 sm:pl-4 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Volver al Catálogo</span>
              <span className="sm:hidden">Volver</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-3 sm:pl-4">
              <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center sm:items-start justify-center">
                <img src={logo} alt="Muni-Go Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-md transform -translate-y-3" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block font-bold -mt-8 uppercase tracking-wide">TRÁMITES MUNICIPALES</span>
              </Link>
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
          <div className="relative">
            <select
              value={selectedMunicipalidadId || ''}
              onChange={(e) => setSelectedMunicipalidadId(e.target.value ? Number(e.target.value) : null)}
              className="appearance-none text-xs font-semibold pl-3 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-[130px] sm:w-auto truncate"
            >
              <option value="" disabled>Seleccione Muni</option>
              {municipalidades.map(muni => (
                <option key={muni.id} value={muni.id}>
                  {muni.nombre.replace('Municipalidad de ', '')}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
