const gulp = require('gulp');
const liveServer = require('live-server');

const { shell, shellSync } = require('./utils/shell');

gulp.task('default', [
  'hexo:watch',
  'serve',
]);

gulp.task('hexo:watch', () => {
  shell('hexo generate --watch');
});

gulp.task('serve', ['hexo:watch'], () => {
  const params = {
    port: 4000,
    root: 'public',
    logLevel: 2,
  };
  liveServer.start(params);
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
