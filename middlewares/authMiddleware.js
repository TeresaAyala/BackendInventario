const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, acceso denegado' });

    }
    try {
        const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = decoded; next();
    }

    catch (error) {

        res.status(401).json({ msg: 'Token no válido' });
    }
};

const checkRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ msg: "No tienes permisos de acceso" });
        } next();
    };
};

module.exports = { auth, checkRole };