import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

export default function PanelChatbot({ tramite }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chat history whenever the selected procedure changes
  useEffect(() => {
    if (tramite) {
      setMessages([
        {
          id: 1,
          sender: 'ia',
          text: `¡Hola! Soy tu Asistente Municipal IA. Estoy aquí para ayudarte específicamente con tu consulta sobre "${tramite.nombre}". ¿Qué duda tienes sobre los requisitos o el proceso?`
        }
      ]);
    }
  }, [tramite]);

  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Simulate AI thinking delay (1.5 seconds)
    setTimeout(() => {
      let replyText = '';
      const normalizedQuery = userMessageText.toLowerCase();

      if (normalizedQuery.includes('croquis') || normalizedQuery.includes('dibujo')) {
        replyText = 'El croquis de distribución puede ser dibujado a mano alzada, no necesitas un arquitecto para locales pequeños. Solo marca calles principales e ingresos.';
      } else if (normalizedQuery.includes('fut') || normalizedQuery.includes('formulario')) {
        replyText = `El Formulario Único de Trámite (FUT) es totalmente gratuito y se pide en mesa de partes para iniciar la solicitud de "${tramite.nombre}".`;
      } else if (normalizedQuery.includes('tiempo')) {
        replyText = `Este trámite (${tramite.nombre}) demora aproximadamente ${tramite.tiempoEstimado} hábiles una vez entregados todos los requisitos oficiales.`;
      } else {
        replyText = `Para resolver dudas adicionales sobre el trámite de "${tramite.nombre}", te invitamos a acercarte a la ventanilla de atención al ciudadano en el palacio municipal.`;
      }

      const iaMessage = {
        id: Date.now() + 1,
        sender: 'ia',
        text: replyText
      };

      setMessages((prev) => [...prev, iaMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[520px] w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-blue-600 px-4 py-3.5 text-white">
        <Bot className="w-6 h-6 text-blue-100" />
        <div>
          <h3 className="font-bold text-sm leading-none">Asistente de IA del Trámite</h3>
          <span className="text-[10px] text-blue-200 font-medium">En línea</span>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-grow bg-gray-50 overflow-y-auto p-4 flex flex-col space-y-3">
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
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
