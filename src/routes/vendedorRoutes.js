const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

router.use(verificarAutenticacao);

router.get('/', vendedorController.listar);
router.get('/:id', vendedorController.detalhar);
router.post('/', vendedorController.criar);
router.post('/atualizar', vendedorController.atualizar);
router.post('/excluir', vendedorController.excluir);

module.exports = router;