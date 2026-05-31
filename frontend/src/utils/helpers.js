export const getResumenIA = (tramite) => {
  if (!tramite) return '';
  switch (tramite.id) {
    case 1:
      return 'Este trámite te permite abrir locales comerciales. Solo necesitas tu DNI, contrato de alquiler y un certificado de defensa civil vigente.';
    case 2:
      return 'Este trámite certifica la jurisdicción y domicilio de tu predio. Es indispensable para obtener servicios básicos, títulos de propiedad y realizar gestiones notariales.';
    case 3:
      return 'Este trámite regulariza y formaliza las construcciones declaradas ante la municipalidad. Permite la inscripción en SUNARP y es fundamental para revalorizar tu predio.';
    case 4:
      return 'Permite obtener la autorización para edificar viviendas unifamiliares de hasta 120m2. Es necesario presentar planos firmados por un arquitecto colegiado y el FUE.';
    case 5:
      return 'Trámite oficial para obtener la licencia de conducir tipo B-IIc para conducir mototaxis y motocicletas en el distrito de Carabayllo de forma legal.';
    case 6:
      return 'Permite la presentación de la declaración jurada anual del Impuesto Predial y Arbitrios, esencial para mantener tus obligaciones tributarias al día.';
    default:
      return 'Este trámite consolida la información requerida por la municipalidad para tu registro formal. Asegúrate de presentar todos los requisitos para agilizar la evaluación.';
  }
};
