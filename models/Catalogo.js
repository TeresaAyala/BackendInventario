const mongoose = require('mongoose');

const catalogoSchema = new mongoose.Schema({

    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    descripcion: {
        type: String,
        trim: true
    },

    imagen: {
        type: String 
    },

    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Catalogo', catalogoSchema);
