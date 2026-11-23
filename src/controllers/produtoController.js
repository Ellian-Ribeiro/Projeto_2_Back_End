const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const Vendedor = require('../models/Vendedor');

async function carregarDadosAuxiliares(produtos) {
    const [categorias, vendedores] = await Promise.all([
        Categoria.consultarTodas(),
        Vendedor.consultarTodos()
    ]);

    const mapaCategorias = new Map(categorias.map((c) => [c._id.toString(), c.nome]));
    const mapaVendedores = new Map(vendedores.map((v) => [v._id.toString(), v.nome]));

    const produtosEnriquecidos = produtos.map((p) => ({
        ...p,
        categoriaNome: p.categoriaId ? mapaCategorias.get(p.categoriaId.toString()) || 'Não encontrada' : '-',
        vendedorNome: p.vendedorId ? mapaVendedores.get(p.vendedorId.toString()) || 'Não encontrado' : 'Não informado'
    }));

    return { produtosEnriquecidos, categorias, vendedores };
}

async function listar(req, res) {
    const busca = req.query.busca || '';
    const categoriaId = req.query.categoriaId || '';

    try {
        const produtos = await Produto.consultarTodos({ busca, categoriaId });
        const { produtosEnriquecidos, categorias, vendedores } = await carregarDadosAuxiliares(produtos);

        return res.render('produtos', {
            titulo: 'Produtos',
            produtos: produtosEnriquecidos,
            categorias,
            vendedores,
            busca,
            categoriaSelecionada: categoriaId,
            erro: null
        });
    } catch (error) {
        const status = error.message.includes('inválido') ? 400 : 500;
        return res.status(status).render('erro', {
            titulo: 'Erro ao consultar produtos',
            mensagem: error.message
        });
    }
}

async function detalhar(req, res) {
    const { id } = req.params;
    try {
        const [produto, categorias, vendedores] = await Promise.all([
            Produto.consultarPorId(id),
            Categoria.consultarTodas(),
            Vendedor.consultarTodos()
        ]);

        return res.render('produto-detalhe', {
            titulo: `Produto: ${produto.nome}`,
            produto,
            categorias,
            vendedores,
            erro: null
        });
    } catch (error) {
        const status = error.message.includes('inválido') ? 400 : 404;
        return res.status(status).render('erro', {
            titulo: 'Erro ao consultar produto',
            mensagem: error.message
        });
    }
}

async function criar(req, res) {
    const { nome, preco, categoriaId, vendedorId, descricao } = req.body;
    try {
        const produto = new Produto(nome, preco, categoriaId, vendedorId, descricao);
        await produto.salvar();
        req.session.mensagemSucesso = 'Produto cadastrado com sucesso!';
        return res.redirect('/produtos');
    } catch (error) {
        const produtos = await Produto.consultarTodos().catch(() => []);
        const { produtosEnriquecidos, categorias, vendedores } = await carregarDadosAuxiliares(produtos).catch(() => ({
            produtosEnriquecidos: [],
            categorias: [],
            vendedores: []
        }));

        return res.status(400).render('produtos', {
            titulo: 'Produtos',
            produtos: produtosEnriquecidos,
            categorias,
            vendedores,
            busca: '',
            categoriaSelecionada: '',
            erro: error.message
        });
    }
}

async function atualizar(req, res) {
    const { id, nome, preco, categoriaId, vendedorId, descricao } = req.body;
    try {
        await Produto.atualizar(id, { nome, preco, categoriaId, vendedorId, descricao });
        req.session.mensagemSucesso = 'Produto atualizado com sucesso!';
        return res.redirect('/produtos');
    } catch (error) {
        const [categorias, vendedores] = await Promise.all([
            Categoria.consultarTodas().catch(() => []),
            Vendedor.consultarTodos().catch(() => [])
        ]);

        return res.status(400).render('produto-detalhe', {
            titulo: 'Editar Produto',
            produto: { _id: id, nome, preco, categoriaId, vendedorId, descricao },
            categorias,
            vendedores,
            erro: error.message
        });
    }
}

async function excluir(req, res) {
    const { id } = req.body;
    try {
        await Produto.excluir(id);
        req.session.mensagemSucesso = 'Produto excluído com sucesso!';
        return res.redirect('/produtos');
    } catch (error) {
        req.session.mensagemErro = error.message;
        return res.redirect('/produtos');
    }
}

module.exports = { listar, detalhar, criar, atualizar, excluir };