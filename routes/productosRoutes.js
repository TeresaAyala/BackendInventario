const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN', 'EMPLEADO'), productosController.getProductos);
router.get('/:id', auth, checkRole('ADMIN', 'EMPLEADO'), productosController.getProductoById);
router.post('/', auth, checkRole('ADMIN'), productosController.createProducto);
router.put('/:id', auth, checkRole('ADMIN'), productosController.updateProducto);
router.delete('/:id', auth, checkRole('ADMIN'), productosController.deleteProducto);

module.exports = router;
