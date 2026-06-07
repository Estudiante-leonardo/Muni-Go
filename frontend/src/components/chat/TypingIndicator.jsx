import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="bg-white border border-slate-200 text-slate-400 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center space-x-1 shadow-sm">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
