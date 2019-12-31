const gulp = require('gulp');
const mkdirp = require('mkdirp');

// copy the files needed in the top-level directory
function build(callback) {
  mkdirp('dist/');
  mkdirp('dist/sounds');
  gulp.src('source/*.*').pipe(gulp.dest('dist/'));
  gulp.src('sounds/*.mp3').pipe(gulp.dest('dist/sounds/'));
  callback();
}
// watch for file changes and rebuild
function watch() {
  gulp.watch('source/*.*', build);
}

exports.build = build;
exports.watch = watch;
exports.default = build;
