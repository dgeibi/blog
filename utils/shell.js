const { exec, execSync } = require('child_process')

const { err, log } = require('./log')

exports.shell = function shell(cmd = '', callback) {
  const proc = exec(cmd, (error, stdout, stderr) => {
    if (typeof callback === 'function') callback(error)
    if (error) {
      err(`${error}`)
      return
    }
    log(`${stdout}`)
    err(`${stderr}`)
  })
  return proc
}

exports.shellSync = function shellSync(cmd = '') {
  try {
    log(execSync(cmd).toString())
  } catch (e) {
    err(e.stderr.toString())
  }
}
