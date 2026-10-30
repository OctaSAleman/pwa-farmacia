# Plan de pruebas: PWA Farmacia

Responsable: Edwin (QA) · Entrega: jueves 29 de octubre de 2026

## 1. Alcance
CRUD de medicamentos, regla de stock bajo, responsividad y requisitos PWA
(manifiesto, Service Worker). Los errores se reportan como Issues en GitHub.

## 2. Casos de prueba: alta de medicamento

| ID | Caso | Entrada | Resultado esperado |
|----|------|---------|--------------------|
| A-01 | Alta válida | Todos los campos correctos | Se crea (201) y aparece en el catálogo |
| A-02 | Campo obligatorio vacío | Dejar vacío nombre_comercial | Mensaje de error, no se envía |
| A-03 | Presentación no elegida | Sin seleccionar presentación | Mensaje de error |
| A-04 | Precio negativo | precio_publico = -5 | Mensaje de error |
| A-05 | Stock decimal | stock_actual = 2.5 | Mensaje de error (debe ser entero) |
| A-06 | Stock negativo | stock_minimo = -1 | Mensaje de error |
| A-07 | Sin fecha de caducidad | Fecha vacía | Mensaje de error |
| A-08 | Imagen opcional vacía | imagen_url vacío | Se guarda con imagen_url nulo |
| A-09 | Stock bajo | stock_actual <= stock_minimo | El catálogo muestra la alerta visual |
| A-10 | Validación en backend | POST directo con datos inválidos | Respuesta 400 con campo error |
| A-11 | API caída | Detener el servidor y guardar | Se muestra mensaje de error en pantalla |

## 3. Pruebas del CRUD (API)
Listar (GET), obtener uno (GET /:id, 404 si no existe), crear (POST, 201),
actualizar (PUT) y eliminar (DELETE con campo mensaje).

## 4. Pruebas PWA
Con `npm run build` y `npm run preview` (no `npm run dev`):
- Lighthouse en la categoría PWA.
- Manifiesto: iconos 192/512/maskable, display standalone, orientation.
- Service Worker: install, activate (limpieza de caché), fetch, registro.
- Modo sin conexión: se muestra offline.html.

## 5. Pruebas responsivas
Modo dispositivo de DevTools: móvil (obligatorio), 768 px, 1024 px y 1920 px.

## 6. Registro de resultados
| ID | Fecha | Resultado (OK/Falla) | Issue | Observaciones |
