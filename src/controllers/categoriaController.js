const Categoria = require('../models/Categoria');

async function listar(req, res) {
    const busca = req.query.busca || '';
    try {
        const categorias = await Categoria.consultarTodas(busca);
        return res.render('categorias', {
            titulo: 'Categorias',
            categorias,
            busca,
            categoriaEmEdicao: null,
            erro: null
        });
    } catch (error) {
        return res.status(500).render('erro', {
            titulo: 'Erro ao listar categorias',
            mensagem: error.message
        });
    }
}

async function detalhar(req, res) {
    const { id } = req.params;
    try {
        const [categoriaEmEdicao, categorias] = await Promise.all([
            Categoria.consultarPorId(id),
            Categoria.consultarTodas()
        ]);
        return res.render('categorias', {
            titulo: 'Editar Categoria',
            categorias,
            busca: '',
            categoriaEmEdicao,
            erro: null
        });
    } catch (error) {
        const status = error.message.includes('inválido') ? 400 : 404;
        return res.status(status).render('erro', {
            titulo: 'Erro ao consultar categoria',
            mensagem: error.message
        });
    }
}

async function criar(req, res) {
    const { nome, descricao } = req.body;
    try {
        const categoria = new Categoria(nome, descricao);
        await categoria.salvar();
        req.session.mensagemSucesso = 'Categoria cadastrada com sucesso!';
        return res.redirect('/categorias');
    } catch (error) {
        const categorias = await Categoria.consultarTodas().catch(() => []);
        return res.status(400).render('categorias', {
            titulo: 'Categorias',
            categorias,
            busca: '',
            categoriaEmEdicao: null,
            erro: error.message
        });
    }
}

async function atualizar(req, res) {
    const { id, nome, descricao } = req.body;
    try {
        await Categoria.atualizar(id, { nome, descricao });
        req.session.mensagemSucesso = 'Categoria atualizada com sucesso!';
        return res.redirect('/categorias');
    } catch (error) {
        const categorias = await Categoria.consultarTodas().catch(() => []);
        return res.status(400).render('categorias', {
            titulo: 'Editar Categoria',
            categorias,
            busca: '',
            categoriaEmEdicao: { _id: id, nome, descricao },
            erro: error.message
        });
    }
}

async function excluir(req, res) {
    const { id } = req.body;
    try {
        await Categoria.excluir(id);
        req.session.mensagemSucesso = 'Categoria excluída com sucesso!';
        return res.redirect('/categorias');
    } catch (error) {
        req.session.mensagemErro = error.message;
        return res.redirect('/categorias');
    }
}

module.exports = { listar, detalhar, criar, atualizar, excluir };