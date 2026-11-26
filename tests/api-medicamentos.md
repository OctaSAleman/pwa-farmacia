# Casos de prueba de la API (Bruno, Thunder Client o Postman)

Base: http://localhost:3000

Para las rutas protegidas se envía el encabezado:
Authorization: Bearer <token>
El token se obtiene con POST /api/auth/login.

| # | Método y ruta | Rol | Cuerpo | Esperado |
|---|---------------|-----|--------|----------|
| 1 | GET /api/salud | Sin sesión | - | 200 |
| 2 | POST /api/auth/login | Sin sesión | correo y password correctos | 200 con token y usuario |
| 3 | POST /api/auth/login | Sin sesión | password incorrecta | 401 «Credenciales incorrectas» |
| 4 | POST /api/auth/login | Sin sesión | sin correo | 400 |
| 5 | GET /api/medicamentos | Sin sesión | - | 401 |
| 6 | GET /api/medicamentos | Básico | - | 200 con arreglo |
| 7 | GET /api/medicamentos/:id | Básico | - | 200 |
| 8 | GET /api/medicamentos/9999 | Básico | - | 404 |
| 9 | POST /api/medicamentos | Básico | medicamento válido | 403 |
| 10 | POST /api/medicamentos | Administrador | medicamento válido | 201 |
| 11 | POST /api/medicamentos | Administrador | precio_publico = -5 | 400 |
| 12 | PUT /api/medicamentos/:id | Básico | cambios válidos | 403 |
| 13 | PUT /api/medicamentos/:id | Administrador | cambios válidos | 200 |
| 14 | PUT /api/medicamentos/9999 | Administrador | cambios válidos | 404 |
| 15 | DELETE /api/medicamentos/:id | Básico | - | 403 |
| 16 | DELETE /api/medicamentos/:id | Administrador | - | 200 con campo mensaje |
| 17 | DELETE /api/medicamentos/9999 | Administrador | - | 404 con campo error |
| 18 | GET /api/medicamentos | Administrador | token alterado | 401 |

## Cuerpo de ejemplo para crear

{
  "nombre_comercial": "Paracetamol",
  "sustancia_activa": "Paracetamol",
  "presentacion": "Tabletas",
  "concentracion": "500 mg",
  "lote": "L-2026-01",
  "fecha_caducidad": "2027-12-31",
  "precio_publico": 45.5,
  "stock_actual": 20,
  "stock_minimo": 5,
  "imagen_url": null
}