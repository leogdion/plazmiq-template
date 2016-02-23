var User = require('./controllers/user.js');

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

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
  hashListeners: [],
  hashChange: function (controller) {
    this.hashListeners.push(controller);
  },
  configuration: {},
  start: function () {
    var user = new User();
    var App = this;
    this.attachStyleSheet();
    window.addEventListener('load', function (evt) {
      var configurationElement = document.getElementById('main-configuration');
      if (configurationElement) {
        App.configuration = JSON.parse(configurationElement.innerText.trim()) || this.configuration;
      }
      user.initialize(App);
      for (var i = 0, len = App.hashListeners.length; i < len; i++) {
        var func = isFunction(App.hashListeners[i].hashChange);
        if (func && App.hashListeners[i].hashChange(evt)) {
          return;
        }
      }
    });
    window.addEventListener('hashChange', function (evt) {
      for (var i = 0, len = App.hashListeners.length; i < len; i++) {
        var func = isFunction(App.hashListeners[i].hashChange);
        if (func && App.hashListeners[i].hashChange(evt)) {
          return;
        }
      }
    });
  }
};