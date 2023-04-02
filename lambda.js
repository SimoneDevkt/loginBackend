/*const awsLambdaFastify = require('@fastify/aws-lambda')
const init = require('./app');

const proxy = awsLambdaFastify(init())
// or
// const proxy = awsLambdaFastify(init(), { binaryMimeTypes: ['application/octet-stream'] })

exports.handler = proxy;
// or
// exports.handler = (event, context, callback) => proxy(event, context, callback);
// or
// exports.handler = (event, context) => proxy(event, context);
// or
// exports.handler = async (event, context) => proxy(event, context);
*/

import awsLambdaFastify from 'aws-lambda-fastify'
import Fastify from 'fastify';
import App from './app.js'

const fastify = Fastify();

await fastify.register(App)

export const lambdaHandler = awsLambdaFastify(fastify, {
    callbackWaitsForEmptyEventLoop: false
})

await fastify.ready() // needs to be placed after awsLambdaFastify call because of the decoration: https://github.com/fastify/aws-lambda-fastify/blob/master/index.js#L9