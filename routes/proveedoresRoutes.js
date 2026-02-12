const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN', 'INVENTORY'), proveedoresController.getProveedores);
router.get('/:id', auth, checkRole('ADMIN', 'INVENTORY'), proveedoresController.getProveedorById);
router.post('/', auth, checkRole('ADMIN'), proveedoresController.createProveedor);
router.put('/:id', auth, checkRole('ADMIN'), proveedoresController.updateProveedor);
router.delete('/:id', auth, checkRole('ADMIN'), proveedoresController.deleteProveedor);

module.exports = router;