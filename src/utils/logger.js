const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'errors.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

function logError(tipo, mensagem, operacao) {
    const data = new Date().toLocaleString('pt-BR');
    const logMensagem = `\n[${data}]\nERRO: ${tipo}\nMENSAGEM: ${mensagem}\nOPERAÇÃO: ${operacao}\n-------------------------`;
    fs.appendFileSync(logFile, logMensagem, 'utf8');
}

module.exports = { logError };