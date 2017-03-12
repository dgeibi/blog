/* eslint-disable no-console */

const childProcess = require('child_process')
const clc = require('cli-color')

const err = clc.red.bold
const notice = clc.blue

exports.shell = function shell(cmd = '') {
  const proc = childProcess.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(notice(`${error}`))
      return
    }
    console.log(`${stdout}`)
    console.log(err(`${stderr}`))
  })
  return proc
}

exports.shellSync = function shellSync(cmd = '') {
  try {
    console.log(childProcess.execSync(cmd).toString())
  } catch (e) {
    console.log(err(e.stderr.toString()))
  }
}
