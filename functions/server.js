import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify from 'fastify';
import sp from 'synchronized-promise'

const fastify = Fastify();

//Workaround: manually load routes, .env file and plugin because of netlify doasn't load all file if is not imported 
//https://github.com/fastify/fastify-autoload/issues/265
import auth from '../plugins/auth.js'
import corsPlugin from '../plugins/cors.js'
import dbMysql from '../plugins/dbMysql.js'
import mailer from '../plugins/fastify-mailer.js'
import sensible from '../plugins/sensible.js'
import login from '../routes/login.js'
import register from '../routes/register'
import resetpassword from '../routes/resetpassword'
import root from '../routes/root.js'


fastify.config = {
    FRONTEND: '',
    GMAIL_PSW: '',
    GMAIL_USER: '',
    JWT_SECRET: '',
    MYSQL_CONNECTIONSTRING: ''
}

fastify.register(auth)
fastify.register(corsPlugin)
fastify.register(dbMysql)
fastify.register(mailer)
fastify.register(sensible)
fastify.register(login, { prefix: '/.netlify/functions/server' })
fastify.register(register, { prefix: '/.netlify/functions/server' })
fastify.register(resetpassword, { prefix: '/.netlify/functions/server' })
fastify.register(root, { prefix: '/.netlify/functions/server' })

export const handler = awsLambdaFastify(fastify, {
    callbackWaitsForEmptyEventLoop: false,
})

sp(() => fastify.ready() )  // needs to be placed after awsLambdaFastify call because of the decoration: https://github.com/fastify/aws-lambda-fastify/blob/master/index.js#L9
