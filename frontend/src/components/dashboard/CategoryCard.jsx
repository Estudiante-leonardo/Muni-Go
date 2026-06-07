import React from 'react';
import { categoryCardStyles } from '../../lib/constants';

export default function CategoryCard({ name, color = 'blue', onClick }) {
  const styles = categoryCardStyles[color];

  return (
    <div
      onClick={onClick}
      className={`p-6 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md ${styles.card} cursor-pointer transition-all text-left group`}
    >
      <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center mb-4 transition-colors`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className={`font-bold text-slate-850 dark:text-white ${styles.text} transition-colors mb-1.5 text-base`}>
        {name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        Trámites y servicios relacionados a {name.toLowerCase()}.
      </p>
    </div>
  );
}
