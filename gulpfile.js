var gulp = require('gulp');
var beautify = require('gulp-beautify');

gulp.task('beautify', function () {
  gulp.src(['./app/**/*.js', 'gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2
  })).pipe(gulp.dest('.'))
});
gulp.task('heroku:production', ['submodules', 'beautify']);
gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('default', ['submodules', 'beautify']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});