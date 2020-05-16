const { transformRequest, transformResponse } = require('./src/apiGatewayTransformers')
const { logRequest, logResponse } = require('./src/logging')

const handleEvent = async (server, e, config) => {
  const { logger = console } = config

  const start = Date.now()

  const preTransformRequest = Date.now()
  const request = transformRequest(e)
  const postTransformRequest = Date.now()

  logRequest({ request, logger })

  const preInject = Date.now()
  const serverResponse = await server.inject(request)
  const postInject = Date.now()

  const preTransformResponse = Date.now()
  const response = transformResponse(serverResponse)
  const postTransformResponse = Date.now()

  const end = Date.now()

  const timing = {
    total: end - start,
    transformRequest: postTransformRequest - preTransformRequest,
    inject: postInject - preInject,
    transformResponse: postTransformResponse - preTransformResponse
  }

  logResponse({ request, response, timing, logger })

  return response
}

let server

module.exports = (init, config = {}) => {
  if (!init) {
    throw new Error('Function "init" was not provided')
  }

  return async (e) => {
    if (!server) {
      server = await init()
      await server.initialize()
      console.log(`Server ready on ${server.info.uri}`)
    }

    return handleEvent(server, e, config)
  }
}
