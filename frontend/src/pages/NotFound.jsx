import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>MuniGo - Página no encontrada</title></Helmet>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in gap-3">
      <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Frown className="w-20 h-20" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
        Página no encontrada
      </h2>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mb-3 leading-relaxed">
        Lo sentimos, la ruta que estás intentando visitar no existe o ha sido movida temporalmente.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
    </>
  );
}
