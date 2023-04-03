import fp from 'fastify-plugin'
import mysql from '@fastify/mysql'

async function dbMysql(fastify, option) {  
  const { config } = fastify;
  fastify.register(mysql, {
    promise: true,
    connectionString: config.MYSQL_CONNECTIONSTRING,
  })
}

export default fp(dbMysql)