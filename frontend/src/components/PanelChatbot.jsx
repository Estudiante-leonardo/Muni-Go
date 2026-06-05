import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic } from 'lucide-react';

export default function PanelChatbot({ tramite, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Initialize chat history whenever the selected procedure changes
  useEffect(() => {
    if (tramite) {
      setMessages([
        {
          id: 1,
          sender: 'ia',
          text: `¡Hola! Soy Manuelito, tu Asistente Municipal IA. Estoy aquí para ayudarte específicamente con tu consulta sobre "${tramite.nombre}". ¿Qué duda tienes sobre los requisitos o el proceso?`
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          sender: 'ia',
          text: '¡Hola! Soy Manuelito, tu Asistente Municipal IA de Carabayllo. ¿En qué trámite o consulta municipal te puedo guiar hoy?'
        }
      ]);
    }
  }, [tramite]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userMessageText
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      const normalizedQuery = userMessageText.toLowerCase();

      if (normalizedQuery.includes('croquis') || normalizedQuery.includes('dibujo')) {
        replyText = 'El croquis de distribución puede ser dibujado a mano alzada, no necesitas un arquitecto para locales pequeños. Solo marca calles principales e ingresos.';
      } else if (normalizedQuery.includes('fut') || normalizedQuery.includes('formulario')) {
        replyText = `El Formulario Único de Trámite (FUT) es totalmente gratuito y se pide en mesa de partes para iniciar la solicitud.`;
      } else if (normalizedQuery.includes('tiempo')) {
        replyText = tramite
          ? `Este trámite (${tramite.nombre}) demora aproximadamente ${tramite.tiempoEstimado} una vez entregados todos los requisitos oficiales.`
          : 'El tiempo de atención varía según el trámite. Por ejemplo, la Licencia de Funcionamiento toma de 15 a 20 días hábiles, los Certificados toman 3 días y las Declaratorias de Fábrica toman hasta 30 días.';
      } else if (normalizedQuery.includes('costo') || normalizedQuery.includes('precio') || normalizedQuery.includes('pagar')) {
        replyText = tramite
          ? `El costo de este trámite (${tramite.nombre}) es de S/ ${tramite.costo === 0 ? 'Gratuito' : tramite.costo}.`
          : 'Los costos oficiales varían: la Licencia de Funcionamiento cuesta S/ 120, el Certificado de Jurisdicción S/ 25, la Declaratoria de Fábrica S/ 350, y las Licencias de Edificación S/ 220. El trámite de Impuesto Predial es gratuito para su presentación.';
      } else if (normalizedQuery.includes('licencia') && normalizedQuery.includes('conducir')) {
        replyText = 'Para la Licencia de Conducir de Vehículos Menores (Mototaxis), necesitas: Copia DNI, examen médico psicosomático aprobado, examen de reglas de tránsito, dos fotos tamaño carné fondo blanco y el derecho de trámite de S/ 85.';
      } else if (normalizedQuery.includes('impuesto') || normalizedQuery.includes('arbitrios') || normalizedQuery.includes('predial')) {
        replyText = 'Para presentar tu Declaración Jurada de Impuesto Predial y Arbitrios, debes traer la copia del DNI del propietario, la copia del testimonio de propiedad o compraventa, y el formulario de autoavalúo (PU y HR) del año vigente.';
      } else {
        replyText = tramite
          ? `Para resolver dudas adicionales sobre el trámite de "${tramite.nombre}", te invitamos a acercarte a la ventanilla de atención al ciudadano en el palacio municipal.`
          : 'Puedo darte detalles sobre Licencias de Funcionamiento, de Edificación, Licencia de Conducir Mototaxis, Certificados de Domicilio, Declaratorias de Fábrica e Impuestos Municipales. ¿Sobre cuál deseas consultar?';
      }

      const iaMessage = {
        id: Date.now() + 1,
        sender: 'ia',
        text: replyText
      };

      setMessages((prev) => [...prev, iaMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#16171d] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3.5 text-white">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-blue-100" />
          <div>
            <h3 className="font-bold text-sm leading-none">Asistente de IA del Trámite</h3>
            <span className="text-[10px] text-blue-200 font-medium">En línea</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Cerrar asistente de IA" className="p-1 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Messages List Area */}
      <div ref={chatContainerRef} className="flex-grow bg-gray-50 overflow-y-auto p-4 flex flex-col space-y-3" aria-live="polite" aria-atomic="false">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`text-sm px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-white border border-slate-200 text-slate-400 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center space-x-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Form Area */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale a la IA sobre este trámite... Ej: ¿Cómo hago el croquis?"
          className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-800 placeholder-slate-400"
        />
        <button
          type="button"
          aria-label="Hablar por micrófono (Próximamente)"
          title="Próximamente: Dictado por voz"
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          aria-label="Enviar mensaje"
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
