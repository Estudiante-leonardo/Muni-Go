import React from 'react';
import { Download, Eye } from 'lucide-react';

export default function FormatosDescargables({ formatos, onPreview }) {
  if (!formatos || formatos.length === 0) {
    return <p className="text-sm text-slate-500 font-medium mt-4">Este trámite no cuenta con formatos adicionales para descargar.</p>;
  }

  return (
    <>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Imprime y llena estos documentos desde casa para evitar colas o buscar copias el mismo día.</p>
      <div className="space-y-3">
        {formatos.map(formato => {
          const pdfUrl = formato.urlDescarga ? '/formatos/placeholder.pdf' : null;
          return (
            <div key={formato.id} className="flex items-center justify-between bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-sm">
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{formato.nombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formato.descripcion}</p>
              </div>
              {pdfUrl && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onPreview(formato)}
                    aria-label={`Ver ${formato.nombre}`}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <a
                    href={pdfUrl}
                    download
                    aria-label={`Descargar ${formato.nombre}`}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
