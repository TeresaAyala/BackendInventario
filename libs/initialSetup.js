const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    try {
        // 1. Verificar si ya existen usuarios para no duplicar
        const count = await Usuario.estimatedDocumentCount();
        if (count > 0) return;

        // 2. Encriptar contraseña (siempre hazlo por seguridad)
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // 3. Crear el usuario administrador
        const adminUsuario = new Usuario({
            nombre: 'Administrador',
            apellido: 'Sistema',
            email: 'admin@correo.com',
            password: hashedPassword,
            rol: 'ADMIN',
            status: 'active'
        });

        await adminUsuario.save();
        console.log('Usuario administrador creado por defecto');
    } catch (error) {
        console.error('Error creando usuario por defecto:', error);
    }
};

module.exports = { createAdmin };