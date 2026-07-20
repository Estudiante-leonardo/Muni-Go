-- =========================================================================
-- 1. HABILITAR EXTENSIONES PARA VECTOR STORE (pgvector)
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions; -- Supabase suele usar el esquema extensions
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. ELIMINAR TABLAS EXISTENTES PARA REINICIAR EL ESTADO (Orden correcto)
-- =========================================================================
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS estadisticas_accesibilidad CASCADE;
DROP TABLE IF EXISTS estadisticas_usuarios CASCADE;
DROP TABLE IF EXISTS estadisticas_consultas CASCADE;
DROP TABLE IF EXISTS requisitos CASCADE;
DROP TABLE IF EXISTS formatos CASCADE;
DROP TABLE IF EXISTS pasos CASCADE;
DROP TABLE IF EXISTS lugares CASCADE;
DROP TABLE IF EXISTS tramites CASCADE;
DROP TABLE IF EXISTS municipalidades CASCADE;
DROP TABLE IF EXISTS vector_store CASCADE;

-- =========================================================================
-- 3. CREACIÓN DE TABLAS
-- =========================================================================

-- Tabla para Vector Store
CREATE TABLE vector_store (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text,
    metadata json,
    embedding vector(768)
);

CREATE INDEX idx_vector_store_embedding 
    ON vector_store USING HNSW (embedding vector_cosine_ops);

-- Crear tabla de municipalidades
CREATE TABLE municipalidades (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de trámites
CREATE TABLE tramites (
    id BIGSERIAL PRIMARY KEY,
    municipalidad_id BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    tiempo_estimado VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    CONSTRAINT fk_municipalidad FOREIGN KEY (municipalidad_id) REFERENCES municipalidades(id) ON DELETE CASCADE
);

-- Crear tabla de requisitos
CREATE TABLE requisitos (
    id BIGSERIAL PRIMARY KEY,
    tramite_id BIGINT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tramite FOREIGN KEY (tramite_id) REFERENCES tramites(id) ON DELETE CASCADE
);

-- Crear tabla de formatos
CREATE TABLE formatos (
    id BIGSERIAL PRIMARY KEY,
    tramite_id BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    url_descarga VARCHAR(500) NOT NULL,
    CONSTRAINT fk_tramite_formatos FOREIGN KEY (tramite_id) REFERENCES tramites(id) ON DELETE CASCADE
);

-- Crear tabla de pasos
CREATE TABLE pasos (
    id BIGSERIAL PRIMARY KEY,
    tramite_id BIGINT NOT NULL,
    numero INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT fk_tramite_pasos FOREIGN KEY (tramite_id) REFERENCES tramites(id) ON DELETE CASCADE
);

-- Crear tabla de lugares
CREATE TABLE lugares (
    id BIGSERIAL PRIMARY KEY,
    tramite_id BIGINT UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    horario VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tramite_lugares FOREIGN KEY (tramite_id) REFERENCES tramites(id) ON DELETE CASCADE
);

-- Tablas de estadísticas
CREATE TABLE estadisticas_consultas (
    id BIGSERIAL PRIMARY KEY,
    municipalidad_id BIGINT NOT NULL,
    mes VARCHAR(20) NOT NULL,
    anio INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT fk_estadistica_muni FOREIGN KEY (municipalidad_id) REFERENCES municipalidades(id) ON DELETE CASCADE
);

CREATE TABLE estadisticas_usuarios (
    id BIGSERIAL PRIMARY KEY,
    municipalidad_id BIGINT NOT NULL,
    mes VARCHAR(20) NOT NULL,
    anio INT NOT NULL,
    usuarios_activos_promedio INT NOT NULL,
    CONSTRAINT fk_usuarios_muni FOREIGN KEY (municipalidad_id) REFERENCES municipalidades(id) ON DELETE CASCADE
);

CREATE TABLE estadisticas_accesibilidad (
    id BIGSERIAL PRIMARY KEY,
    municipalidad_id BIGINT NOT NULL,
    herramienta VARCHAR(50) NOT NULL,
    porcentaje DECIMAL(5, 2) NOT NULL,
    CONSTRAINT fk_accesibilidad_muni FOREIGN KEY (municipalidad_id) REFERENCES municipalidades(id) ON DELETE CASCADE
);

-- Tablas de administración
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    municipalidad_id BIGINT,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_admin_muni FOREIGN KEY (municipalidad_id) REFERENCES municipalidades(id) ON DELETE SET NULL
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);

