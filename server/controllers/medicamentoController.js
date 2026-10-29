const db = require('../config/db'):

// 1. Listar todos los medicamentos activos
const obtenerMedicamentos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE estatus =1');
        res.json(rows);
    } catch (error) {
        res.estatus(500).json({ error: 'Error al obtener los medicamentos'});
    }
};

// 2. Obtener un medicamento por ID
const obtenerMedicamentoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE id = ? AND estatus = 1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el medicamento' });
    }
};

// 3. Crear un nuevo medicamento
const crearMedicamento = async (req, res) => {
    try {
        const {
            nombre_comercial, sustancia_activa, presentacion,
            concentracion, lote, fecha_caducidad,
            precio_publico, stock_actual, stock_minimo, imagen_url
        } = req.body;

        // Validaciones básicas de campos obligatorios
        if (!nombre_comercial || !sustancia_activa || !presentacion || !concentracion || !lote || !fecha_caducidad || precio_publico === undefined || stock_actual === undefined || stock_minimo === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const query = `
            INSERT INTO medicamentos 
            (nombre_comercial, sustancia_activa, presentacion, concentracion, lote, fecha_caducidad, precio_publico, stock_actual, stock_minimo, imagen_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [resultado] = await db.query(query, [
            nombre_comercial, sustancia_activa, presentacion,
            concentracion, lote, fecha_caducidad,
            precio_publico, stock_actual, stock_minimo, imagen_url || null
        ]);

        res.status(201).json({
            id: resultado.insertId,
            message: 'Medicamento creado exitosamente',
            ...req.body
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el medicamento' });
    }
};

// 4. Actualizar un medicamento
const actualizarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre_comercial, sustancia_activa, presentacion,
            concentracion, lote, fecha_caducidad,
            precio_publico, stock_actual, stock_minimo, imagen_url
        } = req.body;

        const query = `
            UPDATE medicamentos SET 
            nombre_comercial = ?, sustancia_activa = ?, presentacion = ?, 
            concentracion = ?, lote = ?, fecha_caducidad = ?, 
            precio_publico = ?, stock_actual = ?, stock_minimo = ?, imagen_url = ?
            WHERE id = ?
        `;

        const [resultado] = await db.query(query, [
            nombre_comercial, sustancia_activa, presentacion,
            concentracion, lote, fecha_caducidad,
            precio_publico, stock_actual, stock_minimo, imagen_url || null, id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        res.json({ message: 'Medicamento actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el medicamento' });
    }
};

// 5. Borrado lógico (Inactivar medicamento)
const eliminarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        // Borrado lógico: cambiamos el estatus a 0 en lugar de borrar la fila físicamente
        const [resultado] = await db.query('UPDATE medicamentos SET estatus = 0 WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }

        res.json({ message: 'Medicamento eliminado (baja lógica) correctamente' });
    } catch (error) {
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