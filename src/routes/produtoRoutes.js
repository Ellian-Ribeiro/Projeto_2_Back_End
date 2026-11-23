const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

router.use(verificarAutenticacao);

router.get('/', produtoController.listar);
router.get('/:id', produtoController.detalhar);
router.post('/', produtoController.criar);
router.post('/atualizar', produtoController.atualizar);
router.post('/excluir', produtoController.excluir);

module.exports = router;