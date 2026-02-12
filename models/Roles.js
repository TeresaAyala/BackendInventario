const mongoose = require('mongoose');

const RolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del rol es obligatorio'],
        unique: true,
        uppercase: true,
        trim: true
    },
    descripcion: {
        type: String
    },
    estado: {
        type: String,
        enum: ['ACTIVO', 'INACTIVO'],
        default: 'ACTIVO'
    }
}, { timestamps: true });

module.exports = mongoose.model('Rol', RolSchema);
