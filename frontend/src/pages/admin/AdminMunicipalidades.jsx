import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MunicipalidadContext } from '../../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../../lib/constants';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminMunicipalidades() {
  const { user } = useAuth();
  const { fetchMunicipalidades: refreshGlobalMunicipalidades } = useContext(MunicipalidadContext);
  
  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '' });
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchMunicipalidadesLocal = () => {
    setLoading(true);
    axios.get(API_ENDPOINTS.MUNICIPALIDADES)
      .then(res => setMunicipalidades(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMunicipalidadesLocal();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormError('');
    setShowFormModal(true);
  };

  const handleOpenEdit = (muni) => {
    setEditingId(muni.id);
    setFormName(muni.nombre);
    setFormError('');
    setShowFormModal(true);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setFormError('');
    try {
      if (editingId) {
        await axios.put(`${API_ENDPOINTS.MUNICIPALIDADES}/${editingId}`, { nombre: formName });
        setFormSuccess('Municipalidad actualizada con éxito.');
      } else {
        await axios.post(API_ENDPOINTS.MUNICIPALIDADES, { nombre: formName });
        setFormSuccess('Municipalidad creada con éxito.');
      }
      setShowFormModal(false);
      fetchMunicipalidadesLocal();
      if (refreshGlobalMunicipalidades) refreshGlobalMunicipalidades();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al procesar la municipalidad.');
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_ENDPOINTS.MUNICIPALIDADES}/${deleteTarget.id}`);
      setFormSuccess('Municipalidad eliminada con éxito.');
      fetchMunicipalidadesLocal();
      if (refreshGlobalMunicipalidades) refreshGlobalMunicipalidades();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al eliminar la municipalidad.');
      setTimeout(() => setFormError(''), 4000);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget({ id: null, name: '' });
    }
  };

  // Solo SUPER_ADMIN puede ver esta página, pero por si acaso validamos
  if (user?.rol !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center text-slate-500">
        No tienes permisos para ver esta página.
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} aria-hidden="true" />
        <div className="absolute -top-16 -right-16 w-48 h-48 sm:w-64 sm:h-64 bg-white/[0.05] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/15 text-white/90 border border-white/20 uppercase tracking-wider mb-2">
              Gestión del Sistema
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black !text-white leading-tight">
              Municipalidades
            </h1>
            <p className="text-sm text-purple-100/70 mt-1 font-medium">
              Administra los municipios afiliados a la plataforma Muni-Go.
            </p>
          </div>
          
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-purple-700 hover:bg-purple-50 font-bold rounded-xl text-sm shadow-lg shadow-black/10 transition-all cursor-pointer self-start sm:self-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Registrar Municipalidad
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          {formSuccess}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-250 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 font-semibold text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {formError}
        </div>
      )}

      {/* Table / List */}
      <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-[3px] border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Cargando municipalidades...</p>
            </div>
          </div>
        ) : municipalidades.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No hay municipalidades registradas</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-550/5 dark:bg-white/[0.02]">
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre de la Municipalidad</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 dark:divide-white/[0.04]">
                {municipalidades.map((muni) => (
                  <tr key={muni.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 text-xs font-bold text-slate-400 dark:text-slate-500">#{muni.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{muni.nombre}</div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(muni)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(muni.id, muni.nombre)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Eliminar Municipalidad"
        message={`¿Estás seguro de eliminar la "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget({ id: null, name: '' }); }}
      />

      {/* Modal Nueva/Editar Municipalidad */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1e1f24] border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl scale-100">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {editingId ? 'Editar Municipalidad' : 'Registrar Municipalidad'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Ingresa el nombre oficial de la municipalidad.
            </p>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300 text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/20">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Nombre de la Municipalidad
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej. Municipalidad de Lima"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {editingId ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
