const gulp = require('gulp'),
  child_process = require('child_process'),
  clc = require('cli-color'),
  liveServer = require("live-server"),
  sass = require('gulp-sass'),
  themeSrc = './themes/plain/source',
  sassFiles = `${themeSrc}/css/**/*.scss`,
  err = clc.red.bold,
  notice = clc.blue

gulp.task('default', ['sass', 'watch', 'build:watch', 'serve'])

gulp.task('build:watch', function () {
  shell('hexo generate --watch')
})

gulp.task('watch', function () {
  gulp.watch(sassFiles, ['sass'])
})

gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
})

gulp.task('serve', function () {
  const params = {
    port: 4000,
    root: "public",
    logLevel: 2,
  }
  liveServer.start(params)
})

gulp.task('generate', function () {
  shellSync(`hexo clean && hexo g`)
})

gulp.task('deploy', ['generate'], function () {
  shell(`firebase deploy --only hosting`)
})

gulp.task('push', function () {
  shellSync("git add -A && git commit -m \"update at `date`\" && git push")
})

function shell(cmd = '') {
  const proc = child_process.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(notice(`${error}`))
      return
    }
    console.log(`${stdout}`)
    console.log(err(`${stderr}`))
  })
  return proc
}

function shellSync(cmd = '') {
  try {
    console.log(child_process.execSync(cmd).toString())
  } catch (e) {
    console.log(err(e.stderr.toString()))
  }
}
