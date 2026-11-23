const { connectDB } = require('../database/database');
const { logError } = require('../utils/logger');
const { gerarHashSenha, verificarSenha } = require('../utils/password');

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

class Usuario {
    constructor(nome, email, senha) {
        this.nome = typeof nome === 'string' ? nome.trim() : '';
        this.email = typeof email === 'string' ? email.trim().toLowerCase() : '';
        this.senha = typeof senha === 'string' ? senha : '';
    }

    async salvar() {
        try {
            if (!this.nome || !this.email || !this.senha) {
                throw new Error('Os campos "nome", "email" e "senha" são obrigatórios.');
            }
            if (!emailValido(this.email)) {
                throw new Error('Informe um endereço de e-mail válido.');
            }
            if (this.senha.length < 6) {
                throw new Error('A senha deve possuir no mínimo 6 caracteres.');
            }

            const db = await connectDB();
            const existente = await db.collection('usuarios').findOne({ email: this.email });
            if (existente) {
                throw new Error('Já existe um usuário cadastrado com este e-mail.');
            }

            const senhaHash = gerarHashSenha(this.senha);
            const result = await db.collection('usuarios').insertOne({
                nome: this.nome,
                email: this.email,
                senhaHash,
                criadoEm: new Date()
            });
            return result.insertedId;
        } catch (error) {
            logError('Falha ao cadastrar Usuário', error.message, 'Usuario.salvar');
            throw error;
        }
    }

    static async autenticar(email, senha) {
        try {
            const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';
            if (!emailLimpo || !senha) {
                throw new Error('Informe o e-mail e a senha para entrar.');
            }

            const db = await connectDB();
            const usuario = await db.collection('usuarios').findOne({ email: emailLimpo });

            if (!usuario || !verificarSenha(senha, usuario.senhaHash)) {
                throw new Error('E-mail ou senha incorretos.');
            }

            return {
                id: usuario._id.toString(),
                nome: usuario.nome,
                email: usuario.email
            };
        } catch (error) {
            logError('Falha de Autenticação', error.message, 'Usuario.autenticar');
            throw error;
        }
    }

    static async criarAdminPadrao() {
        try {
            const db = await connectDB();
            const existe = await db.collection('usuarios').findOne({ email: 'admin@ecommerce.com' });
            if (!existe) {
                const admin = new Usuario('Administrador', 'admin@ecommerce.com', '123456');
                await admin.salvar();
                console.log('Usuário padrão criado: admin@ecommerce.com / 123456');
            }
        } catch (error) {
            logError('Falha ao criar usuário padrão', error.message, 'Usuario.criarAdminPadrao');
        }
    }
}

module.exports = Usuario;