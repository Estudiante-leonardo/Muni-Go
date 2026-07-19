import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bot, Send, Mic } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/constants';
import { MunicipalidadContext } from '../context/MunicipalidadContext';

export default function PanelChatbot({ tramite, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [sessionId, setSessionId] = useState(() => {
    const saved = sessionStorage.getItem('chatSessionId');
    if (saved) return saved;
    const newSession = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('chatSessionId', newSession);
    return newSession;
  });
  const { selectedMunicipalidadId, municipalidades } = useContext(MunicipalidadContext);
  
  const currentMuni = municipalidades?.find(m => m.id === selectedMunicipalidadId);
  const municipalidadNombre = currentMuni ? currentMuni.nombre : 'Muni-Go';

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Resetear el chat SOLO si cambia la municipalidad
  useEffect(() => {
    if (!selectedMunicipalidadId) return;
    const currentMuniContext = `muni_${selectedMunicipalidadId}`;
    const savedMuniContext = sessionStorage.getItem('chatMuniContext');
    
    if (savedMuniContext && savedMuniContext !== currentMuniContext) {
      const newSession = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('chatSessionId', newSession);
      setSessionId(newSession);
      setMessages([]); // Esto disparará el efecto de inicialización abajo
    }
    sessionStorage.setItem('chatMuniContext', currentMuniContext);
  }, [selectedMunicipalidadId]);

  // Guardar mensajes en sessionStorage cada vez que cambien
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Initialize chat history solo si no hay mensajes previos en la sesión
  useEffect(() => {
    if (messages.length > 0) return; // Ya hay historial en la sesión

    if (tramite) {
      setMessages([
        {
          id: 1,
          sender: 'ia',
          text: `¡Hola! Soy Manuelito, tu Asistente Municipal IA. Estoy aquí para ayudarte específicamente con tu consulta sobre "${tramite.nombre}". ¿Qué duda tienes sobre los requisitos o el proceso?`
        }
      ]);
    } else {
      const shortName = municipalidadNombre.replace('Municipalidad de ', '');
      setMessages([
        {
          id: 1,
          sender: 'ia',
          text: `¡Hola! Soy Manuelito, tu Asistente Municipal IA de ${shortName}. ¿En qué trámite o consulta municipal te puedo guiar hoy?`
        }
      ]);
    }
  }, [tramite, municipalidadNombre, messages.length]);

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

    axios.post(API_ENDPOINTS.CHAT, {
      mensaje: userMessageText,
      tramiteId: tramite?.id || null,
      sessionId: sessionId,
      municipalidadNombre: municipalidadNombre
    })
      .then((res) => {
        const iaMessage = {
          id: Date.now() + 1,
          sender: 'ia',
          text: res.data.respuesta
        };
        setMessages((prev) => [...prev, iaMessage]);
      })
      .catch(() => {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'ia',
          text: 'Lo siento, estoy teniendo dificultades para responder. Por favor, intenta de nuevo en unos segundos.'
        };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
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
      <div ref={chatContainerRef} className="flex-grow bg-gray-50 overflow-y-auto p-4 flex flex-col space-y-3" aria-live="polite" aria-atomic="true">
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
