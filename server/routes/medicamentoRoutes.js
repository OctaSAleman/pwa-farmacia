const express = require('express');
const router = express.Router();

const{
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
} = require('../controllers/medicamentoController');

// Definición de las rutas del CRUD para /api/medicamentos

// 1. Obtener todos los medicamentos activos 
router.get('/', obtenerMedicamentos);

// 2. Obtener un medicamento por su ID 
router.get('/:id', obtenerMedicamentoPorId);

// 3. Crear un nuevo medicamento 
router.post('/', crearMedicamento);

// 4. Actualizar un medicamento existente 
router.put('/:id', actualizarMedicamento);

//5. Inactivar/Borrar lógicamente un medicamento
router.delete('/:id', eliminarMedicamento);

module.exports = router;