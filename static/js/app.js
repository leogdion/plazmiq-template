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
  start: function () {
    var user = new User();
    this.attachStyleSheet();
    window.addEventListener('load', function () {
      user.initialize();
    });

  }
};