import fp from 'fastify-plugin'
import cors from '@fastify/cors'

async function corsPlugin(fastify, option) {  
    await fastify.register(cors, {
        origin: true
    })
}

export default fp(corsPlugin)