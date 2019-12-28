const { spawn } = require('child_process')
const debug = require('debug')('clipbrd-share:util')
let cid = 0

exports.command = function (cmd, args, stdin) {
  const id = `command[${cid++}]`
  debug(id, `${cmd} ${args.join(' ')}`)
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { encoding: 'buffer' })
    let data = Buffer.alloc(0)
    let alive = true
    child.stdout.on('data', chunk => {
      data = Buffer.concat([data, chunk])
    })
    if (stdin) {
      child.stdin.write(stdin)
    }
    child.stdin.end()
    child.on('exit', () => {
      debug(id, 'exit')
      alive = false
    })
    setTimeout(() => {
      if (!alive) return
      debug(id, 'still alive, killing')
      child.kill('SIGTERM')
    }, 3000)
    child.stdout.on('end', () => resolve(data))
    child.on('error', reject)
  })
}
