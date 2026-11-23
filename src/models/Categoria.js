const { ObjectId } = require('mongodb');
const { connectDB } = require('../database/database');
const { logError } = require('../utils/logger');

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class Categoria {
    constructor(nome, descricao = '') {
        this.nome = typeof nome === 'string' ? nome.trim() : '';
        this.descricao = typeof descricao === 'string' ? descricao.trim() : '';
    }

    async salvar() {
        try {
            if (!this.nome) {
                throw new Error('O campo "nome" é obrigatório para cadastrar uma categoria.');
            }

            const db = await connectDB();
            const result = await db.collection('categorias').insertOne({
                nome: this.nome,
                descricao: this.descricao
            });
            return result.insertedId;
        } catch (error) {
            logError('Falha ao inserir Categoria', error.message, 'Categoria.salvar');
            throw error;
        }
    }

    static async consultarTodas(busca = '') {
        try {
            const db = await connectDB();
            const filtro = {};

            if (busca && busca.trim()) {
                const regex = new RegExp(escaparRegex(busca.trim()), 'i');
                filtro.$or = [{ nome: regex }, { descricao: regex }];
            }

            return await db.collection('categorias').find(filtro).sort({ nome: 1 }).toArray();
        } catch (error) {
            logError('Falha na consulta de Categorias', error.message, 'Categoria.consultarTodas');
            throw error;
        }
    }

    static async consultarPorId(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de categoria inválido.');
            }

            const db = await connectDB();
            const categoria = await db.collection('categorias').findOne({ _id: new ObjectId(id) });

            if (!categoria) {
                throw new Error('Categoria não encontrada.');
            }
            return categoria;
        } catch (error) {
            logError('Falha ao consultar Categoria por ID', error.message, 'Categoria.consultarPorId');
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de categoria inválido.');
            }

            const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
            const descricao = typeof dados.descricao === 'string' ? dados.descricao.trim() : '';

            if (!nome) {
                throw new Error('O campo "nome" é obrigatório para atualizar a categoria.');
            }

            const db = await connectDB();
            const result = await db.collection('categorias').updateOne(
                { _id: new ObjectId(id) },
                { $set: { nome, descricao } }
            );

            if (result.matchedCount === 0) {
                throw new Error('Categoria não encontrada para atualização.');
            }
            return result;
        } catch (error) {
            logError('Falha ao atualizar Categoria', error.message, 'Categoria.atualizar');
            throw error;
        }
    }

    static async excluir(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de categoria inválido.');
            }

            const db = await connectDB();
            const result = await db.collection('categorias').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new Error('Categoria não encontrada para exclusão.');
            }
            return result;
        } catch (error) {
            logError('Falha ao excluir Categoria', error.message, 'Categoria.excluir');
            throw error;
        }
    }
}

module.exports = Categoria;