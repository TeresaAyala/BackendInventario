const mongoose = require('mongoose');

const ProveedoresSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    contacto: String,
    telefono: String,
    email: String,
    direccion: String,
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Proveedores', ProveedoresSchema);
