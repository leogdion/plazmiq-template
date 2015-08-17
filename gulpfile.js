var gulp = require('gulp');

gulp.task('test', function() {
  // place code for your default task here
});

gulp.task('default', ['submodules']);

gulp.task('submodules', function () {
	return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});