const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/login -> { token, usuario: { nombre, rol } }
const login = async (req, res) => {
    try {
        const { correo, password } = req.body || {};

        if (!correo || !password) {
            return res.status(400).json({ error: 'El correo y la contraseña son obligatorios' });
        }

        const [filas] = await db.query(
            'SELECT id, nombre, correo, password_hash, rol FROM usuarios WHERE correo = ? AND activo = 1',
            [String(correo).trim().toLowerCase()]
        );

        // Mismo mensaje si falla el correo o la contraseña (no damos pistas)
        const usuario = filas[0];
        const passwordCorrecta = usuario && await bcrypt.compare(String(password), usuario.password_hash);
        if (!passwordCorrecta) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRA || '8h' }
        );

        res.json({
            token,
            usuario: { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
        });
    } catch (error) {
        console.error('Error en el login:', error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = { login };
