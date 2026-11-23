const crypto = require('crypto');

function gerarHashSenha(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verificarSenha(senhaInformada, hashArmazenado) {
    if (!hashArmazenado || !hashArmazenado.includes(':')) {
        return false;
    }
    const [salt, chaveOriginal] = hashArmazenado.split(':');
    const chaveDerivada = crypto.scryptSync(senhaInformada, salt, 64);
    const bufferOriginal = Buffer.from(chaveOriginal, 'hex');

    if (chaveDerivada.length !== bufferOriginal.length) {
        return false;
    }
    return crypto.timingSafeEqual(chaveDerivada, bufferOriginal);
}

module.exports = { gerarHashSenha, verificarSenha };