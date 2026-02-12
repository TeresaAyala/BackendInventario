const Categoria = require('../models/Categoria');

// Crear categoría
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Verificar si ya existe
        const existeCategoria = await Categoria.findOne({ nombre });
        if (existeCategoria) {
            return res.status(400).json({ msg: 'La categoría ya existe' });
        }

        const categoria = new Categoria({
            nombre,
            descripcion
        });

        await categoria.save();
        res.status(201).json(categoria);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la categoría' });
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({ estado: true })
            .sort({ createdAt: -1 });

        res.json(categorias);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener categorías' });
    }
};

// Obtener categoría por ID
exports.obtenerCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (!categoria || !categoria.estado) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        res.json(categoria);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la categoría' });
    }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const { nombre, descripcion, estado } = req.body;

        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, estado },
            { new: true }
        );

        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        res.json(categoria);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la categoría' });
    }
};

// Eliminar categoría (borrado lógico)
exports.eliminarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            { estado: false },
            { new: true }
        );

        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        res.json({ msg: 'Categoría eliminada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la categoría' });
    }
};
