import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MunicipalidadContext } from '../../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../../lib/constants';
import { BarChart3, Users, Eye, Settings2, Sparkles, Activity, Building } from 'lucide-react';
import AdminCharts from '../../components/admin/AdminCharts';
import CustomSelect from '../../components/ui/CustomSelect';

export default function AdminStats() {
  const { user } = useAuth();
  const { municipalidades, selectedMunicipalidadId, setSelectedMunicipalidadId, fetchMunicipalidades: refreshGlobalMunicipalidades } = useContext(MunicipalidadContext);
  
  const [consultas, setConsultas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [accesibilidad, setAccesibilidad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay ninguno seleccionado (y es admin), seleccionar el primero
    if (user?.rol === 'SUPER_ADMIN' && municipalidades?.length > 0 && !selectedMunicipalidadId) {
      setSelectedMunicipalidadId(municipalidades[0].id);
    }
  }, [municipalidades, user, selectedMunicipalidadId, setSelectedMunicipalidadId]);

  // Edit Muni State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const muniId = user?.rol === 'SUPER_ADMIN' ? (selectedMunicipalidadId || 0) : (user?.municipalidadId || 0);
        const [resConsultas, resUsuarios, resAccesibilidad] = await Promise.all([
          axios.get(`${API_ENDPOINTS.ESTADISTICAS_CONSULTAS}?municipalidadId=${muniId}`),
          axios.get(`${API_ENDPOINTS.ESTADISTICAS_USUARIOS}?municipalidadId=${muniId}`),
          axios.get(`${API_ENDPOINTS.ESTADISTICAS_ACCESIBILIDAD}?municipalidadId=${muniId}`)
        ]);
        
        setConsultas(resConsultas.data);
        setUsuarios(resUsuarios.data);
        setAccesibilidad(resAccesibilidad.data);
      } catch (err) {
        console.error("Error al cargar estadísticas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, selectedMunicipalidadId]);

  const handleOpenEdit = () => {
    const muni = municipalidades?.find(m => String(m.id) === String(user?.municipalidadId));
    const muniName = muni ? muni.nombre : (user?.municipalidadId ? `Municipalidad ${user.municipalidadId}` : '');
    setFormName(muniName);
    setFormError('');
    setShowEditModal(true);
  };

  const handleEditMuni = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setFormError('');
    try {
      await axios.put(`${API_ENDPOINTS.MUNICIPALIDADES}/${user.municipalidadId}`, { nombre: formName });
      setFormSuccess('Municipalidad actualizada con éxito.');
      setShowEditModal(false);
      if (refreshGlobalMunicipalidades) refreshGlobalMunicipalidades();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al actualizar la municipalidad.');
    }
  };

  const totalConsultas = Array.isArray(consultas) ? consultas.reduce((acc, curr) => acc + (curr.cantidadConsultas || 0), 0) : 0;
  const totalUsuarios = Array.isArray(usuarios) ? usuarios.reduce((acc, curr) => acc + (curr.usuariosActivos || 0), 0) : 0;
  const totalAccesibilidad = Array.isArray(accesibilidad) ? accesibilidad.reduce((acc, curr) => acc + (curr.vecesUsado || 0), 0) : 0;
  
  if (loading && (!consultas.length && !usuarios.length)) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Preparando tu panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-[#0f1115] dark:to-[#15171c] border-0 dark:border dark:border-white/[0.05] rounded-3xl p-8 sm:p-10 shadow-lg dark:shadow-sm">
        {/* Capa de fondo con overflow hidden para las chispas */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 p-8 opacity-20 dark:opacity-[0.05]">
            <Sparkles className="w-64 h-64 text-white dark:text-indigo-500" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-indigo-500/10 !text-white dark:!text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm self-start">
                <Activity className="w-4 h-4" />
                Vista General
              </div>
              
              {/* Selector para Super Admin */}
              {user?.rol === 'SUPER_ADMIN' && municipalidades?.length > 0 && (
                <div className="relative z-50 flex items-center gap-3 min-w-[200px]">
                  <CustomSelect
                    value={selectedMunicipalidadId}
                    onChange={(val) => setSelectedMunicipalidadId(parseInt(val))}
                    options={municipalidades.map(m => ({ label: m.nombre, value: m.id }))}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 !text-white backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl shadow-sm text-sm font-bold"
                    placeholder="Seleccione..."
                    required={true}
                  />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black !text-white tracking-tight drop-shadow-md">
              Hola, Administrador
            </h1>
            <p className="text-base !text-white/90 dark:!text-slate-300 font-medium max-w-lg">
              Aquí tienes el rendimiento de {user?.rol === 'SUPER_ADMIN' ? 'la municipalidad seleccionada' : 'tu municipalidad'} en tiempo real.
            </p>
          </div>

          {user?.rol === 'ADMIN_MUNICIPAL' && (
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-white hover:bg-slate-50 dark:hover:bg-slate-100 text-indigo-700 dark:text-slate-900 font-bold rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0"
            >
              <Settings2 className="w-4 h-4" />
              Editar Municipalidad
            </button>
          )}
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
          {formSuccess}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 font-semibold text-sm">
          {formError}
        </div>
      )}

      {/* Visualización Gráfica Rediseñada */}
      {loading ? (
         <div className="h-64 flex items-center justify-center">
           <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
         </div>
      ) : (
        <AdminCharts consultas={consultas} usuarios={usuarios} accesibilidad={accesibilidad} />
      )}

      {/* Modal Editar Municipalidad Premium */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#15171c] border border-slate-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ajustes Municipalidad</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 pl-13">Configura los detalles de tu municipalidad.</p>
            
            <form onSubmit={handleEditMuni} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Nombre Oficial
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="Ej. Municipalidad de Lima"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-900 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all disabled:cursor-not-allowed"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
