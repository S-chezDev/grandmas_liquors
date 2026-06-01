-- Migración: Aumentar campo NIT a VARCHAR(30) para permitir caracteres especiales
-- Descripción: Cambia el campo nit de VARCHAR(20) a VARCHAR(30) para soportar NITs con 
--              guiones, comas, asteriscos y slash
-- Versión: 001

ALTER TABLE proveedores 
ALTER COLUMN nit TYPE VARCHAR(30);
