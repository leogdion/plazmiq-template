define(['templates', 'zepto', 'crossroads', 'hasher', './controllers/index'], function (templates, $, crossroads, hasher, controllers) {
  var app = {};

  //setup crossroads
  crossroads.addRoute('/', function () {
    $('main').html(templates[controllers.home.template]());
  });

  crossroads.addRoute(/.*/, function () {
    $('main').html(templates['404']());
  });
  //crossroads.addRoute('lorem/ipsum');
  crossroads.routed.add(console.log, console); //log all routes
  //setup hasher

  function parseHash(newHash, oldHash) {
    crossroads.parse(newHash);
  }
  hasher.initialized.add(parseHash); //parse initial hash
  hasher.changed.add(parseHash); //parse hash changes
  hasher.init(); //start listening for history change
  //update URL fragment generating new history record
  //hasher.setHash('lorem/ipsum');
  //$('main').html(templates.home());
  return app;
});