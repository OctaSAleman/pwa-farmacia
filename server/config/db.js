const mysql = require('mysql2');

// Configuración de la conexión usando variables de entorno (server/.env)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmacia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // las fechas llegan como texto AAAA-MM-DD
});

// Exportamos el pool utilizando promesas para usar async/await
module.exports = pool.promise();
