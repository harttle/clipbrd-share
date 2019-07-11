const io = require('socket.io-client')
const conf = require('./config')
const platform = require('os').platform()
const POLL_INTERVAL = 1000
const impl = {
  darwin: require('./impls/darwin'),
  linux: require('./impls/linux')
}[platform]

if (!impl) {
  console.error(`Your platform ${platform} is not supported yet, feel free to file a PR/Issue on https://github.com/harttle/clipboard-share/issues`)
  process.exit(1)
}

let URL = ''
if (process.env.URL) {
  URL = process.env.URL
  conf.set('url', URL)
} else {
  console.log('URL env not set, trying ~/.clipboard-sharerc:url')
  URL = conf.get('url')
}

if (!URL) {
  console.error('Please set URL for the remote server, eg:\n> URL=http://192.168.1.100:3000 node client.js')
  process.exit(1)
}

console.log(`connecting to ${URL}...`)
const socket = io(URL)
let lastContent = { type: 'text/plain', data: '' }

setInterval(async function () {
  const content = await impl.read()
  if (isChanged(content)) {
    lastContent = content
    console.log('clipboard changed, emitting...')
    socket.emit(content.type, content.content)
  }
}, POLL_INTERVAL)

socket.on('message', impl.write)

function isChanged (content) {
  return content.mime !== lastContent.mime || content.data !== lastContent.data
}

socket.on('connect', () => console.log('connected'))
socket.on('connect_error', (err) => console.error(err))
socket.on('connect_timeout', () => console.error('connect timeout'))
socket.on('disconnect', () => console.log('disconnected'))
socket.on('error', (err) => console.error(err))
socket.on('client left', (count) => console.log(`client left, ${count} client remains`))
socket.on('client join', (count) => console.log(`client join, ${count} client in total`))
