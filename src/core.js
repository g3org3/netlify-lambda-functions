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

const getEmoji = (event, logLevel) => {
  const logLevelEvent = events[logLevel + event] || event
  return emojis[logLevelEvent]
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

  const subjectInfo = subject ? ` *S:* \`${subject}\`` : ''

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

  const fromText = from ? from.split('via FFYN')[0].trim() : ''
  const fromInfo = `\`${fromText}\` :arrow_right: `

  const userVariables = eventData['user-variables'] || {}
  const replyToEmailHash = userVariables.replyToEmailHash
  const hashText = replyToEmailHash ? replyToEmailHash.split('@')[0] : null
  const hashInfo = hashText ? ` *H:* \`${hashText}\`` : ''

  const tags = eventData.tags || []
  const tagsInfo = tags.length > 0 ? ` *Tag:* \`${tags.join(', ')}\`` : ''

  const emoji = getEmoji(event, logLevel)
  const toInfo = ` \`${recipient}\``

  const messageText =
    `${emoji} ` +
    fromInfo +
    toInfo +
    hashInfo +
    tagsInfo +
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
