import React, { useRef, useEffect, useState } from 'react';
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function AdminCharts({ consultas = [], usuarios = [], accesibilidad = [] }) {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.4)'); // Indigo 500
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      setGradient(grad);
    }
  }, [usuarios]);

  const mesesOrden = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const mesesConsultas = mesesOrden.filter(m => consultas.some(c => c.mes === m));
  const barData = {
    labels: mesesConsultas.length ? mesesConsultas : ['Sin datos'],
    datasets: [
      {
        label: 'IA',
        data: mesesConsultas.length ? mesesConsultas.map(m => {
          const item = consultas.find(c => c.mes === m && c.tipo === 'IA');
          return item ? item.cantidad : 0;
        }) : [0],
        backgroundColor: '#4f46e5', // Indigo 600
        hoverBackgroundColor: '#4338ca', // Indigo 700
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 16,
      },
      {
        label: 'Tradicional',
        data: mesesConsultas.length ? mesesConsultas.map(m => {
          const item = consultas.find(c => c.mes === m && c.tipo === 'TRADICIONAL');
          return item ? item.cantidad : 0;
        }) : [0],
        backgroundColor: '#e2e8f0', // Slate 200
        hoverBackgroundColor: '#cbd5e1', // Slate 300
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 16,
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
        titleColor: '#fff', 
        bodyColor: '#e2e8f0', 
        padding: 14, 
        cornerRadius: 12, 
        titleFont: { size: 14, family: 'Inter', weight: 'bold' },
        bodyFont: { size: 13, family: 'Inter' }
      }
    },
    scales: {
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter' } } },
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter' } } }
    }
  };

  const mesesUsuarios = mesesOrden.filter(m => usuarios.some(u => u.mes === m));
  const lineData = {
    labels: mesesUsuarios.length ? mesesUsuarios : ['Sin datos'],
    datasets: [{
      label: 'Usuarios Activos Diarios',
      data: mesesUsuarios.length ? mesesUsuarios.map(m => {
        const item = usuarios.find(u => u.mes === m);
        return item ? item.usuariosActivosPromedio : 0;
      }) : [0],
      borderColor: '#6366f1', // Indigo 500
      backgroundColor: gradient || 'rgba(99, 102, 241, 0.2)',
      borderWidth: 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#6366f1',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.5 
    }]
  };

  const doughnutData = {
    labels: accesibilidad.length ? accesibilidad.map(a => a.herramienta) : ['Sin datos'],
    datasets: [{
      data: accesibilidad.length ? accesibilidad.map(a => a.porcentaje) : [100],
      backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe'],
      hoverBackgroundColor: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: '75%', 
    plugins: {
      ...commonOptions.plugins,
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 24, color: '#64748b', font: { family: 'Inter', weight: '500' } } },
    },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Análisis de Desempeño
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Tendencias y uso de la plataforma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#15171c] border border-slate-200/80 dark:border-white/[0.04] rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Volumen de Consultas</h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> IA</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Trad.</span>
            </div>
          </div>
          <div className="h-[250px]">
            <Bar data={barData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#15171c] border border-slate-200/80 dark:border-white/[0.04] rounded-3xl p-7 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-8">Crecimiento de Usuarios</h3>
          <div className="h-[250px]">
            <Line ref={chartRef} data={lineData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#15171c] border border-slate-200/80 dark:border-white/[0.04] rounded-3xl p-7 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6">Uso de Accesibilidad</h3>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {accesibilidad.length > 0 ? (
              accesibilidad.map((item, idx) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
                const bgColor = colors[idx % colors.length];
                return (
                  <div key={idx} className="space-y-2 w-full">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-700 dark:text-slate-300">{item.herramienta}</span>
                      <span className="text-slate-900 dark:text-white">{item.porcentaje}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                      <div className={`h-full rounded-full ${bgColor} transition-all duration-1000 ease-out relative`} style={{ width: `${item.porcentaje}%` }}>
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">No hay datos disponibles</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
