const URL = require('url')

const getURL = (event) => {
  const url = {
    pathname: event.path || (event.requestContext && event.requestContext.http && event.requestContext.http.path) || '/',
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
  } else if (type === 'undefined') {
    return Buffer.from(JSON.stringify(null))
  }

  throw new Error(`Unexpected event.body type: "${type}"`)
}

const getHeaders = (event) => {
  return {
    ...event.headers,
    'X-Request-Id': event.requestContext?.requestId,
    'X-Stage': event.requestContext?.stage
  }
}

const getRemoteAddress = (event) => {
  return (
    event.requestContext &&
    event.requestContext.identity &&
    event.requestContext.identity.sourceIp
  )
}

const BINARY_ENCODINGS = {
  gzip: true,
  deflate: true,
  br: true
}

const isBinary = (headers) => {
  const contentEncoding = headers['content-encoding']
  if (typeof contentEncoding !== 'string') {
    return false
  }

  return contentEncoding.split(',').some(value => BINARY_ENCODINGS[value])
}

const transformRequest = (event) => {
  return {
    method: event.httpMethod || event.requestContext?.http?.method || 'GET',
    url: getURL(event),
    payload: getPayload(event),
    headers: getHeaders(event),
    remoteAddress: getRemoteAddress(event),
    validate: true
  }
}

const transformResponse = response => {
  console.log(JSON.stringify(response, null, 2))
  const { statusCode } = response

  const headers = {
    ...response.headers
  }

  if (headers['transfer-encoding'] === 'chunked') {
    delete headers['transfer-encoding']
  }

  const multiValueHeaders = {}
  Object.keys(headers).forEach(key => {
    multiValueHeaders[key] = Array.isArray(headers[key]) ? headers[key] : [headers[key]]
  })

  const isBase64Encoded = isBinary(headers)
  const encoding = isBase64Encoded ? 'base64' : 'utf8'
  const body = response.rawPayload && response.rawPayload.toString(encoding)

  return {
    statusCode,
    multiValueHeaders,
    body,
    isBase64Encoded
  }
}

module.exports = {
  transformRequest,
  transformResponse
}
