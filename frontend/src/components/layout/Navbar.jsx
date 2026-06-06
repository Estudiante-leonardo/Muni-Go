import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MunicipalidadContext } from "../../context/MunicipalidadContext";
import logo from "../../assets/Logo-MuniGo.svg";

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  const dropdownRef = useRef(null);

  const announceSelection = (muniId) => {
    const selected = municipalidades.find((m) => m.id === muniId);
    if (selected) {
      setAnnouncement("");
      setTimeout(() => {
        setAnnouncement(
          `Se ha escogido el distrito ${selected.nombre.replace("Municipalidad de ", "")}`,
        );
      }, 50);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsDropdownOpen(true);
        const idx = municipalidades.findIndex(
          (m) => m.id === selectedMunicipalidadId,
        );
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
    } else {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsDropdownOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < municipalidades.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : municipalidades.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < municipalidades.length
        ) {
          const newId = municipalidades[highlightedIndex].id;
          setSelectedMunicipalidadId(newId);
          announceSelection(newId);
        }
        setIsDropdownOpen(false);
      } else if (e.key === "Tab") {
        setIsDropdownOpen(false);
      }
    }
  };

  const selectedMuni = municipalidades.find(
    (m) => m.id === selectedMunicipalidadId,
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
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

        <div className="flex items-center space-x-4">
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
          <div className="relative" ref={dropdownRef}>
            <button
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Seleccionar Distrito. Presione Enter para desplegar las opciones y use las flechas para navegar."
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              className="flex items-center justify-between text-xs font-semibold pl-4 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-[140px] sm:w-[170px]"
            >
              <span className="truncate">
                {selectedMuni
                  ? selectedMuni.nombre.replace("Municipalidad de ", "")
                  : "Seleccione Muni"}
              </span>
              <svg
                className={`w-4 h-4 ml-1 flex-shrink-0 text-slate-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul
                role="listbox"
                aria-activedescendant={
                  highlightedIndex >= 0 && municipalidades[highlightedIndex]
                    ? `muni-option-${municipalidades[highlightedIndex].id}`
                    : undefined
                }
                className="absolute right-0 mt-2 w-[180px] sm:w-[220px] bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden"
              >
                {municipalidades.map((muni, index) => {
                  const isSelected = selectedMunicipalidadId === muni.id;
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <li
                      key={muni.id}
                      id={`muni-option-${muni.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedMunicipalidadId(muni.id);
                        announceSelection(muni.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between ${isHighlighted ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"} ${isSelected ? "font-bold" : "font-medium"}`}
                    >
                      <span className="truncate">
                        {muni.nombre.replace("Municipalidad de ", "")}
                      </span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
