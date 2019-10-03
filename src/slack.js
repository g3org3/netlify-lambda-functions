const qs = require('query-string')
const fetch = require('./fetch')

module.exports = sendSlackMessage
/**
 *
 * @param {string} token
 * @param {string} channel
 * @param {string} text
 *
 * @returns {Promise<any>}
 */
function sendSlackMessage(token, channel, text = '') {
  if (!token) throw new Error('Token not found')
  if (!channel) throw new Error('Channel not found')

  const hostname = 'slack.com'
  const method = '/api/chat.postMessage'
  const params = {
    token,
    channel,
    text,
  }
  const queryparams = qs.stringify(params)
  const path = `${method}?${queryparams}`

  return fetch({ hostname, path, method: 'POST' })
}
