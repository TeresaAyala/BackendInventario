const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.createUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password,rol,status } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsuario = new Usuario({ nombre, apellido, email, telefono,rol, status, password: hashedPassword });
        await newUsuario.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        // 1. Manejar errores de validación (required, enum, match)
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        // 2. Manejar error de campo duplicado (Email unique)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email, status: 'active' });
        if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(password, usuario.password);
        if (!validPass) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol, email: usuario.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '8h' }
        );

        res.json({ token, msg: "Bienvenido " + usuario.nombre });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsuarios = async (req, res) => {
    try {
        const { apellido, nombre } = req.query;
        let query = {};
        if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
        if (apellido) query.apellido = { $regex: apellido, $options: 'i' };

        const usuario = await Usuario.find(query);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUsuarioById = async (req, res) => {
    try {
        const Usuario = await Usuario.findById(req.params.id);
        if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'});
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const data = req.body;
        delete data.password;
        const updatedUsuario = await Usuario.findByIdAndUpdate(req.params.id, data, { new: false });
        res.json(updatedUsuario);
    } catch (error) {
         // 1. Manejar errores de validación (required, enum, match)
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                ok: false,
                errores 
            });
        }

        // 2. Manejar error de campo duplicado (Email unique)
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El correo electrónico ya está registrado']
            });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.changePasswordUsuario = async (req, res) => {
    try {
       const {id} = req.Usuario;
       if(id !==  req.params.id){
        return  res.status(403).json({ msg: 'No tienes permiso para cambiar esta contraseña' });
       }
       const { currentPassword, newPassword } = req.body;
        const Usuario = await Usuario.findById(req.params.id);
        if (!Usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(currentPassword, Usuario.password);
        if (!validPass) return res.status(400).json({ msg: 'Contraseña actual incorrecta' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUsuario = await User.findByIdAndUpdate(req.params.id, {password: hashedPassword}, { new: false });
        res.json(updatedUsuario);
    } catch (error) {     
        res.status(500).json({ error: error.message });
    }
};