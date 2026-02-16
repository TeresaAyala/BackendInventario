const Proveedores = require('../models/Proveedores');

exports.getProveedores = async (req, res) => {
  try {

    const lista = await Proveedores.find({ estado: true })
      .populate('categoria', 'nombre') 
      .sort({ createdAt: -1 });

    res.json(lista);

  } catch (error) {
    res.status(500).json({ msg: 'Error' });
  }
};

exports.getProveedorById = async (req, res) => {
    try {
        const proveedor = await Proveedores.findById(req.params.id)
            .populate('categoria', 'nombre'); 

        if (!proveedor) {
            return res.status(404).json({ msg: 'Proveedor no encontrado' });
        }

        res.json(proveedor);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProveedor = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const existe = await Proveedores.findOne({ $or: [{ nombre }, { email }] });

        if (existe) {
            return res.status(400).json({ msg: 'Ya existe' });
        } const nuevoProveedor = new Proveedores(req.body);

        await nuevoProveedor.save(); res.status(201).json(nuevoProveedor);

    } catch (error) {
        res.status(500).json({ msg: 'Error' });
    }
};

exports.updateProveedor = async (req, res) => {
    try {
        const actualizado = await Proveedores.findByIdAndUpdate(req.params.id, req.body,
            { new: true });
        res.json(actualizado);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error' });
    }
};

exports.deleteProveedor = async (req, res) => {
    try {
        await Proveedores.findByIdAndUpdate(req.params.id, { estado: false });
        res.json({ msg: 'Eliminado' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error' });
    }
};