const express = require('express');
const router = express.Router();

const {
    obtenerMedicamentos,
    obtenerMedicamentoPorId,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
} = require('../controllers/medicamentoController');

const { verificarToken, permitirRoles } = require('../middlewares/auth');

// Todas las rutas de medicamentos piden sesión iniciada
router.use(verificarToken);

// Definición de las rutas del CRUD para /api/medicamentos

// 1. Obtener todos los medicamentos (básico y administrador)
router.get('/', obtenerMedicamentos);

// 2. Obtener un medicamento por su ID (básico y administrador)
router.get('/:id', obtenerMedicamentoPorId);

// 3. Crear un nuevo medicamento (solo administrador)
router.post('/', permitirRoles('administrador'), crearMedicamento);

// 4. Actualizar un medicamento existente (solo administrador)
router.put('/:id', permitirRoles('administrador'), actualizarMedicamento);

// 5. Eliminar un medicamento (solo administrador)
router.delete('/:id', permitirRoles('administrador'), eliminarMedicamento);

module.exports = router;
