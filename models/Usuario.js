const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'],unique: [true, 'El email ya existe'] },
    telefono: { type: String},
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    rol: { 
        type: String, 
       required: [true, 'El rol es obligatorio'],
        enum: {
        values: ['ADMIN_ROLE', 'INVENTORY_ROLE', 'SALES_ROLE'],
        message: '{VALUE} no es un rol válido' 
    },
    default: 'SALES_ROLE' },
    status: { 
        type: String, 
        required: true,
        required: [true, 'El estado es obligatorio'],
        enum: {
                values: ['active', 'inactive'],
              message: '{VALUE} no es un estado válido'
       },
       default: 'active'
     },
});

module.exports = mongoose.model('Usuario', usuarioSchema);