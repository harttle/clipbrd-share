const { spawn } = require('child_process')

const target2mime = {
  'text/plain': 'text/plain',
  'image/png': 'image/png',
  STRING: 'text/plain',
  UTF8_STRING: 'text/plain',
  TEXT: 'text/plain'
}

exports.read = async function () {
  const availableTargets = await readTargets()
  for (const [target, mime] of Object.entries(target2mime)) {
    if (availableTargets.includes(target)) return readByMime(target, mime)
  }
  return { mime: 'text/plain', data: Buffer.alloc(0) }
}

exports.write = async function ({ mime, data }) {
  writeByMime(mime, data)
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

function command (cmd, args, stdin) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { encoding: 'buffer' })
    let data = Buffer.alloc(0)
    child.on('error', reject)
    child.stdout.on('data', chunk => {
      data = Buffer.concat([data, chunk])
    })
    child.stdout.on('end', () => resolve(data))
    if (stdin) {
      child.stdin.write(stdin)
      child.stdin.end()
    }
  })
}
