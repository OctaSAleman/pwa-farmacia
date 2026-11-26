// Servicio de login: POST /api/auth/login
// Respuesta: { token, usuario: { nombre, correo, rol } }
export async function login(correo, password) {
  let respuesta;
  try {
    respuesta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });
  } catch {
    throw new Error('No hay conexión con el servidor. Revisa que la API esté encendida.');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.error || 'No se pudo iniciar sesión');
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}
