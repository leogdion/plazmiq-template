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
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    awspublish = require("gulp-awspublish"),
    htmlmin = require('gulp-htmlmin'),
    revall = require('gulp-rev-all'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    awspublishRouter = require("gulp-awspublish-router");

HandlebarsIntl = require('handlebars-intl');

var revquire = require('./gulp/revquire');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

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
/*
  glob("./static/partials/*.hbt", function (er, files) {
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
      Handlebars.registerHelper('year', function (contents) {
        return contents.getFullYear();
      });
      Handlebars.registerHelper('isoDate', function (contents) {
        return contents.toISOString();
      });
      Handlebars.registerHelper('strip', function (contents) {
        return contents.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ");
      });
      cb(error);
    });
  });
  */
});

gulp.task('browserify', ['clean', 'lint'], function () {
  var b = browserify({
    entries: './static/js/main.js',
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
  return gulp.src('static/scss/**/*.scss').pipe(sass()).pipe(gulp.dest('.tmp/build/css'));
});

gulp.task('assets', ['clean'], function () {
  return gulp.src('static/assets/**/*').pipe(gulp.dest('.tmp/build/assets'));
});

gulp.task('static', ['metalsmith', 'browserify', 'assets', 'scss']);

gulp.task('metalsmith', ['handlebars', 'clean'], metalsmith_build({
  stage: "development"
}));


gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('bump', [], function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('beautify', function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2
  })).pipe(gulp.dest('.'));
});

gulp.task('development', ['static'], function () {
  return gulp.src('.tmp/build/**/*').pipe(gulp.dest('build/development'));
});

gulp.task('production', ['minify', 'production-assets'], function () {
  var revAll = new revall({
    dontRenameFile: ['.html', '.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    debug: true
  });
  return gulp.src('.tmp/production/**/*').pipe(revAll.revision()).pipe(gulp.dest('./build/production'));
});

gulp.task('production-assets', ['assets'], function () {
  return gulp.src('.tmp/build/assets/**/*').pipe(gulp.dest('./build/production/assets'));
});

gulp.task('minify', ['htmlmin', 'uglify-js', 'uglify-css']);

gulp.task('htmlmin', ['metalsmith'], function () {
  return gulp.src('.tmp/build/**/*.html').pipe(htmlmin({
    collapseWhitespace: true
  })).pipe(gulp.dest('.tmp/production'));
});

gulp.task('uglify-js', ['browserify'], function () {
  return gulp.src('.tmp/build/**/*.js').pipe(uglify({
    mangle: false,
    compress: false
  })).pipe(gulp.dest('.tmp/production'));

});

gulp.task('uglify-css', ['scss'], function () {
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