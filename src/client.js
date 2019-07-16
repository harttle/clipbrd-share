const debug = require('debug')('clipbrd-share:client')
const io = require('socket.io-client')
const POLL_INTERVAL = 1000
const { Lock } = require('./lock')

let lastMsg = { mime: 'text/plain', data: Buffer.alloc(0) }

exports.connect = function (url, clipboard) {
  console.log(`connecting to ${url}...`)
  const socket = io(url)
  const lock = new Lock()
  let clipboardWritten = false

  setInterval(async function () {
    await lock.acquire()
    const msg = await clipboard.read()
    if (compare(msg, lastMsg)) {
      lastMsg = msg
      if (clipboardWritten) {
        clipboardWritten = false
        debug(`clipboard written changed, skip sending`)
      } else {
        console.log(`clipboard changed, ${msg.data.length} bytes of ${msg.mime}`)
        msg.data.length && socket.emit('message', msg)
      }
    }
    lock.release()
  }, POLL_INTERVAL)

  socket.on('message', async (msg) => {
    await lock.acquire()
    console.log(`clipboard received ${msg.data.length} bytes of ${msg.mime}`)
    await clipboard.write(msg)
    clipboardWritten = true
    lock.release()
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
