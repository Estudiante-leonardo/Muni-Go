import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Clock, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { MunicipalidadContext } from '../context/MunicipalidadContext';
import { API_ENDPOINTS } from '../lib/constants';
import logoSvg from '../assets/Logo-MuniGo.svg';
import DashboardHero from '../components/dashboard/DashboardHero';
import StatCard from '../components/dashboard/StatCard';
import CategoryCard from '../components/dashboard/CategoryCard';
import NewsCard from '../components/dashboard/NewsCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedMunicipalidadId, municipalidades, loading: muniLoading } = useContext(MunicipalidadContext);
  
  const [tramitesCount, setTramitesCount] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { onOpenFaq } = useOutletContext();
  const currentMuni = municipalidades.find(m => m.id === selectedMunicipalidadId);
  const muniName = currentMuni ? currentMuni.nombre.replace('Municipalidad de ', '') : '...';

  useEffect(() => {
    if (!selectedMunicipalidadId) return;

    setLoading(true);
    axios.get(`${API_ENDPOINTS.TRAMITES}?municipalidadId=${selectedMunicipalidadId}`)
      .then(response => {
        setTramitesCount(response.data.length);
        const uniqueCats = Array.from(new Set(response.data.map(t => t.categoria)));
        setDynamicCategories(uniqueCats.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMunicipalidadId]);

  // --- Interfaz de Usuario ---
  return (
    <>
      <Helmet><title>MuniGo - Inicio | {muniName}</title></Helmet>
      <div className="space-y-12 animate-fade-in text-left">
        <DashboardHero muniName={muniName} logoUrl={logoSvg} onOpenFaq={onOpenFaq} />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard icon={FileText} value={tramitesCount} label="Servicios Listos" bgColor="bg-blue-50 dark:bg-blue-950/30" textColor="text-blue-600 dark:text-blue-400" />
        <StatCard icon={Clock} value="~5 días" label="Respuesta Promedio" bgColor="bg-emerald-50 dark:bg-emerald-950/30" textColor="text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={ShieldCheck} value="96.8%" label="Casos Resueltos" bgColor="bg-purple-50 dark:bg-purple-950/30" textColor="text-purple-600 dark:text-purple-400" />
        <StatCard icon={TrendingUp} value="1.2K+" label="Ciudadanos/Mes" bgColor="bg-amber-50 dark:bg-amber-950/30" textColor="text-amber-600 dark:text-amber-400" />
      </div>

      {/* Categorías */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Servicios por Categoría
          </h2>
          <Link
            to="/tramites"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
          >
            Ver todos los trámites
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicCategories.map((cat, index) => {
            const colors = ['blue', 'emerald', 'purple', 'amber'];
            const color = colors[index % colors.length];
            return (
              <CategoryCard key={cat} name={cat} color={color} onClick={() => navigate(`/tramites?category=${cat}`)} />
            );
          })}
        </div>
      </div>

      {/* Novedades */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Novedades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NewsCard
            tag="Tributario"
            tagColor="text-blue-600 dark:text-blue-400"
            title={`Campaña Tributaria ${muniName} 2026`}
            description="Aprovecha hasta un 15% de descuento en Arbitrios pagando tu Impuesto Predial 2026 anual antes de fin de mes."
          />
          <NewsCard
            tag="Tecnología"
            tagColor="text-indigo-600 dark:text-indigo-400"
            title="Nueva Mesa de Partes Virtual"
            description="Presenta solicitudes formales e ingresa expedientes en PDF directamente las 24 horas a través del portal de Muni-Go."
          />
        </div>
      </div>
    </div>
    </>
  );
}
