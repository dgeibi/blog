const gulp = require('gulp')
const liveServer = require('live-server')
const path = require('path')
const hexo = require('./utils/hexo')

const { shellSync, run } = require('./utils/shell')

const errorlogger = error => {
  console.log(error)
}

const buildHexo = () => hexo('generate')

const buildProdTheme = () =>
  run(`npm run -s build`, {
    cwd: path.join(__dirname, 'themes/plain'),
  })

const buildDevTheme = dir =>
  run(`npm run -s build -- --env.dev ${dir ? `--env.dir=${dir}` : ''}`, {
    cwd: path.join(__dirname, 'themes/plain'),
  })

const watch = async () => {
  await buildDevTheme()
  await buildHexo()

  const devAssetsOutputPath = path.join(__dirname, 'public/assets')
  const watcher = gulp.watch([
    `source/**/*`,
    `themes/plain/layout/**/*`,
    `themes/plain/languages/**/*`,
    `themes/plain/src/**/*`,
    `**/_config.yml`,
    `**/webpack.config.js`,
    `themes/plain/**/.babelrc`,
  ])
  const handler = p => {
    console.log(`${p} changed`)
    if (
      matchPath(p, [
        'source',
        'themes/plain/layout',
        'themes/plain/languages',
      ]) ||
      p.endsWith('_config.yml')
    ) {
      buildHexo().catch(errorlogger)
    } else if (
      matchPath(p, 'themes/plain/src') ||
      p.endsWith('.babelrc') ||
      p.endsWith('webpack.config.js')
    ) {
      buildDevTheme(devAssetsOutputPath).catch(errorlogger)
    } else {
      console.log('but nothing to do')
    }
  }
  watcher.on('change', handler)
  watcher.on('add', handler)
}

const listen = () => {
  liveServer.start({
    port: 4000,
    root: 'public',
    logLevel: 2,
  })
}

const serve = () => watch().then(listen)

const generate = async () => {
  await hexo('clean')
  await buildProdTheme()
  await buildHexo()
}

const deploy = () => run('firebase deploy')

const push = () => {
  shellSync('git add -A && git commit -m "update at `date`" && git push')
}

gulp.task('serve', serve)
gulp.task('generate', generate)
gulp.task('deploy', gulp.series(generate, deploy))
gulp.task('push', push)
gulp.task('serve:prod', gulp.series(generate, listen))

function matchPath(a, b) {
  if (typeof b === 'string')
    return path.normalize(a).startsWith(path.normalize(b))
  else if (Array.isArray(b)) {
    const na = path.normalize(a)
    return b.some(x => na.startsWith(path.normalize(x)))
  }
  return false
}
