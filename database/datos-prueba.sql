-- Datos de prueba para ver el catálogo (opcional)
USE farmacia;

INSERT INTO medicamentos
(nombre_comercial, sustancia_activa, presentacion, concentracion, lote, fecha_caducidad, precio_publico, stock_actual, stock_minimo, imagen_url)
VALUES
('Tempra', 'Paracetamol', 'Tabletas', '500 mg', 'L-2026-01', '2027-12-31', 45.50, 40, 10, NULL),
('Advil', 'Ibuprofeno', 'Cápsulas', '400 mg', 'L-2026-02', '2027-08-15', 89.00, 5, 10, NULL),
('Amoxil', 'Amoxicilina', 'Jarabe', '250 mg/5 ml', 'L-2026-03', '2027-03-01', 120.00, 18, 8, NULL),
('Voltaren', 'Diclofenaco', 'Pomada', '1 %', 'L-2026-04', '2028-01-20', 150.00, 3, 5, NULL),
('Complejo B', 'Vitaminas B1, B6 y B12', 'Ampolletas', '3 ml', 'L-2026-05', '2027-06-30', 210.00, 12, 4, NULL);
