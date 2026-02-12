const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN_ROLE'), usuariosController.getUsuarios);
router.get('/:id', auth,checkRole('ADMIN_ROLE'), usuariosController.getUsuarioById);
router.post('/', auth,checkRole('ADMIN_ROLE'), usuariosController.createUsuario);
router.post('/login', usuariosController.login);
router.put('/:id', auth,checkRole('ADMIN_ROLE'), usuariosController.updateUsuario);
router.put('/:id/change-password', auth, usuariosController.changePasswordUsuario);

module.exports = router;