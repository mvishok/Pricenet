import Fastify from 'fastify'
import { MongoClient } from 'mongodb';
import search from './scraper/process.js';

const fastify = Fastify()

//Database
const uri = process.env.MONGODB_URI;
let client;

fastify.addHook('onReady', async () => {
    client = new MongoClient(uri);
    await client.connect();
    fastify.log.info('Connected to MongoDB');
});

fastify.addHook('onClose', async (instance, done) => {
    if (client) {
        await client.close();
        fastify.log.info('MongoDB connection closed');
    }
    done();
});

fastify.get('/', async (request, reply) => {
    return { 
        status: 'success',
        message: 'Pricenet API'
    }
});

//API
//search endpoint
fastify.get('/search', async (request, reply) => {
    const query = request.query.query
    if(!query){
        return {
            status: 'error',
            message: 'Invalid query'
        }
    }

    const db = client.db('pricenet');
    const collection = db.collection('cache');

    const cached = await collection.findOne({query});
    if(cached){
        return {
            status: 'success',
            results: cached.results
        }
    }

    const results = await search(query)
    await collection.insertOne({query, results});
    
    return {
        status: 'success',
        results
    }
});

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}