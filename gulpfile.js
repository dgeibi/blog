const gulp = require('gulp')
const liveServer = require('live-server')
const path = require('path')

const { shellSync, run } = require('./utils/shell')

const errorlogger = error => {
  console.log(error)
}

const buildHexo = () => run('hexo g')

const buildTheme = () =>
  run(`npm run -s build -- --env.dir=${path.resolve(__dirname, 'public/js')}`, {
    cwd: path.join(__dirname, 'themes/plain'),
  })

const watch = () =>
  buildHexo().then(() => {
    const watcher = gulp.watch([
      `source/**/*`,
      `themes/plain/layout/**/*`,
      `themes/plain/src/**/*`,
      `**/_config.yml`,
      `themes/plain/**/.babelrc`,
    ])
    const handler = p => {
      console.log(`${p} changed`)
      if (
        matchPath(p, ['source', 'themes/plain/layout']) ||
        p.endsWith('_config.yml')
      ) {
        buildHexo().catch(errorlogger)
      } else if (matchPath(p, 'themes/plain/src') || p.endsWith('.babelrc')) {
        buildTheme().catch(errorlogger)
      } else {
        console.log('but nothing to do')
      }
    }
    watcher.on('change', handler)
    watcher.on('add', handler)
  })

const serve = () =>
  watch().then(() => {
    liveServer.start({
      port: 4000,
      root: 'public',
      logLevel: 2,
    })
  })

const generate = async () => {
  await run('hexo clean')
  await run('hexo g')
}

const deploy = () => run('firebase deploy')

const push = () => {
  shellSync('git add -A && git commit -m "update at `date`" && git push')
}

gulp.task('serve', serve)
gulp.task('generate', generate)
gulp.task('deploy', gulp.series(generate, deploy))
gulp.task('push', push)

function matchPath(a, b) {
  if (typeof b === 'string')
    return path.normalize(a).startsWith(path.normalize(b))
  else if (Array.isArray(b)) {
    const na = path.normalize(a)
    return b.some(x => na.startsWith(path.normalize(x)))
  }
  return false
}
