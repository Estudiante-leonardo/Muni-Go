const responses = [
  {
    keywords: ['croquis', 'dibujo'],
    getReply: () =>
      'El croquis de distribución puede ser dibujado a mano alzada, no necesitas un arquitecto para locales pequeños. Solo marca calles principales e ingresos.',
  },
  {
    keywords: ['fut', 'formulario'],
    getReply: () =>
      'El Formulario Único de Trámite (FUT) es totalmente gratuito y se pide en mesa de partes para iniciar la solicitud.',
  },
  {
    keywords: ['tiempo'],
    getReply: (tramite) =>
      tramite
        ? `Este trámite (${tramite.nombre}) demora aproximadamente ${tramite.tiempoEstimado} una vez entregados todos los requisitos oficiales.`
        : 'El tiempo de atención varía según el trámite. Por ejemplo, la Licencia de Funcionamiento toma de 15 a 20 días hábiles, los Certificados toman 3 días y las Declaratorias de Fábrica toman hasta 30 días.',
  },
  {
    keywords: ['costo', 'precio', 'pagar'],
    getReply: (tramite) =>
      tramite
        ? `El costo de este trámite (${tramite.nombre}) es de S/ ${tramite.costo === 0 ? 'Gratuito' : tramite.costo}.`
        : 'Los costos oficiales varían: la Licencia de Funcionamiento cuesta S/ 120, el Certificado de Jurisdicción S/ 25, la Declaratoria de Fábrica S/ 350, y las Licencias de Edificación S/ 220. El trámite de Impuesto Predial es gratuito para su presentación.',
  },
  {
    keywords: ['licencia', 'conducir'],
    getReply: () =>
      'Para la Licencia de Conducir de Vehículos Menores (Mototaxis), necesitas: Copia DNI, examen médico psicosomático aprobado, examen de reglas de tránsito, dos fotos tamaño carné fondo blanco y el derecho de trámite de S/ 85.',
  },
  {
    keywords: ['impuesto', 'arbitrios', 'predial'],
    getReply: () =>
      'Para presentar tu Declaración Jurada de Impuesto Predial y Arbitrios, debes traer la copia del DNI del propietario, la copia del testimonio de propiedad o compraventa, y el formulario de autoavalúo (PU y HR) del año vigente.',
  },
];

export const defaultReply = (tramite) =>
  tramite
    ? `Para resolver dudas adicionales sobre el trámite de "${tramite.nombre}", te invitamos a acercarte a la ventanilla de atención al ciudadano en el palacio municipal.`
    : 'Puedo darte detalles sobre Licencias de Funcionamiento, de Edificación, Licencia de Conducir Mototaxis, Certificados de Domicilio, Declaratorias de Fábrica e Impuestos Municipales. ¿Sobre cuál deseas consultar?';

export function findReply(query, tramite) {
  const normalized = query.toLowerCase();
  const match = responses.find((r) => r.keywords.some((kw) => normalized.includes(kw)));
  return match ? match.getReply(tramite) : defaultReply(tramite);
}
