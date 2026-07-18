export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  TRAMITES: `${API_BASE_URL}/tramites`,
  MUNICIPALIDADES: `${API_BASE_URL}/municipalidades`,
  ESTADISTICAS_CONSULTAS: `${API_BASE_URL}/estadisticas/consultas`,
  ESTADISTICAS_USUARIOS: `${API_BASE_URL}/estadisticas/usuarios`,
  ESTADISTICAS_ACCESIBILIDAD: `${API_BASE_URL}/estadisticas/accesibilidad`,
  CHAT: `${API_BASE_URL}/chat`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/auth/login`,
  ADMIN_TRAMITES: `${API_BASE_URL}/admin/tramites`,
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
};
