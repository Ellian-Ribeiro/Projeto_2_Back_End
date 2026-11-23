const { ObjectId } = require('mongodb');
const { connectDB } = require('../database/database');
const { logError } = require('../utils/logger');

function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

class Vendedor {
    constructor(nome, email, documento = '') {
        this.nome = typeof nome === 'string' ? nome.trim() : '';
        this.email = typeof email === 'string' ? email.trim().toLowerCase() : '';
        this.documento = typeof documento === 'string' ? documento.trim() : '';
    }

    async salvar() {
        try {
            if (!this.nome || !this.email) {
                throw new Error('Os campos "nome" e "email" são obrigatórios para o Vendedor.');
            }
            if (!emailValido(this.email)) {
                throw new Error('O e-mail informado para o vendedor é inválido.');
            }

            const db = await connectDB();
            const result = await db.collection('vendedores').insertOne({
                nome: this.nome,
                email: this.email,
                documento: this.documento
            });
            return result.insertedId;
        } catch (error) {
            logError('Falha ao inserir Vendedor', error.message, 'Vendedor.salvar');
            throw error;
        }
    }

    static async consultarTodos(busca = '') {
        try {
            const db = await connectDB();
            const filtro = {};

            if (busca && busca.trim()) {
                const regex = new RegExp(escaparRegex(busca.trim()), 'i');
                filtro.$or = [{ nome: regex }, { email: regex }, { documento: regex }];
            }

            return await db.collection('vendedores').find(filtro).sort({ nome: 1 }).toArray();
        } catch (error) {
            logError('Falha na consulta de Vendedores', error.message, 'Vendedor.consultarTodos');
            throw error;
        }
    }

    static async consultarPorId(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de vendedor inválido.');
            }

            const db = await connectDB();
            const vendedor = await db.collection('vendedores').findOne({ _id: new ObjectId(id) });

            if (!vendedor) {
                throw new Error('Vendedor não encontrado.');
            }
            return vendedor;
        } catch (error) {
            logError('Falha ao consultar Vendedor por ID', error.message, 'Vendedor.consultarPorId');
            throw error;
        }
    }

    static async atualizar(id, dados) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de vendedor inválido.');
            }

            const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
            const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';
            const documento = typeof dados.documento === 'string' ? dados.documento.trim() : '';

            if (!nome || !email) {
                throw new Error('Os campos "nome" e "email" são obrigatórios para atualizar o vendedor.');
            }
            if (!emailValido(email)) {
                throw new Error('O e-mail informado é inválido.');
            }

            const db = await connectDB();
            const result = await db.collection('vendedores').updateOne(
                { _id: new ObjectId(id) },
                { $set: { nome, email, documento } }
            );

            if (result.matchedCount === 0) {
                throw new Error('Vendedor não encontrado para atualização.');
            }
            return result;
        } catch (error) {
            logError('Falha ao atualizar Vendedor', error.message, 'Vendedor.atualizar');
            throw error;
        }
    }

    static async excluir(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Identificador de vendedor inválido.');
            }

            const db = await connectDB();
            const result = await db.collection('vendedores').deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new Error('Vendedor não encontrado para exclusão.');
            }
            return result;
        } catch (error) {
            logError('Falha ao excluir Vendedor', error.message, 'Vendedor.excluir');
            throw error;
        }
    }
}

module.exports = Vendedor;