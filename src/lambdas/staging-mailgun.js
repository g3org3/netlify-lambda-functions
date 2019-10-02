require('dotenv').config()

const { sendMailgunNotification } = require('../util')
if (!process.env.SLACK_CHANNEL_STAGING)
  throw Error('env SLACK_CHANNEL_STAGING not found')

exports.handler = (event, context, callback) => {
  if (!isValidMailgunEvent(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  const { body } = event
  const mailgunPayload = JSON.parse(body)

  sendMailgunNotification(process.env.SLACK_CHANNEL_STAGING, mailgunPayload)
    .then(r => {
      callback(null, {
        statusCode: 200,
        body: `r: ${r}`,
      })
    })
    .catch(err => callback(err))
}

function isValidMailgunEvent(event = {}) {
  const { httpMethod, headers } = event
  const userAgent = headers['user-agent']

  return httpMethod === 'POST' && userAgent.includes('mailgun')
}