-- =========================================================================
-- 4. INSERCIÓN DE DATOS
-- =========================================================================
INSERT INTO municipalidades (id, nombre) VALUES
(1, 'Municipalidad de Carabayllo'),
(2, 'Municipalidad de Comas'),
(3, 'Municipalidad de Los Olivos'),
(4, 'Municipalidad de San Martín de Porres'),
(5, 'Municipalidad de Miraflores');

SELECT setval('municipalidades_id_seq', 5);

-- (MUNICIPALIDAD DE CARABAYLLO)
INSERT INTO tramites (id, municipalidad_id, nombre, descripcion, costo, tiempo_estimado, categoria) VALUES
(1, 1, 'Licencia de Funcionamiento - Riesgo Bajo', 'Autorización para apertura de comercios menores como bodegas o librerías.', 145.50, '7 días hábiles', 'Licencias'),
(2, 1, 'Inspección Técnica de Seguridad en Edificaciones (ITSE)', 'Evaluación de las condiciones de seguridad y Defensa Civil del local comercial.', 190.00, '10 días hábiles', 'Defensa Civil'),
(3, 1, 'Licencia de Edificación - Modalidad A', 'Aprobación automática para construcción de viviendas unifamiliares hasta 120m2.', 320.00, '5 días hábiles', 'Obras Privadas'),
(4, 1, 'Constancia de Posesión para Servicios Básicos', 'Documento para acreditar la posesión de un predio con fines de instalación de agua, desagüe o luz.', 85.00, '15 días hábiles', 'Desarrollo Urbano'),
(5, 1, 'Certificado de Parámetros Urbanísticos', 'Documento técnico que especifica las disposiciones de diseño y zonificación de un predio.', 110.00, '5 días hábiles', 'Urbanismo'),
(6, 1, 'Matrimonio Civil en Palacio Municipal', 'Celebración de boda civil dentro de las instalaciones del palacio municipal en horario de oficina.', 250.00, '30 días', 'Registro Civil'),
(7, 1, 'Copia Certificada de Partida de Nacimiento', 'Obtención de una copia oficial de la partida registrada en el distrito.', 15.00, '1 día hábil', 'Registro Civil'),
(8, 1, 'Inscripción de Declaración Jurada de Autoavalúo', 'Registro del predio por transferencia de propiedad o modificación de la construcción.', 0.00, '1 día hábil', 'Rentas'),
(9, 1, 'Licencia de Conducir de Vehículos Menores (Clase B2c)', 'Emisión de licencia para la conducción de mototaxis y trimóviles de carga.', 95.00, '12 días hábiles', 'Transportes'),
(10, 1, 'Autorización de Anuncios y Publicidad Exterior', 'Permiso para la colocación de letreros, paneles o carteles luminosos comerciales.', 160.00, '10 días hábiles', 'Licencias'),
-- (MUNICIPALIDAD DE COMAS)
(11, 2, 'Licencia de Funcionamiento - Riesgo Medio', 'Licencia para locales de mediana envergadura como restaurantes o talleres mecánicos.', 210.00, '9 días hábiles', 'Licencias'),
(12, 2, 'Certificado de Inspección de Seguridad (ITSE)', 'Certificación obligatoria de Defensa Civil para establecimientos comerciales medianos.', 240.00, '12 días hábiles', 'Defensa Civil'),
(13, 2, 'Licencia de Edificación - Modalidad B', 'Aprobación de proyecto de construcción de viviendas multifamiliares de hasta 5 pisos con firma de revisores.', 480.00, '25 días hábiles', 'Obras Privadas'),
(14, 2, 'Constancia de Posesión Teritorial', 'Trámite administrativo para acreditar posesión pacífica en asentamientos humanos regulados.', 75.00, '20 días hábiles', 'Desarrollo Urbano'),
(15, 2, 'Certificado de Nomenclatura y Numeración Fincas', 'Asignación de número oficial de calle para un inmueble o lote.', 90.00, '7 días hábiles', 'Urbanismo'),
(16, 2, 'Matrimonio Civil a Domicilio / Local Privado', 'Celebración de boda civil fuera del recinto municipal por un registrador autorizado.', 420.00, '30 días', 'Registro Civil'),
(17, 2, 'Copia Certificada de Partida de Matrimonio', 'Emisión de duplicado oficial del acta de matrimonio inscrita en el distrito.', 18.00, '1 día hábil', 'Registro Civil'),
(18, 2, 'Actualización de Datos del Contribuyente', 'Modificación de datos del titular, estado civil o domicilio fiscal en el sistema tributario.', 0.00, '1 día hábil', 'Rentas'),
(19, 2, 'Permiso de Operación para Transporte de Pasajeros', 'Autorización anual para empresas de mototaxis dentro de las rutas autorizadas del distrito.', 350.00, '15 días hábiles', 'Transportes'),
(20, 2, 'Visación de Planos para Habilitación Urbana', 'Visación técnica preliminar de planos de distribución y localización periférica.', 180.00, '15 días hábiles', 'Urbanismo'),
-- (MUNICIPALIDAD DE LOS OLIVOS)
(21, 3, 'Licencia de Funcionamiento - Mercados y Galerías', 'Licencia corporativa para puestos individuales ubicados dentro de mercados reconocidos.', 125.00, '5 días hábiles', 'Licencias'),
(22, 3, 'Certificado ITSE Posterior al Inicio de Actividades', 'Inspección de seguridad ejecutada de oficio para giros comerciales de muy bajo riesgo.', 150.00, '5 días hábiles', 'Defensa Civil'),
(23, 3, 'Licencia de Demolición de Inmuebles', 'Autorización para derribar parcial o totalmente edificaciones antiguas o en riesgo.', 390.00, '15 días hábiles', 'Obras Privadas'),
(24, 3, 'Certificado de Alineamiento Urbano', 'Determinación de la línea de propiedad frente a la vía pública para futuras edificaciones.', 130.00, '10 días hábiles', 'Urbanismo'),
(25, 3, 'Copia de Planos Archivados', 'Búsqueda y reproducción certificada de planos de proyectos aprobados en el archivo municipal.', 65.00, '4 días hábiles', 'Desarrollo Urbano'),
(26, 3, 'Separación Convencional y Divorcio Ulterior', 'Trámite simplificado de divorcio (Ley de Divorcio Rápido) de mutuo acuerdo.', 550.00, '60 días', 'Registro Civil'),
(27, 3, 'Copia Certificada de Partida de Defunción', 'Emisión de copia oficial del acta de fallecimiento registrada en Los Olivos.', 15.00, '1 día hábil', 'Registro Civil'),
(28, 3, 'Constancia de No Adeudo Tributario', 'Certificado que acredita que el contribuyente se encuentra al día en el pago de arbitrios e impuesto predial.', 35.00, '2 días hábiles', 'Rentas'),
(29, 3, 'Renovación de Carné de Sanidad Comercial', 'Expedición de documento médico indispensable para manipuladores de alimentos.', 25.00, '1 día hábil', 'Salud'),
(30, 3, 'Autorización para Espectáculos Públicos No Deportivos', 'Licencia temporal para eventos masivos, conciertos, ferias o circos locales.', 620.00, '10 días hábiles', 'Licencias'),
-- (MUNICIPALIDAD DE SAN MARTÍN DE PORRES)
(31, 4, 'Licencia de Funcionamiento Indeterminada', 'Otorgamiento de licencia comercial de vigencia indefinida sujeta a fiscalización posterior.', 165.00, '10 días hábiles', 'Licencias'),
(32, 4, 'Evaluación de Condiciones de Seguridad en Espectáculos (ECSE)', 'Inspección técnica especializada previa para garantizar la seguridad en recintos de eventos.', 310.00, '7 días hábiles', 'Defensa Civil'),
(33, 4, 'Licencia de Edificación - Regularización', 'Procedimiento para declarar y legalizar obras civiles construidas sin licencia previa.', 520.00, '30 días hábiles', 'Obras Privadas'),
(34, 4, 'Certificado de Jurisdicción Territorial', 'Acreditación formal de que un predio se encuentra en la jurisdicción catastral de SMP.', 95.00, '8 días hábiles', 'Desarrollo Urbano'),
(35, 4, 'Visación de Planos para Trámite Judicial', 'Aprobación técnica de planos requerida para procesos de prescripción adquisitiva.', 210.00, '20 días hábiles', 'Urbanismo'),
(36, 4, 'Inscripción Ordinaria de Nacimiento', 'Registro formal del recién nacido en el sistema civil del distrito para la emisión del primer acta.', 0.00, '1 día hábil', 'Registro Civil'),
(37, 4, 'Rectificación Administrativa de Partidas', 'Corrección de errores materiales u ortográficos evidentes en actas registrales antiguas.', 45.00, '15 días hábiles', 'Registro Civil'),
(38, 4, 'Emisión de Estado de Cuenta Corriente Predial', 'Reporte detallado de deudas, fraccionamientos e historial de pagos de tributos.', 10.00, '1 día hábil', 'Rentas'),
(39, 4, 'Duplicado de Licencia de Conducir Vehículos Menores', 'Reposición de la credencial de manejo física por motivos de pérdida, robo o deterioro.', 40.00, '3 días hábiles', 'Transportes'),
(40, 4, 'Permiso para Ocupación de la Vía Pública', 'Autorización temporal para uso de veredas o calzadas por obras, mudanzas o andamios.', 140.00, '5 días hábiles', 'Urbanismo'),
-- (MUNICIPALIDAD DE MIRAFLORES)
(41, 5, 'Licencia de Funcionamiento Digital Automática', 'Licencia emitida de manera electrónica en menos de 24 horas para giros de riesgo muy bajo.', 180.00, '1 día hábil', 'Licencias'),
(42, 5, 'Certificado ITSE Ex Ante (Riesgo Alto)', 'Evaluación de seguridad rigurosa previa a la apertura para bancos, hoteles o discotecas.', 450.00, '15 días hábiles', 'Defensa Civil'),
(43, 5, 'Conformidad de Obra y Declaratoria de Edificación', 'Revisión final de la edificación terminada para certificar que cumple con el proyecto aprobado.', 610.00, '20 días hábiles', 'Obras Privadas'),
(44, 5, 'Certificado de Zonificación y Vías', 'Informe técnico detallado sobre el uso del suelo permitido y las afectaciones viales del entorno.', 175.00, '4 días hábiles', 'Urbanismo'),
(45, 5, 'Asignación de Numeración Interna (Quintas/Edificios)', 'Desglose y numeración oficial para departamentos, oficinas o estacionamientos independientes.', 230.00, '10 días hábiles', 'Urbanismo'),
(46, 5, 'Celebración de Matrimonio Civil en Parques Huacas', 'Servicio exclusivo de bodas en locaciones turísticas o históricas administradas por el distrito.', 850.00, '45 días', 'Registro Civil'),
(47, 5, 'Constancia de Soltería / Viudez', 'Certificado expedido por el registro civil local que acredita el estado civil actual.', 30.00, '2 días hábiles', 'Registro Civil'),
(48, 5, 'Compensación o Devolución de Pagos Indebidos', 'Solicitud formal para el retorno de saldos tributarios a favor o cobros realizados por error.', 0.00, '30 días hábiles', 'Rentas'),
(49, 5, 'Autorización de Mudanzas Fuera del Horario Habitual', 'Permiso especial para operaciones de carga y transporte residencial en zonas rígidas.', 70.00, '2 días hábiles', 'Urbanismo'),
(50, 5, 'Tarjeta de Estacionamiento Residencial', 'Permiso anual gratuito o de tarifa preferencial para residentes en zonas con parquímetros.', 50.00, '7 días hábiles', 'Transportes');

