import { API_ENDPOINTS } from '../lib/constants';

export const getResumenIA = async (tramite) => {
  if (!tramite) return '';
  try {
    const res = await fetch(`${API_ENDPOINTS.TRAMITES}/${tramite.id}/resumen-ia`);
    if (!res.ok) throw new Error('Error al obtener resumen');
    const data = await res.json();
    return data.resumen || '';
  } catch {
    return '';
  }
};
