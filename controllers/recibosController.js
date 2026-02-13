const Recibo = require('../models/Recibo');
const DetalleRecibo = require('../models/DetalleRecibo');

exports.createRecibo = async (req, res) => {
    try {
        const { folio, usuario, cliente, productos } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ msg: 'Debe agregar al menos un producto' });
        }

        const nuevoRecibo = new Recibo({
            folio,
            usuario,
            cliente,
            subtotal: 0,
            impuestos: 0,
            total: 0
        });

        await nuevoRecibo.save();

        let subtotal = 0;

        // Crear detalles
        for (let item of productos) {
            const subtotalProducto = item.cantidad * item.precio;
            subtotal += subtotalProducto;

            const detalle = new DetalleRecibo({
                recibo: nuevoRecibo._id,
                producto: item.producto,
                cantidad: item.cantidad,
                precio: item.precio,
                subtotal: subtotalProducto
            });

            await detalle.save();
        }

        const impuestos = subtotal * 0.13; 
        const total = subtotal + impuestos;

        nuevoRecibo.subtotal = subtotal;
        nuevoRecibo.impuestos = impuestos;
        nuevoRecibo.total = total;

        await nuevoRecibo.save();

        res.status(201).json({
            msg: 'Recibo creado correctamente',
            recibo: nuevoRecibo
        });

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
        const recibos = await Recibo.find()
            .populate('usuario')
            .populate('cliente');

        res.json(recibos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getReciboById = async (req, res) => {
    try {
        const recibo = await Recibo.findById(req.params.id)
            .populate('usuario')
            .populate('cliente');

        if (!recibo) {
            return res.status(404).json({ msg: 'Recibo no encontrado' });
        }

        const detalles = await DetalleRecibo.find({ recibo: recibo._id })
            .populate('producto');

        res.json({ recibo, detalles });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistorialRecibos = async (req, res) => {
    try {

        const recibos = await Recibo.find()
            .populate('usuario')
            .populate('cliente')
            .sort({ createdAt: -1 });

        res.json(recibos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.anularRecibo = async (req, res) => {
    try {
        const recibo = await Recibo.findById(req.params.id);

        if (!recibo) {
            return res.status(404).json({ msg: 'Recibo no encontrado' });
        }

        recibo.estado = 'Anulado';
        await recibo.save();

        res.json({ msg: 'Recibo anulado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
