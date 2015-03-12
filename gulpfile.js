if (!global.Intl) {
  global.Intl = require('intl');
}

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
    revall = require('gulp-rev-all'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    gulp_front_matter = require('gulp-front-matter'),
    gulpFilter = require('gulp-filter'),
    awspublish = require("gulp-awspublish"),
    awspublishRouter = require("gulp-awspublish-router");

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

var awscredentials = revquire({
  "key": "AWS_CREDENTIALS_KEY",
  "secret": "AWS_CREDENTIALS_SECRET",
  "bucket": "AWS_CREDENTIALS_BUCKET"
}, './.aws-credentials.json');


var watch = function (stage) {
  var Watch = function () {
    stage = stage || "default";
    return gulp.watch('./static/**/*', {
      debounceDelay: 2000
    }, [stage]);
  };

  return Watch;
};

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
      "^assets/.+$": {
        // cache static assets for 2 years
        cacheTime: 630720000
      },

/* "^assets/(?:.+)\\.(?:js|css|svg|ttf)$": {
        // don't modify original key. this is the default
        key: "$&",
        // use gzip for assets that benefit from it
        gzip: true,
        // cache static assets for 2 years
        cacheTime: 630720000
      },

      "^assets/.+$": {
        // cache static assets for 2 years
        cacheTime: 630720000
      },

      // e.g. upload items/foo/bar/index.html under key items/foo/bar
      "^items/([^/]+)/([^/]+)/index\\.html": "items/$1/$2",

      "^.+\\.html": {
        // apply gzip with extra options
        gzip: {
          // Add .gz extension.
          ext: ".gz"
        }
      },

      "^README$": {
        // specify extra headers
        headers: {
          "Content-Type": "text/plain"
        }
      },

      // pass-through for anything that wasn't matched by routes above, to be uploaded with default options
      */
      "^.+$": {
        key: "$&",
        gzip: true
      }
    }
  })).pipe(publisher.publish()).pipe(publisher.sync()).pipe(awspublish.reporter());
});

gulp.task('build', ['clean', 'browserify', 'sass', 'copy', 'lint', 'metalsmith', 'bump']);

gulp.task('default', ['development', 'production']);

gulp.task('development', ['build'], function () {
  return gulp.src('.tmp/build/**/*').pipe(gulp.dest('build/development'));
});

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

  .pipe(jsFilter.restore()).pipe(jsFilter)*/
  .pipe(cssFilter).pipe(uglifycss()).pipe(cssFilter.restore()).pipe(imagesFilter)

  .pipe(revall({
    ignore: ['.html', '.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    quiet: false
  })).pipe(gulp.dest('./build/production'));

  gulp.src(['.tmp/build/assets/**/*.jpg', '.tmp/build/assets/**/*.png', '.tmp/build/assets/**/*.jpeg', '.tmp/build/assets/**/*.ico']).pipe(gulp.dest('./build/production/assets'));

  return stream;
});

gulp.task('heroku:staging', ['default']);

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

gulp.task('metalsmith', ['clean', 'handlebars'], function () {
  return gulp.src('./static/html/**/*').pipe(gulp_front_matter()).on("data", function (file) {
    assign(file, file.frontMatter);
    delete file.frontMatter;
  }).pipe(
  gulpsmith().use(ignore('drafts/*')).use(define({
    pkg: require('./package.json'),
    buildDate: new Date()
  })).use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: '*.md'
    }
  })).use(tags({
    handle: 'tags',
    // yaml key for tag list in you pages
    path: 'tags',
    // path for result pages
    template: '../templates/blog.hbt',
    // template to use for tag listing
    sortBy: 'date',
    // provide posts sorted by 'date' (optional)
    reverse: true // sort direction (optional)
  })).use(paginate({
    perPage: 1,
    path: "blog/page"
  })).use(markdown()).use(excerpts()).use(permalinks({
    pattern: 'blog/:date/:title',
    date: 'YY/MM/DD'
  })).use(templates({
    engine: 'handlebars',
    directory: 'static/templates'
  }))).pipe(gulp.dest(".tmp/build"));
});

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
});

gulp.task('bump', ['browserify'], function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

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
});

gulp.task('watch', ['default'], watch());
gulp.task('watch-development', ['development'], watch('development'));
gulp.task('watch-production', ['production'], watch('production'));