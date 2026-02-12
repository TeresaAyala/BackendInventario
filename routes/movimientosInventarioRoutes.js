const express = require('express');
const router = express.Router();
const movimientoInventarioController = require('../controllers/movimientoInventarioController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN', 'INVENTORY'), movimientoInventarioController.getMovimientos);
router.post('/entrada', auth, checkRole('ADMIN', 'INVENTORY'), movimientoInventarioController.entradaStock);
router.post('/salida', auth, checkRole('ADMIN', 'INVENTORY'), movimientoInventarioController.salidaStock);

module.exports = router;