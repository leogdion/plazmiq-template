var
markdown = require('metalsmith-markdown'),
    excerpts = require('metalsmith-excerpts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    paginate = require('metalsmith-paginate'),
    tags = require('metalsmith-tags'),
    publish = require('metalsmith-publish'),
    define = require('metalsmith-define'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    metalsmith = require('metalsmith');

module.exports = (function () {
  function build(configuration, cb) {


    var publishSettings = {};
    var stage = (configuration && configuration.stage) || "development";
    var basePath = (configuration && configuration.base) || (__dirname + "/..");

    if (stage === "development") {
      publishSettings = {
        draft: true,
        future: true
      };
    }
    metalsmith(basePath + "/static").metadata({
      site: {
        title: "BrightDigit",
        url: "http://www.brightdigit.com"
      }
    }).use(publish(publishSettings)).use(define({
      pkg: require(basePath + '/package.json'),
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
      path: 'blog/tags.html',
      // path for result pages
      layout: "../layouts/tags.hbt",
      // template to use for tag listing
      sortBy: 'date',
      // provide posts sorted by 'date' (optional)
      reverse: true // sort direction (optional)
    })).use(paginate({
      perPage: 10,
      path: "blog/page"
    })).use(markdown()).use(excerpts()).use(permalinks({
      pattern: 'blog/:date/:title',
      date: 'YY/MM/DD'
    })).use(layouts({
      engine: "handlebars",
      partials: 'partials'
    })).destination("../.tmp/build")
    // and .use() as many Metalsmith plugins as you like 
    //.use(permalinks('posts/:title'))
    .build(cb);
  }

  function build_callback(configuration) {
    return build.bind(null, [configuration]);
  }

  return build_callback;
})();