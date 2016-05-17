if (!global.Intl) {
  global.Intl = require('intl');
}


Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    if (o) {
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
    }
    return o;

}

var gutil = require('gulp-util');
var traverse = require('traverse');
var matter = require('gray-matter');
var yaml = require('js-yaml');
var url = require('url');
var glob = require("glob");
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

HandlebarsIntl = require('handlebars-intl');

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

var beginkit_package = package.beginkit;

var beginkit_creds;
try {
  beginkit_creds = require('./.credentials/beginkit.json');
} catch (e) {
}


var mc_api_key = Object.byString(beginkit_creds,"services.MailChimp.ApiKey");

var dc = mc_api_key && mc_api_key.split  && mc_api_key.split('-')[1];

var base_url = dc ? ["https://", dc, ".", domain_suffix, "/", base_path , "/"].join("") : undefined;

var state = require('crypto').randomBytes(64).toString('hex');

var awscredentials = {
  "accessKeyId": Object.byString(beginkit_creds,"services.Amazon.AccessKeyId"),
  "secretAccessKey": Object.byString(beginkit_creds,"services.Amazon.SecretAccessKey"),
  "params": {
    "Bucket": Object.byString(beginkit_creds,"services.Amazon.Bucket")
  }
};

var publishType = beginkit_package.publishing.type;

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
        backgroundColor: '#000000',
        margin: '28%'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#ffffff',
        manifest: {
          name: 'tagmento web',
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
      compression: 5,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
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
  Handlebars.registerHelper('access', function (collection, key) {
    return collection[key];
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
    if (!(contents.toISOString)) {
      contents = new Date(contents);
    }
    return contents.toISOString();
  });
  Handlebars.registerHelper('strip', function (contents) {
    return contents.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ");
  });
  Handlebars.registerHelper('single', function (contents) {
    return contents && contents.length && contents.length === 1;
  });
  Handlebars.registerHelper('zerofill', function (number, width) {
    width -= number.toString().length;
    if ( width > 0 )
    {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // always return a stringify
    //return contents && contents.length && contents.length === 1;
  });
  Handlebars.registerHelper('stringify', function(object){
    return new Handlebars.SafeString(JSON.stringify(object));
  });
  /**
  * Handlebars helpers.
  * @namespace Handlebars.helpers
  */
  Handlebars.registerHelper('slugify', function (component, options) {
    /**
    * Return a slug for a DOM id or class.
    * @function slugify
    * @memberof Handlebars.helpers
    * @param {string} component - string to slugify.
    * @example
    * // returns stuff-in-the-title-lots-more
    * Handlebars.helpers.slugify('Stuff in the TiTlE & Lots More');
    * @returns {string} slug
    */
    var slug = component.replace(/[^\w\s]+/gi, '').replace(/ +/gi, '-');

    return slug.toLowerCase();

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

gulp.task('favicons', ['clean', 'generate-favicon', 'check-for-favicon-update'], function () {
  return gulp.src('.tmp/favicons/*.*').pipe(gulp.dest('.tmp/metalsmith/production')).pipe(gulp.dest('.tmp/metalsmith/development'));
});

gulp.task('fonts', ['clean'], function () {
  return gulp.src('./node_modules/font-awesome/fonts/*.*').pipe(gulp.dest('.tmp/metalsmith/production/assets/fonts/font-awesome')).pipe(gulp.dest('.tmp/metalsmith/development/assets/fonts/font-awesome'));
});

gulp.task('static', ['metalsmith-development', 'metalsmith-production', 'browserify', 'assets', 'graphics', 'fonts', 'critical', 'favicons', 'sitemap']);

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

gulp.task('production', ['minify', 'browserify', 'scss', 'production-css-js', 'production-assets', 'production-cname', 'production-rss', 'production-favicons', 'production-sitemap'], function () {
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

gulp.task('production-rss', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/rss.xml').pipe(gulp.dest('./.tmp/build/production'));
});

gulp.task('minify', ['htmlmin', 'uglify-js', 'uglify-css']);

gulp.task('htmlmin', ['static'], function () {
  return gulp.src(['.tmp/metalsmith/production/**/*.html','!.tmp/metalsmith/production/newsletters/**/*.html']).pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true
  })).pipe(gulp.dest('.tmp/build/production'));
});

gulp.task('uglify-js', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/**/*.js').pipe(uglify({
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
        .pipe(gulp.dest('.tmp/metalsmith/production/assets/fonts/tagmento'))
        .pipe(gulp.dest('.tmp/metalsmith/development/assets/fonts/tagmento'))
        .on('finish', cb);
    }
  ], done);
});

