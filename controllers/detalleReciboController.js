const DetalleRecibo = require('../models/DetalleRecibo');
const Recibo = require('../models/Recibo');
const Producto = require('../models/Producto');

exports.createDetalle = async (req, res) => {
    try {
        const { recibo, producto, cantidad, precio } = req.body;

        if (!recibo || !producto || !cantidad || !precio) {
            return res.status(400).json({
                msg: 'Todos los campos son obligatorios'
            });
        }

        const reciboExistente = await Recibo.findById(recibo);
        if (!reciboExistente) {
            return res.status(404).json({
                msg: 'Recibo no encontrado'
            });
        }

        if (reciboExistente.estado === 'Anulado') {
            return res.status(400).json({
                msg: 'No se puede agregar detalle a un recibo anulado'
            });
        }

        const productoExistente = await Producto.findById(producto);
        if (!productoExistente) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
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

        await Producto.findByIdAndUpdate(
            producto,
            { $inc: { stock: cantidad } }
        );

        await recalcularTotales(recibo);

        res.status(201).json({
            msg: 'Detalle creado correctamente',
            detalle: nuevoDetalle
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDetallesByRecibo = async (req, res) => {
    try {
        const { reciboId } = req.params;

        const detalles = await DetalleRecibo.find({
            recibo: reciboId,
            estado: 'Activo'
        }).populate('producto');

        res.json(detalles);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.inactivarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await DetalleRecibo.findById(id);

        if (!detalle) {
            return res.status(404).json({
                msg: 'Detalle no encontrado'
            });
        }

        if (detalle.estado === 'Inactivo') {
            return res.status(400).json({
                msg: 'El detalle ya está inactivo'
            });
        }

        await Producto.findByIdAndUpdate(
            detalle.producto,
            { $inc: { stock: -detalle.cantidad } }
        );

        detalle.estado = 'Inactivo';
        await detalle.save();

        await recalcularTotales(detalle.recibo);

        res.json({
            msg: 'Detalle inactivado correctamente'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const recalcularTotales = async (reciboId) => {
    const detalles = await DetalleRecibo.find({
        recibo: reciboId,
        estado: 'Activo'
    });

    let subtotal = 0;

    detalles.forEach(detalle => {
        subtotal += detalle.subtotal;
    });

    const impuestos = subtotal * 0.13;
    const total = subtotal + impuestos;

    await Recibo.findByIdAndUpdate(reciboId, {
        subtotal,
        impuestos,
        total
    });
};
