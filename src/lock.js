const debug = require('debug')('clipbrd-share:lock')

class Lock {
  constructor () {
    this.queue = []
    this.running = false
  }

  async acquire () {
    debug('acquiring, queue length:', this.queue.length)
    return new Promise((resolve, reject) => {
      this.queue.push(resolve)
      if (this.queue.length === 1) {
        this.queue[0]()
      }
    })
  }

  release () {
    debug('releasing, queue length:', this.queue.length)
    this.queue.shift()
    if (this.queue.length) {
      this.queue[0]()
    }
  }
}

exports.Lock = Lock
