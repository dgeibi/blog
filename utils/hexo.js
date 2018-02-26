const Hexo = require('hexo')

module.exports = function init(
  cmd,
  args = {},
  cwd = process.cwd(),
  initopts = {}
) {
  const hexo = new Hexo(cwd, initopts)
  return hexo
    .init()
    .then(() => hexo.call(cmd, args))
    .then(() => hexo.exit())
    .catch(err => hexo.exit(err))
}
