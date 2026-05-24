import React from 'react';

const CATEGORY_COLORS = {
  'Licencias': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'Certificados': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'Obras': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'Impuestos': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
};

export default function TramiteCard({ tramite, onClick }) {
  const badgeColor = CATEGORY_COLORS[tramite.categoria] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <div 
      onClick={onClick}
      className="flex flex-col justify-between p-6 bg-white dark:bg-[#1f2028] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 text-left select-none group"
    >
      <div>
        {/* Category Badge */}
        <div className="mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
            {tramite.categoria}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tramite.nombre}
        </h3>
      </div>

      {/* Call to Action Link */}
      <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        Ver detalles del trámite
        <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
