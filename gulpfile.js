const gulp = require('gulp')
const liveServer = require('live-server')
const sass = require('gulp-sass')
const shell = require('./shell').shell
const shellSync = require('./shell').shellSync

const themeSrc = './themes/plain/source'
const sassFiles = `${themeSrc}/css/**/*.scss`

gulp.task('default', [
  'sass',
  'watch',
  'build:watch',
  'serve',
])

gulp.task('build:watch', () => {
  shell('hexo generate --watch')
})

gulp.task('watch', () => {
  gulp.watch(sassFiles, ['sass'])
})

gulp.task('sass', () =>
  gulp.src(sassFiles)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
)

gulp.task('serve', () => {
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

gulp.task('deploy', ['generate'], () => {
  shell('firebase deploy --only hosting')
})

gulp.task('push', () => {
  shellSync('git add -A && git commit -m "update at `date`" && git push')
})
