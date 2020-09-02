const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({
    port: process.env.port || 3000,
    host: 'localhost'
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: () => `Hello world!`
  })

  return server
}

module.exports = init
