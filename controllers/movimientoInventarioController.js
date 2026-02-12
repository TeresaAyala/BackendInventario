const MovimientosInventario = require('../models/MovimientosInventario');
const Movimiento = require('../models/MovimientosInventario');
const Producto = require('../models/Producto');

exports.getMovimientos = async (req, res) => {
    try {
        const MovimientosInventario = await MovimientosInventario.find()
            .populate('producto', 'nombre codigo')
            .populate('usuario', 'nombres apellidos')
            .sort({ createdAt: -1 });

        res.json(MovimientosInventario);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener movimientos de inventario'
        });
    }
};

exports.entradaStock = async (req, res) => {
    try {
        const { producto, cantidad, descripcion } = req.body;

        if (cantidad <= 0) {
            return res.status(400).json({
                msg: 'La cantidad debe ser mayor a 0'
            });
        }

        const productoDB = await Producto.findById(producto);
        if (!productoDB) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }

        productoDB.stock += cantidad;
        await productoDB.save();

        const MovimientosInventario = new MovimientosInventario({
            producto,
            tipo: 'ENTRADA',
            cantidad,
            descripcion,
            usuario: req.usuario.id
        });

        await MovimientosInventario.save();

        res.status(201).json(MovimientosInventario);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al registrar entrada de inventario'
        });
    }
};

exports.salidaStock = async (req, res) => {
    try {
        const { producto, cantidad, descripcion } = req.body;

        if (cantidad <= 0) {
            return res.status(400).json({
                msg: 'La cantidad debe ser mayor a 0'
            });
        }

        const productoDB = await Producto.findById(producto);
        if (!productoDB) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }

        if (productoDB.stock < cantidad) {
            return res.status(400).json({
                msg: 'Stock insuficiente'
            });
        }

        productoDB.stock -= cantidad;
        await productoDB.save();

        const MovimientosInventario = new MovimientosInventario({
            producto,
            tipo: 'SALIDA',
            cantidad,
            descripcion,
            usuario: req.usuario.id
        });

        await MovimientosInventario.save();

        res.status(201).json(MovimientosInventario);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al registrar salida de inventario'
        });
    }
};