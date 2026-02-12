const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { auth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', auth, checkRole('ADMIN', 'EMPLEADO'), rolesController.getRoles);
router.get('/:id', auth, checkRole('ADMIN', 'EMPLEADO'), rolesController.getRolById);
router.post('/', auth, checkRole('ADMIN'), rolesController.createRoles);
router.put('/:id', auth, checkRole('ADMIN'), rolesController.updateRoles);
router.delete('/:id', auth, checkRole('ADMIN'), rolesController.deleteRoles);

module.exports = router;

