import { AlertTriangle } from 'lucide-react';

export default function CatalogErrorState({ message, onRetry }) {
  return (
    <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-800 dark:text-red-400 mb-1">Error de Conexión</h3>
      <p className="text-xs text-red-705 dark:text-red-300 leading-relaxed mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  );
}
