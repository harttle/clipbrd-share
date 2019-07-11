#!/usr/bin/env node

const conf = require('../src/config')
const server = require('../src/server')

let port
if (process.env.PORT) {
  port = process.env.PORT
  conf.set('port', port)
} else {
  console.log('PORT env not set, trying ~/.clipboard-sharerc:port')
  port = conf.get('port')
}
if (!port) {
  port = 3000
}

server.listen(port)
