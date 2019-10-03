const { version } = require('../package.json')

module.exports = function(mailgunPayload) {
  const eventData = mailgunPayload['event-data'] || {}
  const { event = 'unknown' } = eventData || {}
  const logLevel = eventData['log-level'].toUpperCase() || '-'

  console.log(`[${version}][${logLevel}][${event}]`)
}
