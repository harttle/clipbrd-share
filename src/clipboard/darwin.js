const clipboardy = require('clipboardy')
const { spawn } = require('child_process')
const { resolve } = require('path')

exports.read = async function () {
  const text = await clipboardy.read()
  if (text.length) {
    return { mime: 'text/plain', data: Buffer.from(text) }
  } else {
    const img = await readImageFromClipboard()
    return { mime: 'image/png', data: img }
  }
}

exports.write = async function ({ mime, data }) {
  if (mime === 'text/plain') {
    clipboardy.write(data.toString())
  } else if (mime === 'image/png') {
    writeImageToClipboard(data)
  }
}

function writeImageToClipboard (img) {
  const bin = resolve(__dirname, '../../bin/pngcopy')
  return new Promise((resolve, reject) => {
    const child = spawn(bin, ['-'], { encoding: 'buffer' })
    child.on('error', reject)
    child.stdin.write(img)
    child.stdin.end()
  })
}

function readImageFromClipboard () {
  const bin = resolve(__dirname, '../../bin/pngpaste')
  return new Promise((resolve, reject) => {
    const child = spawn(bin, ['-'], { encoding: 'buffer' })
    let data = Buffer.alloc(0)
    child.on('error', reject)
    child.stdout.on('data', chunk => { data = Buffer.concat([data, chunk]) })
    child.stdout.on('end', () => resolve(data))
  })
}
