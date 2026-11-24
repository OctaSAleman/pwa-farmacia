// Servicio de la operación "obtener un medicamento" (GET /api/medicamentos/:id)
export async function obtenerMedicamento(id) {
  const token = localStorage.getItem('token');

  const respuesta = await fetch(`/api/medicamentos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.error || 'No se pudo obtener el medicamento');
    error.status = respuesta.status; // 401, 403, 404, 500...
    throw error;
  }

  return datos;
}