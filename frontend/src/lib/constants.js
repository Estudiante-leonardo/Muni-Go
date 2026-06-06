export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  TRAMITES: `${API_BASE_URL}/tramites`,
  MUNICIPALIDADES: `${API_BASE_URL}/municipalidades`,
};
