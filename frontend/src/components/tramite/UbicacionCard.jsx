import React from 'react';

export default function UbicacionCard({ lugar }) {
  if (!lugar) return null;

  return (
    <div className="mt-10 bg-slate-50 dark:bg-[#15161c] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl w-full sm:w-2/3">
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">¿Dónde ir?</h4>
      </div>
      <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{lugar.nombre}</p>
        <p className="font-semibold text-xs text-slate-600 dark:text-slate-400 mt-1">{lugar.direccion}</p>
        <p className="font-medium text-xs text-blue-600 dark:text-blue-400 mt-1">Horario: {lugar.horario}</p>
      </div>
    </div>
  );
}
