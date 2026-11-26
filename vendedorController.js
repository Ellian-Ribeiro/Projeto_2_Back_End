const Vendedor = require('../models/Vendedor');

async function listar(req, res) {
    const busca = req.query.busca || '';
    try {
        const vendedores = await Vendedor.consultarTodos(busca);
        return res.render('vendedores', {
            titulo: 'Vendedores',
            vendedores,
            busca,
            vendedorEmEdicao: null,
            erro: null
        });
    } catch (error) {
        return res.status(500).render('erro', {
            titulo: 'Erro ao listar vendedores',
            mensagem: error.message
        });
    }
}

async function detalhar(req, res) {
    const { id } = req.params;
    try {
        const [vendedorEmEdicao, vendedores] = await Promise.all([
            Vendedor.consultarPorId(id),
            Vendedor.consultarTodos()
        ]);
        return res.render('vendedores', {
            titulo: 'Editar Vendedor',
            vendedores,
            busca: '',
            vendedorEmEdicao,
            erro: null
        });
    } catch (error) {
        const status = error.message.includes('inválido') ? 400 : 404;
        return res.status(status).render('erro', {
            titulo: 'Erro ao consultar vendedor',
            mensagem: error.message
        });
    }
}

async function criar(req, res) {
    const { nome, email, documento } = req.body;
    try {
        const vendedor = new Vendedor(nome, email, documento);
        await vendedor.salvar();
        req.session.mensagemSucesso = 'Vendedor cadastrado com sucesso!';
        return res.redirect('/vendedores');
    } catch (error) {
        const vendedores = await Vendedor.consultarTodos().catch(() => []);
        return res.status(400).render('vendedores', {
            titulo: 'Vendedores',
            vendedores,
            busca: '',
            vendedorEmEdicao: null,
            erro: error.message
        });
    }
}

async function atualizar(req, res) {
    const { id, nome, email, documento } = req.body;
    try {
        await Vendedor.atualizar(id, { nome, email, documento });
        req.session.mensagemSucesso = 'Vendedor atualizado com sucesso!';
        return res.redirect('/vendedores');
    } catch (error) {
        const vendedores = await Vendedor.consultarTodos().catch(() => []);
        return res.status(400).render('vendedores', {
            titulo: 'Editar Vendedor',
            vendedores,
            busca: '',
            vendedorEmEdicao: { _id: id, nome, email, documento },
            erro: error.message
        });
    }
}

async function excluir(req, res) {
    const { id } = req.body;
    try {
        await Vendedor.excluir(id);
        req.session.mensagemSucesso = 'Vendedor excluído com sucesso!';
        return res.redirect('/vendedores');
    } catch (error) {
        req.session.mensagemErro = error.message;
        return res.redirect('/vendedores');
    }
}

module.exports = { listar, detalhar, criar, atualizar, excluir };