gulp.task('sitemap', ['clean', 'metalsmith-production'], function () {

  return gulp.src(['.tmp/metalsmith/production/**/*.html','!.tmp/metalsmith/production/newsletters/**/*.html'])
        .pipe(sitemap({
            siteUrl: 'http://www.tagmento.com'
        }))
        .pipe(gulp.dest('.tmp/metalsmith/production'));
});

gulp.task('critical', ['scss', 'metalsmith-production', 'metalsmith-development', 'favicons', 'iconfont', 'fonts'], function (cb) {
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



gulp.task('newsletters', ['metalsmith-production', 'assets', 'scss', 'clean'], function() {
  fs.ensureFileSync("./beginkit/MailChimp/files.json");
  var images =  fs.readJsonSync("./beginkit/MailChimp/files.json", {throws: false}) || {};
  var replaceMap = {};
  
  return gulp.src(['newsletters/**/*.html'], {
    cwd: ".tmp/metalsmith/production"
  }).pipe(cheerio(function ($, file, done) {
      // The only difference here is the inclusion of a `done` parameter. 
      // Call `done` when everything is finished. `done` accepts an error if applicable.
      if (base_url && mc_api_key) {
      async.each($('[style*=background-image],[style*=background],img').toArray(), function (item, cb) {
        var uri;
        var propValue = $(item).css('background-image') || $(item).css('background');
        
        if (propValue) {
          uri = propValue.match(/url\(([^\)]+)\)/)[1];
        } else if (item.tagName === "img") {
          uri = $(item).attr('src');
        } else {
          cb();
        }
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
           .auth(state, mc_api_key)
           .header('content-type', 'application/json')
           .send({"name": sha + extname, "file_data": base64})
           .end(function (response) {
            
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
            
          });
          }
        });
      }, function (error) {
        fs.writeJson("./beginkit/MailChimp/files.json", images, {spaces : 2}, function (err){
          done(err || error);
        });
      })
    } else {
      done()
    }
    }))

        .pipe(inline({base: ".tmp/metalsmith/production",css: uglifycss, js: uglify, disabledTypes: ['img']}))
        .pipe(inlineCss({
          preserveMediaQueries: true
        }))
        .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true
  })).pipe(replace([{
      search : /url\(([^\)]+)\)/g,
      replacement: function(match) {
        var uri = match.substr(4,match.length - 5);
        
        var newUrl = replaceMap[uri];
        if (newUrl) {
          return "url(" + newUrl + ")";
        } else {
          return match;
        }
      }
    },{
      search : /\ssrc="(\/[^"]+)"\s/g,
      replacement: function(match, uri) {
        
        var newUrl = replaceMap[uri];
        if (newUrl) {
          return " src=\"" + newUrl + "\" ";
        } else {
          return match;
        }
      }
    }, {
      search : /"(\.\.)?\//g,
      replacement: "\"http://www.tagmento.com/"
    }]
  ))

        .pipe(gulp.dest('.tmp/newsletters'));
});


gulp.task('templates', ['newsletters'], function (done) {
  var campaign_folder_id = Object.byString(beginkit_package,"services.MailChimp.folders.campaign");
  var template_folder_id = Object.byString(beginkit_package,"services.MailChimp.folders.template");
  var campaign_statuses = Object.byString(beginkit_package,"services.MailChimp.campaigns.overwrite.status") || [];
  
  async.parallel([
    function (cb) {
      unirest.get(base_url + "/campaigns")
      .auth(state, mc_api_key)
      .header('content-type', 'application/json')
      .send({})
      .end(function (response) {
        /*
         if (response.body.error) {
           console.log(response.body.error_description);
         } else {
           templates[response.body.id] = response.body;
         }
         cb(response.body.error);
         */
         var campaigns = response.body.campaigns.filter( function (_) {
          
            return _.settings.folder_id == campaign_folder_id
         }).reduce(function (memo, _) {
          //var template = templates[_.settings.template_id];
          //if (template) {
            memo[_.settings.template_id] = _.status;  
          //}

          
          return memo
         }, {});
         cb(null,campaigns);
       });
    },
    function (cb) {
      unirest.get(base_url + "/templates")
      .auth(state, mc_api_key)
      .header('content-type', 'application/json')
      .send({})
      .end(function (response) {
        /*
         if (response.body.error) {
           console.log(response.body.error_description);
         } else {
           templates[response.body.id] = response.body;
         }
         cb(response.body.error);
         */
         var templates = response.body.templates.filter( function (_) {
          
            return _.folder_id == template_folder_id
         }).map(function (_) {
          return {name : _.name,  id : _.id}
         }, {});
         cb(null, templates);
       });
    }
  ], function (error, results) {
    var templates = results[1].reduce(function (memo, _) {
      var status = results[0][_.id];
      if (!status || campaign_statuses.indexOf(status) > -1) {
        memo[_.name] = _.id;  
      } else if (status) {
        memo[_.name] = null;
      }
      
      return memo;
    }, {});
    glob('.tmp/newsletters/**/index.html', function (er, files) {
      async.each(files, 
        function (file, cb) {
          var template_name = path.basename(path.dirname(file));
          var template_id = templates[template_name];
          if (template_id === null) {
            gutil.log("Skipping", gutil.colors.cyan("'" + template_name + "'"));
            cb();
          } else {
            fs.readFile(file, function(err, data) {
              var htmltext = new Buffer(data).toString();
              if (template_id) {
           // console.log("overwrite ", template_name);
            
                unirest.patch(base_url + "/templates/" + template_id)
                .auth(state, mc_api_key)
                .header('content-type', 'application/json')
                .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
                .end(function (response) {
                  if (response.body.error) {
                    console.log(response.body.error_description);
                  } else {
                    gutil.log("Overwriting", gutil.colors.cyan("'" + template_name + "'"));
                  }
                  cb(response.body.error);
                });
                
              } else {
            //console.log("creating ", template_name);
                
                unirest.post(base_url + "/templates")
                .auth(state, mc_api_key)
                .header('content-type', 'application/json')
                .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
                .end(function (response) {
                  if (response.body.error) {
                    console.log(response.body.error_description);
                  } else {
                    gutil.log("Creating", gutil.colors.cyan("'" + template_name + "'"));
                  }
                  cb(response.body.error);
                });
                
              }
            });
          }
        },
        function (error) {
          if (error) {
            console.log(error);
          }
          done(error);
        }
      );
    });
  });

});

