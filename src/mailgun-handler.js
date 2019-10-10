require('dotenv').config()
const debug = require('./debug')
const { sendMailgunNotification } = require('./core')
const { isValidMailgunRequest } = require('./verify-request')

module.exports = slackConfig => (event, context, callback) => {
  if (!isValidMailgunRequest(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  const success = r =>
    callback(null, {
      statusCode: 200,
      body: 'ok',
    })

  debug(JSON.parse(event.body))

  sendMailgunNotification(slackConfig, JSON.parse(event.body))
    .then(success)
    .catch(callback)
}
