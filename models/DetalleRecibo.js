const mongoose = require('mongoose');

const DetalleReciboSchema = new mongoose.Schema({

    recibo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recibo',
        required: [true, 'El recibo es obligatorio']
    },

    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    },

    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [1, 'La cantidad debe ser mayor a 0']
    },

    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },

    subtotal: {
        type: Number,
        required: true
    },

    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('DetalleRecibo', DetalleReciboSchema);
