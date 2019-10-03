module.exports = {
  prod: {
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    error_channel: process.env.SLACK_CHANNEL_ERROR,
  },
  staging: {
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL_STAGING,
    error_channel: process.env.SLACK_CHANNEL_ERROR_STAGING,
  },
}
