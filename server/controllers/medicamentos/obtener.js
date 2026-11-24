import pool from '../../config/db.js';

// GET /api/medicamentos/:id -> devuelve un medicamento
export async function obtener(req, res) {
  const id = Number(req.params.id);

  // Validación: el id debe ser un entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id del medicamento no es válido' });
  }

  try {
    // Consulta parametrizada (?) para evitar inyección SQL
    const [filas] = await pool.query(
      `SELECT id, nombre_comercial, sustancia_activa, presentacion, concentracion,
              lote, DATE_FORMAT(fecha_caducidad, '%Y-%m-%d') AS fecha_caducidad,
              precio_publico, stock_actual, stock_minimo, imagen_url
       FROM medicamentos
       WHERE id = ?`,
      [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ error: 'El medicamento no existe' });
    }

    const medicamento = filas[0];
    // mysql2 devuelve DECIMAL como texto; se convierte a número
    medicamento.precio_publico = Number(medicamento.precio_publico);

    return res.status(200).json(medicamento);
  } catch (error) {
    console.error('Error al obtener el medicamento:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}