import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

//API

//search endpoint

fastify.get('/search', async (request, reply) => {

    //get query parameter
    const query = request.query.query

    //check if query is empty
    if(!query){
        return {
            status: 'error',
            message: 'Invalid query'
        }
    }

    
});

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}