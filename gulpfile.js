var gulp = require('gulp'),
    child_process = require('child_process'),
    clc = require('cli-color'),
    generate

const error = clc.red.bold,
    notice = clc.blue

gulp.task('default', ['watch', 'build', 'serve'])

gulp.task('build', function () {
    if (generate) generate.kill()
    const clean = child_process.spawnSync('hexo', ['clean'])
    console.log(clean.stdout.toString())
    generate = child_process.spawn('hexo', ['generate', '--watch'])
    generate.stdout.on('data', data => {
        console.log(`${data}`)
    })
    generate.stderr.on('data', data => {
        console.log(error(`${data}`))
    })
})

gulp.task('watch', function () {
    gulp.watch('./themes/plain/source/css/**/*.scss', ['build'])
})

gulp.task('serve', function () {
    const server = child_process.spawn('firebase', ['serve'])

    server.stdout.on('data', data => {
        console.log(`${data}`)
    })

    server.stderr.on('data', data => {
        console.log(error(`${data}`))
    })

    server.on('close', code => {
        console.log(notice(`child process exited with code ${code}`))
    })
})