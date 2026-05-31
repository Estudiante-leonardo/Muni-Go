import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MunicipalidadContext } from '../context/MunicipalidadContext';

const API_URL = 'http://localhost:8081/api/tramites';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedMunicipalidadId, municipalidades } = useContext(MunicipalidadContext);
  
  const [tramitesCount, setTramitesCount] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  const currentMuni = municipalidades.find(m => m.id === selectedMunicipalidadId);
  const muniName = currentMuni ? currentMuni.nombre.replace('Municipalidad de ', '') : '...';

  useEffect(() => {
    if (selectedMunicipalidadId) {
      axios.get(`${API_URL}?municipalidadId=${selectedMunicipalidadId}`)
        .then(response => {
          setTramitesCount(response.data.length);
          const uniqueCats = Array.from(new Set(response.data.map(t => t.categoria)));
          setDynamicCategories(uniqueCats.slice(0, 4)); // Show top 4 categories on dashboard
        })
        .catch(err => console.error(err));
    }
  }, [selectedMunicipalidadId]);

  // --- Interfaz de Usuario ---
  return (
    <div className="space-y-12 animate-fade-in text-left">
      {/* Portada Principal */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 shadow-lg text-white">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-lg pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-100 border border-blue-400/20 mb-4 uppercase tracking-wider">
            Portal del Ciudadano de {muniName}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-tight">
            Muni-Go: Tu Municipalidad Virtual
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mb-6 leading-relaxed">
            Consulta de manera rápida y transparente todos los requisitos oficiales, costos y tiempos estimados de tus trámites municipales. Todo respaldado por inteligencia artificial.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tramites"
              className="px-5 py-3 bg-white text-blue-700 font-extrabold rounded-xl text-sm shadow-md hover:bg-blue-50 hover:shadow-lg transition-all flex items-center cursor-pointer"
            >
              Ver Catálogo de Trámites
              <svg className="w-4.5 h-4.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1">{tramitesCount}</span>
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

      {/* Categorías */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Servicios por Categoría
          </h2>
          <Link
            to="/tramites"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
          >
            Ver todos los trámites
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicCategories.map((cat, index) => {
            const colors = ['blue', 'emerald', 'purple', 'amber'];
            const color = colors[index % colors.length];
            return (
              <div
                key={cat}
                onClick={() => navigate(`/tramites?category=${cat}`)}
                className={`p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-${color}-500 dark:hover:border-${color}-450 cursor-pointer transition-all text-left group`}
              >
                <div className={`w-10 h-10 rounded-lg bg-${color}-50 dark:bg-${color}-950/30 text-${color}-600 dark:text-${color}-400 flex items-center justify-center mb-4 transition-colors`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`font-bold text-slate-850 dark:text-white group-hover:text-${color}-600 transition-colors mb-1.5 text-base`}>
                  {cat}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Trámites y servicios relacionados a {cat.toLowerCase()}.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Novedades */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Novedades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Tributario</span>
            <h4 className="text-base font-bold text-slate-850 dark:text-white mt-2">
              Campaña Tributaria {muniName} 2026
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Aprovecha hasta un 15% de descuento en Arbitrios pagando tu Impuesto Predial 2026 anual antes de fin de mes.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Tecnología</span>
            <h4 className="text-base font-bold text-slate-850 dark:text-white mt-2">
              Nueva Mesa de Partes Virtual
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Presenta solicitudes formales e ingresa expedientes en PDF directamente las 24 horas a través del portal de Muni-Go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
