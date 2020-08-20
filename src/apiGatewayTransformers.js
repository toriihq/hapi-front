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
    payload: event.body,
    headers: event.headers,
    validate: true
  }
}

const transformResponse = response => {
  const { statusCode } = response

  const headers = {
    ...response.headers
  }

  const body = response.payload

  return {
    statusCode,
    headers,
    body
  }
}

module.exports = {
  transformRequest,
  transformResponse
}