SELECT setval('tramites_id_seq', 50);

INSERT INTO requisitos (tramite_id, descripcion) VALUES
(1, 'Formulario Único de Trámite (FUT) debidamente llenado.'),
(1, 'Declaración Jurada firmada por el representante legal o persona natural.'),
(1, 'Copia de DNI o RUC vigente.'),
(2, 'Croquis de distribución interna de arquitectura con cálculo de aforo.'),
(2, 'Certificado de operatividad de extintores vigentes.'),
(2, 'Plan de Seguridad ante contingencias y emergencias.'),
(3, 'Formulario Único de Edificación (FUE) por duplicado.'),
(3, 'Copia literal de dominio emitida por la SUNARP.'),
(3, 'Planos de ubicación, arquitectura y estructuras a escala.'),
(4, 'Plano visado de lote y plano de ubicación geográfica.'),
(4, 'Acta de asamblea o documento de adjudicación emitido por la directiva.'),
(4, 'Declaración jurada de no tener litigios pendientes sobre el lote.'),
(5, 'Copia de DNI del solicitante.'),
(5, 'Recibo de pago por derechos de trámite urbanístico.'),
(6, 'Partidas de nacimiento certificadas de ambos contrayentes con antigüedad menor a 3 meses.'),
(6, 'Certificado médico prenupcial expedido por centro de salud autorizado.'),
(6, 'Copia de DNI de los contrayentes y de dos testigos mayores de edad.'),
(7, 'Indicar fecha exacta del nacimiento y nombres completos del registrado.'),
(7, 'Recibo de pago en caja por duplicado de acta.'),
(8, 'Formularios prediales PU (Predio Urbano) y HR (Hoja de Resumen).'),
(8, 'Copia del testimonio de compraventa o minuta con firmas legalizadas.'),
(9, 'Certificado de aptitud psicosomática del MTC.'),
(9, 'Aprobación del examen de reglamento de tránsito y de manejo práctico.'),
(9, 'Dos fotografías tamaño carnet recientes fondo blanco.'),
(10, 'Arte final impreso a color indicando las dimensiones del panel o anuncio.'),
(10, 'Carta de autorización del propietario del inmueble si es alquilado.'),
(11, 'Declaración jurada de observancia de condiciones de seguridad.'),
(11, 'Vigencia de poder en caso de personas jurídicas.'),
(12, 'Planos eléctricos firmados por ingeniero electricista habilitado.'),
(13, 'FUE Modalidad B con firmas de la junta de revisores urbanos.'),
(14, 'Declaración jurada de testigos colindantes del lote.'),
(15, 'Copia del plano catastral visado.'),
(16, 'Pago de la tasa especial para matrimonios fuera del local municipal.'),
(17, 'Datos del folio y tomo de la inscripción matrimonial.'),
(18, 'Documento que acredite el cambio del domicilio o estado civil.'),
(19, 'Copia de tarjeta de propiedad y SOAT vigente de los vehículos.'),
(20, 'Planos de independización y memoria descriptiva del proyecto.'),
(21, 'Constancia de socio del mercado expedida por la administración central.'),
(22, 'FUT de solicitud de inspección posterior.'),
(23, 'Plan de manejo de residuos de la construcción (demolición).'),
(24, 'Certificado catastral actualizado.'),
(25, 'Número de expediente del proyecto original archivado.'),
(26, 'Convenio de régimen de patria potestad y pensión alimentaria si hay hijos.'),
(27, 'Certificado de defunción emitido por el hospital o médico forense.'),
(28, 'Código de contribuyente y DNI del solicitante.'),
(29, 'Muestra médica de laboratorio y examen clínico presencial.'),
(30, 'Póliza de seguro de responsabilidad civil frente a terceros para eventos.'),
(31, 'Declaración jurada de zonificación compatible.'),
(32, 'Informe estructural del escenario y firmas de ingenieros civiles.'),
(33, 'Planos de replanteo arquitectónico de la edificación ejecutada.'),
(34, 'Copia de autovaluo HR y PU del año en curso.'),
(35, 'Planos perimétricos firmados y visados en coordenadas UTM.'),
(36, 'Certificado de nacido vivo emitido por el MINSA.'),
(37, 'Documentos probatorios que sustenten el error en el acta original.'),
(38, 'Solicitud simple dirigida al área de rentas y tributación.'),
(39, 'Denuncia policial por pérdida o declaración jurada de extravío.'),
(40, 'Croquis indicando el metraje exacto de la vía pública a ocupar.'),
(41, 'Formulario web con RUC activo y habido.'),
(42, 'Planos de señalización, evacuación, luces de emergencia y pozos a tierra.'),
(43, 'Plano de replanteo final de obra visado por los profesionales.'),
(44, 'Certificado literal expedido por registros públicos.'),
(45, 'Plano de subdivisiones internas indicando áreas exclusivas y comunes.'),
(46, 'Reserva de fecha en la oficina de turismo municipal.'),
(47, 'Declaración jurada de no tener impedimento para contraer nupcias.'),
(48, 'Comprobantes de pago originales que sustenten el doble cobro.'),
(49, 'FUT indicando placa de camión transportista, fecha y hora del traslado.'),
(50, 'Acreditación de residencia mediante recibo de servicios y DNI actualizado.');

