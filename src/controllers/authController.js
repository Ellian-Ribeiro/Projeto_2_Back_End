const Usuario = require('../models/Usuario');
const { logError } = require('../utils/logger');

function exibirLogin(req, res) {
    if (req.session.usuario) {
        return res.redirect('/produtos');
    }
    return res.render('login', { titulo: 'Login', erro: null, emailInformado: '' });
}

async function login(req, res) {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.autenticar(email, senha);
        req.session.usuario = usuario;
        req.session.mensagemSucesso = `Bem-vindo(a), ${usuario.nome}!`;
        return res.redirect('/produtos');
    } catch (error) {
        return res.status(401).render('login', {
            titulo: 'Login',
            erro: error.message,
            emailInformado: email || ''
        });
    }
}

function exibirCadastro(req, res) {
    if (req.session.usuario) {
        return res.redirect('/produtos');
    }
    return res.render('register', {
        titulo: 'Criar Conta',
        erro: null,
        dados: { nome: '', email: '' }
    });
}

async function cadastrar(req, res) {
    const { nome, email, senha } = req.body;
    try {
        const novoUsuario = new Usuario(nome, email, senha);
        await novoUsuario.salvar();
        req.session.mensagemSucesso = 'Conta criada com sucesso! Faça login para continuar.';
        return res.redirect('/auth/login');
    } catch (error) {
        return res.status(400).render('register', {
            titulo: 'Criar Conta',
            erro: error.message,
            dados: { nome: nome || '', email: email || '' }
        });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            logError('Falha no Logout', err.message, 'authController.logout');
            return res.status(500).render('erro', {
                titulo: 'Erro ao sair',
                mensagem: 'Não foi possível encerrar a sessão.'
            });
        }
        res.clearCookie('connect.sid');
        return res.redirect('/auth/login');
    });
}

module.exports = {
    exibirLogin,
    login,
    exibirCadastro,
    cadastrar,
    logout
};