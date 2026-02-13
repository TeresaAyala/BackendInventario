const mongoose = require('mongoose');

const DetalleReciboSchema = new mongoose.Schema({
    recibo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recibo',
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precio: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DetalleRecibo', DetalleReciboSchema);
