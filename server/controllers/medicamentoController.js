const db = require('../config/db');
const { validarMedicamento } = require('../utils/validaciones');

// Columnas que se regresan al frontend
const COLUMNAS = `id, nombre_comercial, sustancia_activa, presentacion, concentracion,
    lote, DATE_FORMAT(fecha_caducidad, '%Y-%m-%d') AS fecha_caducidad,
    precio_publico, stock_actual, stock_minimo, imagen_url`;

// mysql2 devuelve DECIMAL como texto; se convierte a número
function formatear(m) {
    return { ...m, precio_publico: Number(m.precio_publico) };
}

// El id debe ser un entero positivo
function idValido(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Arma el arreglo de valores en el orden de las columnas
function valoresDe(body) {
    return [
        String(body.nombre_comercial).trim(),
        String(body.sustancia_activa).trim(),
        body.presentacion,
        String(body.concentracion).trim(),
        String(body.lote).trim(),
        String(body.fecha_caducidad).slice(0, 10),
        Number(body.precio_publico),
        Number(body.stock_actual),
        Number(body.stock_minimo),
        body.imagen_url ? String(body.imagen_url).trim() : null
    ];
}

// Toma el primer error de validación para mandarlo en el campo "error"
function respuestaValidacion(res, errores) {
    return res.status(400).json({ error: Object.values(errores)[0], errores });
}

// 1. Listar todos los medicamentos
const obtenerMedicamentos = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT ${COLUMNAS} FROM medicamentos ORDER BY nombre_comercial`
        );
        res.json(rows.map(formatear));
    } catch (error) {
        console.error('Error al obtener los medicamentos:', error.message);
        res.status(500).json({ error: 'Error al obtener los medicamentos' });
    }
};

// 2. Obtener un medicamento por ID
const obtenerMedicamentoPorId = async (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ error: 'El id del medicamento no es válido' });

    try {
        const [rows] = await db.query(
            `SELECT ${COLUMNAS} FROM medicamentos WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        res.json(formatear(rows[0]));
    } catch (error) {
        console.error('Error al obtener el medicamento:', error.message);
        res.status(500).json({ error: 'Error al obtener el medicamento' });
    }
};

// 3. Crear un nuevo medicamento
const crearMedicamento = async (req, res) => {
    const errores = validarMedicamento(req.body);
    if (Object.keys(errores).length > 0) return respuestaValidacion(res, errores);

    try {
        const [resultado] = await db.query(
            `INSERT INTO medicamentos
            (nombre_comercial, sustancia_activa, presentacion, concentracion, lote,
             fecha_caducidad, precio_publico, stock_actual, stock_minimo, imagen_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            valoresDe(req.body)
        );

        const [rows] = await db.query(`SELECT ${COLUMNAS} FROM medicamentos WHERE id = ?`, [resultado.insertId]);
        res.status(201).json(formatear(rows[0]));
    } catch (error) {
        console.error('Error al crear el medicamento:', error.message);
        res.status(500).json({ error: 'Error al crear el medicamento' });
    }
};

// 4. Actualizar un medicamento
const actualizarMedicamento = async (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ error: 'El id del medicamento no es válido' });

    const errores = validarMedicamento(req.body);
    if (Object.keys(errores).length > 0) return respuestaValidacion(res, errores);

    try {
        const [resultado] = await db.query(
            `UPDATE medicamentos SET
            nombre_comercial = ?, sustancia_activa = ?, presentacion = ?,
            concentracion = ?, lote = ?, fecha_caducidad = ?,
            precio_publico = ?, stock_actual = ?, stock_minimo = ?, imagen_url = ?
            WHERE id = ?`,
            [...valoresDe(req.body), id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        const [rows] = await db.query(`SELECT ${COLUMNAS} FROM medicamentos WHERE id = ?`, [id]);
        res.json(formatear(rows[0]));
    } catch (error) {
        console.error('Error al actualizar el medicamento:', error.message);
        res.status(500).json({ error: 'Error al actualizar el medicamento' });
    }
};

// 5. Eliminar un medicamento
const eliminarMedicamento = async (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ error: 'El id del medicamento no es válido' });

    try {
        const [resultado] = await db.query('DELETE FROM medicamentos WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        res.json({ mensaje: 'Medicamento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el medicamento:', error.message);
        res.status(500).json({ error: 'Error al eliminar el medicamento' });
    }
};

module.exports = {
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
};
