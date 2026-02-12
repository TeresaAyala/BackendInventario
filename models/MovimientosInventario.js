const mongoose = require('mongoose');

const MovimientosInventarioSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de movimiento es obligatorio'],
        enum: {
            values: ['ENTRADA', 'SALIDA'],
            message: 'El tipo debe ser ENTRADA o SALIDA'
        }
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [1, 'La cantidad debe ser mayor a 0']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MovimientosInventario', MovimientosInventarioSchema);
