const express = require('express');
const connectDB = require('./config/mongoConfig');
const cors = require('cors');
require('dotenv').config();
const { createAdmin } = require('./libs/initialSetup');

const app = express();

connectDB().then(() => {
    createAdmin();
});

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', require('./routes/productosRoutes'));
app.use('/api/movimientosInventario', require('./routes/movimientosInventarioRoutes')); 
app.use('/api/recibo', require('./routes/recibosRoutes'));
app.use('/api/usuario', require('./routes/usuariosRoutes'));
app.use('/api/catalogo', require('./routes/catalogoRoutes'));
app.use('/api/categoria', require('./routes/categoriaRoutes'));
app.use('/api/detalleRecibo', require('./routes/detalleReciboRoutes'));
app.use('/api/proveedores', require('./routes/proveedoresRoutes'));
app.use('/api/roles', require('./routes/rolesRoutes'));

app.get('/api/status', (req, res) => {
    res.json({ status: 'conectado' });
});

const PORT = process.env.PORT || 3000;
app.
listen(PORT, () => {
    console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
});