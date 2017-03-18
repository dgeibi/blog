const gulp = require('gulp')
const liveServer = require('live-server')
const sass = require('gulp-sass')

const { shell, shellSync } = require('./utils/shell')

const themeSrc = './themes/plain/source'
const sassFiles = `${themeSrc}/css/**/*.scss`

gulp.task('default', [
  'sass:watch',
  'hexo:watch',
  'serve',
])

gulp.task('hexo:watch', () => {
  shell('hexo generate --watch')
})

gulp.task('sass:watch', ['sass'], () => {
  gulp.watch(sassFiles, ['sass'])
})

gulp.task('sass', () =>
  gulp.src(sassFiles)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
)

gulp.task('serve', ['sass:watch', 'hexo:watch'], () => {
  const params = {
    port: 4000,
    root: 'public',
    logLevel: 2,
  }
  liveServer.start(params)
})

gulp.task('generate', () => {
  shellSync('hexo clean && hexo g')
})

gulp.task('deploy', ['generate'], (callback) => {
  shell('firebase deploy', callback)
})

gulp.task('push', () => {
  shellSync('git add -A && git commit -m "update at `date`" && git push')
})
