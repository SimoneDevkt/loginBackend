import fp from 'fastify-plugin'
import Mailer from 'fastify-mailer'

/**
 * //send mail
 *
 * @see https://github.com/coopflow/fastify-mailer
 */
async function mailer(fastify, option) {
  const { config } = fastify;
  fastify.register(Mailer, {
    defaults: { from: `Test <${config.GMAIL_USER}>` },
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: config.GMAIL_USER, // like : abc@gmail.com
          pass: config.GMAIL_PSW, // like : pass@123
      }
    }
  })
}

export default fp(mailer)
