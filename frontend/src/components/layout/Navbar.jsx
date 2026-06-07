import React, { useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Sun, Moon, Monitor } from "lucide-react";
import { MunicipalidadContext } from "../../context/MunicipalidadContext";
import { AccesibilidadContext } from "../../context/AccesibilidadContext";
import logo from "../../assets/Logo-MuniGo.svg";
import MunicipalidadDropdown from "./MunicipalidadDropdown";

export default function Navbar({ setIsMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const {
    municipalidades,
    selectedMunicipalidadId,
    setSelectedMunicipalidadId,
  } = useContext(MunicipalidadContext);

  const isDashboard = location.pathname === "/";
  const isCatalog = location.pathname === "/tramites";
  const isDetail = location.pathname.startsWith("/tramites/") && params.id;

  const { settings, updateSetting } = useContext(AccesibilidadContext);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            id="hamburger-menu"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú de navegación"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isDetail ? (
            <button
              onClick={() => navigate("/tramites")}
              aria-label="Volver al catálogo de trámites"
              className="flex items-center text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-350 dark:hover:text-blue-400 transition-colors border-l border-slate-200 dark:border-slate-700 pl-2 sm:pl-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <svg
                className="w-4 h-4 mr-1 sm:mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden sm:inline">Volver al Catálogo</span>
              <span className="sm:hidden">Volver</span>
            </button>
          ) : (
            <div className="flex items-center border-l border-slate-200 dark:border-slate-700 pl-3 sm:pl-4 h-full">
              <Link
                to="/"
                aria-label="Inicio Muni-Go"
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <img
                  src={logo}
                  alt="Muni-Go Logo"
                  className="
                    h-8 sm:h-9 md:h-9 w-auto object-contain
                    dark:brightness-0 dark:invert
                  "
                />
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => {
              const modes = ['system', 'light', 'dark'];
              const next = modes[(modes.indexOf(settings.darkMode) + 1) % modes.length];
              updateSetting('darkMode', next);
            }}
            aria-label={`Modo oscuro: ${settings.darkMode === 'dark' ? 'oscuro' : settings.darkMode === 'light' ? 'claro' : 'automático'}. Haga clic para cambiar.`}
            className="hidden md:flex p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            {settings.darkMode === 'dark' ? <Moon size={16} /> : settings.darkMode === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
          </button>
          {!isDetail && (
            <nav
              className="hidden md:flex items-center space-x-1.5 mr-2"
              aria-label="Navegación principal"
            >
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDashboard
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/tramites"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCatalog
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Catálogo
              </Link>
            </nav>
          )}
          <MunicipalidadDropdown
            municipalidades={municipalidades}
            selectedId={selectedMunicipalidadId}
            onChange={setSelectedMunicipalidadId}
          />
        </div>
      </div>
    </header>
  );
}
