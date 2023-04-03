/**  @type {import('fastify').FastifyPluginAsync<{ optionA: boolean, optionB: string }>} //https://github.com/fastify/fastify/issues/2829*/
import S from 'fluent-json-schema'
import crypto from 'crypto'

export default async function (fastify, opts) {
    const {httpErrors, bcrypt, mysql} = fastify;

    fastify.post('/register', {//register a user on db if is not present
        schema: {
            body: S.object()
                .prop('userId', S.string().required())
                .prop('password', S.string().required())
                .prop('email', S.string().format(S.FORMATS.EMAIL).required()),
            response: {
                201: S.object()
            }
        }
    }, async (request, reply) => {
        const { userId, password, email } = request.body
      
        const query = 'INSERT INTO User (user, password, email) VALUES (?, ?, ?)'
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const values = [userId, hashedPassword, email]

        try {
            const [rows] = await mysql.pool.query(query, values)      
            reply.code(204);
        } catch (error) {
            console.error(error)
            return httpErrors.conflict('Email already present')
        }
    })
}
          