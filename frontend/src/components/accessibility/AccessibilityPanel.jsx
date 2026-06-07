import React, { useContext, useState, useRef } from 'react';
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
} from 'lucide-react';
import ToggleSwitch from '../ToggleSwitch';
import SelectRow from './SelectRow';
import useEscapeKey from '../../hooks/useEscapeKey';
import { colorblindOptions, fontSizeOptions, darkModeOptions } from '../../lib/constants';

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

export default function AccessibilityPanel() {
  const { settings, updateSetting } = useContext(AccesibilidadContext);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  useEscapeKey(() => setIsOpen(false), isOpen);

  return (
    <>
      <button
        onClick={handleToggle}
        aria-label={isOpen ? 'Cerrar panel de accesibilidad' : 'Abrir panel de accesibilidad'}
        className={`fixed bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
          isOpen
            ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <span className="relative w-5 h-5">
          <X size={20} className={`absolute inset-0 transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
          <Accessibility size={20} className={`absolute inset-0 transition-opacity duration-150 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
        </span>
      </button>

      <div
          ref={panelRef}
          className={`fixed bottom-20 left-6 w-72 bg-white dark:bg-[#16171d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden transition-all duration-150 ${
            isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-1 opacity-0 pointer-events-none'
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
              <ToggleSwitch checked={settings.highContrast} onChange={() => updateSetting('highContrast', !settings.highContrast)} label="Alto contraste" />
            </ToggleRow>

            <ToggleRow label="Reducir animaciones" icon={Sparkles}>
              <ToggleSwitch checked={settings.reducedMotion} onChange={() => updateSetting('reducedMotion', !settings.reducedMotion)} label="Reducir animaciones" />
            </ToggleRow>
          </div>
        </div>
    </>
  );
}
