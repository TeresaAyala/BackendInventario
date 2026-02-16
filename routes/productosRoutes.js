const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', auth, checkRole('ADMIN',  'INVENTORY'), productosController.getProductos);
router.get('/:id', auth, checkRole('ADMIN',  'INVENTORY'), productosController.getProductoById);
router.post('/',auth,checkRole('ADMIN'),upload.single('imagen'), productosController.createProducto);
router.put('/:id',auth,checkRole('ADMIN'),upload.single('imagen'), productosController.updateProducto);
router.delete('/:id', auth, checkRole('ADMIN'), productosController.deleteProducto);

module.exports = router;
