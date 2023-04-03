import fp from 'fastify-plugin'
import Jwt from '@fastify/jwt'

/**  @type {import('fastify').FastifyPluginAsync<{ optionA: boolean, optionB: string }>} //https://github.com/fastify/fastify/issues/2829*/

async function auth(fastify, opts) {
    const { config } = fastify;

    fastify.register(Jwt, {
        secret: config.JWT_SECRET,
    })

    fastify.decorate('authorize', async function authorize(req, reply) {
        await req.jwtVerify();
    })
    
}

export default fp(auth);