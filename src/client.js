const io = require('socket.io-client')
const POLL_INTERVAL = 1000

let lastContent = { mime: 'text/plain', data: '' }

exports.connect = function (url, clipboard) {
  console.log(`connecting to ${url}...`)
  const socket = io(url)

  setInterval(async function () {
    const content = await clipboard.read()
    if (isChanged(content)) {
      lastContent = content
      console.log('clipboard changed, emitting...')
      socket.emit('message', content)
    }
  }, POLL_INTERVAL)

  socket.on('message', clipboard.write)
  socket.on('connect', () => console.log('connected'))
  socket.on('connect_error', (err) => console.error(err))
  socket.on('connect_timeout', () => console.error('connect timeout'))
  socket.on('disconnect', () => console.log('disconnected'))
  socket.on('error', (err) => console.error(err))
  socket.on('client left', (count) => console.log(`client left, ${count} client remains`))
  socket.on('client join', (count) => console.log(`client join, ${count} client in total`))
}

function isChanged (content) {
  return content.mime !== lastContent.mime || content.data !== lastContent.data
}
