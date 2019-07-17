const notifier = require('node-notifier')

function notify ({ mime, data }) {
  const type = {
    'text/plain': 'Text',
    'image/png': 'Image'
  }[mime]

  notifier.notify({
    title: 'clipbrd-share',
    message: `${type} received, ${data.length} bytes`
  })
}

exports.notify = notify
