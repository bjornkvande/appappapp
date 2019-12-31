const gulp = require('gulp');
const mkdirp = require('mkdirp');

// copy the files needed in the top-level directory
function build(callback) {
  mkdirp('dist/');
  gulp.src('source/*.html').pipe(gulp.dest('dist/'));
  gulp.src('source/*.js').pipe(gulp.dest('dist/'));
  callback();
}
// watch for file changes and rebuild
function watch() {
  gulp.watch('source/*.*', build);
}

exports.build = build;
exports.watch = watch;
exports.default = build;
