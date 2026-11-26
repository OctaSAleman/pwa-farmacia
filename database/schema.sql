CREATE DATABASE IF NOT EXISTS farmacia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmacia;

CREATE TABLE IF NOT EXISTS medicamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_comercial VARCHAR(100) NOT NULL,
  sustancia_activa VARCHAR(100) NOT NULL,
  presentacion ENUM('Tabletas','Jarabe','Ampolletas','Cápsulas','Pomada') NOT NULL,
  concentracion VARCHAR(50) NOT NULL,
  lote VARCHAR(50) NOT NULL,
  fecha_caducidad DATE NOT NULL,
  precio_publico DECIMAL(10,2) NOT NULL CHECK (precio_publico >= 0),
  stock_actual INT NOT NULL CHECK (stock_actual >= 0),
  stock_minimo INT NOT NULL CHECK (stock_minimo >= 0),
  imagen_url VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('basico','administrador') NOT NULL DEFAULT 'basico',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;