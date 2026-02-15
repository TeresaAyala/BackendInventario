const Roles = require('../models/Roles');

exports.createRoles = async (req, res) => {
    try {
        const roles = new Roles(req.body);
        await roles.save();

        res.status(201).json({
            ok: true,
            msg: 'Rol creado correctamente'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El rol ya existe']
            });
        }

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Roles.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRolById = async (req, res) => {
    try {
        const roles = await Roles.findById(req.params.id);
        if (!roles) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoles = async (req, res) => {
    try {
        const roles = await Roles.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRoles = async (req, res) => {
    try {
        await Roles.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Rol eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
