// Servicios para hablar con la API de medicamentos (/api/medicamentos)
// En desarrollo, Vite manda las peticiones /api al servidor (ver vite.config.js)

// Función base: agrega el token y convierte los errores en excepciones
export async function peticion(ruta, opciones = {}) {
  const token = localStorage.getItem('token');

  let respuesta;
  try {
    respuesta = await fetch(ruta, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error('No hay conexión con el servidor. Revisa que la API esté encendida.');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    // Sesión vencida o token inválido: se borra la sesión y se manda al login
    if (respuesta.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    const error = new Error(datos.error || 'Ocurrió un error, intenta de nuevo');
    error.status = respuesta.status; // 400, 401, 403, 404, 500...
    error.errores = datos.errores; // errores por campo (validación)
    throw error;
  }

  return datos;
}

// GET /api/medicamentos -> lista de medicamentos activos
export function obtenerMedicamentos() {
  return peticion('/api/medicamentos');
}

// GET /api/medicamentos/:id -> un medicamento
export function obtenerMedicamento(id) {
  return peticion(`/api/medicamentos/${id}`);
}

// POST /api/medicamentos -> crea un medicamento (solo administrador)
export function crearMedicamento(medicamento) {
  return peticion('/api/medicamentos', {
    method: 'POST',
    body: JSON.stringify(medicamento),
  });
}

// PUT /api/medicamentos/:id -> actualiza un medicamento (solo administrador)
export function actualizarMedicamento(id, medicamento) {
  return peticion(`/api/medicamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(medicamento),
  });
}

// DELETE /api/medicamentos/:id -> elimina el medicamento (solo administrador)
export function eliminarMedicamento(id) {
  return peticion(`/api/medicamentos/${id}`, { method: 'DELETE' });
}
