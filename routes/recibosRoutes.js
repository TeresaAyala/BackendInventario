const express = require('express');
const router = express.Router();

const recibosController = require('../controllers/recibosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.post('/',auth,checkRole('ADMIN', 'INVENTORY'),recibosController.createRecibo);
router.get('/historial',auth,checkRole('ADMIN'),recibosController.getHistorialRecibos);
router.get('/:id/pdf',auth,checkRole('ADMIN', 'INVENTORY'),recibosController.generarPDF);
router.get('/',auth,checkRole('ADMIN', 'INVENTORY'),recibosController.getRecibos);
router.get('/:id',auth,checkRole('ADMIN', 'INVENTORY'),recibosController.getReciboById);
router.put('/:id/anular',auth,checkRole('ADMIN'),recibosController.anularRecibo);

module.exports = router;

