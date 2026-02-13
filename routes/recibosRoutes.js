const express = require('express');
const router = express.Router();

const recibosController = require('../controllers/recibosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.post('/',auth,checkRole('ADMIN', 'EMPLEADO'),recibosController.createRecibo);
router.get('/',auth,checkRole('ADMIN', 'EMPLEADO'),recibosController.getRecibos);
router.get('/historial',auth,checkRole('ADMIN'),recibosController.getHistorialRecibos);
router.get('/:id',auth,checkRole('ADMIN', 'EMPLEADO'),recibosController.getReciboById);
router.put('/anular/:id',auth,checkRole('ADMIN'), recibosController.anularRecibo);


module.exports = router;