gulp.task('uglify-css', ['static'], function () {
  return gulp.src('.tmp/metalsmith/production/**/*.css').pipe(uglifycss()).pipe(gulp.dest('.tmp/build/production'));
});

gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('build', ['submodules', 'production', 'test']);

gulp.task('default', ['submodules', 'bump', 'production', 'development', 'test']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});

gulp.task('drafts', ['drafts-pocket']);

gulp.task('drafts-pocket', ['handlebars'], function (cb) {
  var sources = Object.byString(beginkit_package, "services.Pocket.sources") || [];
  glob('static/src/posts/**/*.md', function (error, files) {
    
    async.reduce(files, {}, function (memo, file, cb) {

      fs.readFile(file, function (error, data) {
        
          var frontmatter = matter(data.toString());
          if (frontmatter.data.pocket && frontmatter.data.pocket.item_id) {
            var item_id = Number(frontmatter.data.pocket.item_id);
            if (!isNaN(item_id)) {
              memo[item_id] = true
            }
          }
        cb(undefined, memo);
      });
    }, function (error, item_ids) {
      var current = files.length - Object.keys(item_ids).length;
      async.each(sources, 
        function (source, cb) {
          var params = source.parameters || {};
          params.consumer_key = Object.byString(beginkit_creds,"services.Pocket.ConsumerKey");
          params.access_token = Object.byString(beginkit_creds,"services.Pocket.AccessToken");
          var filename = Handlebars.compile(source.filename);
          var template = Handlebars.compile(fs.readFileSync(source.template).toString());
          unirest.post('https://getpocket.com/v3/get.php')
          .header('X-Accept', 'application/json')
          .header('Content-Type', 'application/json; charset=UTF-8')
          .send(params)
          .end(function (response) {
            async.each(response.body.list,
              function (article, cb) {
                if (item_ids[article.item_id]) {
                  //console.log("Already: ",article.item_id,article.resolved_title);
                  cb();
                  return;
                }
                traverse(article).forEach(function (value) {
                  if (this.key) {
                    
                    var words = this.key.split("_");
                    if (words.length === 2 && (words[0] === "is" || words[0] === "has")) {
                      this.update(value === '1');
                    } else {
                      var parsed = Number(value); 
                      if (!isNaN(parsed)) {
                        this.update(parsed);
                      }
                    }
                  }
                });
                var videos = article.videos || {};
                var video;
                for(var key in videos) {
                    if(videos.hasOwnProperty(key)) {
                        video = videos[key];
                        break;
                    }
                }
                if (video) {
                  article.video = video;
                }
                article.url = article.resolved_url || article.given_url;
                article.title = article.resolved_title || article.given_title;
                article.ordinal = current;
                var url_obj = url.parse(article.url)
                article.site_url = url.format( {
                  "protocol" : url_obj.protocol,
                  "hostname" : url_obj.hostname
                });
                article.tag_list = article.tags ? Object.keys(article.tags).join(", ") : undefined;
                article.now = new Date();
                current++; 
                var filepath = path.join("static", "src",source.path, filename(article));
                fs.outputFile(filepath, template(article), function(error) {
                  cb(error);
                });
              },
              function (error) {
                cb();
              });
          });
        },
        function (error) {
          cb();
        });
    });
  });
});