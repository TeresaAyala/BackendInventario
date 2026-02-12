const mongoose = require('mongoose');

const ReciboSchema = new mongoose.Schema({
    folio: {
        type: String,
        required: [true, 'El número de folio es obligatorio'],
        unique: [true, 'El folio ya existe'],
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            cantidad: {
                type: Number,
                required: true,
                min: [1, 'La cantidad debe ser mayor a 0']
            },
            precio: {
                type: Number,
                required: true
            }
        }
    ],
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es obligatorio']
    },
    impuestos: {
        type: Number,
        required: [true, 'Los impuestos son obligatorios']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recibo', ReciboSchema);
