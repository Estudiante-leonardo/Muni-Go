import React from 'react';

export default function RequisitoList({ requisitos, checkedItems, onToggle }) {
  if (!requisitos || requisitos.length === 0) {
    return <p className="text-sm text-slate-400">Este trámite no tiene requisitos específicos.</p>;
  }

  return (
    <div className="space-y-3">
      {requisitos.map((req) => {
        const isChecked = checkedItems[req.id] || false;
        return (
          <label
            key={req.id}
            className="flex items-start p-3.5 bg-slate-50 hover:bg-slate-100/70 dark:bg-[#15161c] dark:hover:bg-[#1d1f27] rounded-xl border border-slate-150 dark:border-slate-805 cursor-pointer select-none transition-all group text-left"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(req.id)}
              className="mt-0.5 w-4.5 h-4.5 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-semibold transition-colors">
              {req.descripcion}
            </span>
          </label>
        );
      })}
    </div>
  );
}
