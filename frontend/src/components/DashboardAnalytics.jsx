import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MunicipalidadContext } from '../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../lib/constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const PIE_COLORS = ['#8b5cf6', '#f59e0b', '#ef4444', '#cbd5e1'];

export default function DashboardAnalytics() {
  const { selectedMunicipalidadId } = useContext(MunicipalidadContext);
  const [consultas, setConsultas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [accesibilidad, setAccesibilidad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedMunicipalidadId) return;
    setLoading(true);

    Promise.all([
      axios.get(`${API_ENDPOINTS.ESTADISTICAS_CONSULTAS}?municipalidadId=${selectedMunicipalidadId}`),
      axios.get(`${API_ENDPOINTS.ESTADISTICAS_USUARIOS}?municipalidadId=${selectedMunicipalidadId}`),
      axios.get(`${API_ENDPOINTS.ESTADISTICAS_ACCESIBILIDAD}?municipalidadId=${selectedMunicipalidadId}`)
    ])
      .then(([consultasRes, usuariosRes, accesibilidadRes]) => {
        setConsultas(consultasRes.data);
        setUsuarios(usuariosRes.data);
        setAccesibilidad(accesibilidadRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedMunicipalidadId]);

  // Extraer meses únicos de consultas (en orden)
  const mesesOrden = ['Julio', 'Agosto', 'Septiembre'];
  const mesesConsultas = mesesOrden.filter(m =>
    consultas.some(c => c.mes === m)
  );

  // Datos para gráfico de barras
  const barData = {
    labels: mesesConsultas,
    datasets: [
      {
        label: 'Consultas resueltas por IA',
        data: mesesConsultas.map(m => {
          const item = consultas.find(c => c.mes === m && c.tipo === 'IA');
          return item ? item.cantidad : 0;
        }),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      },
      {
        label: 'Consultas tradicionales',
        data: mesesConsultas.map(m => {
          const item = consultas.find(c => c.mes === m && c.tipo === 'TRADICIONAL');
          return item ? item.cantidad : 0;
        }),
        backgroundColor: '#94a3b8',
        borderRadius: 4
      }
    ]
  };

  // Datos para gráfico de líneas
  const mesesUsuarios = mesesOrden.filter(m =>
    usuarios.some(u => u.mes === m)
  );

  const lineData = {
    labels: mesesUsuarios,
    datasets: [{
      label: 'Usuarios Activos Diarios (Promedio)',
      data: mesesUsuarios.map(m => {
        const item = usuarios.find(u => u.mes === m);
        return item ? item.usuariosActivosPromedio : 0;
      }),
      borderColor: '#10b981',
      backgroundColor: '#10b981',
      borderWidth: 3,
      fill: false,
      tension: 0,
      pointRadius: 6,
      pointHoverRadius: 9,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  // Datos para gráfico de pastel
  const pieData = {
    labels: accesibilidad.map(a => a.herramienta),
    datasets: [{
      data: accesibilidad.map(a => a.porcentaje),
      backgroundColor: PIE_COLORS.slice(0, accesibilidad.length),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const axisOptions = (xLabel, yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { title: { display: true, text: `x=${xLabel}`, font: { weight: 'bold' }, color: '#4b5563' } },
      y: { beginAtZero: true, title: { display: true, text: `y=${yLabel}`, font: { weight: 'bold' }, color: '#4b5563' } }
    }
  });

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 15 } },
      title: { display: true, text: 'x=Categorías, y=%', position: 'bottom', color: '#4b5563' }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Dashboard Analítico
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm h-80 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-4" />
              <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título de sección */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
        A. Análisis Descriptivo
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-2">(Julio - Septiembre 2026)</span>
      </h2>

      {/* 3 Gráficos al lado del otro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras */}
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center mb-4">
            Consultas: IA vs Tradicional
          </h3>
          <div className="relative h-64 w-full">
            <Bar data={barData} options={axisOptions('Meses', 'Consultas')} />
          </div>
        </div>

        {/* Gráfico de Líneas (estilo bolsa de valores) */}
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center mb-4">
            Crecimiento de Usuarios Activos
          </h3>
          <div className="relative w-full flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-3/4 h-64">
              <Line data={lineData} options={axisOptions('Meses', 'Usuarios')} />
            </div>
            <div className="w-full lg:w-1/4 mt-4 lg:mt-0 lg:pl-2 flex flex-col justify-center items-center lg:items-start">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Variables</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                {mesesUsuarios.map(m => {
                  const item = usuarios.find(u => u.mes === m);
                  return (
                    <li key={m} className="flex items-center">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 flex-shrink-0" />
                      {m.substring(0, 3)}: {item ? item.usuariosActivosPromedio.toLocaleString() : 0}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Gráfico de Pastel */}
        <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center mb-4">
            Uso de Accesibilidad (%)
          </h3>
          <div className="relative h-64 w-full flex justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Título Predictivo */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-4">
        B. Análisis Predictivo
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-2">(Octubre - Diciembre 2026)</span>
      </h2>

      {/* 3 Casos de Uso Predictivos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caso 1 - Escalabilidad IA */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h4 className="font-bold text-blue-900 dark:text-blue-300 text-base mb-3 flex items-center">
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 w-7 h-7 rounded-full flex justify-center items-center mr-2 text-xs font-black">1</span>
            Escalabilidad de la IA
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">
            <strong>Tendencia (Jul-Sep):</strong> Las consultas delegadas a la IA crecieron un 267%.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            <strong>Predicción (Oct-Dic):</strong> Se espera que en diciembre la IA procese el 85% de las consultas totales.
          </p>
          <div className="mt-3 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-900/30 text-xs">
            <strong className="text-blue-800 dark:text-blue-400 block mb-1">💡 Caso de Uso:</strong>
            <span className="text-slate-600 dark:text-slate-400">Implementar auto-escalado en servidores del chatbot y caché a las preguntas frecuentes para reducir costos de API.</span>
          </div>
        </div>

        {/* Caso 2 - Retención */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-base mb-3 flex items-center">
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 w-7 h-7 rounded-full flex justify-center items-center mr-2 text-xs font-black">2</span>
            Retención de Usuarios
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">
            <strong>Tendencia (Jul-Sep):</strong> Los usuarios activos crecieron un 147% en 3 meses.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            <strong>Predicción (Oct-Dic):</strong> El pico se dará en noviembre por campañas de amnistía municipal.
          </p>
          <div className="mt-3 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-xs">
            <strong className="text-emerald-800 dark:text-emerald-400 block mb-1">💡 Caso de Uso:</strong>
            <span className="text-slate-600 dark:text-slate-400">Lanzar notificaciones automatizadas a mitad de mes recordando vencimientos para distribuir la carga de usuarios.</span>
          </div>
        </div>

        {/* Caso 3 - Inclusión */}
        <div className="bg-purple-50/50 dark:bg-purple-950/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-900/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h4 className="font-bold text-purple-900 dark:text-purple-300 text-base mb-3 flex items-center">
            <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 w-7 h-7 rounded-full flex justify-center items-center mr-2 text-xs font-black">3</span>
            Mejora en Inclusión
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">
            <strong>Tendencia (Jul-Sep):</strong> El 60% de usuarios de accesibilidad eligen el "Lector de Voz".
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            <strong>Predicción (Oct-Dic):</strong> Con campañas para adultos mayores, el uso de voz se duplicará.
          </p>
          <div className="mt-3 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-purple-100 dark:border-purple-900/30 text-xs">
            <strong className="text-purple-800 dark:text-purple-400 block mb-1">💡 Caso de Uso:</strong>
            <span className="text-slate-600 dark:text-slate-400">Mejorar el motor de Text-to-Speech para soportar dialectos locales, asegurando que adultos mayores entiendan los trámites.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
