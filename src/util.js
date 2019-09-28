const qs = require('query-string')
const fetch = require('./fetch')

// list of exports
exports.sendMailgunNotification = sendMailgunNotification

if (!process.env.SLACK_TOKEN) throw Error('env SLACK_TOKEN not found')
if (!process.env.SLACK_CHANNEL) throw Error('env SLACK_CHANNEL not found')

function getParams(mailgunPayload) {
  const eventData = mailgunPayload['event-data']
  const { message, recipient, event } = eventData || {}
  const { to, from, subject } = message.headers || {}
  const logLevel = eventData['log-level'].toUpperCase()
  const text = `[${logLevel}][${event}] to: ${recipient} - subject: ${subject}`

  return { to, from, event, text, subject, logLevel, recipient }
}

function sendMailgunNotification(mailgunPayload = {}) {
  const { logLevel, event, recipient, subject, text } = getParams(
    mailgunPayload
  )

  const colors = {
    INFO: '#00BCD4',
    WARN: '#ffc107',
    ERROR: '#ff5722',
    SUCCESS: '#4CAF50',
    INFOdelivered: '#4CAF50',
  }
  const emoji = {
    delivered: ':email:',
    failed: ':helmet_with_white_cross:',
    complained: ':face_with_raised_eyebrow:',
    clicked: ':male-technologist::skin-tone-2:',
    opened: ':eyes:',
  }
  const formattedSubject = subject ? ` *Subject:* ${subject}` : ''
  const events = {
    ERRORfailed: 'permanent failure',
    WARNfailed: 'temporary failure',
  }
  const formattedEvent = events[logLevel + event] || event
  const color = colors[logLevel + event] || colors[logLevel]
  const attachments = JSON.stringify([
    {
      fallback: text,
      color,
      title: `${emoji[event] || ''} ${formattedEvent}`,
      text: `*To:* ${recipient}${formattedSubject}`,
      footer: 'Mailgun API',
      footer_icon: 'http://wwwhere.io/img/thumbs/mailgun.jpg',
    },
  ])

  return sendSlackMessage(process.env.SLACK_CHANNEL, '', attachments)
}

function sendSlackMessage(channel, text, attachments) {
  const hostname = 'slack.com'
  const method = '/api/chat.postMessage'
  const params = {
    token: process.env.SLACK_TOKEN,
    channel,
    text,
    attachments,
  }
  const queryparams = qs.stringify(params)
  const path = `${method}?${queryparams}`

  return fetch({ hostname, path, method: 'POST' })
}
