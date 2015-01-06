if (!global.Intl) {
    global.Intl = require('intl');
}

var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates'),
    excerpts  = require('metalsmith-excerpts'),
    collections  = require('metalsmith-collections'),
    Handlebars = require('handlebars'),
    fs         = require('fs'),
    async      = require('async'),
    path       = require('path'),
    glob       = require('glob'),
    HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);
//async.each(fs.readDir('./static/templates/partials'))

glob("./static/templates/partials/*.html", function (er, files) {
  async.each(files, function (file, cb) {
    fs.readFile(file, function (error, content) {
      console.log(path.basename(file, '.html'));
      Handlebars.registerPartial(path.basename(file, '.html'), content.toString());
      cb(error);
    });
  }, function (error) {
    Handlebars.registerHelper('safe', function(contents) {
      return new Handlebars.SafeString(contents);
    });
    console.log(error);
    Metalsmith(__dirname)
        .source('static/html')
        .use(collections({
            posts: {
                pattern: 'posts/*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(markdown())
        .use(excerpts())
        .use(templates({engine : 'handlebars', directory: 'static/templates'}))
        .destination('./public')
        .build(function (error, files) {
          console.log(error);
          console.log(files);
        });
  });
    // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
});
