exports.isValidMailgunRequest = function(event = {}) {
  const { httpMethod, headers } = event
  const userAgent = headers['user-agent']

  return httpMethod === 'POST' && userAgent.includes('mailgun')
}
