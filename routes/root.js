export default async function (fastify, opts) {
  fastify.addHook('onRequest', fastify.authorize)//only requests with valid jwt are authorized

  fastify.get('/', async function (request, reply) {
    return { authenticate: true }
  })
}
