const express = require('express');
const path = require('path');
const session = require('express-session');

const { connectDB } = require('./src/database/database');
const { logError } = require('./src/utils/logger');
const Usuario = require('./src/models/Usuario');

const authRoutes = require('./src/routes/authRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const vendedorRoutes = require('./src/routes/vendedorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do motor de templates (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Arquivos estáticos (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Processamento de parâmetros enviados via POST (formulários e JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de Sessões
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'ec48b-ecommerce-chave-sessao-2026',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2 // 2 horas
        }
    })
);

// Disponibiliza usuário logado e mensagens de feedback em todas as views
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.mensagemSucesso = req.session.mensagemSucesso || null;
    res.locals.mensagemErro = req.session.mensagemErro || null;
    delete req.session.mensagemSucesso;
    delete req.session.mensagemErro;
    next();
});

// Rota inicial
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Início' });
});

// Rotas da aplicação
app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/vendedores', vendedorRoutes);

// Tratamento para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).render('erro', {
        titulo: 'Página não encontrada (404)',
        mensagem: 'A rota solicitada não existe nesta aplicação.'
    });
});

// Middleware global de tratamento de erros inesperados (500)
app.use((err, req, res, next) => {
    logError('Erro Inesperado na Requisição', err.message, `${req.method} ${req.originalUrl}`);
    res.status(500).render('erro', {
        titulo: 'Erro Interno do Servidor (500)',
        mensagem: 'Ocorreu um erro inesperado ao processar sua solicitação.'
    });
});

// Inicialização do servidor e conexão com o MongoDB
async function iniciarServidor() {
    try {
        await connectDB();
        await Usuario.criarAdminPadrao();
        app.listen(PORT, () => {
            console.log(`Servidor E-commerce PW2 rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error.message);
        process.exit(1);
    }
}

iniciarServidor();