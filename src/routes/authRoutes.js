const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.exibirLogin);
router.post('/login', authController.login);

router.get('/register', authController.exibirCadastro);
router.post('/register', authController.cadastrar);

router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;