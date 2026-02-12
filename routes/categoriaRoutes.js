const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN', 'INVENTORY', 'SALES'), categoriaController.obtenerCategorias);
router.get('/:id', auth, checkRole('ADMIN', 'INVENTORY', 'SALES'), categoriaController.obtenerCategoria);
router.post('/', auth, checkRole('ADMIN'), categoriaController.crearCategoria);
router.put('/:id', auth, checkRole('ADMIN'), categoriaController.actualizarCategoria);
router.delete('/:id', auth, checkRole('ADMIN'), categoriaController.eliminarCategoria);

module.exports = router;
