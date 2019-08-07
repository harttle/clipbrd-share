const { command } = require('./util')
const POLL_INTERVAL = 1000
const target2mime = {
  'text/plain': 'text/plain',
  'image/png': 'image/png',
  STRING: 'text/plain',
  UTF8_STRING: 'text/plain',
  TEXT: 'text/plain'
}

let lastContent = { mime: 'text/plain', data: Buffer.alloc(0) }

async function read () {
  const availableTargets = await readTargets()
  for (const [target, mime] of Object.entries(target2mime)) {
    if (availableTargets.includes(target)) return readByMime(target, mime)
  }
  return { mime: 'text/plain', data: Buffer.alloc(0) }
}

exports.onChange = function (cb) {
  setInterval(async function () {
    const content = await read()
    if (compare(content, lastContent)) {
      lastContent = content
      cb(content)
    }
  }, POLL_INTERVAL)
}

exports.write = async function ({ mime, data }) {
  lastContent = { mime, data }
  writeByMime(mime, data)
}

function compare (content, lastMsg) {
  return content.mime !== lastMsg.mime ||
    Buffer.compare(content.data, lastMsg.data)
}

async function readTargets () {
  const buffer = await command(
    'xclip',
    ['-selection', 'clipboard', '-t', 'TARGETS', '-o']
  )
  return buffer.toString().split('\n')
}

async function writeByMime (mime, data) {
  await command(
    'xclip',
    ['-selection', 'clipboard', '-t', mime, '-i'],
    data
  )
}

async function readByMime (mime, replace) {
  const data = await command(
    'xclip',
    ['-selection', 'clipboard', '-t', mime, '-o']
  )
  return { mime: replace || mime, data }
}
