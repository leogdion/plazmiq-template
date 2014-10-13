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
    //main = $('main').html(templates[template](data));
    if (controller.prepare) {
      controller.prepare.call(main, callback);
    } else {
      callback({});
    }

    function callback(data) {
      var div, template;
      for (var selector in controller.templates) {
        template = controller.templates[selector];
        div = $(selector).html(templates[template](data));
        if (selector === 'main') {
          main = div;
        }
      }
      if (controller.events) {
        for (var selector in controller.events) {
          main.on(controller.events[selector], selector);
        }
      }
      if (controller.setup) {
        controller.setup.call(main);
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
    if (controller.prepare) {
      controller.prepare.call(main, callback);
    } else {
      callback({});
    }

    function callback(data) {
      var div, template;
      for (var selector in controller.templates) {
        template = controller.templates[selector];
        div = $(selector).html(templates[template](data));
        if (selector === 'main') {
          main = div;
        }
      }
      if (controller.events) {
        for (var selector in controller.events) {
          main.on(controller.events[selector], selector);
        }
      }
      if (controller.setup) {
        controller.setup.call(main);
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
    if (controller.prepare) {
      controller.prepare.call(main, callback);
    } else {
      callback({});
    }

    function callback(data) {
      var div, template;
      for (var selector in controller.templates) {
        template = controller.templates[selector];
        div = $(selector).html(templates[template](data));
        if (selector === 'main') {
          main = div;
        }
      }
      if (controller.events) {
        for (var selector in controller.events) {
          main.on(controller.events[selector], selector);
        }
      }
      if (controller.setup) {
        controller.setup.call(main);
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
    if (controller.prepare) {
      controller.prepare.call(main, callback);
    } else {
      callback({});
    }

    function callback(data) {
      var div, template;
      for (var selector in controller.templates) {
        template = controller.templates[selector];
        div = $(selector).html(templates[template](data));
        if (selector === 'main') {
          main = div;
        }
      }
      if (controller.events) {
        for (var selector in controller.events) {
          main.on(controller.events[selector], selector);
        }
      }
      if (controller.setup) {
        controller.setup.call(main);
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