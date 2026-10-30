-- Creación de la base de datos para la PWA de la Farmacia
CREATE DATABASE IF NOT EXISTS pwa_farmacia;
USE pwa_farmacia;

-- Tabla principal de medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comercial VARCHAR(100) NOT NULL,
    sustancia_activa VARCHAR(100) NOT NULL,
    presentacion ENUM('Tabletas', 'Jarabe', 'Ampolletas', 'Cápsulas', 'Pomada') NOT NULL,
    concentracion VARCHAR(50) NOT NULL,
    lote VARCHAR(50) NOT NULL,
    fecha_caducidad DATE NOT NULL,
    precio_publico DECIMAL(10,2) NOT NULL CHECK (precio_publico >= 0),
    stock_actual INT NOT NULL CHECK (stock_actual >= 0),
    stock_minimo INT NOT NULL CHECK (stock_minimo >= 0),
    imagen_url VARCHAR(255) NULL,
    estatus TINYINT(1) DEFAULT 1 NOT NULL -- 1: Activo, 0: Inactivo (Borrado lógico)
);