INSERT INTO formatos (tramite_id, nombre, descripcion, url_descarga) VALUES
(1, 'Formato Único de Trámite (FUT)', 'Formulario base PDF - 150 KB', '/formatos/carabayllo_fut.pdf'),
(1, 'Anexo 01 - Declaración Jurada de Licencias', 'Formato complementario PDF - 95 KB', '/formatos/carabayllo_anexo1.pdf'),
(3, 'Formulario Único de Edificación (FUE)', 'Documento técnico PDF - 450 KB', '/formatos/fue_modalidad_a.pdf'),
(11, 'FUT Comas', 'Formulario de solicitud general - 120 KB', '/formatos/comas_fut.pdf'),
(13, 'FUE Modalidad B - Licencia de Construcción', 'Formulario de edificación avanzada - 520 KB', '/formatos/fue_modalidad_b.pdf'),
(21, 'Formato Especial de Licencias para Mercados', 'Formulario especializado PDF - 110 KB', '/formatos/losolivos_mercados.pdf'),
(26, 'Formato de Solicitud de Divorcio Rápido', 'Plantilla legal de solicitud formal - 210 KB', '/formatos/divorcio_rapido.pdf'),
(31, 'FUT San Martín de Porres', 'Documento de trámite regular PDF - 130 KB', '/formatos/smp_fut.pdf'),
(33, 'Formulario de Regularización de Edificación', 'Anexo especial de regularizaciones - 310 KB', '/formatos/smp_regularizacion.pdf'),
(41, 'Solicitud Virtual de Licencia Automática', 'Formulario interactivo en línea', '/formatos/miraflores_licencia_digital.pdf');

