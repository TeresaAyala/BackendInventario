const express = require('express');
const router = express.Router();

const detalleReciboController = require('../controllers/detalleReciboController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.post('/',auth,checkRole('ADMIN', 'EMPLEADO'),detalleReciboController.createDetalle);
router.get('/recibo/:reciboId',auth,checkRole('ADMIN', 'EMPLEADO'),detalleReciboController.getDetallesByRecibo);
router.put('/inactivar/:id',auth, checkRole('ADMIN'),detalleReciboController.inactivarDetalle);


module.exports = router;
