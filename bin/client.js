#!/usr/bin/env node

const conf = require('../src/config')
const client = require('../src/client')
const platform = require('os').platform()

const impl = {
  darwin: require('../src/clipboard/darwin'),
  linux: require('../src/clipboard/linux')
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

client.connect(URL, impl)
