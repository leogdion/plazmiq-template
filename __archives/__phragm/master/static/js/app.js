define(['templates', 'zepto', 'crossroads', 'hasher', './controllers/index'], function (templates, $, crossroads, hasher, controllers) {
  var app = {};

  var controller, main;


  //setup crossroads
  crossroads.addRoute('/', function () {
    $('main').html(templates[controllers.home.template]());
  });

  crossroads.addRoute('profile', function () {
    if (controller) {
      if (controller.events) {
        for (var selector in controller.events) {
          main.off(controller.events[selector], selector);
        }
      }
    }
    controller = controllers.profile;
    main = $('main').html(templates[controller.template]());
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
    }
    if (controller.initialize) {
      controller.initialize.call(main);
    }
  });

  crossroads.addRoute('login', function () {
    if (controller) {
      if (controller.events) {
        for (var selector in controller.events) {
          main.off(controller.events[selector], selector);
        }
      }
    }
    controller = controllers.login;
    main = $('main').html(templates[controller.template]());
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
    }
    if (controller.initialize) {
      controller.initialize.call(main);
    }
  });

  crossroads.addRoute('confirmation', function () {
    if (controller) {
      if (controller.events) {
        for (var selector in controller.events) {
          main.off(controller.events[selector], selector);
        }
      }
    }
    controller = controllers.confirmation;
    main = $('main').html(templates[controller.template]());
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
    }
    if (controller.initialize) {
      controller.initialize.call(main);
    }
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
  hasher.prependHash = "";
  hasher.initialized.add(parseHash); //parse initial hash
  hasher.changed.add(parseHash); //parse hash changes
  hasher.init(); //start listening for history change
  //update URL fragment generating new history record
  //hasher.setHash('lorem/ipsum');
  //$('main').html(templates.home());
  return app;
});