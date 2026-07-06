import React, { createContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'munigo-accesibilidad';

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    colorblindMode: 'none',
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    darkMode: 'system',
  };
}

function applyToHtml(key, value) {
  const html = document.documentElement;
  switch (key) {
    case 'colorblindMode': {
      html.classList.remove('colorblind-deuteranopia', 'colorblind-monochrome');
      if (value === 'deuteranopia') html.classList.add('colorblind-deuteranopia');
      if (value === 'monochrome') html.classList.add('colorblind-monochrome');
      break;
    }
    case 'fontSize': {
      const scales = { normal: '100%', large: '120%', extra: '140%' };
      html.style.fontSize = scales[value] || '100%';
      html.setAttribute('data-font-size', value);
      break;
    }
    case 'highContrast': {
      html.classList.toggle('high-contrast', value);
      break;
    }
    case 'reducedMotion': {
      html.classList.toggle('motion-reduce', value);
      break;
    }
    case 'darkMode': {
      html.classList.remove('light', 'dark');
      if (value === 'light') html.classList.add('light');
      if (value === 'dark') html.classList.add('dark');
      if (value === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.add(prefersDark ? 'dark' : 'light');
      }
      break;
    }
  }
}

function applyAllSettings(settings) {
  Object.entries(settings).forEach(([key, value]) => applyToHtml(key, value));
}

export const AccesibilidadContext = createContext();

export function AccesibilidadProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAllSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.darkMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyToHtml('darkMode', 'system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.darkMode]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <AccesibilidadContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AccesibilidadContext.Provider>
  );
}
