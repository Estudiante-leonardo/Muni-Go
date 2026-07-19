import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <>
      <Helmet><title>MuniGo - Página no encontrada</title></Helmet>

      <div className="animate-fade-in h-screen not-found-page">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 h-full">

          <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="crosses" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 8v24M8 20h24" stroke="white" strokeWidth="1.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#crosses)" />
          </svg>

          <div className="absolute top-10 left-10 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-400/[0.08] rounded-full blur-2xl pointer-events-none" aria-hidden />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/[0.05] rounded-full blur-xl pointer-events-none" aria-hidden />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 h-full">

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h1 className="text-5xl sm:text-8xl font-black text-white tracking-tight leading-none">
              404
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight">
              Página no encontrada
            </h2>

            <p className="mt-3 text-sm sm:text-base text-blue-100/80 max-w-md leading-relaxed">
              Lo sentimos, la ruta que estás intentando visitar no existe o ha sido movida temporalmente.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${countdown <= 3 ? 'bg-red-400 animate-pulse' : 'bg-blue-300 animate-pulse'}`} />
              <span className="text-xs sm:text-sm font-medium text-blue-100">
                Serás redirigido en <span className="font-bold text-white">{countdown}s</span>
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/"
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl text-sm shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all"
              >
                Volver al Inicio
              </Link>
              <button
                onClick={() => setCountdown(0)}
                className="px-6 py-3 border-2 border-white/30 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-all"
              >
                Ir ahora
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
