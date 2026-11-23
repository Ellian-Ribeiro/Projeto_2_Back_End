const { logError } = require('../utils/logger');

function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    }

    logError(
        'Acesso Não Autorizado',
        `Tentativa de acesso sem autenticação na rota ${req.method} ${req.originalUrl}`,
        'authMiddleware.verificarAutenticacao'
    );

    req.session.mensagemErro = 'Você precisa estar autenticado para acessar esta funcionalidade.';
    return res.redirect('/auth/login');
}

module.exports = { verificarAutenticacao };