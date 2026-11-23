const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarAutenticacao } = require('../middlewares/authMiddleware');

router.use(verificarAutenticacao);

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.detalhar);
router.post('/', categoriaController.criar);
router.post('/atualizar', categoriaController.atualizar);
router.post('/excluir', categoriaController.excluir);

module.exports = router;