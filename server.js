const express = require('express');
const connectDB = require('./config/mongoConfig');
const cors = require('cors');
require('dotenv').config();
const { createAdmin } = require('./libs/initialSetup');
const path = require('path');


const app = express();

let PROVEEDORES = [];

connectDB().then(() => {
    createAdmin();
});


app.use(express.json());

app.use(cors());


app.use('/api/producto', require('./routes/productosRoutes'));
app.use('/api/movimientosInventario', require('./routes/movimientosInventarioRoutes')); 
app.use('/api/recibos', require('./routes/recibosRoutes'));
app.use('/api/usuario', require('./routes/usuariosRoutes'));
app.use('/api/catalogo', require('./routes/catalogoRoutes'));
app.use('/api/categoria', require('./routes/categoriaRoutes'));
app.use('/api/detalleRecibo', require('./routes/detalleReciboRoutes'));
app.use('/api/proveedores', require('./routes/proveedoresRoutes'));
app.use('/api/roles', require('./routes/rolesRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/status', (req, res) => {res.json({ status: 'conectado' });});
app.get('/api/producto', (req, res) => {res.json({ok: true,data: PRODUCTOS  });});
app.post('/api/proveedores', (req, res) => {
    try {
        const { nombre, contacto, telefono, email, direccion, categoria } = req.body;

        if (!nombre) {
            return res.status(400).json({ ok: false, msg: "El nombre es obligatorio" });
        }

        const nuevoProveedor = {
            id: Date.now(),
            nombre,
            contacto,
            telefono,
            email,
            direccion,

            categoria: (typeof categoria === 'object') ? categoria.nombre : categoria
        };

        PROVEEDORES.push(nuevoProveedor);
        res.status(201).json({ ok: true, data: nuevoProveedor });

    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error en el servidor", detalle: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.
listen(PORT, () => {
    console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
});