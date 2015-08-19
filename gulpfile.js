if (!global.Intl) {
  global.Intl = require('intl');
}

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var beautify = require('gulp-beautify');
var jshint = require('gulp-jshint');
var async = require('async');
var bump = require('gulp-bump'),
    glob = require('glob'),
    Handlebars = require('handlebars'),
    scss = require('gulp-scss'),
    HandlebarsIntl = require('handlebars-intl');

var markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    metalsmith = require('metalsmith');

var async = require('async'),
    rimraf = require('rimraf');
gulp.task('clean', function (cb) {
  async.each(['.tmp'], rimraf, cb);
});

gulp.task('handlebars', function (cb) {
  HandlebarsIntl.registerWith(Handlebars);
  glob("./static/templates/partials/*.hbt", function (er, files) {
    async.each(files, function (file, asynccb) {
      fs.readFile(file, function (error, content) {
        Handlebars.registerPartial(path.basename(file, '.hbt'), content.toString());
        asynccb(error);
      });
    }, function (error) {
      Handlebars.registerHelper('limit', function (collection, limit, start) {
        return collection.slice(start, limit + 1);
      });
      Handlebars.registerHelper('safe', function (contents) {
        return new Handlebars.SafeString(contents);
      });
      Handlebars.registerHelper('year', function (contents) {
        return contents.getFullYear();
      });
      cb(error);
    });
  });
});

gulp.task('scss', ['clean'], function () {
  return gulp.src('static/scss/**/*.scss').pipe(scss()).pipe(gulp.dest('.tmp/build/css'));
});

gulp.task('metalsmith', ['handlebars', 'clean'], function (cb) {

  metalsmith("./static") // defaults to process.cwd() if no dir supplied
  // You can initialize the metalsmith instance with metadata
  //.metadata({site_name: "My Site"})
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: '*.md'
    }
  })).use(markdown()).use(layouts({
    engine: "handlebars",
    partials: 'partials'
  })).destination("../.tmp/build")
  // and .use() as many Metalsmith plugins as you like 
  //.use(permalinks('posts/:title'))
  .build(cb);
});


gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./*.js', 'static/js/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('bump', [], function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('beautify', function () {
  return gulp.src(['./app/**/*.js', 'gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2
  })).pipe(gulp.dest('.'));
});

gulp.task('heroku:production', ['submodules']);

gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('default', ['submodules', 'lint', 'bump', 'metalsmith', 'scss']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});