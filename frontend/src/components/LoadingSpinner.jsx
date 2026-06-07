import React from 'react';

export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-3" />
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{message}</p>
    </div>
  );
}
