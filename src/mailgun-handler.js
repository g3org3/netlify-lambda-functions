require('dotenv').config()
const debug = require('./debug')
const { sendMailgunNotification } = require('./util')
const { isValidMailgunRequest } = require('./verify-request')

module.exports = slackConfig => (event, context, callback) => {
  if (!isValidMailgunRequest(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  debug(JSON.parse(event.body))

  sendMailgunNotification(slackConfig, JSON.parse(event.body))
    .then(r =>
      callback(null, {
        statusCode: 200,
        body: `r: ${r}`,
      })
    )
    .catch(err => callback(err))
}
