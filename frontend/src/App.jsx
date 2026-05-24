import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TramiteCard from './components/TramiteCard';
import PanelChatbot from './components/PanelChatbot';

const API_URL = 'http://localhost:8081/api/tramites';

export default function App() {
  const [tramites, setTramites] = useState([]);
  const [filteredTramites, setFilteredTramites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detailed view and UI states
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [checkedRequisitos, setCheckedRequisitos] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    setLoading(true);
    axios.get(API_URL)
      .then(response => {
        setTramites(response.data);
        setFilteredTramites(response.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching procedures:', err);
        setError(`No se pudo conectar con el servidor backend. Asegúrate de que la aplicación Spring Boot esté ejecutándose en ${API_URL}.`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter logic for catalog view
  useEffect(() => {
    let result = tramites;

    if (selectedCategory !== 'Todas') {
      result = result.filter(t => t.categoria.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.nombre.toLowerCase().includes(query) ||
        t.descripcion.toLowerCase().includes(query)
      );
    }

    setFilteredTramites(result);
  }, [selectedCategory, searchQuery, tramites]);

  // Reset checkboxes when switching selected procedure
  useEffect(() => {
    setCheckedRequisitos({});
  }, [selectedTramite]);

  const handleToggleRequisito = (id) => {
    setCheckedRequisitos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getResumenIA = (tramite) => {
    if (!tramite) return '';
    switch (tramite.id) {
      case 1:
        return 'Este trámite te permite abrir locales menores a 100m2. Solo necesitas tu DNI, contrato de alquiler y un extintor vigente.';
      case 2:
        return 'Este trámite certifica la jurisdicción y domicilio de tu predio. Es indispensable para obtener servicios básicos, títulos de propiedad y realizar gestiones notariales.';
      case 3:
        return 'Este trámite regulariza y formaliza las construcciones declaradas ante la municipalidad. Permite la inscripción en SUNARP y es fundamental para revalorizar tu predio.';
      default:
        return 'Este trámite consolida la información requerida por la municipalidad para tu registro formal. Asegúrate de presentar todos los requisitos para agilizar la evaluación.';
    }
  };

  const categories = ['Todas', 'Licencias', 'Certificados', 'Obras'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131419] transition-colors duration-300 flex flex-col font-sans text-left relative">

      {/* Drawer Sidebar Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#16171d] border-r border-slate-200 dark:border-slate-800 shadow-xl p-6 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-lg text-slate-850 dark:text-white">Muni<span className="text-purple-600">Go</span></span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => { setSelectedTramite(null); setIsMenuOpen(false); }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 flex items-center"
          >

            Catálogo de Trámites
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            Preguntas Frecuentes
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            Contacto
          </a>
        </nav>
      </div>

      {/* Persistent Navbar (Hamburger + Logo/Back-Button always visible) */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl focus:outline-none transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Conditionally show logo or back button right next to it */}
            {selectedTramite ? (
              <button
                onClick={() => setSelectedTramite(null)}
                className="flex items-center text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors border-l border-slate-200 dark:border-slate-700 pl-4"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Catálogo
              </button>
            ) : (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/25">
                  M
                </div>
                <div>
                  <span className="font-bold text-xl text-slate-850 dark:text-white tracking-tight">Muni<span className="text-purple-600">Go</span></span>
                  <span className="text-[10px] text-slate-400 block font-semibold -mt-1">TRÁMITES MUNICIPALES</span>
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-355 rounded-full border border-slate-200 dark:border-slate-700">
              Ventanilla Única
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">

        {/* If a procedure is selected, show the detailed page */}
        {selectedTramite ? (
          <div className="flex flex-col">

            {/* Detailed Layout - Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Left Column (Detail Info) */}
              <div className="lg:col-span-2 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm transition-colors duration-300">

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                  Trámite: {selectedTramite.nombre}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-505 dark:text-slate-400 font-semibold mb-6">
                  <div>
                    <span className="text-slate-400">Costo:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">S/ {selectedTramite.costo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">dias habiles:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedTramite.tiempoEstimado}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">tipo:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedTramite.categoria === 'Obras' ? 'Presencial' : 'Virtual'}</span>
                  </div>
                </div>

                {/* Smart IA Summary Box */}
                <div className="bg-slate-50 dark:bg-[#15161c] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-start space-x-4 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-850 dark:text-white text-sm block mb-1">Resumen Inteligente IA</span>
                    <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                      {getResumenIA(selectedTramite)}
                    </p>
                  </div>
                </div>

                {/* Requirements checklist */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Requisitos Oficiales:
                  </h3>
                  {selectedTramite.requisitos && selectedTramite.requisitos.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTramite.requisitos.map((req) => {
                        const isChecked = checkedRequisitos[req.id] || false;
                        return (
                          <label
                            key={req.id}
                            className="flex items-start p-3 bg-slate-50 hover:bg-slate-100/70 dark:bg-[#15161c] dark:hover:bg-[#1d1f27] rounded-xl border border-slate-150 dark:border-slate-800/80 cursor-pointer select-none transition-all group"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRequisito(req.id)}
                              className="mt-0.5 w-4.5 h-4.5 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-3 text-sm text-slate-750 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium transition-colors">
                              {req.descripcion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-405">Este trámite no tiene requisitos específicos.</p>
                  )}
                </div>

              </div>

              {/* Right Column (Chatbot Sidebar) */}
              <div className="lg:col-span-1">
                <PanelChatbot tramite={selectedTramite} />
              </div>

            </div>

          </div>
        ) : (
          /* Catalog View */
          <div>

            {/* Hero Banner */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 text-center">
                Catálogo de Trámites
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 text-center">
                Encuentra de forma rápida y sencilla los requisitos, costos oficiales y tiempos estimados para todos los trámites municipales disponibles.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-[#1a1b22] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-10 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Search Bar */}
                <div className="relative flex-grow max-w-xl">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar trámite por nombre o palabra clave..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#121318] border border-slate-250 dark:border-slate-805 rounded-2xl text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {/* Filters Tabs */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 ${selectedCategory === category
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-705'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* List Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando trámites municipales...</p>
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto text-center py-16 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-650 dark:text-red-400 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2050/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-455 mb-2">Error de Conexión</h3>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all focus:outline-none"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredTramites.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2050/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No se encontraron trámites</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Prueba buscando con otros términos o seleccionando otra categoría.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Mostrando {filteredTramites.length} {filteredTramites.length === 1 ? 'trámite' : 'trámites'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTramites.map((tramite) => (
                    <TramiteCard
                      key={tramite.id}
                      tramite={tramite}
                      onClick={() => setSelectedTramite(tramite)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#16171d] border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 Municipalidad Virtual - Plataforma Muni-Go. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
