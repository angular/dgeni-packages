var argv = require('yargs')
  .default('port', 4000)
  .argv;
var del = require('del');
var Dgeni = require('dgeni');

// Gulp dependencies
var gulp = require('gulp');
var $g = require('gulp-load-plugins')();

////////////

var config = {
  paths: {
    clean: '../.tmp',
    dist: {
      docs: '../.tmp/docs',
      css: '../.tmp/docs/css',
      js: '../.tmp/docs/js'
    },
    js: ['src/js/**/*.js'],
    less: {
      src: 'src/less/main.less',
      watch: ['src/less/**/*.less']
    },
    docs: {
      config: './config',
      watch: '**',
      assets: 'assets/**'
    }
  }
};

gulp.task('clean', function (cb) {
  del(config.paths.clean, cb);
});

gulp.task('js',  function () {
  var js = gulp.src(config.paths.js)
    .pipe($g.plumber())
    .pipe($g.cached('js'))
    .pipe($g.jshint())
    .pipe($g.jscs())
    .on('error', function () {})
    .pipe($g.jscsStylish.combineWithHintResults())
    .pipe($g.jshint.reporter('jshint-stylish'))
    .pipe($g.ngAnnotate())
    .pipe(gulp.dest(config.paths.dist.js))
    .pipe($g.connect.reload());
});

gulp.task('less', function () {
  // Process the less files
  return gulp.src(config.paths.less.src)
    .pipe($g.cached('less'))
    .pipe($g.progeny())
    .pipe($g.less())
    .pipe(
      gulp.dest(config.paths.dist.css)
    )
    .pipe($g.minifyCss())
    .pipe($g.rename('main.min.css'))
    .pipe(
      gulp.dest(config.paths.dist.css)
    )
    .pipe($g.connect.reload());
});

gulp.task('dgeni', function () {
  // Copy asset files straight over
  gulp.src(config.paths.docs.assets, { base: 'docs/assets' })
    .pipe(gulp.dest(config.paths.dist.docs))
    .pipe($g.connect.reload());

  var dgeni = new Dgeni([require(config.paths.docs.config)]);
  dgeni.generate()
    .then(
      $g.connect.reload,
      function (err) {
        return console.log('error', err);
      });
});

gulp.task('watch', ['dgeni', 'less', 'js'], function (done) {
  gulp.watch(config.paths.js, ['js', 'dgeni']);
  gulp.watch(config.paths.docs.watch, ['dgeni']);
  gulp.watch(config.paths.less.watch, ['less']);

  // Fire up connect server
  return $g.connect.server({
    root: [config.paths.dist.docs, '..'],
    port: argv.port,
    livereload: true
  });
});
