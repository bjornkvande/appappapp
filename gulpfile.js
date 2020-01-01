const gulp = require('gulp');
const mkdirp = require('mkdirp');
const workboxBuild = require('workbox-build');

// copy the files needed in the top-level directory
function build(callback) {
  mkdirp('dist/');
  mkdirp('dist/sounds');
  mkdirp('dist/icons');
  gulp.src('source/app.js').pipe(gulp.dest('dist/'));
  gulp.src('source/*.html').pipe(gulp.dest('dist/'));
  gulp.src('source/*.json').pipe(gulp.dest('dist/'));
  gulp.src('source/*.css').pipe(gulp.dest('dist/'));
  gulp.src('sounds/*.*').pipe(gulp.dest('dist/sounds/'));
  gulp.src('icons/*.png').pipe(gulp.dest('dist/icons/'));
  buildServiceWorker();
  callback();
}
// watch for file changes and rebuild
function watch() {
  gulp.watch('source/*.*', build);
}

function buildServiceWorker() {
  return workboxBuild
    .injectManifest({
      globDirectory: 'dist/',
      globPatterns: ['**/*.{js,html,json,m4a,mp3,css}'],
      swDest: 'dist/sw.js',
      swSrc: 'source/sw.js'
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
}

exports.build = build;
exports.watch = watch;
exports.default = build;
