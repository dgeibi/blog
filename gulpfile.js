const gulp = require('gulp');
const liveServer = require('live-server');
const path = require('path');

const { shell, shellSync } = require('./utils/shell');

gulp.task('default', ['serve']);

gulp.task('serve', ['theme:watch', 'hexo:watch'], () => {
  liveServer.start({
    port: 4000,
    root: 'public',
    logLevel: 2,
  });
});

gulp.task('generate', () => {
  shellSync('hexo clean && hexo g');
});

gulp.task('deploy', ['generate'], (callback) => {
  shell('firebase deploy', callback);
});

gulp.task('push', () => {
  shellSync('git add -A && git commit -m "update at `date`" && git push');
});

gulp.task('theme:watch', () => {
  shell(`cd themes/plain && npm run watch -- --env.dir=${path.resolve(__dirname, 'public/js')}`);
});

gulp.task('hexo:watch', () => {
  shell('hexo g --watch');
});
