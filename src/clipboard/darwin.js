const { command } = require('./util')
const { resolve } = require('path')
const POLL_INTERVAL = 1000
const debug = require('debug')('clipbrd-share:darwin')
const bin = resolve(__dirname, '../../bin/osxclipboard')
let lastCount = -1

const PasteboardType2mime = {
  'public.utf8-plain-text': 'text/plain',
  'public.tiff': 'image/png'
}

const mime2PasteboardType = {
  'text/plain': 'public.utf8-plain-text',
  'image/png': 'public.tiff'
}

async function read (availableTypes) {
  for (const [type, mime] of Object.entries(PasteboardType2mime)) {
    if (availableTypes.includes(type)) return readByType(type, mime)
  }
  return { mime: 'text/plain', data: Buffer.alloc(0) }
}

async function readByType (type, mime) {
  debug(`reading clipboard by type: ${type}`)
  const data = await command(bin, ['--output', type])
  return { mime, data }
}

async function status () {
  const buffer = await command(bin, ['--status'])
  return JSON.parse(buffer.toString())
}

exports.onChange = function (handler) {
  setInterval(async function () {
    const stat = await status()
    if (stat.count > lastCount) {
      lastCount = stat.count
      handler(await read(stat.types))
    }
  }, POLL_INTERVAL)
}
exports.write = async function ({ mime, data }) {
  const type = mime2PasteboardType[mime]
  if (!type) {
    console.error(`mime ${mime} not supported`)
    return
  }
  await command(bin, ['--input', type], data)
  lastCount++
}
