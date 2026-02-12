const Recibo = require('../models/Recibo');

exports.createRecibo = async (req, res) => {
    try {
        const recibo = new Recibo(req.body);
        await recibo.save();

        res.status(201).json({ msg: 'Recibo generado exitosamente' });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.getRecibos = async (req, res) => {
    try {
        const recibos = await Recibo.find().populate('usuario');
        res.json(recibos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReciboById = async (req, res) => {
    try {
        const recibo = await Recibo.findById(req.params.id);
        if (!recibo) {
            return res.status(404).json({ msg: 'Recibo no encontrado' });
        }
        res.json(recibo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
