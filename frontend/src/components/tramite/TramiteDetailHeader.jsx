import { Volume2, Pause } from 'lucide-react';

export default function TramiteDetailHeader({ titulo, tts, textoCompleto }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
        {titulo}
      </h2>
      <button
        onClick={() => {
          if (tts.isSpeaking) {
            tts.stop();
          } else {
            tts.speak(textoCompleto);
          }
        }}
        aria-label={tts.isSpeaking ? 'Detener lectura' : 'Escuchar información del trámite'}
        className={`p-2.5 rounded-xl flex items-center gap-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer motion-reduce:transition-none transition-colors ${
          tts.isSpeaking
            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400'
            : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:text-blue-400'
        }`}
      >
        {tts.isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}
        {tts.isSpeaking ? 'Detener' : 'Escuchar'}
      </button>
    </div>
  );
}
