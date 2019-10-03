const sendSlackMessage = require('./slack')

function getParams(mailgunPayload) {
  const eventData = mailgunPayload['event-data'] || {}
  const { message, recipient, event } = eventData
  const { to, from, subject } = message.headers || {}
  const logLevel = eventData['log-level'].toUpperCase()

  return { to, from, eventData, event, subject, logLevel, recipient }
}

exports.sendMailgunNotification = function(
  slackConfig = {},
  mailgunPayload = {}
) {
  const { logLevel, from, eventData, event, recipient, subject } = getParams(
    mailgunPayload
  )

  const formattedSubject = subject ? ` *Subject:* ${subject}` : ''
  const events = {
    ERRORfailed: 'permanent-fail',
    WARNfailed: 'temporary-fail',
  }
  const formattedEvent = events[logLevel + event] || event

  let clientInfo = ''

  if (eventData['client-info'] && event !== 'opened') {
    const os = eventData['client-info']['client-os']
    const { country, city } = eventData.geolocation || {}
    clientInfo = ` *Where:* ${os} - ${city}, ${country}`
  }

  let clickInfo = ''
  if (eventData.url) {
    clickInfo = ` *Url:* ${eventData.url}`
  }

  const fromInfo = from
    ? ` *From:* \`${from.split('<')[0]}\` *Hash:* \`${
        from.split('<')[1].split('@')[0]
      }\``
    : ''
  const emoji = {
    delivered: ':email:',
    'permanent-fail': ':helmet_with_white_cross:',
    'temporary-fail': ':small_orange_diamond:',
    complained: ':face_with_raised_eyebrow:',
    clicked: ':male-technologist::skin-tone-2:',
    opened: ':eyes:',
    unsubscribed: ':warning:',
  }
  const messageText = `${emoji[formattedEvent]} *${event}:* *To:* \`${recipient}\`${fromInfo}${formattedSubject}${clickInfo}${clientInfo}`

  return sendSlackMessage(slackConfig.token, slackConfig.channel, messageText)
}
