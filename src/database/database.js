const { MongoClient } = require('mongodb');
const { logError } = require('../utils/logger');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGO_DB || 'ecommerce_pw1';

const client = new MongoClient(uri);
let db = null;

async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            db = client.db(dbName);
        } catch (error) {
            logError('Falha de Conexão', error.message, 'database.connectDB');
            throw new Error('Não foi possível conectar ao banco de dados MongoDB.');
        }
    }
    return db;
}

async function closeDB() {
    if (db) {
        await client.close();
        db = null;
    }
}

module.exports = { connectDB, closeDB };