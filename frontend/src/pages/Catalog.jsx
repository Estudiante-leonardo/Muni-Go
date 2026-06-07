import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TramiteCard from '../components/TramiteCard';
import { MunicipalidadContext } from '../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../lib/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import CategorySidebar from '../components/catalog/CategorySidebar';
import SearchBar from '../components/catalog/SearchBar';
import CatalogErrorState from '../components/catalog/CatalogErrorState';
import CatalogEmptyState from '../components/catalog/CatalogEmptyState';

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
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onCategoryKeyDown={handleCategoryKeyDown}
        />

        {/* Búsqueda y Lista de Trámites */}
        <div className="lg:col-span-3 space-y-6">

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            <span>MOSTRANDO {filteredTramites.length} RESULTADOS</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Cargando trámites municipales..." />
          ) : error ? (
            <CatalogErrorState message={error} onRetry={() => window.location.reload()} />
          ) : filteredTramites.length === 0 ? (
            <CatalogEmptyState />
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
