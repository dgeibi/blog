const Hexo = require('hexo')
const hexo = new Hexo(process.cwd(), {
  config: '_config.yml'
})

hexo.init().then(() => {
  console.log(hexo.theme.theme)
})
