const jwt = require('jsonwebtoken');

// Revisa que la petición traiga un token válido: Authorization: Bearer <token>
function verificarToken(req, res, next) {
    const encabezado = req.headers.authorization || '';
    const [tipo, token] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    try {
        // Si el token es válido, guardamos los datos del usuario en req.usuario
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'La sesión no es válida o ya venció' });
    }
}

// Permite el paso solo a los roles indicados. Ej: permitirRoles('administrador')
function permitirRoles(...roles) {
    return (req, res, next) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para esta acción' });
        }
        next();
    };
}

module.exports = { verificarToken, permitirRoles };
