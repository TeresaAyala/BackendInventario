const mongoose = require('mongoose');

const ReciboSchema = new mongoose.Schema({
    folio: {
        type: String,
        required: [true, 'El número de folio es obligatorio'],
        unique: true,
        trim: true
    },

    fecha: {
        type: Date,
        default: Date.now
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    cliente: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },

    subtotal: {
        type: Number,
        required: true,
        default: 0
    },

    impuestos: {
        type: Number,
        required: true,
        default: 0
    },

    total: {
        type: Number,
        required: true,
        default: 0
    },

    estado: {
        type: String,
        enum: ['Activo', 'Anulado'],
        default: 'Activo'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Recibo', ReciboSchema);
