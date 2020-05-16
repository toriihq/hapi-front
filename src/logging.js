const logRequest = ({ request, logger = console }) => {
  const message = [
    '-->',
    request.method,
    request.url
  ].filter(Boolean)
  logger.info(...message)
}

const logResponse = ({ request, response, timing, logger = console }) => {
  const isError = (response.statusCode < 200 || response.statusCode >= 400)
  const message = [
    '<--',
    request.method,
    request.url,
    `[${response.statusCode}]`,
    `${timing.total}ms`,
    isError && response.body
  ].filter(Boolean)
  logger.info(...message)
}

module.exports = {
  logRequest,
  logResponse
}
