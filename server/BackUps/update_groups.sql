-- Script para actualizar la base de datos de poi_chat y soportar grupos de mensajería
-- Ejecuta este script en tu servidor de MySQL (por ejemplo, desde phpMyAdmin, MySQL Workbench o tu consola de MySQL)

ALTER TABLE conversacion 
ADD COLUMN esGrupo TINYINT(1) NOT NULL DEFAULT 0,
ADD COLUMN nombreGrupo VARCHAR(100) DEFAULT NULL,
ADD COLUMN fotoGrupo VARCHAR(255) DEFAULT NULL,
ADD COLUMN idCreador INT DEFAULT NULL,
ADD CONSTRAINT fk_conversacion_creador FOREIGN KEY (idCreador) REFERENCES usuario(ID_Us) ON DELETE SET NULL;

ALTER TABLE conversacion_usuario 
ADD COLUMN rol ENUM('miembro', 'admin') NOT NULL DEFAULT 'miembro';
