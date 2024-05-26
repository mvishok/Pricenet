import Fastify from 'fastify'
import search from './scraper/process.js';

const fastify = Fastify({
  logger: true
})

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

    const results = await search(query)

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