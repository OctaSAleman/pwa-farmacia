const mysql = require('mysql12');

//Configuración de la conexión utilizando variables de entorono o valores por defecto

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'pwa_farmacia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportamos el pool utilizando promesas para usar async/await
module.exports = pool.promise();