const { ObjectId } = require('mongodb');
const { connectDB } = require('../database/database');
const { logError } = require('../utils/logger');

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class Produto {
    constructor(nome, preco, categoriaId, vendedorId, descricao = '') {
        this.nome = typeof nome === 'string' ? nome.trim() : '';
        this.preco = preco;
        this.categoriaId = categoriaId;
        this.vendedorId = vendedorId;
        this.descricao = typeof descricao === 'string' ? descricao.trim() : '';
    }

    static async validarDados(dados) {
        const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
        const descricao = typeof dados.descricao === 'string' ? dados.descricao.trim() : '';
        const precoNumerico = Number(dados.preco);

        if (!nome || dados.preco === undefined || dados.preco === '' || !dados.categoriaId) {
            throw new Error('Os campos "nome", "preço" e "categoria" são obrigatórios para o Produto.');
        }

        if (!Number.isFinite(precoNumerico) || precoNumerico <= 0) {
            throw new Error('O preço do produto deve ser um número maior que zero.');
        }

        if (!ObjectId.isValid(dados.categoriaId)) {
            throw new Error('A categoria selecionada possui um identificador inválido.');
        }

        const db = await connectDB();
        const categoriaExiste = await db.collection('categorias').findOne({
            _id: new ObjectId(dados.categoriaId)
        });
        if (!categoriaExiste) {
            throw new Error('A categoria informada não existe no banco de dados.');
        }

        let vendedorObjectId = null;
        if (dados.vendedorId && String(dados.vendedorId).trim() !== '') {
            if (!ObjectId.isValid(dados.vendedorId)) {
                throw new Error('O vendedor selecionado possui um identificador inválido.');
            }
            const vendedorExiste = await db.collection('vendedores').findOne({
                _id: new ObjectId(dados.vendedorId)
            });
            if (!vendedorExiste) {
                throw new Error('O vendedor informado não existe no banco de dados.');
            }
            vendedorObjectId = new ObjectId(dados.vendedorId);
        }

        return {
            nome,
            preco: precoNumerico,
            categoriaId: new ObjectId(dados.categoriaId),
            vendedorId: vendedorObjectId,
            descricao
        };
    }

    async salvar() {
        try {
            const documentoValidado = await Produto.validarDados(this);
            const db = await connectDB();
            const result = await db.collection('produtos').insertOne(documentoValidado);
            return result.insertedId;
        } catch (error) {
            logError('Falha ao inserir Produto', error.message, 'Produto.salvar');
            throw error;
        }
    }

    static async consultarTodos({ busca = '', categoriaId = '' } = {}) {
        try {
            const db = await connectDB();
            const filtro = {};

            if (busca && busca.trim()) {
                const regex = new RegExp(escaparRegex(busca.trim()), 'i');
                filtro.$or = [{ nome: regex }, { descricao: regex }];
            }

            if (categoriaId && categoriaId.trim()) {
                if (!ObjectId.isValid(categoriaId)) {
                    throw new Error('Identificador de categoria inválido no filtro de busca.');
                }
                filtro.categoriaId = new ObjectId(categoriaId);
            }

            return await db.collection('produtos').find(filtro).sort({ nome: 1 }).toArray();
        } catch (error) {
            logError('Falha na consulta de Produtos', error.message, 'Produto.consultarTodos');
            throw error;
        }
    }

    static async consultarPorId(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de produto inválido.');
            }

            const db = await connectDB();
            const produto = await db.collection('produtos').findOne({ _id: new ObjectId(id) });

            if (!produto) {
                throw new Error('Produto não encontrado.');
            }
            return produto;
        } catch (error) {
            logError('Falha ao consultar Produto por ID', error.message, 'Produto.consultarPorId');
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de produto inválido.');
            }

            const documentoValidado = await Produto.validarDados(dados);
            const db = await connectDB();
            const result = await db.collection('produtos').updateOne(
                { _id: new ObjectId(id) },
                { $set: documentoValidado }
            );

            if (result.matchedCount === 0) {
                throw new Error('Produto não encontrado para atualização.');
            }
            return result;
        } catch (error) {
            logError('Falha ao atualizar Produto', error.message, 'Produto.atualizar');
            throw error;
        }
    }

    static async excluir(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de produto inválido.');
            }

            const db = await connectDB();
            const result = await db.collection('produtos').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new Error('Produto não encontrado para exclusão.');
            }
            return result;
        } catch (error) {
            logError('Falha ao excluir Produto', error.message, 'Produto.excluir');
            throw error;
        }
    }
}

module.exports = Produto;