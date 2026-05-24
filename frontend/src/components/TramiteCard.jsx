import React from 'react';
import { Clock, Coins, ChevronRight } from 'lucide-react';

const CATEGORY_COLORS = {
  'Licencias': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
  'Certificados': 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
  'Obras': 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
  'Impuestos': 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50'
};

export default function TramiteCard({ tramite, onClick }) {
  const badgeColor = CATEGORY_COLORS[tramite.categoria] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-250 select-none group"
    >
      <div className="flex-grow pr-4">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
          {tramite.nombre}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-550 dark:text-slate-400">
          {/* Category Badge */}
          <span className={`px-2.5 py-0.5 rounded-md border uppercase text-[9px] tracking-wider ${badgeColor}`}>
            {tramite.categoria}
          </span>
          
          {/* Estimated Time */}
          <span className="flex items-center space-x-1 py-0.5 px-2 bg-slate-50 dark:bg-slate-800/40 rounded-md border border-slate-100 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{tramite.tiempoEstimado}</span>
          </span>

          {/* Cost */}
          <span className="flex items-center space-x-1 py-0.5 px-2 bg-slate-50 dark:bg-slate-800/40 rounded-md border border-slate-100 dark:border-slate-800">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span>S/ {tramite.costo === 0 ? 'Gratuito' : tramite.costo}</span>
          </span>
        </div>
      </div>

      {/* Navigation Arrow */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-50 dark:bg-slate-800/40 dark:group-hover:bg-blue-950/30 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
