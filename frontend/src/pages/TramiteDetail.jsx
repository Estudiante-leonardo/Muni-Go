import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumenIA } from '../utils/helpers';
import PanelChatbot from '../components/PanelChatbot';
import { MunicipalidadContext } from '../context/MunicipalidadContext';
import useTTS from '../hooks/useTTS';
import { API_ENDPOINTS } from '../lib/constants';
import PdfPreviewModal from '../components/PdfPreviewModal';
import LoadingSpinner from '../components/LoadingSpinner';
import RequisitoList from '../components/tramite/RequisitoList';
import FormatosDescargables from '../components/tramite/FormatosDescargables';
import PasosStepper from '../components/tramite/PasosStepper';
import UbicacionCard from '../components/tramite/UbicacionCard';
import TramiteDetailError from '../components/tramite/TramiteDetailError';
import TramiteDetailHeader from '../components/tramite/TramiteDetailHeader';
import ResumenIA from '../components/tramite/ResumenIA';

export default function TramiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedRequisitos, setCheckedRequisitos] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const { selectedMunicipalidadId, setSelectedMunicipalidadId } = React.useContext(MunicipalidadContext);

  const tts = useTTS();

  useEffect(() => {
    setLoading(true);
    axios.get(API_ENDPOINTS.TRAMITES)
      .then(res => {
        const tramite = res.data.find(t => t.id === parseInt(id));
        if (tramite) {
          setSelectedTramite(tramite);
        } else {
          setError('Trámite no encontrado');
        }
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor backend.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!selectedTramite || !selectedMunicipalidadId) return;

    if (selectedTramite.municipalidadId && selectedTramite.municipalidadId !== selectedMunicipalidadId) {
      axios.get(`${API_ENDPOINTS.TRAMITES}?municipalidadId=${selectedMunicipalidadId}`)
        .then(res => {
          const matchingTramite = res.data.find(t => t.nombre === selectedTramite.nombre);
          if (matchingTramite) {
            navigate(`/tramites/${matchingTramite.id}`);
          } else {
            setAlertMessage('Esta municipalidad no cuenta con este trámite específico.');
            setSelectedMunicipalidadId(selectedTramite.municipalidadId);
          }
        })
        .catch(() => {
          setSelectedMunicipalidadId(selectedTramite.municipalidadId);
        });
    }
  }, [selectedMunicipalidadId, selectedTramite, navigate, setSelectedMunicipalidadId]);

  if (loading) {
    return <LoadingSpinner message="Cargando detalles..." />;
  }

  if (error || !selectedTramite) {
    return <TramiteDetailError error={error} onGoBack={() => navigate('/tramites')} />;
  }

  const handleToggleRequisito = (reqId) => {
    setCheckedRequisitos(prev => ({
      ...prev,
      [reqId]: !prev[reqId]
    }));
  };

  // --- Interfaz de Usuario ---
  return (
    <>
      <Helmet><title>MuniGo - {selectedTramite.nombre}</title></Helmet>

      {alertMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 px-6 py-3 rounded-xl shadow-lg text-sm font-semibold max-w-md text-center">
          {alertMessage}
          <button onClick={() => setAlertMessage(null)} className="ml-3 text-red-500 hover:text-red-700 font-bold" aria-label="Cerrar notificación">×</button>
        </div>
      )}

      <div className="flex flex-col">

      {/* Contenido Principal del Detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">

        {/* Columna de Información */}
          <div className="lg:col-span-2 w-full bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-8 rounded-3xl shadow-sm transition-colors duration-300 relative z-10">

          <TramiteDetailHeader
            titulo={selectedTramite.nombre}
            tts={tts}
            textoCompleto={`${selectedTramite.nombre}. ${getResumenIA(selectedTramite)}. Requisitos: ${selectedTramite.requisitos?.map(r => r.descripcion).join('. ') || 'Ninguno'}. Pasos: ${selectedTramite.pasos?.sort((a, b) => a.numero - b.numero).map(p => `${p.titulo}: ${p.descripcion}`).join('. ') || 'No hay pasos detallados'}.`}
          />

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-bold mb-6">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Costo:</span> <span className="text-slate-800 dark:text-slate-200">S/ {selectedTramite.costo === 0 ? 'Gratuito' : selectedTramite.costo}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Plazo estimado:</span> <span className="text-slate-800 dark:text-slate-200">{selectedTramite.tiempoEstimado}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Categoría:</span> <span className="text-slate-800 dark:text-slate-200">{selectedTramite.categoria}</span>
            </div>
          </div>

          <ResumenIA tramite={selectedTramite} />

          {/* Requisitos */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Requisitos Oficiales:
            </h3>
            <RequisitoList requisitos={selectedTramite.requisitos} checkedItems={checkedRequisitos} onToggle={handleToggleRequisito} />
          </div>

          {/* Formatos */}
          <div className="mt-8 bg-slate-50 dark:bg-[#15161c] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Download className="w-5 h-5 text-slate-500" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Formatos para descargar</h4>
            </div>
            <FormatosDescargables formatos={selectedTramite.formatos} onPreview={setPreviewPdf} />
          </div>

          {/* Pasos a Seguir */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Pasos a seguir:
            </h3>
            <PasosStepper pasos={selectedTramite.pasos} />
          </div>

          {/* Ubicación */}
          <UbicacionCard lugar={selectedTramite.lugar} />

        </div>

        {/* Columna del Chatbot */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-28 h-[calc(100vh-8rem)] min-h-[500px] max-h-[900px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm z-20">
          <PanelChatbot tramite={selectedTramite} />
        </div>

      </div>
      </div>

      {previewPdf && (
        <PdfPreviewModal
          pdfUrl="/formatos/placeholder.pdf"
          formatoNombre={previewPdf.nombre}
          onClose={() => setPreviewPdf(null)}
        />
      )}
    </>
  );
}
