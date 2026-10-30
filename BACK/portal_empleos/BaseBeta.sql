CREATE DATABASE IF NOT EXISTS portal_empleos;
USE portal_empleos;

-- 1. Tabla de Roles (Candidato, Proveedor, Multinacional)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla Central de Usuarios (Autenticación)
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- 3. Perfil del Usuario Normal (Candidato)
CREATE TABLE perfiles_candidatos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    profesion VARCHAR(150),
    habilidades TEXT,
    sobre_mi TEXT,
    cv_url VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. Perfil de Empresas (Cubre tanto a Proveedores como a Multinacionales)
CREATE TABLE perfiles_empresas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    nombre_empresa VARCHAR(150) NOT NULL,
    descripcion TEXT,
    industria VARCHAR(100),
    sitio_web VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 5. Publicaciones / Ofertas de Trabajo
CREATE TABLE ofertas_trabajo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    modalidad ENUM('Presencial', 'Híbrido', 'Remoto') DEFAULT 'Presencial',
    salario DECIMAL(10,2),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES perfiles_empresas(id) ON DELETE CASCADE
);

-- 6. Postulaciones (Relación entre Candidatos y Ofertas)
CREATE TABLE postulaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    oferta_id BIGINT NOT NULL,
    candidato_id BIGINT NOT NULL,
    estado ENUM('Pendiente', 'En Revisión', 'Aceptada', 'Rechazada') DEFAULT 'Pendiente',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oferta_id) REFERENCES ofertas_trabajo(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES perfiles_candidatos(id) ON DELETE CASCADE
);

-- Insertar roles iniciales para testear
INSERT INTO roles (nombre) VALUES ('Candidato'), ('Proveedor'), ('Multinacional');
