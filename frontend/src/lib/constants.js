export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  TRAMITES: `${API_BASE_URL}/tramites`,
  MUNICIPALIDADES: `${API_BASE_URL}/municipalidades`,
};

export const categoryCardStyles = {
  blue: { card: 'hover:border-blue-500 dark:hover:border-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400', text: 'group-hover:text-blue-600' },
  emerald: { card: 'hover:border-emerald-500 dark:hover:border-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400', text: 'group-hover:text-emerald-600' },
  purple: { card: 'hover:border-purple-500 dark:hover:border-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400', text: 'group-hover:text-purple-600' },
  amber: { card: 'hover:border-amber-500 dark:hover:border-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400', text: 'group-hover:text-amber-600' },
};

export const colorblindOptions = [
  { value: 'none', label: 'Desactivado' },
  { value: 'deuteranopia', label: 'Deuteranopia (verde)' },
  { value: 'monochrome', label: 'Monocromático' },
];

export const fontSizeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
  { value: 'extra', label: 'Extra grande' },
];

export const darkModeOptions = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];
