const Catalogo = require('../models/Catalogo');

exports.createCatalogo = async (req, res) => {
    try {

        const { codigo, nombre, descripcion } = req.body;

        const existe = await Catalogo.findOne({ codigo });
        if (existe) {
            return res.status(400).json({ msg: 'El código ya existe' });
        }

        const nuevaImagen = req.file ? req.file.filename : null;

        const nuevoCatalogo = new Catalogo({
            codigo,
            nombre,
            descripcion,
            imagen: nuevaImagen
        });

        await nuevoCatalogo.save();

        res.status(201).json(nuevoCatalogo);

    } catch (error) {
        res.status(500).json({ error: error.message });
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
