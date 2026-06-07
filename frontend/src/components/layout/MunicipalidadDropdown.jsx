import React, { useState, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

export default function MunicipalidadDropdown({ municipalidades, selectedId, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const dropdownRef = useRef(null);

  const selectedMuni = municipalidades.find((m) => m.id === selectedId);

  const announceSelection = (muniId) => {
    const selected = municipalidades.find((m) => m.id === muniId);
    if (selected) {
      setAnnouncement('');
      setTimeout(() => {
        setAnnouncement(`Se ha escogido el distrito ${selected.nombre.replace('Municipalidad de ', '')}`);
      }, 50);
    }
  };

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        const idx = municipalidades.findIndex((m) => m.id === selectedId);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
    } else {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < municipalidades.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : municipalidades.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < municipalidades.length) {
          const newId = municipalidades[highlightedIndex].id;
          onChange(newId);
          announceSelection(newId);
        }
        setIsOpen(false);
      } else if (e.key === 'Tab') {
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Seleccionar Distrito. Presione Enter para desplegar las opciones y use las flechas para navegar."
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between text-xs font-semibold pl-4 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-[140px] sm:w-[170px]"
      >
        <span className="truncate">
          {selectedMuni ? selectedMuni.nombre.replace('Municipalidad de ', '') : 'Seleccione Muni'}
        </span>
        <svg
          className={`w-4 h-4 ml-1 flex-shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-activedescendant={highlightedIndex >= 0 && municipalidades[highlightedIndex] ? `muni-option-${municipalidades[highlightedIndex].id}` : undefined}
          className="absolute right-0 mt-2 w-[180px] sm:w-[220px] bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden"
        >
          {municipalidades.map((muni, index) => {
            const isSelected = selectedId === muni.id;
            const isHighlighted = highlightedIndex === index;
            return (
              <li
                key={muni.id}
                id={`muni-option-${muni.id}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(muni.id);
                  announceSelection(muni.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between ${isHighlighted ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'} ${isSelected ? 'font-bold' : 'font-medium'}`}
              >
                <span className="truncate">{muni.nombre.replace('Municipalidad de ', '')}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
