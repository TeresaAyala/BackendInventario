const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'El SKU es obligatorio'],
        unique: [true, 'El SKU ya existe'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [0, 'La cantidad no puede ser negativa']
    },
    imagen: {
        type: String
    },
    estadoStock: {
        type: String,
        enum: {
            values: ['DISPONIBLE', 'AGOTADO'],
            message: 'El estado debe ser DISPONIBLE o AGOTADO'
        },
        default: 'DISPONIBLE'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', ProductoSchema);
