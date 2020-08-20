const transformUrlPath = (event, options) => {
  let url = event.path || '/'

  if (options.stripStage) {
    const currentStage = event.requestContext ? event.requestContext.stage : null
    if (currentStage) {
      url = url.replace(`${currentStage}/`, '')
    }
  }

  const params = event.queryStringParameters
  if (params) {
    const qs = Object.keys(params).map(key => `${key}=${params[key]}`)
    if (qs.length > 0) {
      url += `?${qs.join('&')}`
    }
  }

  return url
}

const transformBody = (event) => {
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

const transformRequest = (event, options) => {
  const opt = {
    path: {
      stripStage: false
    },
    ...options
  }

  return {
    method: event.httpMethod,
    url: transformUrlPath(event, opt.path),
    payload: transformBody(event),
    headers: event.headers,
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
