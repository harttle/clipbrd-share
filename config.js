const { resolve } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs-extra')
const { homedir } = require('os')
const confFile = resolve(homedir(), '.clipboard-sharerc')

exports.get = function (field) {
  let conf = {}
  if (existsSync(confFile)) {
    const content = readFileSync(confFile) || '{}'
    conf = JSON.parse(content)
  }
  return field ? conf[field] : conf
}

exports.set = function (field, val) {
  const conf = exports.get()
  conf[field] = val
  writeFileSync(confFile, JSON.stringify(conf))
}
