require('dotenv').config()
const { sendMailgunNotification } = require('./core')
const { isValidMailgunRequest } = require('./verify-request')

module.exports = slackConfig => (event, context, callback) => {
  if (!isValidMailgunRequest(event)) {
    console.log('Request incoming, [invalid]')
    return callback(null, { statusCode: 400, body: 'bad-request' })
  }

  console.log('Request incoming, [valid]')
  const success = r => callback(null, { statusCode: 200, body: 'ok' })

  sendMailgunNotification(slackConfig, JSON.parse(event.body))
    .then(success)
    .catch(callback)
}
