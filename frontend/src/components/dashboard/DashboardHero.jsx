import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export default function DashboardHero({ muniName, logoUrl, onOpenFaq }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 rounded-3xl shadow-xl motion-reduce:transition-none transition-all duration-300">
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} aria-hidden="true" />

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/[0.06] rounded-full blur-3xl pointer-events-none motion-reduce:!opacity-30" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-400/[0.08] rounded-full blur-2xl pointer-events-none motion-reduce:!opacity-30" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-blue-400/[0.05] rounded-full blur-xl pointer-events-none motion-reduce:!opacity-20" aria-hidden="true" />

      <div className="relative z-10 grid lg:grid-cols-5 gap-6 sm:gap-10 p-8 sm:p-10 md:p-12">
        <div className="lg:col-span-3 space-y-5 sm:space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-white/15 text-white border border-white/20 backdrop-blur-sm uppercase tracking-wider motion-reduce:backdrop-blur-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Portal del Ciudadano de {muniName}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
            <span className="block mb-1 sm:mb-2">
              <img
                src={logoUrl}
                alt="Muni-Go"
                className="banner-logo h-14 sm:h-14 md:h-16 w-auto brightness-0 invert"
              />
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">Tu Municipalidad Virtual</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-blue-100/90 leading-relaxed max-w-xl font-medium">
            Consulta de manera rápida y transparente todos los requisitos oficiales, costos y tiempos estimados de tus trámites municipales. Todo respaldado por inteligencia artificial.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/tramites"
              className="inline-flex items-center px-5 py-3 bg-white text-blue-700 font-extrabold rounded-xl text-sm shadow-lg hover:bg-blue-50 hover:shadow-xl motion-reduce:transition-none transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 cursor-pointer"
            >
              Ver Catálogo de Trámites
              <svg className="w-4 h-4 ml-2 motion-reduce:transition-none transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <button
              onClick={onOpenFaq}
              className="inline-flex items-center px-5 py-3 bg-transparent text-white font-bold rounded-xl text-sm border-2 border-white/30 hover:border-white/50 motion-reduce:transition-none transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 cursor-pointer backdrop-blur-sm motion-reduce:backdrop-blur-none"
            >
              <HelpCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              Preguntas Frecuentes
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative" aria-hidden="true">
          <div className="relative w-full max-w-[260px] aspect-square">
            <div className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/[0.06]" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-36 bg-white/[0.07] rounded-xl border border-white/[0.10] backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/10 rounded-t-lg border border-white/10" />
              <div className="absolute top-5 left-3 w-6 h-4 bg-white/[0.08] rounded" />
              <div className="absolute top-5 right-3 w-6 h-4 bg-white/[0.08] rounded" />
              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-14 h-[1px] bg-white/10" />
              <div className="absolute top-20 left-3 w-6 h-4 bg-white/[0.08] rounded" />
              <div className="absolute top-20 right-3 w-6 h-4 bg-white/[0.08] rounded" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-white/10 rounded-full" />
            </div>

            <div className="absolute -top-2 left-4 w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="absolute top-6 -right-1 w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="absolute bottom-10 -left-3 w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
