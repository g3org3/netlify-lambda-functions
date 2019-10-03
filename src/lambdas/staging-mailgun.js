require('dotenv').config()

const { sendMailgunNotification } = require('../util')
if (!process.env.SLACK_TOKEN) throw Error('env SLACK_TOKEN not found')
if (!process.env.SLACK_CHANNEL_STAGING)
  throw Error('env SLACK_CHANNEL_STAGING not found')

exports.handler = (event, context, callback) => {
  if (!isValidMailgunEvent(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  const { body } = event
  const mailgunPayload = JSON.parse(body)

  const slackConfig = {
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL_STAGING,
  }
  sendMailgunNotification(slackConfig, mailgunPayload)
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
