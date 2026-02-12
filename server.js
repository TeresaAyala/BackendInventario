const express = require('express');
const connectDB = require('./config/mongoConfig');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/productos', require('./routes/productosRoutes'));
app.use('/api/movimientosInventario', require('./routes/movimientosInventarioRoutes')); 
app.use('/api/recibos', require('./routes/recibosRoutes'));
app.use('/api/usuarios', require('./routes/usuariosRoutes'));
app.use('/api/categoria', require('./routes/categoriaRoutes'));
app.use('/api/proveedores', require('./routes/proveedoresRoutes'));
app.use('/api/roles', require('./routes/rolesRoutes'));

app.get('/api/status', (req, res) => {
    res.json({ status: 'conectado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
});