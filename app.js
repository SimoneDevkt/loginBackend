import path from 'path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import fastifyEnv from '@fastify/env'
import S from 'fluent-json-schema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Pass --options via CLI arguments in command to enable these options.
export const options = {
}

export default async function app(fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyEnv, {    
    dotenv: true,
    schema: S.object()  
      .prop('JWT_SECRET', S.string().required())
      .prop('MYSQL_CONNECTIONSTRING', S.string().required())
      .prop('GMAIL_USER', S.string().required())
      .prop('GMAIL_PSW', S.string().required())
      .prop('FRONTEND', S.string().required())
      .valueOf()
  })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
