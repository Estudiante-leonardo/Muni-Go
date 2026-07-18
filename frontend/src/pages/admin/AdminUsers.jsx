import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../lib/constants';

export default function AdminUsers() {
  const { token } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', nombreCompleto: '', rol: 'ADMIN_MUNICIPAL', municipalidadId: '' });
  const [formError, setFormError] = useState('');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAdmins = () => {
    axios.get(API_ENDPOINTS.ADMIN_USERS, authHeaders)
      .then(res => setAdmins(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
    axios.get(API_ENDPOINTS.MUNICIPALIDADES)
      .then(res => setMunicipalidades(res.data))
      .catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post(API_ENDPOINTS.ADMIN_USERS, {
        ...form,
        municipalidadId: form.rol === 'SUPER_ADMIN' ? null : Number(form.municipalidadId)
      }, authHeaders);
      setShowForm(false);
      setForm({ username: '', password: '', nombreCompleto: '', rol: 'ADMIN_MUNICIPAL', municipalidadId: '' });
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al crear administrador');
    }
  };

  const handleDelete = async (id, username) => {
    if (!confirm(`¿Eliminar al administrador "${username}"?`)) return;
    try {
      await axios.delete(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, authHeaders);
      fetchAdmins();
    } catch {
      alert('Error al eliminar');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all font-medium";
  const selectClass = `${inputClass} cursor-pointer appearance-none`;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            Administradores
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 ml-[52px] sm:ml-[52px]">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer group"
        >
          <svg className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {showForm ? 'Cancelar' : 'Nuevo Admin'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Crear Nuevo Administrador</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completa los datos para registrar un nuevo usuario</p>
            </div>
          </div>

          {formError && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200/80 dark:border-red-400/20 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{formError}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Usuario</label>
              <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className={inputClass} placeholder="nombre.usuario"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className={inputClass} placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input type="text" required value={form.nombreCompleto} onChange={e => setForm({ ...form, nombreCompleto: e.target.value })}
                className={inputClass} placeholder="Juan Pérez García"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                className={selectClass}
              >
                <option value="ADMIN_MUNICIPAL">Admin Municipal</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            {form.rol === 'ADMIN_MUNICIPAL' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Municipalidad</label>
                <select required value={form.municipalidadId} onChange={e => setForm({ ...form, municipalidadId: e.target.value })}
                  className={selectClass}
                >
                  <option value="">Seleccionar municipalidad...</option>
                  {municipalidades.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 justify-end pt-3 border-t border-slate-200/50 dark:border-white/[0.04] mt-1">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer order-2 sm:order-1">
                Cancelar
              </button>
              <button type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer order-1 sm:order-2">
                Crear Administrador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white/70 dark:bg-white/[0.04] backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.06] rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200/60 dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Lista de Administradores
            </h2>
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">
              {admins.length} usuarios
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-10 sm:p-16 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-[3px] border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Cargando administradores...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-white/[0.02]">
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Municipalidad</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-white/[0.04]">
                  {admins.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${a.rol === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                            {a.nombreCompleto?.charAt(0) || a.username?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-white">{a.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{a.nombreCompleto}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                          a.rol === 'SUPER_ADMIN'
                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${a.rol === 'SUPER_ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                          {a.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Municipal'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {a.municipalidadId ? `ID: ${a.municipalidadId}` : (
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">Todas</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(a.id, a.username)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50/0 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer opacity-60 group-hover:opacity-100"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-slate-100/80 dark:divide-white/[0.04]">
              {admins.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${a.rol === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
                      {a.nombreCompleto?.charAt(0) || a.username?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{a.nombreCompleto}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">@{a.username}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(a.id, a.username)}
                          className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          a.rol === 'SUPER_ADMIN'
                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${a.rol === 'SUPER_ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                          {a.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {a.municipalidadId ? `Muni #${a.municipalidadId}` : 'Todas'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
