if (!global.Intl) {
  global.Intl = require('intl');
}

var unirest = require('unirest');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs-extra');
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
var sourcemaps = require('gulp-sourcemaps');
var babel = require('babelify');
var ghPages = require('gulp-gh-pages');
var sitemap = require('gulp-sitemap');
var inline = require('gulp-inline'),
    inlineCss = require('gulp-inline-css'),
    cheerio = require('gulp-cheerio');
var crypto = require('crypto');

var domain_suffix = "api.mailchimp.com"
var base_path = "3.0"
//var base_url = "https://<dc>.api.mailchimp.com/3.0"

var api_key = "34d68e073f06bb9875b577c908533d40-us12";
var dc = api_key.split('-')[1];

var base_url = ["https://", dc, ".", domain_suffix, "/", base_path , "/"].join("");

HandlebarsIntl = require('handlebars-intl');

var revquire = require('./depends/revquire');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var critical = require('critical');

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var insert = require('gulp-insert');

var iconfont = require('gulp-iconfont');

var metalsmith_build = require('./depends/metalsmith');

var async = require('async'),
    rimraf = require('rimraf');

var package = require("./package.json");
var replace = require('gulp-just-replace');

var state = require('crypto').randomBytes(64).toString('hex');

var awscredentials = revquire({
  "accessKeyId": "AWS_CREDENTIALS_KEY",
  "secretAccessKey": "AWS_CREDENTIALS_SECRET",
  "params": {
    "Bucket": "AWS_CREDENTIALS_BUCKET"
  }
}, __dirname + '/.credentials/aws.json');

var publishType = package.beginkit.publishing.type;

