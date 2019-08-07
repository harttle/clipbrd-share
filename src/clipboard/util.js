const { spawn } = require('child_process')

exports.command = function (cmd, args, stdin) {
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
