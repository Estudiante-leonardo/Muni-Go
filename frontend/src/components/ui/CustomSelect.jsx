import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Seleccionar...", 
  className = "", 
  disabled = false,
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Tolerancia al tipo (numérico vs string)
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : (value ? value : placeholder);

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : ''}`} ref={containerRef}>
      {/* Input oculto para que required funcione con formularios nativos si es necesario */}
      {required && (
        <input 
          type="text" 
          required 
          value={value} 
          onChange={() => {}} 
          className="absolute opacity-0 w-0 h-0 p-0 m-0 border-0" 
          style={{ zIndex: -1, bottom: 0 }}
        />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between w-full text-left transition-all ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${!selectedOption && !value ? 'text-slate-400' : ''}`}
      >
        <span className="truncate pr-4">{displayValue}</span>
        <svg 
          className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          <ul className="py-1.5 flex flex-col m-0 p-0">
            {/* Opción vacía si no es obligatorio y tiene placeholder */}
            {!required && placeholder && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    !value || value === '' 
                      ? 'bg-blue-50/80 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] font-medium'
                  }`}
                >
                  <span className="truncate italic text-slate-500">{placeholder}</span>
                  {(!value || value === '') && (
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            )}
            
            {options.map((opt, i) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-blue-50/80 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] font-medium'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
