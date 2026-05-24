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
  };  const getResumenIA = (tramite) => {
    if (!tramite) return '';
    switch (tramite.id) {
      case 1:
        return 'Este trámite te permite abrir locales comerciales. Solo necesitas tu DNI, contrato de alquiler y un certificado de defensa civil vigente.';
      case 2:
        return 'Este trámite certifica la jurisdicción y domicilio de tu predio. Es indispensable para obtener servicios básicos, títulos de propiedad y realizar gestiones notariales.';
      case 3:
        return 'Este trámite regulariza y formaliza las construcciones declaradas ante la municipalidad. Permite la inscripción en SUNARP y es fundamental para revalorizar tu predio.';
      case 4:
        return 'Permite obtener la autorización para edificar viviendas unifamiliares de hasta 120m2. Es necesario presentar planos firmados por un arquitecto colegiado y el FUE.';
      case 5:
        return 'Trámite oficial para obtener la licencia de conducir tipo B-IIc para conducir mototaxis y motocicletas en el distrito de Carabayllo de forma legal.';
      case 6:
        return 'Permite la presentación de la declaración jurada anual del Impuesto Predial y Arbitrios, esencial para mantener tus obligaciones tributarias al día.';
      default:
        return 'Este trámite consolida la información requerida por la municipalidad para tu registro formal. Asegúrate de presentar todos los requisitos para agilizar la evaluación.';
    }
  };

  const categories = ['Todas', 'Licencias', 'Certificados', 'Impuestos', 'Obras'];

  const renderDashboard = () => {
    return (
      <div className="space-y-12 animate-fade-in text-left">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 shadow-lg text-white">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-10 top-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-lg pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-100 border border-blue-400/20 mb-4 uppercase tracking-wider">
              Portal del Ciudadano de Carabayllo
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-tight">
              Muni-Go: Tu Municipalidad Virtual
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mb-6 leading-relaxed">
              Consulta de manera rápida y transparente todos los requisitos oficiales, costos y tiempos estimados de tus trámites municipales. Todo respaldado por inteligencia artificial.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setView('catalog'); setSelectedTramite(null); }}
                className="px-5 py-3 bg-white text-blue-700 font-extrabold rounded-xl text-sm shadow-md hover:bg-blue-50 hover:shadow-lg transition-all flex items-center cursor-pointer"
              >
                Ver Catálogo de Trámites
                <svg className="w-4.5 h-4.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-5 py-3 bg-blue-800/40 border border-white/20 text-white font-extrabold rounded-xl text-sm hover:bg-blue-800/60 transition-all flex items-center cursor-pointer"
              >
                Hablar con Manuelito IA
                <svg className="w-4.5 h-4.5 ml-2 text-blue-300 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L1 17l1.338-3.123C1.582 12.868 1 11.5 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1">6</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Servicios Listos</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1">~5 días</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Respuesta Promedio</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1">96.8%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Casos Resueltos</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1">1.2K+</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ciudadanos/Mes</span>
            </div>
          </div>
        </div>

        {/* Quick Access by Category */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Servicios por Categoría
            </h2>
            <button
              onClick={() => { setView('catalog'); setSelectedCategory('Todas'); setSelectedTramite(null); }}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
            >
              Ver todos los trámites
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Licencias */}
            <div
              onClick={() => { setSelectedCategory('Licencias'); setView('catalog'); }}
              className="p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-450 cursor-pointer transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-850 dark:text-white group-hover:text-blue-600 transition-colors mb-1.5 text-base">
                Licencias
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Licencias de funcionamiento comercial, edificación residencial y conducir mototaxis.
              </p>
            </div>

            {/* Category Certificados */}
            <div
              onClick={() => { setSelectedCategory('Certificados'); setView('catalog'); }}
              className="p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-450 cursor-pointer transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-850 dark:text-white group-hover:text-emerald-600 transition-colors mb-1.5 text-base">
                Certificados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Certificados de domicilio, de jurisdicción territorial y de no adeudo fiscal.
              </p>
            </div>

            {/* Category Impuestos */}
            <div
              onClick={() => { setSelectedCategory('Impuestos'); setView('catalog'); }}
              className="p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500 dark:hover:border-purple-450 cursor-pointer transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-850 dark:text-white group-hover:text-purple-600 transition-colors mb-1.5 text-base">
                Impuestos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Declaración y pago de impuesto predial, arbitrios de limpieza y seguridad ciudadana.
              </p>
            </div>

            {/* Category Obras */}
            <div
              onClick={() => { setSelectedCategory('Obras'); setView('catalog'); }}
              className="p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500 dark:hover:border-amber-450 cursor-pointer transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-850 dark:text-white group-hover:text-amber-600 transition-colors mb-1.5 text-base">
                Obras
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Declaratoria de fábrica municipal, regularización de planos y conformidad de obra.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Mock Section - Active Procedures Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Procedures Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Mis Trámites Activos (Simulación)
            </h2>
            <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
              {/* Active Item 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-150 dark:border-slate-800">
                <div className="space-y-1 mb-3 sm:mb-0">
                  <span className="inline-block text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    Licencias
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Licencia de Funcionamiento de Bodega "Don Pepe"
                  </h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">
                    ID Trámite: #4512 • Exp. 2026-000452
                  </span>
                </div>
                <div className="flex flex-col sm:items-end space-y-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-250 dark:border-amber-900/50 w-fit">
                    En Evaluación de Campo
                  </span>
                  <div className="w-full sm:w-36">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Progreso</span>
                      <span>70%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Item 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-150 dark:border-slate-800">
                <div className="space-y-1 mb-3 sm:mb-0">
                  <span className="inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    Certificados
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Certificado de Jurisdicción - Predio Lote 4 Mz. C
                  </h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">
                    ID Trámite: #3895 • Exp. 2026-000215
                  </span>
                </div>
                <div className="flex flex-col sm:items-end space-y-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/50 w-fit">
                    Aprobado • Listo
                  </span>
                  <div className="w-full sm:w-36">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Progreso</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / News Box */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Novedades
            </h2>
            <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4 text-left">
              <div className="pb-4 border-b border-slate-150 dark:border-slate-800">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Tributario</span>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-1">
                  Campaña Tributaria Carabayllo 2026
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Aprovecha hasta un 15% de descuento en Arbitrios pagando tu Impuesto Predial 2026 anual antes de fin de mes.
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Tecnología</span>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-1">
                  Nueva Mesa de Partes Virtual
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Presenta solicitudes formales e ingresa expedientes en PDF directamente las 24 horas a través del portal de Muni-Go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCatalog = () => {
    return (
      <div className="animate-fade-in text-left">
        {/* Hero Banner */}
        <div className="text-left mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Catálogo de Trámites
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Revisando los servicios disponibles para <span className="font-bold text-slate-800 dark:text-slate-200">Carabayllo</span>.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column (Sidebar Categories Radio Buttons Selector) */}
          <div className="lg:col-span-1 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center">
              <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Categorías
            </h3>

            <div className="space-y-4">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-3 cursor-pointer group select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="sr-only"
                    />
                    <div className={`w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedCategory === category
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-300 dark:border-slate-650 group-hover:border-blue-400 bg-transparent'
                    }`}>
                      {selectedCategory === category && (
                        <div className="w-2 h-2 rounded-full bg-white animate-scale-up" />
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-550 dark:text-slate-405 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                  }`}>
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Right Column (Search Input & Horizontal Procedure List) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar trámite por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1a1b22] border border-slate-250 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium shadow-sm"
              />
            </div>

            {/* Results count indicator */}
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              <span>MOSTRANDO {filteredTramites.length} RESULTADOS</span>
            </div>

            {/* Procedures list */}
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
                {filteredTramites.map((tramite) => (
                  <TramiteCard
                    key={tramite.id}
                    tramite={tramite}
                    onClick={() => setSelectedTramite(tramite)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const [view, setView] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-lg text-slate-850 dark:text-white">Gob<span className="text-blue-600">Tech</span></span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => { setView('dashboard'); setSelectedTramite(null); setIsMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center cursor-pointer transition-all ${
              view === 'dashboard' && !selectedTramite
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            Inicio / Dashboard
          </button>
          <button
            onClick={() => { setView('catalog'); setSelectedCategory('Todas'); setSelectedTramite(null); setIsMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center cursor-pointer transition-all ${
              view === 'catalog' && !selectedTramite
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            Catálogo de Trámites
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            Preguntas Frecuentes
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); }}
            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
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
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl focus:outline-none transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Conditionally show logo or back button right next to it */}
            {selectedTramite ? (
              <button
                onClick={() => setSelectedTramite(null)}
                className="flex items-center text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-350 dark:hover:text-blue-400 transition-colors border-l border-slate-200 dark:border-slate-700 pl-4 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Catálogo
              </button>
            ) : (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                <div>
                  <span className="font-bold text-xl text-slate-850 dark:text-white tracking-tight">Gob<span className="text-blue-600">Tech</span></span>
                  <span className="text-[10px] text-slate-400 block font-bold -mt-1 uppercase tracking-wide">TRÁMITES MUNICIPALES</span>
                </div>
              </div>
            )}

          </div>

          {/* Desktop Navigation Links */}
          <div className="flex items-center space-x-4">
            {!selectedTramite && (
              <div className="hidden md:flex items-center space-x-1.5 mr-2">
                <button
                  onClick={() => { setView('dashboard'); setSelectedTramite(null); }}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    view === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => { setView('catalog'); setSelectedCategory('Todas'); setSelectedTramite(null); }}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    view === 'catalog'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Catálogo
                </button>
              </div>
            )}
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
              <div className="lg:col-span-2 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm transition-colors duration-300">

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                  {selectedTramite.nombre}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-bold mb-6">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Costo:</span> <span className="text-slate-800 dark:text-slate-200">S/ {selectedTramite.costo === 0 ? 'Gratuito' : selectedTramite.costo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Plazo estimado:</span> <span className="text-slate-800 dark:text-slate-200">{selectedTramite.tiempoEstimado}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Categoría:</span> <span className="text-slate-800 dark:text-slate-200">{selectedTramite.categoria}</span>
                  </div>
                </div>

                {/* Smart IA Summary Box */}
                <div className="bg-slate-50 dark:bg-[#15161c] border border-slate-150 dark:border-slate-800/60 p-5 rounded-2xl flex items-start space-x-4 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-850 dark:text-white text-sm block mb-1">Resumen Inteligente IA (Manuelito)</span>
                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
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
                            className="flex items-start p-3.5 bg-slate-50 hover:bg-slate-100/70 dark:bg-[#15161c] dark:hover:bg-[#1d1f27] rounded-xl border border-slate-150 dark:border-slate-805 cursor-pointer select-none transition-all group text-left"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRequisito(req.id)}
                              className="mt-0.5 w-4.5 h-4.5 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-semibold transition-colors">
                              {req.descripcion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Este trámite no tiene requisitos específicos.</p>
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
          /* Render either Dashboard or Catalog based on view state */
          view === 'dashboard' ? renderDashboard() : renderCatalog()
        )}

      </main>

      {/* Floating Chatbot Overlay (Manualito IA) */}
      {!selectedTramite && (
        <>
          {/* Floating trigger button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-750 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50"
          >
            {isChatOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L1 17l1.338-3.123C1.582 12.868 1 11.5 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Floating panel chatbot container */}
          {isChatOpen && (
            <div className="fixed bottom-22 right-6 w-[340px] sm:w-[380px] h-[520px] shadow-2xl rounded-2xl overflow-hidden z-50 animate-scale-up border border-slate-200 dark:border-slate-805">
              <PanelChatbot tramite={null} />
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-[#16171d] border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-405 dark:text-slate-500 font-bold">
            &copy; 2026 Municipalidad Virtual - Plataforma Muni-Go. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
