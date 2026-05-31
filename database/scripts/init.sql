CREATE DATABASE muni_db;
-- Eliminar tablas si existen para reiniciar el estado
DROP TABLE IF EXISTS requisitos CASCADE;
DROP TABLE IF EXISTS formatos CASCADE;
DROP TABLE IF EXISTS pasos CASCADE;
DROP TABLE IF EXISTS lugares CASCADE;
DROP TABLE IF EXISTS tramites CASCADE;

-- Crear tabla de trámites
CREATE TABLE tramites (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    tiempo_estimado VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL
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

-- Insertar datos de prueba para H1
INSERT INTO tramites (id, nombre, descripcion, costo, tiempo_estimado, categoria) VALUES
(1, 'Licencia de Funcionamiento para Locales', 'Obtén la licencia oficial para abrir tu establecimiento comercial de manera segura y regulada en la municipalidad.', 120.00, '15-20 días', 'Licencias'),
(2, 'Certificado de Jurisdicción y Domicilio', 'Documento formal que acredita el domicilio y la jurisdicción territorial de un predio o vivienda en el distrito.', 25.00, '3 días', 'Certificados'),
(3, 'Declaratoria de Fábrica (Construcción)', 'Procedimiento administrativo para declarar e inscribir formalmente las construcciones realizadas ante la municipalidad.', 350.00, '30 días', 'Obras'),
(4, 'Licencia de Edificación - Residencial', 'Obtén la licencia de construcción para habilitación de viviendas unifamiliares de hasta 120m2.', 220.00, '15 días', 'Licencias'),
(5, 'Licencia de Conducir de Vehículos Menores (Mototaxis)', 'Obtención de la licencia de conducir clase B-IIc para mototaxis, motocicletas y triciclos de carga.', 85.00, '10 días', 'Licencias'),
(6, 'Pago de Impuesto Predial y Arbitrios', 'Pago de tributos municipales correspondientes al autoavalúo del predio y los arbitrios de limpieza pública, parques y seguridad.', 0.00, '1 día', 'Impuestos');

-- Ajustar la secuencia de serial de la tabla tramites después de insertar ids explícitos
SELECT setval('tramites_id_seq', 6);

-- Insertar requisitos conectados a los trámites
INSERT INTO requisitos (tramite_id, descripcion) VALUES
(1, 'Copia de cédula de identidad o RUC del propietario'),
(1, 'Certificado de uso de suelo favorable'),
(1, 'Planos arquitectónicos aprobados'),
(1, 'Certificado del cuerpo de bomberos'),
(2, 'Copia de DNI vigente'),
(2, 'Croquis de ubicación de la vivienda'),
(2, 'Recibo de servicios (luz o agua) no mayor a 3 meses'),
(3, 'Título de propiedad inscrito en SUNARP'),
(3, 'Planos de arquitectura (plantas, cortes, elevaciones) a escala 1:100'),
(3, 'Memoria descriptiva firmada por ingeniero o arquitecto colegiado'),
(3, 'Firma y pago de derechos municipales correspondientes'),
(4, 'Formulario Único de Edificación (FUE) debidamente firmado por duplicado'),
(4, 'Copia literal de dominio expedida por la SUNARP (vigencia no mayor a 30 días)'),
(4, 'Plano de ubicación e informes de factibilidad de servicios'),
(4, 'Planos de arquitectura, estructuras, sanitarias y eléctricas firmados por profesionales'),
(5, 'Copia de DNI legible del solicitante'),
(5, 'Certificado médico de aptitud psicosomática emitido por centro autorizado por el MTC'),
(5, 'Certificado de aprobación del examen de normas de tránsito'),
(5, 'Recibo de pago por derecho de trámite'),
(5, 'Dos fotografías tamaño carné fondo blanco'),
(6, 'Código de contribuyente municipal (código de predio)'),
(6, 'Copia de DNI del propietario o representante legal'),
(6, 'Declaración Jurada de Autoavalúo (PU y HR) del año en curso');

-- Insertar formatos
INSERT INTO formatos (tramite_id, nombre, descripcion, url_descarga) VALUES
(1, 'Formato Único de Trámite (FUT)', 'Documento PDF - 120 KB', '/formatos/fut.pdf'),
(1, 'Declaración Jurada de Defensa Civil', 'Documento PDF - 85 KB', '/formatos/dj_defensa.pdf'),
(2, 'Formato Único de Trámite (FUT)', 'Documento PDF - 120 KB', '/formatos/fut.pdf'),
(3, 'Formulario Único de Edificación (FUE)', 'Documento PDF - 250 KB', '/formatos/fue.pdf');

-- Insertar pasos
INSERT INTO pasos (tramite_id, numero, titulo, descripcion) VALUES
(1, 1, 'Preparar Expediente', 'Junta todos los requisitos y llena los formatos descargados en un folder.'),
(1, 2, 'Acercarse a Sede', 'Dirígete a la Municipalidad de Carabayllo. Si tu trámite tiene costo, pasa primero por caja.'),
(1, 3, 'Mesa de Partes', 'Entrega tus documentos. Te asignarán un número para que consultes luego el resultado.'),
(2, 1, 'Llenar Formulario', 'Completa el FUT indicando el motivo de la solicitud.'),
(2, 2, 'Mesa de Partes', 'Entrega los documentos presencialmente o a través de la Mesa de Partes Virtual.');

-- Insertar lugares
INSERT INTO lugares (tramite_id, nombre, direccion, horario) VALUES
(1, 'Municipalidad de Carabayllo', 'Plaza Central del distrito', 'L-V de 8:00 AM a 4:30 PM'),
(2, 'Municipalidad de Carabayllo', 'Plaza Central del distrito', 'L-V de 8:00 AM a 4:30 PM'),
(3, 'Sede de Obras Privadas', 'Av. Túpac Amaru Km 18', 'L-V de 8:00 AM a 1:00 PM'),
(4, 'Sede de Obras Privadas', 'Av. Túpac Amaru Km 18', 'L-V de 8:00 AM a 1:00 PM'),
(5, 'Subgerencia de Transporte', 'Agencia Municipal Lomas', 'L-V de 8:00 AM a 4:00 PM'),
(6, 'Agencia de Administración Tributaria', 'Palacio Municipal', 'L-V de 8:00 AM a 5:30 PM');
