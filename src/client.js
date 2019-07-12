const io = require('socket.io-client')
const POLL_INTERVAL = 1000

let lastMsg = { mime: 'text/plain', data: Buffer.alloc(0) }

exports.connect = function (url, clipboard) {
  console.log(`connecting to ${url}...`)
  const socket = io(url)

  setInterval(async function () {
    const msg = await clipboard.read()
    if (compare(msg, lastMsg)) {
      lastMsg = msg
      console.log(`clipboard changed, sending ${msg.data.length} bytes of ${msg.mime}`)
      socket.emit('message', msg)
    }
  }, POLL_INTERVAL)

  socket.on('message', msg => {
    console.log(`clipboard received ${msg.data.length} bytes of ${msg.mime}`)
    lastMsg = msg
    clipboard.write(msg)
  })
  socket.on('connect', () => console.log('connected'))
  socket.on('connect_error', (err) => console.error(err))
  socket.on('connect_timeout', () => console.error('connect timeout'))
  socket.on('disconnect', () => console.log('disconnected'))
  socket.on('error', (err) => console.error(err))
  socket.on('client left', (count) => console.log(`client left, ${count} client remains`))
  socket.on('client join', (count) => console.log(`client join, ${count} client in total`))
}

function compare (msg, lastMsg) {
  return msg.mime !== lastMsg.mime ||
    Buffer.compare(msg.data, lastMsg.data)
}
