const { src, dest, series, watch } = require('gulp');
const mkdirp = require('mkdirp');
const workboxBuild = require('workbox-build');

// copy the files needed in the top-level directory
function files(callback) {
  mkdirp('dist/');
  mkdirp('dist/sounds');
  mkdirp('dist/icons');
  Promise.all([
    src('source/app.js').pipe(dest('dist/')),
    src('source/*.html').pipe(dest('dist/')),
    src('source/*.json').pipe(dest('dist/')),
    src('source/*.css').pipe(dest('dist/')),
    src('sounds/*.*').pipe(dest('dist/sounds/')),
    src('icons/*.png').pipe(dest('dist/icons/'))
  ]).then(() => {
    callback();
  });
}

// build including service worker
const build = series(files, buildServiceWorker);

// watch for file changes and rebuild
function watchFiles() {
  watch('source/*.*', build);
}

function buildServiceWorker() {
  return workboxBuild
    .injectManifest({
      globDirectory: 'dist/',
      globPatterns: ['**/*.{js,html,json,mp3,css}'],
      swSrc: 'source/sw.js',
      swDest: 'dist/sw.js'
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
}

exports.build = build;
exports.watch = watchFiles;
exports.default = build;
