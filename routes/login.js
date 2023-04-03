/**  @type {import('fastify').FastifyPluginAsync<{ optionA: boolean, optionB: string }>} //https://github.com/fastify/fastify/issues/2829*/
import S from 'fluent-json-schema'
import crypto from 'crypto'

export default async function (fastify, opts) {
    const {httpErrors, jwt, mysql} = fastify;

    fastify.post('/login', {//return a jwt if credentials are correct
        schema: {
            body: S.object()
                .prop('userId', S.string().required())
                .prop('password', S.string().required()),
            response: {
                201: S.object().additionalProperties(true)
            }
        }
    }, async (request, reply) => {
        const { userId, password } = request.body
        const query = 'SELECT * FROM User WHERE user = ? AND password = ?'
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        console.log(hashedPassword);
        const values = [userId, hashedPassword]

        try {
            const [rows] = await mysql.pool.query(query, values)
      
            if (rows.length > 0) {
                const token = jwt.sign({ id: rows[0].id});
                reply.code(201)
                return {token, userId};
            } else {
                return httpErrors.unauthorized('bad username or password') 
            }
        } catch (error) {
            return httpErrors.internalServerError('Internal server error')
        }
    })
}
          