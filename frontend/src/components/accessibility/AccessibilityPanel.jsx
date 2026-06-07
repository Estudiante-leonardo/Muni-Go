import React, { useContext, useState, useRef, useEffect } from 'react';
import { AccesibilidadContext } from '../../context/AccesibilidadContext';
import {
  Accessibility,
  Eye,
  Type,
  Contrast,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  X,
  ChevronDown,
} from 'lucide-react';

function ToggleRow({ label, icon: Icon, children }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      {children}
    </div>
  );
}

function SelectRow({ label, icon: Icon, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

export default function AccessibilityPanel() {
  const { settings, updateSetting } = useContext(AccesibilidadContext);
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);

  const handleToggle = () => {
    if (isOpen) {
      setClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setClosing(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleToggle();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const colorblindOptions = [
    { value: 'none', label: 'Desactivado' },
    { value: 'deuteranopia', label: 'Deuteranopia (verde)' },
    { value: 'monochrome', label: 'Monocromático' },
  ];

  const fontSizeOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Grande' },
    { value: 'extra', label: 'Extra grande' },
  ];

  const darkModeOptions = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];

  return (
    <>
      <button
        onClick={handleToggle}
        aria-label={isOpen || closing ? 'Cerrar panel de accesibilidad' : 'Abrir panel de accesibilidad'}
        className={`fixed bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
          isOpen
            ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X size={20} /> : <Accessibility size={20} />}
      </button>

      {(isOpen || closing) && (
        <div
          ref={panelRef}
          className={`fixed bottom-20 left-6 w-72 bg-white dark:bg-[#16171d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-blue-600 px-4 py-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} />
              Accesibilidad
            </h3>
          </div>

          <div className="px-4 py-2 divide-y divide-slate-100 dark:divide-slate-800">
            <SelectRow
              label="Modo daltónico"
              icon={Eye}
              value={settings.colorblindMode}
              options={colorblindOptions}
              onChange={(v) => updateSetting('colorblindMode', v)}
            />

            <SelectRow
              label="Tamaño de texto"
              icon={Type}
              value={settings.fontSize}
              options={fontSizeOptions}
              onChange={(v) => updateSetting('fontSize', v)}
            />

            <SelectRow
              label="Modo oscuro"
              icon={settings.darkMode === 'dark' ? Moon : settings.darkMode === 'light' ? Sun : Monitor}
              value={settings.darkMode}
              options={darkModeOptions}
              onChange={(v) => updateSetting('darkMode', v)}
            />

            <ToggleRow label="Alto contraste" icon={Contrast}>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </ToggleRow>

            <ToggleRow label="Reducir animaciones" icon={Sparkles}>
              <button
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </ToggleRow>
          </div>
        </div>
      )}
    </>
  );
}
