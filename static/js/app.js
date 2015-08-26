var User = require('./controllers/user.js');

var App = {
  attachStyleSheet: function () {
    var cb = function () {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = '/css/style.css';
      var h = document.getElementsByTagName('head')[0];
      h.parentNode.insertBefore(l, h);
    };
    var raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;
    if (raf) raf(cb);
    else window.addEventListener('load', cb);

  },
  configuration: {},
  start: function () {
    var user = new User();
    this.attachStyleSheet();
    window.addEventListener('load', function () {
      var configurationElement = document.getElementById('main-configuration'),
          configuration;
      if (configurationElement) {
        configuration = JSON.parse(configurationElement.innerText.trim());
      }
      this.configuration = configuration;
      user.initialize();
    });

  }
};