if (publishType == "github") {
  publishTasks = ['github-publish'];
} else if (publishType == "aws") {
  publishTasks = ['aws-publish'];
} else {
  publishTasks = [];
}
// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete. 
// You should run it at least once to create the icons. Then, 
// you should run it whenever RealFaviconGenerator updates its 
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', ['clean', 'metalsmith-development', 'check-for-favicon-update'], function(done) {
  realFavicon.generateFavicon({
    masterPicture: "./graphics/logo.svg",
    dest: "./.tmp/favicons",
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '18%'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'BeginKit',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run 
// this task whenever you modify a page. You can keep this task 
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', ['clean', 'metalsmith-development', 'metalsmith-production', 'generate-favicon'], function() {
  return gulp.src([ './.tmp/metalsmith/**/*.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./.tmp/metalsmith'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your 
// continuous integration system.
gulp.task('check-for-favicon-update', ['clean', 'metalsmith-development'], function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
    done();
  });
});

gulp.task('clean', function (cb) {
  async.each(['.tmp', 'build'], rimraf, cb);
});

gulp.task('publish', publishTasks);

gulp.task('github-publish', ['production'], function () {
  return gulp.src('./build/production/**/*')
    .pipe(ghPages({
      "cacheDir" : "./.tmp/publish"
    }));
});

gulp.task('aws-publish', ['production'], function () {
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

gulp.task('browserify', ['clean'], function () {
  var bundler = browserify('./static/js/main.js', { debug: true }).transform(babel, { presets: ['es2015'] });

  return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp/metalsmith/development/js/'))
      .pipe(gulp.dest('./.tmp/metalsmith/production/js/'));

});

gulp.task('scss', ['clean', 'iconfont'], function () {
  var dest = gulp.dest('.tmp/metalsmith/css');
  var main = gulp.src('static/scss/*.scss').pipe(scss());

  var site = gulp.src('static/scss/*.scss').pipe(scss()).pipe(rename({
    basename: "site"
  }));

  return merge(main, site).pipe(gulp.dest('.tmp/metalsmith/production/css')).pipe(gulp.dest('.tmp/metalsmith/development/css'));
});

gulp.task('assets', ['clean'], function () {
  return gulp.src('static/assets/**/*').pipe(gulp.dest('.tmp/metalsmith/production/assets')).pipe(gulp.dest('.tmp/metalsmith/development/assets'));
});

gulp.task('graphics', ['clean'], function () {
  return gulp.src('graphics/**/*').pipe(gulp.dest('.tmp/metalsmith/production/assets/images')).pipe(gulp.dest('.tmp/metalsmith/development/assets/images'));
});

gulp.task('favicons', ['clean', 'generate-favicon', 'inject-favicon-markups', 'check-for-favicon-update'], function () {
  return gulp.src('.tmp/favicons/*.*').pipe(gulp.dest('.tmp/metalsmith/production')).pipe(gulp.dest('.tmp/metalsmith/development'));
});

gulp.task('fonts', ['clean'], function () {
  return gulp.src('./node_modules/font-awesome/fonts/*.*').pipe(gulp.dest('.tmp/metalsmith/production/assets/fonts/font-awesome')).pipe(gulp.dest('.tmp/metalsmith/development/assets/fonts/font-awesome'));
});

gulp.task('static', ['metalsmith-development', 'metalsmith-production', 'browserify', 'assets', 'graphics', 'fonts', 'critical', 'favicons', 'fonts']);

gulp.task('metalsmith-development', ['handlebars', 'clean'], metalsmith_build({
  stage: "development"
}));

gulp.task('metalsmith-production', ['handlebars', 'clean'], metalsmith_build({
  stage: "production"
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

  return gulp.src('.tmp/metalsmith/development/**/*').pipe(filter).pipe(substituter({
    configuration: JSON.stringify({
      "server": "http://localhost:5000",
      "debug": true
    })
  })).pipe(filter.restore).pipe(gulp.dest('./build/development'));
});

gulp.task('production', ['minify', 'browserify', 'scss', 'production-css-js', 'production-assets', 'production-cname', 'production-favicons', 'production-sitemap'], function () {
  var revAll = new revall({
    dontRenameFile: ['.html', '.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    dontGlobal: ['.svg', '.jpeg', '.jpg', '.png', '.ico', '.xml'],
    debug: false
  });
  return gulp.src('.tmp/build/production/**/*').pipe(revAll.revision()).pipe(gulp.dest('./build/production'));
});

gulp.task('production-css-js', ['static'], function () {
  return gulp.src(['.tmp/metalsmith/production/**/*.js','.tmp/metalsmith/production/**/*.js.map','.tmp/metalsmith/production/**/*.css']).pipe(gulp.dest('./.tmp/build/production/'));
});

gulp.task('production-sitemap', ['static'], function () {
  return gulp.src(['.tmp/metalsmith/production/sitemap.xml']).pipe(gulp.dest('./.tmp/build/production/'));
});

gulp.task('production-favicons', ['static'], function () {
  return gulp.src(['.tmp/metalsmith/production/*.png','.tmp/metalsmith/production/browserconfig.xml','.tmp/metalsmith/production/manifest.json','.tmp/metalsmith/production/*.svg','.tmp/metalsmith/production/*.ico']).pipe(gulp.dest('./.tmp/build/production/'));
});

gulp.task('production-assets', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/assets/**/*').pipe(gulp.dest('./.tmp/build/production/assets'));
});

gulp.task('production-cname', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/CNAME').pipe(gulp.dest('./.tmp/build/production'));
});

gulp.task('minify', ['htmlmin', 'uglify-js', 'uglify-css']);

gulp.task('htmlmin', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/**/*.html').pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true
  })).pipe(gulp.dest('.tmp/build/production'));
});

gulp.task('uglify-js', ['static'], function () {
  return gulp.src('.tmp/metalsmith/**/*.js').pipe(uglify({
    mangle: false,
    compress: false
  })).pipe(gulp.dest('.tmp/build/production'));

});

var runTimestamp = Math.round(Date.now()/1000);
 
var consolidate = require('gulp-consolidate');
 
gulp.task('iconfont', ['clean'], function(done){
  var iconStream = gulp.src(['icons/*.svg'])
    .pipe(iconfont({ fontName: 'tagmento' }));
 
  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src('fontawesome-style.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'tagmento',
            fontPath: '/assets/fonts/tagmento/',
            className: 's'
          }))
          .pipe(rename({
            extname: ".scss"
          }))
          .pipe(gulp.dest('.tmp/css/'))
          .on('finish', cb);
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest('.tmp/metalsmith/assets/fonts/tagmento'))
        .on('finish', cb);
    }
  ], done);
});

gulp.task('sitemap', ['clean', 'metalsmith-production', , 'metalsmith-development'], function () {
  return gulp.src('.tmp/metalsmith/production/**/*.html')
        .pipe(sitemap({
            siteUrl: 'http://www.tagmento.com'
        }))
        .pipe(gulp.dest('./.tmp/metalsmith'));
});

