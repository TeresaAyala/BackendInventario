const Recibo = require('../models/Recibo');
const DetalleRecibo = require('../models/DetalleRecibo');
const Producto = require('../models/Producto');
const PDFDocument = require('pdfkit');

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
            total: 0,
            estado: 'Activo'
        });

        await nuevoRecibo.save();

        let subtotal = 0;

        for (let item of productos) {

            const subtotalProducto = item.cantidad * item.precio;
            subtotal += subtotalProducto;

            const detalle = new DetalleRecibo({
                recibo: nuevoRecibo._id,
                producto: item.producto,
                cantidad: item.cantidad,
                precio: item.precio,
                subtotal: subtotalProducto,
                estado: 'Activo'
            });

            await detalle.save();

            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: item.cantidad } }
            );
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
            .populate('cliente')
            .sort({ createdAt: -1 });

        res.json(recibos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistorialRecibos = async (req, res) => {
    try {
        const recibos = await Recibo.find()
            .sort({ createdAt: -1 });

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

        const detalles = await DetalleRecibo.find({
            recibo: recibo._id
        }).populate('producto');

        res.json({
            recibo,
            detalles
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generarPDF = async (req, res) => {
    try {
        const recibo = await Recibo.findById(req.params.id)
            .populate('usuario')
            .populate('cliente');

        if (!recibo) {
            return res.status(404).json({ msg: 'Recibo no encontrado' });
        }

        const detalles = await DetalleRecibo.find({
            recibo: recibo._id,
            estado: 'Activo'
        }).populate('producto');

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=recibo-${recibo.folio}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(18).text('RECIBO', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Folio: ${recibo.folio}`);
        doc.text(`Fecha: ${recibo.fecha.toLocaleDateString()}`);
        doc.text(`Usuario: ${recibo.usuario?.nombre || ''}`);
        doc.text(`Cliente: ${recibo.cliente?.nombre || ''}`);
        doc.moveDown();

        doc.text('Detalle de Productos');
        doc.moveDown();

        detalles.forEach((detalle, index) => {
            doc.text(
                `${index + 1}. ${detalle.producto.nombre} | Cant: ${detalle.cantidad} | Precio: $${detalle.precio} | Subtotal: $${detalle.subtotal}`
            );
        });

        doc.moveDown();
        doc.text(`Subtotal: $${recibo.subtotal}`);
        doc.text(`Impuestos: $${recibo.impuestos}`);
        doc.text(`Total: $${recibo.total}`);

        doc.end();

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

        if (recibo.estado === 'Anulado') {
            return res.status(400).json({ msg: 'El recibo ya está anulado' });
        }

        const detalles = await DetalleRecibo.find({
            recibo: recibo._id,
            estado: 'Activo'
        });

        for (let detalle of detalles) {
            await Producto.findByIdAndUpdate(
                detalle.producto,
                { $inc: { stock: -detalle.cantidad } }
            );

            detalle.estado = 'Inactivo';
            await detalle.save();
        }

        recibo.estado = 'Anulado';
        await recibo.save();

        res.json({ msg: 'Recibo anulado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


