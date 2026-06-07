import React from 'react';

export default function PasosStepper({ pasos }) {
  if (!pasos || pasos.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-center">
        <p className="text-sm text-slate-500 font-medium">No hay pasos específicos detallados para este trámite.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {pasos.sort((a, b) => a.numero - b.numero).map((paso, index, arr) => (
        <div key={paso.id} className="flex items-stretch relative">
          <div className="flex flex-col items-center mr-5 w-8">
            <div className="w-8 h-8 rounded-full border-2 border-slate-600 dark:border-slate-400 flex items-center justify-center text-sm font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1b22] z-10 flex-shrink-0">
              {paso.numero}
            </div>
            {index !== arr.length - 1 && (
              <div className="w-[2px] bg-slate-300 dark:bg-slate-600 flex-grow my-2"></div>
            )}
          </div>

          <div className={`flex-1 bg-white dark:bg-[#1a1b22] border-2 border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm w-full ${index !== arr.length - 1 ? 'mb-6' : ''}`}>
            <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200">{paso.titulo}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{paso.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
