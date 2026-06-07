import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, X } from 'lucide-react';
import useEscapeKey from '../hooks/useEscapeKey';
import { findReply } from '../utils/chatbotResponses';
import ChatMessage from './chat/ChatMessage';
import TypingIndicator from './chat/TypingIndicator';

export default function PanelChatbot({ tramite, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEscapeKey(() => onClose?.(), !!onClose);

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
      const replyText = findReply(userMessageText, tramite);

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
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages List Area */}
      <div ref={chatContainerRef} className="flex-grow bg-gray-50 overflow-y-auto p-4 flex flex-col space-y-3" aria-live="polite" aria-atomic="true">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

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
