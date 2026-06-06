import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TramiteCard from '../components/TramiteCard';
import { MunicipalidadContext } from '../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../lib/constants';

export default function Catalog() {
  const [tramites, setTramites] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'Todas';

  const navigate = useNavigate();
  const { selectedMunicipalidadId, municipalidades } = React.useContext(MunicipalidadContext);
  
  const currentMuni = municipalidades.find(m => m.id === selectedMunicipalidadId);

  useEffect(() => {
    if (!selectedMunicipalidadId) return;

    setLoading(true);
    axios.get(`${API_ENDPOINTS.TRAMITES}?municipalidadId=${selectedMunicipalidadId}`)
      .then(response => {
        setTramites(response.data);
        const uniqueCats = Array.from(new Set(response.data.map(t => t.categoria)));
        setCategories(['Todas', ...uniqueCats]);
        setError(null);
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor backend.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMunicipalidadId]);

  const filteredTramites = useMemo(() => {
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

    return result;
  }, [selectedCategory, searchQuery, tramites]);

  const handleCategoryChange = (category) => {
    if (category === 'Todas') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleCategoryKeyDown = (e, index, category) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = index < categories.length - 1 ? index + 1 : 0;
      document.getElementById(`category-${next}`)?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = index > 0 ? index - 1 : categories.length - 1;
      document.getElementById(`category-${prev}`)?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryChange(category);
      setTimeout(() => {
        document.getElementById('tramite-card-0')?.focus();
      }, 50);
    }
  };

  // --- Interfaz de Usuario ---
  return (
    <>
      <Helmet><title>MuniGo - Catálogo de Trámites</title></Helmet>
      <div className="animate-fade-in text-left">
      {/* Encabezado */}
      <div className="text-left mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0">
          Catálogo de Trámites
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Revisando los servicios disponibles para <span className="font-bold text-slate-800 dark:text-slate-200">{currentMuni ? currentMuni.nombre.replace('Municipalidad de ', '') : '...'}</span>.
        </p>
      </div>

      {/* Contenido Principal: Menú y Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Menú Lateral de Categorías */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center">
            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Categorías
          </h3>

          <div className="space-y-4" role="radiogroup" aria-label="Filtro de categorías">
            {categories.map((category, index) => {
              const isSelected = selectedCategory === category;
              return (
                <label
                  key={category}
                  id={`category-${index}`}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onKeyDown={(e) => handleCategoryKeyDown(e, index, category)}
                  onClick={() => {
                    handleCategoryChange(category);
                    setTimeout(() => {
                      document.getElementById('tramite-card-0')?.focus();
                    }, 50);
                  }}
                  className="flex items-center space-x-3 cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 -ml-1"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="category"
                      tabIndex={-1}
                      checked={isSelected}
                      onChange={() => handleCategoryChange(category)}
                      className="sr-only"
                    />
                    <div className={`w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 dark:border-slate-650 group-hover:border-blue-400 bg-transparent'
                      }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white animate-scale-up" />
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${isSelected
                    ? 'text-slate-900 dark:text-white font-bold'
                    : 'text-slate-550 dark:text-slate-405 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                    }`}>
                    {category}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Búsqueda y Lista de Trámites */}
        <div className="lg:col-span-3 space-y-6">

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="search-input"
              type="text"
              placeholder="Buscar trámite por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1a1b22] border border-slate-250 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium shadow-sm"
            />
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            <span>MOSTRANDO {filteredTramites.length} RESULTADOS</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando trámites municipales...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-red-800 dark:text-red-400 mb-1">Error de Conexión</h3>
              <p className="text-xs text-red-705 dark:text-red-300 leading-relaxed mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          ) : filteredTramites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No se encontraron trámites</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Prueba buscando con otros términos o seleccionando otra categoría.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {filteredTramites.map((tramite, index) => (
                <TramiteCard
                  key={tramite.id}
                  id={`tramite-card-${index}`}
                  tramite={tramite}
                  onClick={() => navigate(`/tramites/${tramite.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
