
const io = require('socket.io-client')
const { notify } = require('./notify')
const { Lock } = require('./lock')

exports.connect = function (url, clipboard) {
  console.log(`connecting to ${url}...`)
  const socket = io(url)
  const lock = new Lock()

  clipboard.onChange(async function (content) {
    await lock.acquire()
    console.log(`clipboard changed, ${content.data.length} bytes of ${content.mime}`)
    content.data.length && socket.emit('message', content)
    lock.release()
  })

  socket.on('message', async (msg) => {
    await lock.acquire()
    console.log(`clipboard received ${msg.data.length} bytes of ${msg.mime}`)
    notify(msg)
    await clipboard.write(msg)
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
