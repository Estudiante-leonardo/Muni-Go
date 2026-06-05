import React, { useState, useEffect } from 'react';

const faqs = [
  {
    question: '¿Cuáles son los horarios de atención de la Municipalidad?',
    answer: 'El horario de atención presencial es de Lunes a Viernes de 8:00 AM a 5:00 PM. Sin embargo, nuestra plataforma virtual Muni-Go está disponible las 24 horas del día para consultas y trámites digitales.'
  },
  {
    question: '¿Qué necesito para sacar una Licencia de Funcionamiento?',
    answer: 'Dependiendo del nivel de riesgo, generalmente se requiere el Formato Único de Trámite (FUT), vigencia de poder (personas jurídicas), DNI, y declaración jurada de condiciones de seguridad. Puedes buscar "Licencia de Funcionamiento" en nuestro catálogo para ver los requisitos exactos de tu municipalidad.'
  },
  {
    question: '¿Dónde puedo pagar los costos de mis trámites?',
    answer: 'Puedes realizar los pagos directamente en las cajas de la municipalidad, o mediante transferencia bancaria y plataformas digitales como Págalo.pe si tu municipalidad está afiliada.'
  },
  {
    question: '¿Cuánto tiempo tarda en aprobarse un trámite?',
    answer: 'Los tiempos varían según el tipo de trámite. Los de aprobación automática demoran máximo 1 día hábil, mientras que otros como licencias de edificación o matrimonios pueden tomar entre 15 a 30 días. Revisa el detalle de cada trámite en Muni-Go.'
  },
  {
    question: 'Tengo problemas con Muni-Go, ¿con quién me contacto?',
    answer: 'Si presentas problemas técnicos o necesitas orientación, puedes escribirnos al correo soporte@munigo.pe o comunicarte con nuestro asistente virtual desde el ícono de chat en la esquina inferior derecha.'
  }
];

export default function FaqModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const firstElement = document.getElementById('close-faq');
        const lastElement = document.getElementById('last-faq-link');

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isOpen) {
      setTimeout(() => {
        document.getElementById('close-faq')?.focus();
      }, 50);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="faq-title"
        className="relative bg-white dark:bg-[#16171d] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform transition-all border border-slate-200 dark:border-slate-700 overflow-hidden"
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h2 id="faq-title" className="text-xl font-bold text-slate-800 dark:text-white">Preguntas Frecuentes</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Encuentra respuestas rápidas a tus consultas comunes.</p>
          </div>
          <button
            id="close-faq"
            onClick={onClose}
            aria-label="Cerrar modal de preguntas frecuentes"
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-blue-500 shadow-md bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className={`font-semibold text-[15px] ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ¿No encontraste lo que buscabas? <br /> Usa nuestro <button id="last-faq-link" onClick={onClose} className="text-blue-600 dark:text-blue-400 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1">chatbot asistente</button> en la pantalla principal.
          </p>
        </div>
      </div>
    </div>
  );
}
