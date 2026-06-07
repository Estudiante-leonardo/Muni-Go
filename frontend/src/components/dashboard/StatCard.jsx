import React from 'react';

export default function StatCard({ icon: Icon, value, label, bgColor = 'bg-blue-50 dark:bg-blue-950/30', textColor = 'text-blue-600 dark:text-blue-400' }) {
  return (
    <div className="bg-white dark:bg-[#1a1b22] border border-slate-250/60 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-3 sm:space-x-4 min-w-0">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bgColor} ${textColor} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
      </div>
      <div className="min-w-0">
        <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white block leading-none mb-1 break-words">{value}</span>
        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium break-words leading-tight">{label}</span>
      </div>
    </div>
  );
}
