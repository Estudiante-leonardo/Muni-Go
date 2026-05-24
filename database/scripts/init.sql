CREATE DATABASE muni_db;
-- Eliminar tablas si existen para reiniciar el estado
DROP TABLE IF EXISTS requisitos CASCADE;
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

-- Insertar datos de prueba para H1
INSERT INTO tramites (id, nombre, descripcion, costo, tiempo_estimado, categoria) VALUES
(1, 'Licencia de Funcionamiento para Locales', 'Obtén la licencia oficial para abrir tu establecimiento comercial de manera segura y regulada en la municipalidad.', 150.00, '7 días', 'Licencias'),
(2, 'Certificado de Jurisdicción y Domicilio', 'Documento formal que acredita el domicilio y la jurisdicción territorial de un predio o vivienda en el distrito.', 28.00, '3 días', 'Certificados'),
(3, 'Declaratoria de Fábrica (Construcción)', 'Procedimiento administrativo para declarar e inscribir formalmente las construcciones realizadas ante la municipalidad.', 380.00, '30 días', 'Obras');

-- Ajustar la secuencia de serial de la tabla tramites después de insertar ids explícitos
SELECT setval('tramites_id_seq', 3);

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
(3, 'Firma y pago de derechos municipales correspondientes');
