import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../lib/constants';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_ENDPOINTS.ADMIN_TRAMITES, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTramites(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Bienvenido, {user?.nombreCompleto}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {user?.rol === 'SUPER_ADMIN'
            ? 'Tienes acceso total al sistema'
            : 'Administración de trámites de tu municipalidad'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{tramites.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Trámites Registrados</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {[...new Set(tramites.map(t => t.categoria))].length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Categorías</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {user?.rol === 'SUPER_ADMIN' ? 'Total' : 'Local'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nivel de Acceso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tramites Table */}
      <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Trámites Registrados</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {user?.rol === 'SUPER_ADMIN' ? 'Todas las municipalidades' : 'Tu municipalidad asignada'}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-slate-400 mt-3">Cargando trámites...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {tramites.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500">#{t.id}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-white">{t.nombre}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold rounded-lg">
                        {t.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {t.costo == 0 ? 'Gratuito' : `S/ ${t.costo}`}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 font-medium">{t.tiempoEstimado}</td>
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
