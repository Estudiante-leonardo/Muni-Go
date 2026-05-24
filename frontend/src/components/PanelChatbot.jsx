import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

export default function PanelChatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ia',
      text: '¡Hola! Soy tu Asistente Municipal IA. ¿En qué trámite o consulta te puedo orientar hoy?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

    // Add user message to history
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay (1.5 seconds)
    setTimeout(() => {
      let replyText = '';
      const normalizedQuery = userMessageText.toLowerCase();

      if (normalizedQuery.includes('croquis') || normalizedQuery.includes('dibujo')) {
        replyText = 'El croquis de distribución puede ser dibujado a mano alzada. No necesitas un arquitecto para locales pequeños; solo asegúrate de marcar claramente las calles principales, los accesos y las dimensiones básicas.';
      } else if (normalizedQuery.includes('fut') || normalizedQuery.includes('formulario')) {
        replyText = 'El Formulario Único de Trámite (FUT) es totalmente gratuito y lo puedes solicitar físicamente en Mesa de Partes o descargarlo de forma remota desde la sección de formatos de nuestro portal web.';
      } else if (normalizedQuery.includes('tiempo')) {
        replyText = 'Este trámite municipal tiene un tiempo estimado de resolución de entre 7 a 15 días hábiles a partir de la correcta presentación de todos los requisitos.';
      } else {
        replyText = 'Para esta consulta específica, te invitamos a acercarte a la ventanilla de atención al ciudadano en el palacio municipal para brindarte una asesoría personalizada.';
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
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3 bg-blue-600 px-4 py-3.5 text-white">
        <Bot className="w-6 h-6 text-blue-100" />
        <div>
          <h3 className="font-bold text-sm leading-none">Asistente Municipal IA</h3>
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
          placeholder="Pregúntale a la IA sobre este trámite..."
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
