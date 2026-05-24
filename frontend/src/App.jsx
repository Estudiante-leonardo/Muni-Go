import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TramiteCard from './components/TramiteCard';

const API_URL = 'http://localhost:8081/api/tramites';

export default function App() {
  const [tramites, setTramites] = useState([]);
  const [filteredTramites, setFilteredTramites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError('No se pudo conectar con el servidor backend. Asegúrate de que la aplicación Spring Boot esté ejecutándose en el puerto 8080.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    let result = tramites;

    // Filter by category
    if (selectedCategory !== 'Todas') {
      result = result.filter(t => t.categoria.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.nombre.toLowerCase().includes(query) || 
        t.descripcion.toLowerCase().includes(query)
      );
    }

    setFilteredTramites(result);
  }, [selectedCategory, searchQuery, tramites]);

  const categories = ['Todas', 'Licencias', 'Certificados', 'Obras'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131419] transition-colors duration-300 flex flex-col font-sans text-left">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/25">
              M
            </div>
            <div>
              <span className="font-bold text-xl text-slate-850 dark:text-white tracking-tight">Muni<span className="text-purple-600">Go</span></span>
              <span className="text-[10px] text-slate-400 block font-semibold -mt-1">TRÁMITES MUNICIPALES</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-full border border-slate-200 dark:border-slate-700">
              Ventanilla Única
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 text-center">
            Catálogo de Trámites
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 text-center">
            Encuentra de forma rápida y sencilla los requisitos, costos oficiales y tiempos estimados para todos los trámites municipales disponibles.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white dark:bg-[#1a1b22] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-10 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
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
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#121318] border border-slate-250 dark:border-slate-805 rounded-2xl text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-705'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Dynamic Procedimientos Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando trámites municipales...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-red-55 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-650 dark:text-red-400 mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2050/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">Error de Conexión</h3>
            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed mb-6">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
            {/* Results counter */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Mostrando {filteredTramites.length} {filteredTramites.length === 1 ? 'trámite' : 'trámites'}
              </span>
            </div>
            {/* Grid of Procedure Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTramites.map((tramite) => (
                <TramiteCard key={tramite.id} tramite={tramite} />
              ))}
            </div>
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
