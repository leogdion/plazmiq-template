if (!global.Intl) {
  global.Intl = require('intl');
}

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var beautify = require('gulp-beautify');
var jshint = require('gulp-jshint');
var async = require('async');
var merge = require('merge-stream');
var jscs = require('gulp-jscs');
var bump = require('gulp-bump'),
    rename = require('gulp-rename'),
    glob = require('glob'),
    Handlebars = require('handlebars'),
    scss = require('gulp-sass'),
    browserify = require('browserify'),
    awspublish = require("gulp-awspublish"),
    htmlmin = require('gulp-htmlmin'),
    revall = require('gulp-rev-all'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    umd = require('gulp-umd'),
    awspublishRouter = require("gulp-awspublish-router");
var substituter = require('gulp-substituter');
var gulpFilter = require('gulp-filter');

HandlebarsIntl = require('handlebars-intl');

var revquire = require('./gulp/revquire');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var critical = require('critical');

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var insert = require('gulp-insert');

var metalsmith_build = require('./gulp/metalsmith');

var async = require('async'),
    rimraf = require('rimraf');

var awscredentials = revquire({
  "accessKeyId": "AWS_CREDENTIALS_KEY",
  "secretAccessKey": "AWS_CREDENTIALS_SECRET",
  "params": {
    "Bucket": "AWS_CREDENTIALS_BUCKET"
  }
}, __dirname + '/.credentials/aws.json');

gulp.task('clean', function (cb) {
  async.each(['.tmp', 'build'], rimraf, cb);
});

gulp.task('publish', ['production'], function () {
  var publisher = awspublish.create(awscredentials);
  return gulp.src("**/*", {
    cwd: "./build/production/"
  }).pipe(awspublishRouter({
    cache: {
      // cache for 5 minutes by default
      cacheTime: 300,
      gzip: true
    },

    routes: {
      "^(assets|js|css|fonts)/(.+)\.(js|css|svg|ttf)$": {
        // use gzip for assets that benefit from it
        // cache static assets for 2 years
        gzip: true,
        cacheTime: 630720000,
        headers: {
          //"Vary": "Accept-Encoding"
        }
      },
      "^assets/.+$": {
        // cache static assets for 2 years
        cacheTime: 630720000
      },

      // pass-through for anything that wasn't matched by routes above, to be uploaded with default options
      "^.+$": {
        key: "$&",
        gzip: true
      }
    }
  })).pipe(publisher.publish(undefined, {
    force: false
  })).pipe(publisher.sync()).pipe(awspublish.reporter());
});

gulp.task('handlebars', function () {
  HandlebarsIntl.registerWith(Handlebars);
  Handlebars.registerHelper('limit', function (collection, limit, start) {
    return collection.slice(start, limit + 1);
  });
  Handlebars.registerHelper('safe', function (contents) {
    return new Handlebars.SafeString(contents);
  });
  Handlebars.registerHelper('year', function (contents) {
    return contents.getFullYear();
  });
  Handlebars.registerHelper('year', function (contents) {
    return contents.getFullYear();
  });
  Handlebars.registerHelper('isoDate', function (contents) {
    return contents.toISOString();
  });
  Handlebars.registerHelper('strip', function (contents) {
    return contents.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ");
  });
});


gulp.task('templates', ['clean'], function () {
  gulp.src('static/templates/*.hbt').pipe(handlebars()).pipe(wrap('Handlebars.template(<%= contents %>)')).pipe(declare({
    root: "Templates"
    // Avoid duplicate declarations 
  })).pipe(concat('templates.js')).pipe(insert.prepend('var Handlebars = require(\'handlebars\'); var Templates = Templates || {};')).pipe(umd()).pipe(gulp.dest('.tmp/js/'));
});

gulp.task('umd', ['clean'], function () {
  return gulp.src('static/js/**/*.js').pipe(umd()).pipe(gulp.dest('./.tmp/js'));
});

gulp.task('browserify', ['clean', 'lint', 'umd', 'templates'], function () {
  var b = browserify({
    entries: './.tmp/js/main.js',
    debug: false
  });

  return b.bundle().pipe(source('main.js')).pipe(buffer()).pipe(gulp.dest('./.tmp/build/js/'));
/*
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
        */

});

gulp.task('scss', ['clean'], function () {
  var dest = gulp.dest('.tmp/build/css');
  var main = gulp.src('static/scss/*.scss').pipe(scss());

  var site = gulp.src('static/scss/*.scss').pipe(scss()).pipe(rename({
    basename: "site"
  }));

  return merge(main, site).pipe(dest);
});

gulp.task('assets', ['clean'], function () {
  return gulp.src('static/assets/**/*').pipe(gulp.dest('.tmp/build/assets'));
});

gulp.task('fonts', ['clean'], function () {
  return gulp.src('./node_modules/font-awesome/fonts/*.*').pipe(gulp.dest('.tmp/build/assets/fonts/font-awesome'));
});

gulp.task('static', ['metalsmith', 'browserify', 'assets', 'fonts', 'critical']);

gulp.task('metalsmith', ['handlebars', 'clean'], metalsmith_build({
  stage: "development"
}));

gulp.task('jscs', function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js'], {
    base: '.'
  }).pipe(jscs({
    fix: true
  })).pipe(gulp.dest('.'));
});

gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('bump', [], function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('beautify', ['jscs'], function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2
  })).pipe(gulp.dest('.'));
});

gulp.task('development', ['static'], function () {
  var filter = gulpFilter('**/*.html', {
    restore: true
  });

  return gulp.src('.tmp/build/**/*').pipe(filter).pipe(substituter({
    configuration: JSON.stringify({
      "server": "http://localhost:5000",
      "debug": true
    })
  })).pipe(filter.restore).pipe(gulp.dest('build/development'));
});

gulp.task('production', ['minify', 'production-assets'], function () {
  var revAll = new revall({
    dontRenameFile: ['.html', '.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    debug: false
  });
  return gulp.src('.tmp/production/**/*').pipe(substituter({
    configuration: JSON.stringify({
      "server": "http://mysterious-oasis-7692.herokuapp.com"
    })
  })).pipe(revAll.revision()).pipe(gulp.dest('./build/production'));
});

gulp.task('production-assets', ['static'], function () {
  return gulp.src('.tmp/build/assets/**/*').pipe(gulp.dest('./build/production/assets'));
});

gulp.task('minify', ['htmlmin', 'uglify-js', 'uglify-css']);

gulp.task('htmlmin', ['static'], function () {
  return gulp.src('.tmp/build/**/*.html').pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true
  })).pipe(gulp.dest('.tmp/production'));
});

gulp.task('uglify-js', ['static'], function () {
  return gulp.src('.tmp/build/**/*.js').pipe(uglify({
    mangle: false,
    compress: false
  })).pipe(gulp.dest('.tmp/production'));

});

gulp.task('critical', ['scss', 'metalsmith'], function (cb) {
  critical.generateInline({
    base: '.tmp/build',
    src: 'index.html',
    styleTarget: '.tmp/build/css/site.css',
    htmlTarget: '.tmp/build/index.html',
    width: 320,
    height: 480,
    minify: false
  }, cb);
});

gulp.task('uglify-css', ['static'], function () {
  return gulp.src('.tmp/build/**/*.css').pipe(uglifycss()).pipe(gulp.dest('.tmp/production'));
});

gulp.task('heroku:production', ['publish', 'test', 'submodules']);

gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('build', ['submodules', 'production', 'test']);

gulp.task('default', ['submodules', 'bump', 'production', 'development', 'test']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});