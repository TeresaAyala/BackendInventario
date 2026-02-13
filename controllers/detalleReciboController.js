const DetalleRecibo = require('../models/DetalleRecibo');
const Recibo = require('../models/Recibo');

const createDetalle = async (req, res) => {
    try {
        const { recibo, producto, cantidad, precio } = req.body;

        const reciboExistente = await Recibo.findById(recibo);
        if (!reciboExistente) {
            return res.status(404).json({ msg: 'Recibo no encontrado' });
        }

        const subtotal = cantidad * precio;

        const nuevoDetalle = new DetalleRecibo({
            recibo,
            producto,
            cantidad,
            precio,
            subtotal,
            estado: 'Activo'
        });

        await nuevoDetalle.save();

        res.status(201).json(nuevoDetalle);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDetallesByRecibo = async (req, res) => {
    try {
        const detalles = await DetalleRecibo.find({
            recibo: req.params.reciboId,
            estado: 'Activo'
        });

        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const inactivarDetalle = async (req, res) => {
    try {
        const detalle = await DetalleRecibo.findByIdAndUpdate(
            req.params.id,
            { estado: 'Inactivo' },
            { new: true }
        );

        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDetalle,
    getDetallesByRecibo,
    inactivarDetalle
};