INSERT INTO pasos (tramite_id, numero, titulo, descripcion) VALUES
(1, 1, 'Presentación del expediente', 'Ingresa los formatos y requisitos obligatorios en la ventanilla física o mesa de partes virtual.'),
(1, 2, 'Pago de derechos', 'Cancela la tasa correspondiente en las cajas autorizadas del palacio municipal.'),
(1, 3, 'Evaluación y entrega', 'El área de licencias evalúa la zonificación y emite la resolución de licencia en el plazo indicado.'),
(2, 1, 'Ingreso del croquis y planos', 'Presenta el expediente de seguridad con los planos de evacuación en mesa de partes.'),
(2, 2, 'Programación de inspección', 'Coordina con los inspectores municipales la fecha y hora de la visita técnica al establecimiento.'),
(2, 3, 'Emisión del Certificado ITSE', 'Si el local aprueba las condiciones de seguridad, se expide el certificado físico.'),
(11, 1, 'Llenado de declaración jurada', 'Completa los formatos de riesgo medio detallando el aforo de tu local.'),
(11, 2, 'Revisión técnica', 'Personal de la subgerencia de comercialización revisará la documentación.'),
(26, 1, 'Audiencia Única', 'Ambas partes se presentan ante la gerencia de asuntos jurídicos para ratificar el divorcio.'),
(31, 1, 'Registro en Línea', 'Sube tus requisitos a la plataforma virtual de SMP para validación preliminar.'),
(41, 1, 'Acceso al Portal Ciudadano', 'Autentícate con tu DNI electrónico o RUC en la sede electrónica de Miraflores.'),
(41, 2, 'Aprobación Automática', 'El sistema valida las bases de datos y emite tu licencia firmada digitalmente de inmediato.');

