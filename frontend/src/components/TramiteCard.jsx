import React, { useState } from 'react';

const CATEGORY_COLORS = {
  'Licencias': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    accent: 'bg-blue-600'
  },
  'Certificados': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    accent: 'bg-emerald-600'
  },
  'Obras': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    accent: 'bg-amber-600'
  },
  'Impuestos': {
    bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
    accent: 'bg-purple-600'
  }
};

export default function TramiteCard({ tramite }) {
  const [showRequisitos, setShowRequisitos] = useState(false);
  const colorScheme = CATEGORY_COLORS[tramite.categoria] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    accent: 'bg-slate-600'
  };

  const hasRequisitos = tramite.requisitos && tramite.requisitos.length > 0;

  return (
    <div className="flex flex-col bg-white dark:bg-[#1f2028] border border-slate-250 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 text-left">
      {/* Top Accent Line */}
      <div className={`h-1.5 w-full ${colorScheme.accent}`} />
      
      <div className="p-6 flex-grow flex flex-col">
        {/* Category & Badge */}
        <div className="flex justify-between items-center mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorScheme.bg}`}>
            {tramite.categoria}
          </span>
          <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tramite.tiempoEstimado}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-snug">
          {tramite.nombre}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow line-clamp-3">
          {tramite.descripcion}
        </p>

        {/* Cost details */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">Costo</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {tramite.costo > 0 ? `S/ ${tramite.costo.toFixed(2)}` : 'Gratuito'}
              </span>
            </div>
            {hasRequisitos && (
              <button
                onClick={() => setShowRequisitos(!showRequisitos)}
                className="flex items-center text-xs font-semibold text-accent hover:text-purple-750 dark:text-purple-400 dark:hover:text-purple-300 transition-colors focus:outline-none"
              >
                {showRequisitos ? 'Ocultar requisitos' : 'Ver requisitos'}
                <svg
                  className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${showRequisitos ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Requisitos list */}
      {hasRequisitos && (
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#18191f] ${
            showRequisitos ? 'max-h-96 opacity-100 p-6' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <h4 className="text-[10px] font-bold text-slate-450 dark:text-slate-505 uppercase tracking-wider mb-3">Requisitos Oficiales</h4>
          <ul className="space-y-2">
            {tramite.requisitos.map((req) => (
              <li key={req.id} className="flex items-start text-sm text-slate-705 dark:text-slate-350">
                <svg className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{req.descripcion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
