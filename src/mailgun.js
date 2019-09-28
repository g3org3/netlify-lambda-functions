// if (process.env.NODE_ENV === 'development') require('dotenv').config()

const { sendMailgunNotification } = require('./util')
exports.handler = (event, context, callback) => {
  if (!isValidMailgunEvent(event))
    return callback(null, { statusCode: 400, body: 'bad-request' })

  const { body } = event
  const mailgunPayload = JSON.parse(body)

  sendMailgunNotification(mailgunPayload)
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
