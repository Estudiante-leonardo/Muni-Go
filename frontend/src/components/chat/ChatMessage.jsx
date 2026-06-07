import React from 'react';

export default function ChatMessage({ message }) {
  return (
    <div className={`flex flex-col space-y-1 ${
      message.sender === 'user' ? 'items-end' : 'items-start'
    }`}>
      <div
        className={`text-sm px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed max-w-[85%] ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
