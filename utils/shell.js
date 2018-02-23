const { exec, execSync } = require('child_process')
const spawn = require('cross-spawn')

exports.shell = function shell(cmd = '', callback) {
  const proc = exec(cmd, error => {
    if (typeof callback === 'function') callback(error)
  })
  proc.stderr.pipe(process.stderr)
  proc.stdout.pipe(process.stdout)
  return proc
}

exports.shellSync = function shellSync(cmd = '') {
  execSync(cmd, { stdio: 'inherit' })
}

exports.run = function run(cmd, opts) {
  cmd = cmd.trim()
  const [command, ...args] = cmd.split(/\s+/)
  const cp = spawn(command, args, { stdio: 'inherit', ...opts })
  let done = false
  return new Promise((resolve, reject) => {
    cp.once('error', error => {
      if (done) return
      reject(error)
      done = true
    })
    cp.once('close', code => {
      if (done) return
      if (code === 0) resolve()
      else {
        reject(Error(`"${cmd}" exit code is ${code}`))
      }
      done = true
    })
  })
}
