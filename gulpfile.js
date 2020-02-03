const { src, dest, parallel, series, watch } = require('gulp');
const mkdirp = require('mkdirp');
const workboxBuild = require('workbox-build');

function dir(callback) {
  mkdirp('dist/');
  mkdirp('dist/sounds');
  mkdirp('dist/icons');
  callback();
}
const source = () => src('source/*.*').pipe(dest('dist/'));
const sounds = () => src('sounds/*.*').pipe(dest('dist/sounds/'));
const icons = () => src('icons/*.*').pipe(dest('dist/icons/'));
const files = series(dir, parallel(source, sounds, icons));

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
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
}

exports.build = build;
exports.watch = watchFiles;
exports.default = build;
