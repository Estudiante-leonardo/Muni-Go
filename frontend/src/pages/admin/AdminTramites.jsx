import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MunicipalidadContext } from '../../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../../lib/constants';
import ConfirmModal from '../../components/ConfirmModal';
import CustomSelect from '../../components/ui/CustomSelect';

export default function AdminTramites() {
  const { user } = useAuth();
  const { fetchMunicipalidades: refreshGlobalMunicipalidades } = useContext(MunicipalidadContext);
  const [tramites, setTramites] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: '' });

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    costo: 0,
    tiempoEstimado: '',
    categoria: '',
    municipalidadId: '',
    requisitos: [],
    formatos: [],
    pasos: [],
    lugar: { nombre: '', direccion: '', horario: '' }
  });

  const fetchTramites = () => {
    setLoading(true);
    axios.get(API_ENDPOINTS.ADMIN_TRAMITES)
      .then(res => {
        const sorted = res.data.sort((a, b) => a.id - b.id);
        setTramites(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchMunicipalidades = () => {
    axios.get(API_ENDPOINTS.MUNICIPALIDADES)
      .then(res => setMunicipalidades(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTramites();
    fetchMunicipalidades();
  }, []);

  const handleDelete = async (id, name) => {
    setDeleteTarget({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_ENDPOINTS.ADMIN_TRAMITES}/${deleteTarget.id}`);
      fetchTramites();
      setFormSuccess('Trámite eliminado con éxito.');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError('Error al eliminar el trámite.');
      setTimeout(() => setFormError(''), 3000);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget({ id: null, name: '' });
    }
  };

  const handleEdit = (tramite) => {
    setEditingId(tramite.id);
    setForm({
      nombre: tramite.nombre || '',
      descripcion: tramite.descripcion || '',
      costo: tramite.costo || 0,
      tiempoEstimado: tramite.tiempoEstimado || '',
      categoria: tramite.categoria || '',
      municipalidadId: tramite.municipalidadId || '',
      requisitos: tramite.requisitos ? tramite.requisitos.map(r => ({ id: r.id, descripcion: r.descripcion })) : [],
      formatos: tramite.formatos ? tramite.formatos.map(f => ({ id: f.id, nombre: f.nombre, descripcion: f.descripcion, urlDescarga: f.urlDescarga })) : [],
      pasos: tramite.pasos ? tramite.pasos.map(p => ({ id: p.id, numero: p.numero, titulo: p.titulo, descripcion: p.descripcion })).sort((a,b) => a.numero - b.numero) : [],
      lugar: tramite.lugar ? { id: tramite.lugar.id, nombre: tramite.lugar.nombre, direccion: tramite.lugar.direccion, horario: tramite.lugar.horario } : { nombre: '', direccion: '', horario: '' }
    });
    setFormError('');
    setShowForm(true);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewForm = () => {
    setEditingId(null);
    setForm({
      nombre: '',
      descripcion: '',
      costo: 0,
      tiempoEstimado: '',
      categoria: '',
      municipalidadId: user?.rol === 'SUPER_ADMIN' ? '' : user?.municipalidadId || '',
      requisitos: [],
      formatos: [],
      pasos: [],
      lugar: { nombre: '', direccion: '', horario: '' }
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validations
    if (user?.rol === 'SUPER_ADMIN' && !form.municipalidadId) {
      setFormError('Debe seleccionar una municipalidad.');
      return;
    }

    try {
      const payload = {
        ...form,
        costo: Number(form.costo),
        municipalidadId: user?.rol === 'SUPER_ADMIN' ? Number(form.municipalidadId) : user?.municipalidadId
      };

      if (editingId) {
        await axios.put(`${API_ENDPOINTS.ADMIN_TRAMITES}/${editingId}`, payload);
        setFormSuccess('Trámite actualizado con éxito.');
      } else {
        await axios.post(API_ENDPOINTS.ADMIN_TRAMITES, payload);
        setFormSuccess('Trámite creado con éxito.');
      }
      
      setShowForm(false);
      fetchTramites();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar el trámite.');
    }
  };

  // Dynamic helpers
  const addRequisito = () => {
    setForm(prev => ({
      ...prev,
      requisitos: [...prev.requisitos, { descripcion: '' }]
    }));
  };

  const removeRequisito = (index) => {
    setForm(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index)
    }));
  };

  const handleRequisitoChange = (index, value) => {
    setForm(prev => {
      const updated = [...prev.requisitos];
      updated[index] = { ...updated[index], descripcion: value };
      return { ...prev, requisitos: updated };
    });
  };

  const addPaso = () => {
    setForm(prev => {
      const nextNum = prev.pasos.length + 1;
      return {
        ...prev,
        pasos: [...prev.pasos, { numero: nextNum, titulo: '', descripcion: '' }]
      };
    });
  };

  const removePaso = (index) => {
    setForm(prev => {
      const filtered = prev.pasos.filter((_, i) => i !== index);
      // Re-index steps
      const reindexed = filtered.map((paso, i) => ({ ...paso, numero: i + 1 }));
      return { ...prev, pasos: reindexed };
    });
  };

  const handlePasoChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.pasos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pasos: updated };
    });
  };

  const addFormato = () => {
    setForm(prev => ({
      ...prev,
      formatos: [...prev.formatos, { nombre: '', descripcion: '', urlDescarga: '' }]
    }));
  };

  const removeFormato = (index) => {
    setForm(prev => ({
      ...prev,
      formatos: prev.formatos.filter((_, i) => i !== index)
    }));
  };

  const handleFormatoChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.formatos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, formatos: updated };
    });
  };

  const handleLugarChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      lugar: { ...prev.lugar, [field]: value }
    }));
  };

  // Filter & Search logic
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.descripcion && t.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === '' || t.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(tramites.map(t => t.categoria)));

  const inputClass = "w-full px-4 py-2.5 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-250 dark:border-white/[0.08] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-405 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all font-medium";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} aria-hidden="true" />
        <div className="absolute -top-16 -right-16 w-48 h-48 sm:w-64 sm:h-64 bg-white/[0.05] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/15 text-white/90 border border-white/20 uppercase tracking-wider mb-2">
              Gestión del Catálogo
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black !text-white leading-tight">
              Trámites Municipales
            </h1>
            <p className="text-sm text-blue-100/70 mt-1 font-medium">
              Crea, edita, actualiza requisitos, formatos, pasos y lugares de atención.
            </p>
          </div>
          
          
          <div className="flex gap-3">
            {!showForm && (
              <button
                onClick={handleOpenNewForm}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-sm shadow-lg shadow-black/10 transition-all cursor-pointer self-start sm:self-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Nuevo Trámite
              </button>
            )}
          </div>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          {formSuccess}
        </div>
      )}

      {/* CRUD Form */}
      {showForm && (
        <div className="relative z-20 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/[0.06] pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? `Editar Trámite: ${form.nombre}` : 'Crear Nuevo Trámite'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-404 font-medium mt-0.5">
                Rellena todos los campos e incluye la información detallada para los ciudadanos.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-404 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {formError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-300 font-semibold text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nombre del Trámite</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className={inputClass}
                  placeholder="Ej. Licencia de Funcionamiento - Riesgo Bajo"
                />
              </div>

              <div>
                <label className={labelClass}>Categoría</label>
                <input
                  type="text"
                  required
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  className={inputClass}
                  placeholder="Ej. Licencias, Rentas, Registro Civil"
                />
              </div>

              <div>
                <label className={labelClass}>Costo (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.costo}
                  onChange={e => setForm({ ...form, costo: e.target.value })}
                  className={inputClass}
                  placeholder="0.00 para gratuito"
                />
              </div>

              <div>
                <label className={labelClass}>Tiempo Estimado</label>
                <input
                  type="text"
                  required
                  value={form.tiempoEstimado}
                  onChange={e => setForm({ ...form, tiempoEstimado: e.target.value })}
                  className={inputClass}
                  placeholder="Ej. 5 días hábiles, Al instante"
                />
              </div>

              {user?.rol === 'SUPER_ADMIN' && (
                <div>
                  <label className={labelClass}>Municipalidad Asignada</label>
                  <CustomSelect
                    required
                    value={form.municipalidadId}
                    onChange={value => setForm({ ...form, municipalidadId: value })}
                    options={municipalidades.map(m => ({ value: m.id, label: m.nombre }))}
                    placeholder="Seleccione municipalidad..."
                    className={inputClass}
                  />
                </div>
              )}

              <div className="sm:col-span-2 md:col-span-3">
                <label className={labelClass}>Descripción del Servicio</label>
                <textarea
                  rows="3"
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  className={inputClass}
                  placeholder="Explique detalladamente en qué consiste este servicio o trámite municipal..."
                />
              </div>
            </div>

            {/* Lugar de Atención */}
            <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-6">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Lugar y Horario de Atención
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nombre de la Oficina</label>
                  <input
                    type="text"
                    value={form.lugar.nombre}
                    onChange={e => handleLugarChange('nombre', e.target.value)}
                    className={inputClass}
                    placeholder="Ej. Palacio Municipal - Mesa de Partes"
                  />
                </div>
                <div>
                  <label className={labelClass}>Dirección</label>
                  <input
                    type="text"
                    value={form.lugar.direccion}
                    onChange={e => handleLugarChange('direccion', e.target.value)}
                    className={inputClass}
                    placeholder="Ej. Av. Tupac Amaru Km 18"
                  />
                </div>
                <div>
                  <label className={labelClass}>Horario de Atención</label>
                  <input
                    type="text"
                    value={form.lugar.horario}
                    onChange={e => handleLugarChange('horario', e.target.value)}
                    className={inputClass}
                    placeholder="Ej. L-V de 8:00 AM a 4:30 PM"
                  />
                </div>
              </div>
            </div>

            {/* Requisitos Section */}
            <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Requisitos ({form.requisitos.length})
                </h3>
                <button
                  type="button"
                  onClick={addRequisito}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Agregar Requisito
                </button>
              </div>

              {form.requisitos.length === 0 ? (
                <p className="text-xs text-slate-405 dark:text-slate-500 italic">No se han añadido requisitos a este trámite.</p>
              ) : (
                <div className="space-y-2.5">
                  {form.requisitos.map((req, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-650 w-5 text-right flex-shrink-0">{index + 1}.</span>
                        <input
                          type="text"
                          required
                          value={req.descripcion}
                          onChange={e => handleRequisitoChange(index, e.target.value)}
                          className={`${inputClass} flex-1 min-w-0`}
                          placeholder="Escriba el requisito formal..."
                        />
                        <button
                          type="button"
                          onClick={() => removeRequisito(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                          title="Eliminar requisito"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pasos Paso a Paso Section */}
            <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Procedimiento Paso a Paso ({form.pasos.length})
                </h3>
                <button
                  type="button"
                  onClick={addPaso}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Agregar Paso
                </button>
              </div>

              {form.pasos.length === 0 ? (
                <p className="text-xs text-slate-405 dark:text-slate-500 italic">No se han detallado pasos para el procedimiento.</p>
              ) : (
                <div className="space-y-4">
                  {form.pasos.map((paso, index) => (
                    <div key={index} className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.04] p-4 rounded-2xl relative space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg">
                          Paso {paso.numero}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePaso(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar paso"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3">
                        <div className="sm:col-span-1">
                          <label className={labelClass}>Título del Paso</label>
                          <input
                            type="text"
                            required
                            value={paso.titulo}
                            onChange={e => handlePasoChange(index, 'titulo', e.target.value)}
                            className={inputClass}
                            placeholder="Ej. Presentación del FUT"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Detalles / Instrucciones</label>
                          <input
                            type="text"
                            required
                            value={paso.descripcion}
                            onChange={e => handlePasoChange(index, 'descripcion', e.target.value)}
                            className={inputClass}
                            placeholder="Describa qué debe hacer el ciudadano en esta etapa..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formatos / Documentos Section */}
            <div className="border-t border-slate-200/60 dark:border-white/[0.06] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Formatos de Descarga / PDFs ({form.formatos.length})
                </h3>
                <button
                  type="button"
                  onClick={addFormato}
                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Agregar Formato
                </button>
              </div>

              {form.formatos.length === 0 ? (
                <p className="text-xs text-slate-405 dark:text-slate-500 italic">No se han añadido formatos o enlaces de descarga a este trámite.</p>
              ) : (
                <div className="space-y-4">
                  {form.formatos.map((fmt, index) => (
                    <div key={index} className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.04] p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Documento #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFormato(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar formato"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3">
                        <div>
                          <label className={labelClass}>Nombre del Formato</label>
                          <input
                            type="text"
                            required
                            value={fmt.nombre}
                            onChange={e => handleFormatoChange(index, 'nombre', e.target.value)}
                            className={inputClass}
                            placeholder="Ej. Formato Único FUT"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Descripción (Peso/Tipo)</label>
                          <input
                            type="text"
                            required
                            value={fmt.descripcion}
                            onChange={e => handleFormatoChange(index, 'descripcion', e.target.value)}
                            className={inputClass}
                            placeholder="Ej. PDF de descarga - 120 KB"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Enlace de Descarga / URL</label>
                          <input
                            type="text"
                            required
                            value={fmt.urlDescarga}
                            onChange={e => handleFormatoChange(index, 'urlDescarga', e.target.value)}
                            className={inputClass}
                            placeholder="Ej. /formatos/fut.pdf"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200/60 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer order-1 sm:order-2"
              >
                {editingId ? 'Guardar Cambios' : 'Crear Trámite'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      {!showForm && (
        <div className="relative z-20 flex flex-col sm:flex-row gap-4 items-center bg-white/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] p-4 rounded-2xl">
          <div className="relative flex-1 w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Buscar por nombre o descripción de trámite..."
            />
          </div>

          <div className="w-full sm:w-[220px]">
            <CustomSelect
              value={categoryFilter}
              onChange={value => setCategoryFilter(value)}
              options={categories.map(cat => ({ value: cat, label: cat }))}
              placeholder="Todas las Categorías"
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>
      )}

      {/* Trámites Table / Cards */}
      {!showForm && (
        <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Cargando trámites...</p>
              </div>
            </div>
          ) : filteredTramites.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">No se encontraron trámites</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Prueba a modificar los filtros de búsqueda o categoría.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-550/5 dark:bg-white/[0.02]">
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre del Trámite</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiempo</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 dark:divide-white/[0.04]">
                    {filteredTramites.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-5 py-4 text-xs font-bold text-slate-400 dark:text-slate-500">#{t.id}</td>
                        <td className="px-5 py-4">
                          <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{t.nombre}</div>
                            {t.lugar && (
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                {t.lugar.nombre} ({t.lugar.direccion})
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-bold rounded-lg">
                            {t.categoria}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                          {t.costo == 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Gratuito</span>
                          ) : (
                            `S/ ${t.costo.toFixed(2)}`
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{t.tiempoEstimado}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(t)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                              title="Editar trámite"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(t.id, t.nombre)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                              title="Eliminar trámite"
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

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-slate-100/80 dark:divide-white/[0.04]">
                {filteredTramites.map((t) => (
                  <div key={t.id} className="p-4 space-y-3 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{t.nombre}</div>
                        <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md mt-1.5">
                          {t.categoria}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">#{t.id}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-404 font-medium">
                      <span>Costo: {t.costo == 0 ? 'Gratuito' : `S/ ${t.costo.toFixed(2)}`}</span>
                      <span>Tiempo: {t.tiempoEstimado}</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-white/[0.02]">
                      <button
                        onClick={() => handleEdit(t)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.nombre)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <ConfirmModal
        open={deleteModalOpen}
        title="Eliminar trámite"
        message={`¿Estás seguro de eliminar el trámite "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget({ id: null, name: '' }); }}
      />
    </div>
  );
}
