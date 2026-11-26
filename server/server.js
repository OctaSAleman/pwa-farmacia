// Cargar las variables de server/.env
require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const medicamentosRoutes = require('./routes/medicamentoRoutes');

if (!process.env.JWT_SECRET) {
    console.error('Falta JWT_SECRET en server/.env (copia .env.example como .env)');
    process.exit(1);
}

// Inicializar la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales
app.use(cors());
app.use(express.json()); // para leer el cuerpo JSON de las peticiones

// Ruta para revisar que la API está viva
app.get('/api/salud', (req, res) => {
    res.json({ estado: 'ok', mensaje: 'API de PWA Farmacia funcionando correctamente' });
});

// Registrar las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentosRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.json({ message: 'API de PWA Farmacia funcionando correctamente' });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// JSON mal escrito u otro error inesperado
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Levantar el servidor en el puerto configurado
app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
