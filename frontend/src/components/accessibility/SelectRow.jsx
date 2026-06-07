import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import useEscapeKey from '../../hooks/useEscapeKey';

export default function SelectRow({ label, icon: Icon, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEscapeKey(() => setOpen(false), open);

  return (
    <div className="flex items-center justify-between py-2.5 px-1" ref={ref}>
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {options.find(o => o.value === value)?.label || value}
          <ChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-none cursor-pointer ${value === opt.value ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