INSERT INTO lugares (tramite_id, nombre, direccion, horario) VALUES
(1, 'Palacio Municipal de Carabayllo - Mesa de Partes', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 4:30 PM'),
(2, 'Subgerencia de Gestión del Riesgo de Desastres', 'Av. El Progreso Nro. 110', 'L-V de 8:00 AM a 4:00 PM'),
(3, 'Gerencia de Desarrollo Urbano (Carabayllo)', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 2:00 PM'),
(4, 'Agencia Municipal Lomas de Carabayllo', 'Av. Las Lomas s/n', 'L-V de 8:30 AM a 4:00 PM'),
(5, 'Oficina de Catastro y Urbanismo Carabayllo', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 4:30 PM'),
(6, 'Oficina de Registro Civil Carabayllo', 'Palacio Municipal, Segundo Piso', 'L-V de 8:00 AM a 3:30 PM'),
(7, 'Mesa de Partes Central de Carabayllo', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 4:30 PM'),
(8, 'Gerencia de Administración Tributaria (Carabayllo)', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 5:00 PM - Sábados de 9:00 AM a 1:00 PM'),
(9, 'Subgerencia de Transportes de Carabayllo', 'Av. El Progreso Nro. 110', 'L-V de 8:00 AM a 4:00 PM'),
(10, 'Subgerencia de Comercialización Carabayllo', 'Av. Tupac Amaru Km. 18.5', 'L-V de 8:00 AM a 4:30 PM'),
(11, 'Palacio Municipal de Comas', 'Plaza de Armas de Comas s/n - Km. 11 Túpac Amaru', 'L-V de 8:00 AM a 4:30 PM'),
(12, 'Sede de Defensa Civil Comas', 'Av. 22 de Agosto Cdra. 8', 'L-V de 8:00 AM a 4:00 PM'),
(13, 'Gerencia de Desarrollo Urbano Comas', 'Plaza de Armas de Comas s/n', 'L-V de 8:00 AM a 2:00 PM'),
(14, 'Agencia Municipal Zonal Año Nuevo', 'Av. Maestro Peruano s/n', 'L-V de 8:00 AM a 4:30 PM'),
(15, 'Subgerencia de Catastro Comas', 'Plaza de Armas de Comas s/n', 'L-V de 8:00 AM a 4:30 PM'),
(16, 'Registro Civil - Sede Central Comas', 'Plaza de Armas de Comas s/n', 'L-V de 8:00 AM a 4:00 PM'),
(17, 'Ventanilla Única Comas', 'Plaza de Armas de Comas s/n', 'L-V de 8:00 AM a 4:30 PM'),
(18, 'Gerencia de Rentas Comas', 'Av. 22 de Agosto Cdra. 8', 'L-V de 8:00 AM a 5:00 PM'),
(19, 'Subgerencia de Tránsito y Transportes Comas', 'Av. 22 de Agosto Cdra. 8', 'L-V de 8:00 AM a 4:00 PM'),
(20, 'Oficina de Obras Públicas Comas', 'Plaza de Armas de Comas s/n', 'L-V de 8:00 AM a 4:30 PM'),
(21, 'Palacio Municipal de Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 5:00 PM'),
(22, 'Centro de Inspecciones Los Olivos', 'Av. Carlos Izaguirre 815 - Piso 3', 'L-V de 8:00 AM a 4:00 PM'),
(23, 'Ventanilla de Obras Privadas Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 1:00 PM'),
(24, 'Subgerencia de Planeamiento Urbano Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 5:00 PM'),
(25, 'Archivo Central de Desarrollo Urbano Los Olivos', 'Jr. Mercury 7413', 'L-V de 8:00 AM a 4:00 PM'),
(26, 'Oficina de Asuntos Civiles y Divorcios Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 4:00 PM'),
(27, 'Registro Civil Central Los Olivos', 'Av. Carlos Izaguirre 815 - Piso 1', 'L-V de 8:00 AM a 5:00 PM'),
(28, 'Gerencia de Gestión Tributaria Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 5:30 PM - Sábados de 9:00 AM a 1:00 PM'),
(29, 'Dirección de Sanidad y Salud Los Olivos', 'Jr. Amalia Puga Cdra. 4', 'L-V de 7:30 AM a 1:00 PM'),
(30, 'Ventanilla Única de Trámites Los Olivos', 'Av. Carlos Izaguirre 815', 'L-V de 8:00 AM a 5:00 PM'),
(31, 'Palacio Municipal de San Martín de Porres', 'Av. Alfredo Mendiola 169', 'L-V de 8:00 AM a 4:30 PM'),
(32, 'Gerencia de Defensa Civil SMP', 'Av. Alfredo Mendiola 169', 'L-V de 8:00 AM a 4:00 PM'),
(33, 'Gerencia de Desarrollo Urbano SMP', 'Jr. San Martín Cdra. 3', 'L-V de 8:00 AM a 2:00 PM'),
(34, 'Oficina de Catastro SMP', 'Av. Alfredo Mendiola 169', 'L-V de 8:00 AM a 4:30 PM'),
(35, 'Subgerencia de Obras Privadas SMP', 'Jr. San Martín Cdra. 3', 'L-V de 8:00 AM a 4:30 PM'),
(36, 'Registro Civil SMP - Sede Central', 'Av. Alfredo Mendiola 169', 'L-V de 8:00 AM a 4:00 PM'),
(37, 'Oficina de Rectificaciones Civiles SMP', 'Av. Alfredo Mendiola 169', 'L-V de 8:00 AM a 4:00 PM'),
(38, 'Gerencia de Administración Tributaria SMP', 'Av. Alfredo Mendiola 179', 'L-V de 8:00 AM a 5:00 PM'),
(39, 'Subgerencia de Transportes SMP', 'Av. Peru Cdra. 35', 'L-V de 8:30 AM a 4:30 PM'),
(40, 'Mesa de Partes de Desarrollo Urbano SMP', 'Jr. San Martín Cdra. 3', 'L-V de 8:00 AM a 4:30 PM'),
(41, 'Plataforma Virtual Miraflores (Sede Digital)', 'miraflores.gob.pe / Oficina Central', '24 horas online / Presencial L-V de 8:00 AM a 4:00 PM'),
(42, 'Palacio Municipal de Miraflores - Gestión de Riesgos', 'Av. Larco 400', 'L-V de 8:00 AM a 4:00 PM'),
(43, 'Gerencia de Desarrollo Urbano y Obras Privadas Miraflores', 'Av. Larco 400', 'L-V de 8:00 AM a 1:00 PM'),
(44, 'Subgerencia de Urbanismo y Catastro Miraflores', 'Av. Larco 400', 'L-V de 8:00 AM a 4:00 PM'),
(45, 'Oficina de Catastro Miraflores', 'Av. Larco 400', 'L-V de 8:00 AM a 4:00 PM'),
(46, 'Sede Central de Registro Civil Miraflores', 'Jr. Diez Canseco 215', 'L-V de 8:00 AM a 4:00 PM'),
(47, 'Plataforma de Atención al Ciudadano Miraflores', 'Jr. Diez Canseco 215', 'L-V de 8:00 AM a 4:00 PM'),
(48, 'Gerencia de Administración Tributaria Miraflores', 'Av. Larco 400', 'L-V de 8:00 AM a 5:00 PM'),
(49, 'Subgerencia de Movilidad Urbana y Seguridad Vial', 'Jr. Diez Canseco 215', 'L-V de 8:00 AM a 4:00 PM'),
(50, 'Oficina de Control de Estacionamiento Residencial', 'Jr. Diez Canseco 215', 'L-V de 8:00 AM a 4:30 PM');

INSERT INTO estadisticas_consultas (municipalidad_id, mes, anio, tipo, cantidad) VALUES
(1, 'Julio', 2026, 'IA', 340),
(1, 'Julio', 2026, 'TRADICIONAL', 890),
(1, 'Agosto', 2026, 'IA', 780),
(1, 'Agosto', 2026, 'TRADICIONAL', 720),
(1, 'Septiembre', 2026, 'IA', 1250),
(1, 'Septiembre', 2026, 'TRADICIONAL', 580);

INSERT INTO estadisticas_usuarios (municipalidad_id, mes, anio, usuarios_activos_promedio) VALUES
(1, 'Julio', 2026, 850),
(1, 'Agosto', 2026, 1420),
(1, 'Septiembre', 2026, 2100);

INSERT INTO estadisticas_accesibilidad (municipalidad_id, herramienta, porcentaje) VALUES
(1, 'Lector de Voz', 60.00),
(1, 'Alto Contraste', 20.00),
(1, 'Texto Grande', 15.00),
(1, 'Otros', 5.00);

-- ESTADÍSTICAS PARA OTRAS MUNICIPALIDADES (ID 2 a 5)
INSERT INTO estadisticas_consultas (municipalidad_id, mes, anio, tipo, cantidad) VALUES
(2, 'Julio', 2026, 'IA', 410), (2, 'Julio', 2026, 'TRADICIONAL', 820),
(2, 'Agosto', 2026, 'IA', 850), (2, 'Agosto', 2026, 'TRADICIONAL', 690),
(2, 'Septiembre', 2026, 'IA', 1400), (2, 'Septiembre', 2026, 'TRADICIONAL', 520),

(3, 'Julio', 2026, 'IA', 290), (3, 'Julio', 2026, 'TRADICIONAL', 950),
(3, 'Agosto', 2026, 'IA', 600), (3, 'Agosto', 2026, 'TRADICIONAL', 810),
(3, 'Septiembre', 2026, 'IA', 1100), (3, 'Septiembre', 2026, 'TRADICIONAL', 630),

(4, 'Julio', 2026, 'IA', 520), (4, 'Julio', 2026, 'TRADICIONAL', 750),
(4, 'Agosto', 2026, 'IA', 980), (4, 'Agosto', 2026, 'TRADICIONAL', 610),
(4, 'Septiembre', 2026, 'IA', 1650), (4, 'Septiembre', 2026, 'TRADICIONAL', 480),

(5, 'Julio', 2026, 'IA', 600), (5, 'Julio', 2026, 'TRADICIONAL', 600),
(5, 'Agosto', 2026, 'IA', 1100), (5, 'Agosto', 2026, 'TRADICIONAL', 550),
(5, 'Septiembre', 2026, 'IA', 1800), (5, 'Septiembre', 2026, 'TRADICIONAL', 420);

INSERT INTO estadisticas_usuarios (municipalidad_id, mes, anio, usuarios_activos_promedio) VALUES
(2, 'Julio', 2026, 920), (2, 'Agosto', 2026, 1550), (2, 'Septiembre', 2026, 2300),
(3, 'Julio', 2026, 780), (3, 'Agosto', 2026, 1200), (3, 'Septiembre', 2026, 1850),
(4, 'Julio', 2026, 1100), (4, 'Agosto', 2026, 1780), (4, 'Septiembre', 2026, 2600),
(5, 'Julio', 2026, 1250), (5, 'Agosto', 2026, 1950), (5, 'Septiembre', 2026, 2900);

INSERT INTO estadisticas_accesibilidad (municipalidad_id, herramienta, porcentaje) VALUES
(2, 'Lector de Voz', 55.00), (2, 'Alto Contraste', 25.00), (2, 'Texto Grande', 15.00), (2, 'Otros', 5.00),
(3, 'Lector de Voz', 50.00), (3, 'Alto Contraste', 30.00), (3, 'Texto Grande', 15.00), (3, 'Otros', 5.00),
(4, 'Lector de Voz', 65.00), (4, 'Alto Contraste', 15.00), (4, 'Texto Grande', 15.00), (4, 'Otros', 5.00),
(5, 'Lector de Voz', 45.00), (5, 'Alto Contraste', 35.00), (5, 'Texto Grande', 15.00), (5, 'Otros', 5.00);