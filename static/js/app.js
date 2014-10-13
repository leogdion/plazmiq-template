define(['templates', 'zepto', 'crossroads', 'hasher', './controllers/index'], function (templates, $, crossroads, hasher, controllers) {
  var app = {};

  var controller, main;


  //setup crossroads
  crossroads.addRoute('/', function () {
    if (controller) {
      if (controller.events) {
        for (var selector in controller.events) {
          main.off(controller.events[selector], selector);
        }
      }
    }
    controller = controllers.home;
    main = $('main').html(templates[controller.template](data));
    var data = {};
    if (controller.initialize) {
      data = controller.initialize.call(main) || data;
    }
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
    }
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
    var data = {};
    if (controller.initialize) {
      data = controller.initialize.call(main) || data;
    }
    main = $('main').html(templates[controller.template](data));
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
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
    var data = {};
    if (controller.initialize) {
      data = controller.initialize.call(main) || data;
    }
    main = $('main').html(templates[controller.template](data));
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
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
    var data = {};
    if (controller.initialize) {
      data = controller.initialize.call(main) || data;
    }
    main = $('main').html(templates[controller.template](data));
    if (controller.events) {
      for (var selector in controller.events) {
        main.on(controller.events[selector], selector);
      }
    }
  });

  crossroads.addRoute(/.*/, function () {
    $('main').html(templates['404']());
  });
  //crossroads.addRoute('lorem/ipsum');
  crossroads.routed.add(console.log, console); //log all routes
  //setup hasher
  $('#debug').on('click', function () {
    $('#test').css('display', 'inline-block');
  });

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