gulp.task('critical', ['scss', 'metalsmith-production', 'metalsmith-development', 'favicons', 'iconfont'], function (cb) {
  critical.generate({
    inline: true,
    base: '.tmp/metalsmith/production', 
    src: 'index.html',
    styleTarget: '.tmp/metalsmith/production/css/site.css',
    htmlTarget: '.tmp/metalsmith/production/index.html',
    width: 320,
    height: 480,
    minify: false
  }, cb);
});

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}



gulp.task('issues', ['metalsmith-production', 'scss', 'clean'], function() {
  fs.ensureFileSync("./beginkit/MailChimp/files.json");
  var images =  fs.readJsonSync("./beginkit/MailChimp/files.json", {throws: false}) || {};
  var replaceMap = {};
  
  return gulp.src(['issues/**/*.html'], {
    cwd: ".tmp/metalsmith/production"
  }).pipe(cheerio(function ($, file, done) {
      // The only difference here is the inclusion of a `done` parameter. 
      // Call `done` when everything is finished. `done` accepts an error if applicable.
      
      async.each($('[style*=background-image]').toArray(), function (item, cb) {
        var propValue = $(item).css('background-image');
        var uri = propValue.substr(4,propValue.length - 5);
        var pathComponents = uri.split('/');
        pathComponents.unshift("static");
        var filePath = path.resolve.apply(undefined, pathComponents);
        var extname = path.extname(uri);

        fs.readFile(filePath, function (error, data) {
          var base64 = new Buffer(data).toString('base64');
          var sha = checksum(data, 'sha1');
          if (images[sha]) {
            replaceMap[uri] = images[sha].full_size_url;
            images[sha].relative_url = uri;
            cb();
          } else {

          
            unirest.post(base_url + "/file-manager/files")
           .auth(state, api_key)
           .header('content-type', 'application/json')
           .send({"name": sha + extname, "file_data": base64})
           .end(function (response) {
            //console.log(response.body.full_size_url);
            
              if (response.body.error) {
                console.log(response.body.error_description);
                cb(response.body.error);
              } else {
                var data = 
                  {
                    "ext" : extname,
                    "relative_url" : uri,
                    "id" : response.body.id,
                    "full_size_url" : response.body.full_size_url
                  }; 
                  images[sha] = data;
                replaceMap[data.relative_url] = data.full_size_url;
                cb();  
              }
            //console.log(response.body);
            
          });
          }
        });
      }, function (error) {
        fs.writeJson("./beginkit/MailChimp/files.json", images, {spaces : 2}, function (err){
          done(err || error);
        });
      })
    }))

        .pipe(inline({base: ".tmp/metalsmith/production",css: uglifycss, js: uglify}))
        .pipe(inlineCss())
        .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true
  })).pipe(replace(/url\(([^\)]+)\)/g, function(match) {
    var uri = match.substr(4,match.length - 5);
    console.log(uri);
    var newUrl = replaceMap[uri];
    console.log(newUrl);
    if (newUrl) {
      return "url(" + newUrl + ")";
    } else {
      return match;
    }
  }))

        .pipe(gulp.dest('.tmp/issues'));
});

gulp.task('campaign', ['issues'], function () {
// read folder from settings
// read all files in issues folder
// create template name based on folder
// read each file and post
/*
var template_folder_id = "db9b74ea32";
console.log(template_name);
console.log('reading template...');
fs.readFile(path.resolve(__dirname, "template.html"), function(err, data) {
 var htmltext = new Buffer(data).toString();
  console.log('posting template...');
 unirest.post(base_url + "/templates")
 .auth(state, api_key)
 .header('content-type', 'application/json')
 .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
 .end(function (response) {
    if (response.body.error) {
      console.log(response.body.error_description);
      process.exit(1);
    }
    console.log(response.body);
  });
});
*/
});

gulp.task('uglify-css', ['static'], function () {
  return gulp.src('.tmp/metalsmith/**/*.css').pipe(uglifycss()).pipe(gulp.dest('.tmp/build/production'));
});

gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('build', ['submodules', 'production', 'test']);

gulp.task('default', ['submodules', 'bump', 'production', 'development', 'test']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});
