const express = require('express');
const router = express.Router();

const catalogoController = require('../controllers/catalogoController');
const upload = require('../middlewares/uploadMiddleware');
const { auth, checkRole } = require('../middlewares/authMiddleware');


router.post('/',auth,checkRole('ADMIN'), upload.single('imagen'),catalogoController.createCatalogo);
router.get('/',auth,catalogoController.getCatalogos);
router.put('/inactivar/:id',auth,checkRole('ADMIN'),catalogoController.inactivarCatalogo);

module.exports = router;
