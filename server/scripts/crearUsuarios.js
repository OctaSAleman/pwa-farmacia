// Crea (o actualiza) los usuarios de prueba con las contraseñas de server/.env
// Uso: npm run crear-usuarios
require('dotenv').config({ quiet: true });
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const usuarios = [
    { nombre: 'Administrador', correo: 'admin@farmacia.com', password: process.env.ADMIN_PASSWORD, rol: 'administrador' },
    { nombre: 'Usuario básico', correo: 'basico@farmacia.com', password: process.env.BASICO_PASSWORD, rol: 'basico' }
];

async function main() {
    for (const u of usuarios) {
        if (!u.password) {
            console.error(`Falta la contraseña de ${u.correo} en server/.env`);
            process.exit(1);
        }
        const hash = await bcrypt.hash(u.password, 10);
        await db.query(
            `INSERT INTO usuarios (nombre, correo, password_hash, rol)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash), rol = VALUES(rol), activo = 1`,
            [u.nombre, u.correo, hash, u.rol]
        );
        console.log(`Usuario listo: ${u.correo} (${u.rol})`);
    }
    process.exit(0);
}

main().catch((error) => {
    console.error('No se pudieron crear los usuarios:', error.message);
    process.exit(1);
});
