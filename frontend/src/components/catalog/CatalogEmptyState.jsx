import { Frown } from 'lucide-react';

export default function CatalogEmptyState() {
  return (
    <div className="text-center py-16 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
        <Frown className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No se encontraron trámites</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">Prueba buscando con otros términos o seleccionando otra categoría.</p>
    </div>
  );
}
