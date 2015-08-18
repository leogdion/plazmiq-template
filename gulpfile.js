var gulp = require('gulp');
var beautify = require('gulp-beautify');
var jshint = require('gulp-jshint');
var bump = require('gulp-bump');

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

gulp.task('default', ['submodules', 'lint', 'bump']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});