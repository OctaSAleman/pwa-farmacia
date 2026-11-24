# Plan de pruebas: PWA Farmacia

Responsable: Edwin (QA)

## 1. Alcance
CRUD de medicamentos, login con roles (básico y administrador), regla de stock
bajo, responsividad y requisitos PWA (manifiesto, Service Worker).
Los errores se reportan como Issues en GitHub.

## 2. Usuarios de prueba
| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@farmacia.com | La de ADMIN_PASSWORD en server/.env |
| Básico | basico@farmacia.com | La de BASICO_PASSWORD en server/.env |

No se escriben contraseñas reales en este documento.

## 3. Casos de login
| ID | Caso | Entrada | Resultado esperado |
|----|------|---------|--------------------|
| L-01 | Login de administrador | Correo y contraseña correctos | 200 con token y usuario (nombre, rol administrador) |
| L-02 | Login de básico | Correo y contraseña correctos | 200 con token y usuario (rol basico) |
| L-03 | Contraseña incorrecta | Correo válido, contraseña errónea | 401 con «Credenciales incorrectas» |
| L-04 | Correo inexistente | Correo que no existe | 401 con el mismo mensaje «Credenciales incorrectas» |
| L-05 | Campos vacíos | Sin correo o sin contraseña | 400 con campo error |
| L-06 | Ruta protegida sin sesión | Abrir el catálogo sin iniciar sesión | Redirige al login |
| L-07 | Cerrar sesión | Cerrar sesión y volver atrás | Pide iniciar sesión de nuevo |
| L-08 | Token vencido o inválido | Usar un token alterado | 401 con campo error |

## 4. Casos de permisos por rol (API)
| ID | Caso | Rol | Resultado esperado |
|----|------|-----|--------------------|
| P-01 | GET /api/medicamentos sin token | Sin sesión | 401 |
| P-02 | GET /api/medicamentos | Básico | 200 con arreglo |
| P-03 | GET /api/medicamentos/:id | Básico | 200, o 404 si no existe |
| P-04 | POST /api/medicamentos | Básico | 403 |
| P-05 | PUT /api/medicamentos/:id | Básico | 403 |
| P-06 | DELETE /api/medicamentos/:id | Básico | 403 |
| P-07 | POST /api/medicamentos | Administrador | 201 con el medicamento creado |
| P-08 | PUT /api/medicamentos/:id | Administrador | 200, o 404 si no existe |
| P-09 | DELETE /api/medicamentos/:id | Administrador | 200 con campo mensaje, o 404 |
| P-10 | Botones según rol | Básico | No se ven crear, editar ni eliminar (solo comodidad visual) |
| P-11 | Botones según rol | Administrador | Se ven crear, editar y eliminar |

## 5. Casos de alta de medicamento
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
| A-09 | Validación en backend | POST directo con datos inválidos | 400 con campo error |
| A-10 | API caída | Detener el servidor y guardar | Mensaje de error en pantalla |

## 6. Casos de catálogo, edición, detalle y eliminación
| ID | Caso | Entrada | Resultado esperado |
|----|------|---------|--------------------|
| C-01 | Listado | Abrir el catálogo con sesión | Se muestran los medicamentos |
| C-02 | Stock bajo | stock_actual <= stock_minimo | Se muestra la alerta visual |
| C-03 | Stock suficiente | stock_actual > stock_minimo | No se muestra la alerta |
| D-01 | Detalle existente | Abrir un medicamento | Se muestran todos sus campos |
| D-02 | Detalle inexistente | Id que no existe | 404 y mensaje en pantalla |
| E-01 | Edición válida | Cambiar el precio y guardar | Se actualiza (200) |
| E-02 | Edición inválida | Dejar vacío un campo obligatorio | Mensaje de error |
| X-01 | Eliminar con confirmación | Eliminar y confirmar | 200 con mensaje y desaparece del catálogo |
| X-02 | Cancelar eliminación | Eliminar y cancelar | No se borra nada |
| X-03 | Eliminar inexistente | Id que no existe | 404 con campo error |

## 7. Pruebas PWA
Con npm run build y npm run preview (no npm run dev):
- Lighthouse en la categoría PWA.
- Manifiesto: iconos 192/512/maskable, display standalone, orientation.
- Service Worker: install, activate (limpieza de caché), fetch, registro.
- Las rutas /api/ no se guardan en caché (tampoco el login).
- Modo sin conexión: se muestra offline.html.

## 8. Pruebas responsivas
Modo dispositivo de DevTools: móvil (obligatorio), 768 px, 1024 px y 1920 px.

## 9. Registro de resultados
| ID | Fecha | Resultado (OK/Falla) | Issue | Observaciones |
|----|-------|----------------------|-------|---------------|