/**  @type {import('fastify').FastifyPluginAsync<{ optionA: boolean, optionB: string }>} //https://github.com/fastify/fastify/issues/2829*/
import S from 'fluent-json-schema'
import crypto from 'crypto'

export default async function (fastify, opts) {
    const {httpErrors, mailer, jwt, mysql, config} = fastify;

    fastify.post('/recover', {//register a user on db if is not present
        schema: {
            body: S.object()
                .prop('userId', S.string().required()),
            response: {
                201: S.object().additionalProperties(true)
            }
        }
    }, async (request, reply) => {
        const { userId } = request.body

        const query = 'SELECT * FROM User WHERE user = ?'
        const values = [userId]

        try {
            const [rows] = await mysql.pool.query(query, values)
            if (rows.length > 0) {
                const { id, email } = rows[0];
                const token = jwt.sign({userId: id }, { expiresIn: '1h' });

                const link = `${config.FRONTEND}/reset?token=${token}`;
                const subject = 'Reset Password';
                const text = `Link reset password: ${link}`;

                await mailer.sendMail({
                    to: email,
                    subject: subject,
                    text: text
                });
                
                reply.code(204);                
                return
            } else {
                return httpErrors.conflict('User not present')
            }
        } catch (error) {
            console.log(error);
            return httpErrors.internalServerError('Internal server error')
        }
    })
    
    fastify.post('/reset', {//reset a password if you have authorization
        onRequest: fastify.authorize,
        schema: {
            body: S.object()
                .prop('password', S.string().required()),
            response: {
                201: S.object().additionalProperties(true)
            }
        }
    }, async (request, reply) => {
        const { password } = request.body

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const query = 'UPDATE User SET password = ? WHERE id = ?'
        const values = [hashedPassword, request.user.userId]
        
        try {
            const [rows] = await mysql.pool.query(query, values)      
            reply.code(204);
        } catch (error) {
            console.error(error)
            return httpErrors.internalServerError('Internal server error')
        }
    })
}
          