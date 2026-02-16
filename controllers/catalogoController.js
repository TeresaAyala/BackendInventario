const Catalogo = require('../models/Catalogo');

exports.createCatalogo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                msg: 'El nombre es obligatorio'
            });
        }

        const ultimoCatalogo = await Catalogo.findOne().sort({ createdAt: -1 });

        let nuevoCodigo = "CAT-001";

        if (ultimoCatalogo && ultimoCatalogo.codigo) {
            const numero = parseInt(ultimoCatalogo.codigo.split('-')[1]);
            const siguiente = numero + 1;
            nuevoCodigo = `CAT-${String(siguiente).padStart(3, '0')}`;
        }

        const imagen = req.file ? req.file.filename : null;

        const nuevoCatalogo = new Catalogo({
            codigo: nuevoCodigo,
            nombre,
            descripcion,
            imagen
        });

        await nuevoCatalogo.save();

        res.status(201).json({
            msg: 'Catálogo creado correctamente',
            catalogo: nuevoCatalogo
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear el catálogo',
            error: error.message
        });
    }
};


exports.getCatalogos = async (req, res) => {
    try {
        const catalogos = await Catalogo.find({ estado: 'Activo' });
        res.json(catalogos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.inactivarCatalogo = async (req, res) => {
    try {

        const catalogo = await Catalogo.findById(req.params.id);

        if (!catalogo) {
            return res.status(404).json({ msg: 'Catálogo no encontrado' });
        }

        catalogo.estado = 'Inactivo';
        await catalogo.save();

        res.json({ msg: 'Catálogo inactivado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
