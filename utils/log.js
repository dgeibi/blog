const clc = require('cli-color')

const err = clc.red.bold
const note = clc.blue

/* eslint-disable no-console */

exports.err = (...arg) => console.log(err(arg))
exports.log = (...arg) => console.log(arg)
exports.note = (...arg) => console.log(note(arg))
