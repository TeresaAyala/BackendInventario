const express = require('express');
const router = express.Router();
const recibosController = require('../controllers/recibosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');


router.get('/', auth, checkRole('ADMIN', 'SALES'), recibosController.getRecibos);
router.get('/:id', auth, checkRole('ADMIN', 'SALES'), recibosController.getReciboById);
router.post('/', auth, checkRole('ADMIN', 'SALES'), recibosController.createRecibo);

module.exports = router;
