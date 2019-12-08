#!/usr/bin/env node

const conf = require('../src/config')
const server = require('../src/server')

const port = process.env.PORT || conf.get('port') || 3000
const host = process.env.HOST || conf.get('host') || '0.0.0.0'

conf.set('port', port)
conf.set('host', host)

server.listen(port, host)
