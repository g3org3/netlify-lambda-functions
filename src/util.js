const sendSlackMessage = require('./slack')

const emojis = {
  delivered: ':email:',
  'permanent-fail': ':helmet_with_white_cross:',
  'temporary-fail': ':small_orange_diamond:',
  complained: ':face_with_raised_eyebrow:',
  clicked: ':male-technologist::skin-tone-2:',
  opened: ':eyes:',
  unsubscribed: ':warning:',
}
const events = {
  errorfailed: 'permanent-fail',
  warnfailed: 'temporary-fail',
}

exports.sendMailgunNotification = (slackConfig = {}, mailgunPayload = {}) => {
  const eventData = mailgunPayload['event-data'] || {}
  const {
    message: {
      headers: { from, subject },
    },
    recipient,
    event,
  } = eventData
  const logLevel = eventData['log-level'].toLowerCase()
  const logLevelEvent = events[logLevel + event] || event

  const subjectInfo = subject ? ` *Subject:* ${subject}` : ''

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

  const emoji = emojis[logLevelEvent]
  const toInfo = ` *To:* \`${recipient}\``

  const messageText =
    `${emoji} *${event}:*` +
    toInfo +
    fromInfo +
    subjectInfo +
    clickInfo +
    clientInfo

  const messages = [
    sendSlackMessage(slackConfig.token, slackConfig.channel, messageText),
  ]

  if (logLevel === 'error') {
    messages.push(
      sendSlackMessage(
        slackConfig.token,
        slackConfig.error_channel,
        messageText
      )
    )
  }

  return Promise.all(messages)
}
