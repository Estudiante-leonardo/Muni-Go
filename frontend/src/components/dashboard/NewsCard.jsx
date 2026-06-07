import React from 'react';

export default function NewsCard({ tag, tagColor = 'text-blue-600 dark:text-blue-400', title, description }) {
  return (
    <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left">
      <span className={`text-[10px] font-bold uppercase tracking-wide ${tagColor}`}>{tag}</span>
      <h4 className="text-base font-bold text-slate-850 dark:text-white mt-2">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
