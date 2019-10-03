const handler = require('../mailgun-handler')
const slackConfig = require('../slack-config')

exports.handler = handler(slackConfig.staging)
