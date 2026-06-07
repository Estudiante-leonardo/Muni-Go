import React from 'react';

export default function CategorySidebar({ categories, selectedCategory, onCategoryChange, onCategoryKeyDown }) {
  return (
    <div className="lg:col-span-1 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
      <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-5 flex items-center">
        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Categorías
      </h3>

      <div className="space-y-4" role="radiogroup" aria-label="Filtro de categorías">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <label
              key={category}
              id={`category-${index}`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(e) => onCategoryKeyDown(e, index, category)}
              onClick={() => {
                onCategoryChange(category);
                setTimeout(() => {
                  document.getElementById('tramite-card-0')?.focus();
                }, 50);
              }}
              className="flex items-center space-x-3 cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 -ml-1"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="category"
                  tabIndex={-1}
                  checked={isSelected}
                  onChange={() => onCategoryChange(category)}
                  className="sr-only"
                />
                <div className={`w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-slate-300 dark:border-slate-650 group-hover:border-blue-400 bg-transparent'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white animate-scale-up" />
                  )}
                </div>
              </div>
              <span className={`text-sm font-semibold transition-colors ${isSelected
                ? 'text-slate-900 dark:text-white font-bold'
                : 'text-slate-550 dark:text-slate-405 group-hover:text-slate-900 dark:group-hover:text-slate-200'
              }`}>
                {category}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
