const Producto = require('../models/Producto');

exports.createProducto = async (req, res) => {
    try {

        const datos = {
            ...req.body
        };

        if (req.file) {
            datos.imagen = req.file.filename;
        }

        const producto = new Producto(datos);
        await producto.save();

        res.status(201).json({
            msg: 'Producto creado correctamente',
            producto
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                errores: ['El SKU ya está registrado']
            });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.getProductos = async (req, res) => {
    try {
        const { nombre, categoria } = req.query;
        let query = {};

        if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
        if (categoria) query.categoria = categoria;

        const productos = await Producto.find(query);
        res.json(productos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(producto);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProducto = async (req, res) => {
    try {

        const datos = {
            ...req.body
        };

        if (req.file) {
            datos.imagen = req.file.filename;
        }

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            datos,
            { new: true }
        );

        res.json(producto);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ ok: false, errores });
        }

        res.status(500).json({ error: error.message });
    }
};


exports.deleteProducto = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Producto eliminado' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
