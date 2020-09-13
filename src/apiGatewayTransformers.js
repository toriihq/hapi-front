const URL = require('url')

const getURL = (event) => {
  const url = {
    pathname: event.path || '/',
    query: event.multiValueQueryStringParameters || event.queryStringParameters
  }
  return URL.format(url)
}

const getPayload = (event) => {
  const type = typeof event.body

  if (Buffer.isBuffer(event.body)) {
    return event.body
  } else if (type === 'string') {
    return Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
  } else if (type === 'object') {
    return Buffer.from(JSON.stringify(event.body))
  }

  throw new Error(`Unexpected event.body type: "${type}"`)
}

const getHeaders = (event) => {
  return {
    ...event.headers,
    'X-Request-Id': event.requestContext.requestId,
    'X-Stage': event.requestContext.stage
  }
}

const getRemoteAddress = (event) => {
  return (
    event.requestContext &&
    event.requestContext.identity &&
    event.requestContext.identity.sourceIp
  )
}

const transformRequest = (event) => {
  return {
    method: event.httpMethod,
    url: getURL(event),
    payload: getPayload(event),
    headers: getHeaders(event),
    remoteAddress: getRemoteAddress(event),
    validate: true
  }
}

const transformResponse = response => {
  const { statusCode } = response

  const headers = {
    ...response.headers
  }

  delete headers['transfer-encoding']

  const body = response.rawPayload && response.rawPayload.toString('base64')

  return {
    statusCode,
    headers,
    body,
    isBase64Encoded: true
  }
}

module.exports = {
  transformRequest,
  transformResponse
}
