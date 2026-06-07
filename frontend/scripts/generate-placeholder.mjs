import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generate() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();

  let y = height - 50;
  const margin = 50;
  const lineHeight = 18;
  const sw = (text, size = 12) => ({ text, size, font: bold, color: rgb(0, 0, 0) });
  const t = (text, size = 11) => ({ text, size, font, color: rgb(0, 0, 0) });

  const writeLine = (x, textObj) => {
    page.drawText(textObj.text, { x, y, size: textObj.size, font: textObj.font, color: textObj.color });
    y -= lineHeight;
  };
  const skip = (n = 1) => { y -= lineHeight * n; };

  // ── Header ──
  page.drawText('FORMATO ÚNICO DE TRÁMITE', { x: margin, y, size: 20, font: bold, color: rgb(0.1, 0.3, 0.7) });
  y -= 28;
  page.drawText('MuniGo - Tu Municipalidad Virtual', { x: margin, y, size: 13, font, color: rgb(0.4, 0.4, 0.4) });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1.5, color: rgb(0.1, 0.3, 0.7) });
  y -= 22;

  writeLine(margin, sw('DATOS DEL SOLICITANTE', 13));
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 6;

  writeLine(margin, t('Apellidos y Nombres: _____________________________________________'));
  writeLine(margin, t('DNI / CE: _________________________'));
  writeLine(margin, t('Domicilio: _____________________________________________________'));
  writeLine(margin, t('Distrito: ___________________  Provincia: ___________________'));
  writeLine(margin, t('Teléfono: ___________________  Correo: _______________________'));
  skip();

  writeLine(margin, sw('DATOS DEL TRÁMITE', 13));
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 6;

  writeLine(margin, t('Tipo de trámite solicitado: ______________________________________'));
  writeLine(margin, t('Descripción detallada: ___________________________________________'));
  writeLine(margin, t('_____________________________________________________________________'));
  writeLine(margin, t('_____________________________________________________________________'));
  skip();

  writeLine(margin, sw('DOCUMENTACIÓN ADJUNTA', 13));
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 6;
  writeLine(margin, t('(X)  Copia simple de DNI / CE'));
  writeLine(margin, t('( )  Comprobante de pago por derecho de trámite'));
  writeLine(margin, t('( )  Vigencia de poder (personas jurídicas)'));
  writeLine(margin, t('( )  Croquis de ubicación'));
  writeLine(margin, t('( )  Otros: ____________________________________________________'));
  skip(2);

  writeLine(margin, sw('DECLARACIÓN JURADA', 13));
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 6;
  page.drawText('Declaro bajo juramento que todos los datos consignados son verdaderos', { x: margin, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
  y -= 14;
  page.drawText('y me someto a las verificaciones correspondientes por parte de la Municipalidad.', { x: margin, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
  skip(3);

  writeLine(margin, t('Firma: _______________________________'));
  writeLine(margin, t('Fecha: ___ / ___ / ______'));

  // ── Footer ──
  y = 40;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 14;
  page.drawText('Documento generado por MuniGo v1.1 — Este es un formato de ejemplo con fines ilustrativos.', {
    x: margin, y, size: 8, font, color: rgb(0.6, 0.6, 0.6)
  });

  // ── Second page: instructions ──
  page = doc.addPage([612, 792]);
  y = height - 50;

  page.drawText('INSTRUCCIONES DE LLENADO', { x: margin, y, size: 16, font: bold, color: rgb(0.1, 0.3, 0.7) });
  y -= 28;

  const instructions = [
    '1. Complete todos los campos del formulario con letra legible y en mayúsculas.',
    '2. Adjunte copia simple de su DNI vigente (ambos lados).',
    '3. Verifique el tipo de trámite antes de realizar el pago correspondiente.',
    '4. El comprobante de pago debe estar original o copia legible.',
    '5. Presente este formato en Mesa de Partes de su municipalidad.',
    '6. Conserve el cargo de recepción para futuras consultas.',
    '',
    'Para mayor información visite https://muni-go.com o escríbanos a soporte@munigo.pe',
  ];

  for (const line of instructions) {
    writeLine(margin, t(line, 11));
  }

  skip(3);
  writeLine(margin, sw('Nota:', 11));
  writeLine(margin, t('Los plazos de atención varían según el tipo de trámite y la municipalidad.', 10));
  writeLine(margin, t('Consulte los tiempos estimados en la plataforma MuniGo.', 10));

  const pdfBytes = await doc.save();
  const outPath = resolve(__dirname, '..', 'public', 'formatos', 'placeholder.pdf');
  writeFileSync(outPath, pdfBytes);
  console.log(`PDF generado: ${outPath}`);
}

generate().catch(console.error);
