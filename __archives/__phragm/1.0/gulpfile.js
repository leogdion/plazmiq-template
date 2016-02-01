if (!global.Intl) {
  global.Intl = require('intl');
}

<<<<<<< HEAD:gulpfile.js
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
    scss = require('gulp-scss'),
    browserify = require('browserify'),
    awspublish = require("gulp-awspublish"),
    htmlmin = require('gulp-htmlmin'),
=======
var revquire = require('./revquire');

var fs = require('fs'),
    path = require('path');

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
    beautify = require('gulp-beautify'),
    encrypt = require("gulp-simplecrypt").encrypt,
    decrypt = require("gulp-simplecrypt").decrypt,
    istanbul = require("gulp-istanbul"),
    coveralls = require('gulp-coveralls'),
    sass = require('gulp-sass'),
    cover = require("gulp-coverage"),
>>>>>>> phragm:__phragm/1.0/gulpfile.js
    revall = require('gulp-rev-all'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    awspublishRouter = require("gulp-awspublish-router");
<<<<<<< HEAD:gulpfile.js
=======

var gulpsmith = require('gulpsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    excerpts = require('metalsmith-excerpts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    paginate = require('metalsmith-paginate'),
    tags = require('metalsmith-tags'),
    ignore = require('metalsmith-ignore'),
    define = require('metalsmith-define');


gulp.task('encrypt', function () {

  var options = {
    password: fs.existsSync('.encryption_key') ? fs.readFileSync('.encryption_key') : process.env.ENCRYPTION_KEY,
    salt: fs.existsSync('.salt') ? fs.readFileSync('.salt') : process.env.SALT
  };
  gulp.src('server/configuration/unencrypted/**/*.json').pipe(encrypt(options)).pipe(gulp.dest('server/configuration/encrypted/'));

});

gulp.task('decrypt', ['clean'], function () {

  var options = {
    password: fs.existsSync('.encryption_key') ? fs.readFileSync('.encryption_key') : process.env.ENCRYPTION_KEY,
    salt: fs.existsSync('.salt') ? fs.readFileSync('.salt') : process.env.SALT
  };
  gulp.src('server/configuration/encrypted/**/*.json').pipe(decrypt(options)).pipe(gulp.dest('server/configuration/unencrypted/'));

});
var async = require('async'),
    glob = require('glob'),
    Handlebars = require('handlebars'),
    HandlebarsIntl = require('handlebars-intl'),
    assign = require('lodash.assign'),
    async = require('async'),
    rimraf = require('rimraf'),
    browserify = require('browserify'),
    transform = require('vinyl-transform');
>>>>>>> phragm:__phragm/1.0/gulpfile.js

HandlebarsIntl = require('handlebars-intl');

var revquire = require('./gulp/revquire');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var critical = require('critical');

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

<<<<<<< HEAD:gulpfile.js
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
  var dest = gulp.dest('.tmp/build/css');
  var main = gulp.src('static/scss/*.scss').pipe(scss());

  var site = gulp.src('static/scss/*.scss').pipe(scss()).pipe(rename({
    basename: "site"
  }));

  return merge(main, site).pipe(dest);
});
=======
gulp.task('production', ['build'], function () {
  var htmlFilter = gulpFilter("**/*.html"),
      jsFilter = gulpFilter("**/*.js"),
      cssFilter = gulpFilter("**/*.css"),
      imagesFilter = gulpFilter(["**/*", "!assets/**/*.jpeg", "!assets/**/*.png", "!assets/**/*.jpg", "!assets/**/*.ico"]);

  var stream = gulp.src('.tmp/build/**/*').pipe(htmlFilter).pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true
  })).pipe(htmlFilter.restore())
/*.pipe(jsFilter)
.pipe(uglify({
    mangle: false,
    compress: false
  }))
>>>>>>> phragm:__phragm/1.0/gulpfile.js

gulp.task('assets', ['clean'], function () {
  return gulp.src('static/assets/**/*').pipe(gulp.dest('.tmp/build/assets'));
});

