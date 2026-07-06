import React, { useEffect } from 'react';

export default function PdfPreviewModal({ pdfUrl, formatoNombre, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      document.getElementById('close-preview')?.focus();
    }, 50);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Vista previa: ${formatoNombre}`}
        className="relative bg-white dark:bg-[#16171d] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
            Vista previa: {formatoNombre}
          </h3>
          <button
            id="close-preview"
            onClick={onClose}
            aria-label="Cerrar vista previa"
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <iframe
            src={pdfUrl}
            title={`Vista previa de ${formatoNombre}`}
            className="w-full h-full border-0"
            style={{ minHeight: '70vh' }}
          />
        </div>
      </div>
    </div>
  );
}
