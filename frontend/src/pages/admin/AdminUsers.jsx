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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Administradores</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Gestión de usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Nuevo Admin
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Crear Nuevo Administrador</h3>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">{formError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Usuario</label>
              <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
              <input type="text" required value={form.nombreCompleto} onChange={e => setForm({ ...form, nombreCompleto: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ADMIN_MUNICIPAL">Admin Municipal</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            {form.rol === 'ADMIN_MUNICIPAL' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Municipalidad</label>
                <select required value={form.municipalidadId} onChange={e => setForm({ ...form, municipalidadId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Seleccionar municipalidad...</option>
                  {municipalidades.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                Cancelar
              </button>
              <button type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer">
                Crear Administrador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Municipalidad</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {admins.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-white">{a.username}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400">{a.nombreCompleto}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                        a.rol === 'SUPER_ADMIN'
                          ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                          : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {a.rol === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Municipal'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                      {a.municipalidadId ? `ID: ${a.municipalidadId}` : 'Todas'}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(a.id, a.username)}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