gulp.task('static', ['metalsmith', 'browserify', 'assets', 'critical']);

gulp.task('metalsmith', ['handlebars', 'clean'], metalsmith_build({
  stage: "development"
}));

<<<<<<< HEAD:gulpfile.js
gulp.task('jscs', function () {
  return gulp.src(['./*.js', 'gulp/**/*.js', 'static/js/**/*.js', 'app/**/*.js'], {
    base: '.'
  }).pipe(jscs({
    fix: true
  })).pipe(gulp.dest('.'));
=======
  return stream;
>>>>>>> phragm:__phragm/1.0/gulpfile.js
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
  return gulp.src('.tmp/build/**/*').pipe(gulp.dest('build/development'));
});

<<<<<<< HEAD:gulpfile.js
gulp.task('production', ['minify', 'production-assets'], function () {
  var revAll = new revall({
    dontRenameFile: ['.html', '.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    debug: false
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
=======
gulp.task('test', ['clean'], function () {

});

//gulp.task('test', ['clean'], function (cb) {
///gulp.src(['./server/**/*.js']).pipe(istanbul()).on('finish', function () {
//  gulp.src(["./test/server/**/*.js"]).pipe(mocha()).pipe(istanbul.writeReports()).on('end', cb); // Creating the reports after tests runned
//});
/*
gulp.task('test', ['clean'], function () {
  var options = {
    thresholds: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    },
    coverageDirectory: 'coverage',
    rootDirectory: ''
  };*/
//return gulp.src(['./server/**/*.js']).pipe(coverageEnforcer(options));
//};
//gulp.src(['./app/**/*.js']).pipe(cover.instrument({
//  pattern: ["./test/app/**/*.js"],
/*
    debugDirectory: 'debug'
  })).pipe(mocha()).pipe(cover.report({
    outFile: '.coverdata/coverage.html'
  })).pipe(cover.enforce(options.thresholds));
*/

gulp.task('copy', ['clean'], function () {
  return gulp.src('static/assets/**/*').pipe(gulp.dest('.tmp/build/assets'));
});

gulp.task('sass', ['clean'], function () {
  return gulp.src('static/scss/**/*.scss').pipe(sass()).pipe(gulp.dest('.tmp/build/css'));
});


gulp.task('browserify', ['clean'], function () {
  var browserified = transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./static/js/main.js']).pipe(browserified).pipe(gulp.dest('./.tmp/build/js'));
>>>>>>> phragm:__phragm/1.0/gulpfile.js
});

gulp.task('uglify-js', ['browserify'], function () {
  return gulp.src('.tmp/build/**/*.js').pipe(uglify({
    mangle: false,
    compress: false
  })).pipe(gulp.dest('.tmp/production'));

});

<<<<<<< HEAD:gulpfile.js
gulp.task('critical', ['scss', 'metalsmith'], function () {
  critical.generateInline({
    base: '.tmp/build',
    src: 'index.html',
    styleTarget: '.tmp/build/css/site.css',
    htmlTarget: '.tmp/build/index.html',
    width: 320,
    height: 480,
    minify: false
  });
});

gulp.task('uglify-css', ['scss'], function () {
  return gulp.src('.tmp/build/**/*.css').pipe(uglifycss()).pipe(gulp.dest('.tmp/production'));
});

gulp.task('heroku:production', ['publish', 'test', 'submodules']);

gulp.task('test', function () {
  // place code for your default task here
=======
gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./*.js', 'static/js/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('beautify', ['clean'], function () {
  return gulp.src(['./*.js', 'static/js/**/*.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2,
    preserveNewlines: true
  })).pipe(gulp.dest('.'));
>>>>>>> phragm:__phragm/1.0/gulpfile.js
});

gulp.task('build', ['submodules', 'production', 'test']);

gulp.task('default', ['submodules', 'bump', 'production', 'development', 'test']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});