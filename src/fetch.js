const https = require('https')

module.exports = fetch
function fetch(_options = {}) {
  return new Promise((resolve, reject) => {
    const {
      json,
      method = 'GET',
      body,
      headers = {},
      hostname,
      path,
    } = _options

    const postHeaders = !body
      ? {}
      : { 'Content-Type': 'application/json', 'Content-Length': body.length }
    const jsonHeader = !json ? {} : { Accept: 'application/json' }

    const options = {
      hostname,
      port: 443,
      path,
      method,
      headers: {
        ...jsonHeader,
        ...postHeaders,
        ...headers,
        'User-Agent': 'NODEJS/11.0',
      },
    }

    const request = https.request(options, resp => {
      let data = ''

      // A chunk of data has been recieved.
      resp.on('data', chunk => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        // console.log(data)
        resolve(json ? JSON.parse(data) : data)
      })
    })

    request.on('error', err => {
      // console.log('Error: ' + err.message)
      reject(err)
    })

    if (body) request.write(body)
    request.end()
  })
}
