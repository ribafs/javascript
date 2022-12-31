var program = require('commander');
var browserify = require('browserify');
var express = require('express');
var path = require('path');
var rimraf = require('rimraf');

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var buffer = require('gulp-buffer');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var webp = require('gulp-webp');
var micro = require('gulp-micro');
var size = require('gulp-size');
var terser = require('gulp-terser');
var zip = require('gulp-zip');
var advzip = require('gulp-advzip');
var source = require('vinyl-source-stream');

program.on('--help', function(){
  console.log('  Tasks:');
  console.log();
  console.log('    build       build the game');
  console.log('    clean       delete generated files');
  console.log('    dist        generate archive');
  console.log('    serve       launch development server');
  console.log('    watch       watch for file changes and rebuild automatically');
  console.log();
});

program
  .usage('<task> [options]')
  .option('-P, --prod', 'generate production assets')
  .parse(process.argv);

//var prod = !!program.prod;
var prod = true;

gulp.task('build_source', function() {
  console.log('is prod: ', prod);
    return gulp.src('src/g.js')
        .pipe(gulpif(prod, terser({
          toplevel: true,
          mangle: {
            toplevel: true
          },
          compress: {
            arguments: true,
            drop_console: true
          }
        })))
        .pipe(gulp.dest('build'));
});

gulp.task('build_index', function() {
    return gulp.src('src/index.html')
        .pipe(gulpif(prod, htmlmin({
        })))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function(done) {
  rimraf.sync('build');
  rimraf.sync('dist');
  done();
});

//compress all images
gulp.task('optimize_images', function() {
  return gulp.src(['src/**/*.{gif,png,jpg}'])
      .pipe(webp({
        alphaQuality: 0,
        lossless: true,
        method: 6
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', gulp.series('build_source'));
  gulp.watch('src/**/*.{gif,png,jpg}', gulp.series('optimize_images'))
  gulp.watch('src/index.html', gulp.series('build_index'));
});

function browserifyError(err) {
  gutil.log(gutil.colors.red('ERROR'), gutil.colors.gray(err.message));
  this.emit('end');
}

gulp.task('build', gulp.series('clean', 'build_source', 'build_index', 'optimize_images'));

gulp.task('dist', function() {
    return gulp.src('build/**/*')
      .pipe(zip('archive.zip'))
      .pipe(advzip({
        optimizationLevel: 4,
        iterations: 10
      }))
      .pipe(size())
      .pipe(micro({limit: 13 * 1024}))
      .pipe(gulp.dest('dist'));
});

gulp.task('start_server', function() {
    var htdocs = path.resolve(__dirname, 'build');
    var app = express();
    
    app.use(express.static(htdocs));
    app.listen(3000, function() {
        gutil.log("Server started on '" + gutil.colors.green('http://localhost:3000') + "'");
    });
});
gulp.task('serve', gulp.series('build', 'dist', gulp.parallel('watch', 'start_server') ) );
