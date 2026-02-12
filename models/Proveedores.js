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
    tipo: {
        type: String,
        enum: ['MATERIA PRIMA', 'LOGISTICA', 'OFICINA', 'ELECTRONICA'],
        default: 'OFICINA'
    },
    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Proveedores', ProveedoresSchema);
