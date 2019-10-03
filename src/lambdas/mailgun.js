require('dotenv').config()

const debug = require('../debug')
const { sendMailgunNotification } = require('../util')
const { isValidMailgunRequest } = require('./verify-request')

if (!process.env.SLACK_TOKEN) throw Error('env SLACK_TOKEN not found')
if (!process.env.SLACK_CHANNEL) throw Error('env SLACK_CHANNEL not found')

exports.handler = (event, context, callback) => {
  if (!isValidMailgunRequest(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  debug(JSON.parse(event.body))

  const slackConfig = {
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL,
  }

  sendMailgunNotification(slackConfig, JSON.parse(event.body))
    .then(r =>
      callback(null, {
        statusCode: 200,
        body: `r: ${r}`,
      })
    )
    .catch(err => callback(err))
}
