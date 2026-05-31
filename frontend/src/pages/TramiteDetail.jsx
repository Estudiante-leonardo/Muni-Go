import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getResumenIA } from '../utils/helpers';
import PanelChatbot from '../components/PanelChatbot';
import { MunicipalidadContext } from '../context/MunicipalidadContext';

const API_URL = 'http://localhost:8081/api/tramites';

export default function TramiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedTramite, setSelectedTramite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedRequisitos, setCheckedRequisitos] = useState({});

  const { selectedMunicipalidadId, setSelectedMunicipalidadId } = React.useContext(MunicipalidadContext);

  // --- Lógica y Estado ---
  useEffect(() => {
    setLoading(true);
    axios.get(API_URL)
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
      axios.get(`${API_URL}?municipalidadId=${selectedMunicipalidadId}`)
        .then(res => {
          const matchingTramite = res.data.find(t => t.nombre === selectedTramite.nombre);
          if (matchingTramite) {
            navigate(`/tramites/${matchingTramite.id}`);
          } else {
            alert('Esta municipalidad no cuenta con este trámite específico.');
            setSelectedMunicipalidadId(selectedTramite.municipalidadId);
          }
        })
        .catch(err => {
          console.error('Error verificando trámite en otra municipalidad', err);
          setSelectedMunicipalidadId(selectedTramite.municipalidadId);
        });
    }
  }, [selectedMunicipalidadId, selectedTramite, navigate, setSelectedMunicipalidadId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !selectedTramite) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-red-800 dark:text-red-400 mb-1">Error</h3>
        <p className="text-xs text-red-705 dark:text-red-300 leading-relaxed mb-4">{error || 'Trámite no encontrado'}</p>
        <button
          onClick={() => navigate('/tramites')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const handleToggleRequisito = (reqId) => {
    setCheckedRequisitos(prev => ({
      ...prev,
      [reqId]: !prev[reqId]
    }));
  };

  // --- Interfaz de Usuario ---
  return (
    <div className="flex flex-col">

      {/* Contenido Principal del Detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">

        {/* Columna de Información */}
        <div className="lg:col-span-2 w-full bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800/80 p-5 sm:p-8 rounded-3xl shadow-sm transition-colors duration-300 relative z-10">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            {selectedTramite.nombre}
          </h2>

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

          <div className="bg-slate-50 dark:bg-[#15161c] border border-slate-150 dark:border-slate-800/60 p-5 rounded-2xl flex items-start space-x-4 mb-8">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-slate-850 dark:text-white text-sm block mb-1">Resumen Inteligente IA (Manuelito)</span>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                {getResumenIA(selectedTramite)}
              </p>
            </div>
          </div>

          {/* Requisitos */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Requisitos Oficiales:
            </h3>
            {selectedTramite.requisitos && selectedTramite.requisitos.length > 0 ? (
              <div className="space-y-3">
                {selectedTramite.requisitos.map((req) => {
                  const isChecked = checkedRequisitos[req.id] || false;
                  return (
                    <label
                      key={req.id}
                      className="flex items-start p-3.5 bg-slate-50 hover:bg-slate-100/70 dark:bg-[#15161c] dark:hover:bg-[#1d1f27] rounded-xl border border-slate-150 dark:border-slate-805 cursor-pointer select-none transition-all group text-left"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRequisito(req.id)}
                        className="mt-0.5 w-4.5 h-4.5 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-semibold transition-colors">
                        {req.descripcion}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Este trámite no tiene requisitos específicos.</p>
            )}
          </div>

          {/* Formatos */}
          <div className="mt-8 bg-slate-50 dark:bg-[#15161c] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Formatos para descargar</h4>
            </div>
            
            {(!selectedTramite.formatos || selectedTramite.formatos.length === 0) ? (
              <p className="text-sm text-slate-500 font-medium mt-4">Este trámite no cuenta con formatos adicionales para descargar.</p>
            ) : (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Imprime y llena estos documentos desde casa para evitar colas o buscar copias el mismo día.</p>
                <div className="space-y-3">
                  {selectedTramite.formatos.map(formato => (
                    <div key={formato.id} className="flex items-center justify-between bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-sm">
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{formato.nombre}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formato.descripcion}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <a href={formato.urlDescarga} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pasos a Seguir */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Pasos a seguir:
            </h3>
            {(!selectedTramite.pasos || selectedTramite.pasos.length === 0) ? (
              <div className="bg-slate-50 dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-center">
                <p className="text-sm text-slate-500 font-medium">No hay pasos específicos detallados para este trámite.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {selectedTramite.pasos.sort((a, b) => a.numero - b.numero).map((paso, index, arr) => (
                  <div key={paso.id} className="flex items-stretch relative">
                    <div className="flex flex-col items-center mr-5 w-8">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-600 dark:border-slate-400 flex items-center justify-center text-sm font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1b22] z-10 flex-shrink-0">
                        {paso.numero}
                      </div>
                      {index !== arr.length - 1 && (
                        <div className="w-[2px] bg-slate-300 dark:bg-slate-600 flex-grow my-2"></div>
                      )}
                    </div>
                    
                    <div className={`flex-1 bg-white dark:bg-[#1a1b22] border-2 border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm w-full ${index !== arr.length - 1 ? 'mb-6' : ''}`}>
                      <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200">{paso.titulo}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{paso.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ubicación */}
          {selectedTramite.lugar && (
            <div className="mt-10 bg-slate-50 dark:bg-[#15161c] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl w-full sm:w-2/3">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">¿Dónde ir?</h4>
              </div>
              <div className="bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{selectedTramite.lugar.nombre}</p>
                <p className="font-semibold text-xs text-slate-600 dark:text-slate-400 mt-1">{selectedTramite.lugar.direccion}</p>
                <p className="font-medium text-xs text-blue-600 dark:text-blue-400 mt-1">Horario: {selectedTramite.lugar.horario}</p>
              </div>
            </div>
          )}

        </div>

        {/* Columna del Chatbot */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-28 h-[calc(100vh-8rem)] min-h-[500px] max-h-[900px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm z-20">
          <PanelChatbot tramite={selectedTramite} />
        </div>

      </div>
    </div>
  );
}
