if (!global.Intl) {
  global.Intl = require('intl');
}

var gulp = require('gulp'),
    bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
    beautify = require('gulp-beautify'),
    sass = require('gulp-sass'),
    es = require('event-stream'),
    async = require('async'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    gulpsmith = require('gulpsmith'),
    Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    excerpts = require('metalsmith-excerpts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    async = require('async'),
    path = require('path'),
    glob = require('glob'),
    HandlebarsIntl = require('handlebars-intl'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign'),
    revall = require('gulp-rev-all');

gulp.task('default', ['rev']);

gulp.task('build', ['clean', 'browserify', 'sass', 'copy', 'lint', 'metalsmith', 'bump']);

gulp.task('clean', function (cb) {
  async.each(['public', '.tmp', '.coverdata'], rimraf, cb);
});

gulp.task('rev', ['build'], function () {
  return gulp.src('.tmp/build/**').pipe(revall({
    ignore: ['.html']
  })).pipe(gulp.dest('./public'));
});

gulp.task('handlebars', function (cb) {
  HandlebarsIntl.registerWith(Handlebars);
  glob("./static/templates/partials/*.html", function (er, files) {
    async.each(files, function (file, asynccb) {
      fs.readFile(file, function (error, content) {
        Handlebars.registerPartial(path.basename(file, '.html'), content.toString());
        asynccb(error);
      });
    }, function (error) {
      Handlebars.registerHelper('safe', function (contents) {
        return new Handlebars.SafeString(contents);
      });
      cb(error);
    });
  });
});

gulp.task('metalsmith', ['clean', 'handlebars'], function () {
  return gulp.src('./static/html/**/*').pipe(gulp_front_matter()).on("data", function (file) {
    assign(file, file.frontMatter);
    delete file.frontMatter;
  }).pipe(
  gulpsmith().use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  })).use(markdown()).use(excerpts()).use(permalinks()).use(templates({
    engine: 'handlebars',
    directory: 'static/templates'
  }))).pipe(gulp.dest("./.tmp/build"));
});

gulp.task('copy', ['clean'], function () {
  return es.merge(
  gulp.src('static/fonts/**/*.*').pipe(gulp.dest('.tmp/build/fonts')), gulp.src('static/images/**/*.*').pipe(gulp.dest('.tmp/build/images')));
});

gulp.task('sass', ['clean'], function () {
  return gulp.src('static/scss/**/*.scss').pipe(sass()).pipe(gulp.dest('.tmp/build/css'));
});

gulp.task('browserify', function () {
  var browserified = transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./static/js/main.js']).pipe(browserified)
  //.pipe(uglify())
  .pipe(gulp.dest('./.tmp/build/js'));
});

gulp.task('bump', function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./gulpfile.js', 'static/js/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('beautify', function () {
  return gulp.src(['./gulpfile.js', 'static/js/**/*.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
});