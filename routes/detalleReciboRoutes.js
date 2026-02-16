const express = require('express');
const router = express.Router();

const detalleReciboController = require('../controllers/detalleReciboController');
const { auth, checkRole } = require('../middlewares/authMiddleware');


router.get('/recibo/:reciboId',auth,checkRole('ADMIN', 'INVENTORY'),detalleReciboController.getDetallesByRecibo);
router.post('/',auth,checkRole('ADMIN', 'INVENTORY'),detalleReciboController.createDetalle);
router.put('/:id/inactivar',auth,checkRole('ADMIN'),detalleReciboController.inactivarDetalle);

module.exports = router;

