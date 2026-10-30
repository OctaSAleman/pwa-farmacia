const express = require('express');
const cors = require('cors');

// Importar las rutas de medicamentos
const medicamentosRoutes = require('./routes/medicamentoRoutes');

//Inicializar la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales
app.use(cors());
app.use('/api/medicamentos', medicamentoRoutes);

// Registrar las rutas de la API bajo el prefijo /api/medicamentos
app.use('/api/medicamentos', medicamentosRoutes);

// Ruta de prueba inicial para verificar que el servidor responde
app.get('/', (req, res) => {
    res.json({ message: 'API de PWA Farmacia funcionando correctamente'});
});

// Levantar el servidor en el puerto configurado 
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});