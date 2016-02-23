export default class App {
  attachStyleSheetOnReady () {
    const raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;
    if (raf) raf(this.attachStyleSheet);
    else window.addEventListener('load', this.attachStyleSheet);
  }
  setConfigurationOnReady () {
    window.addEventListener('load', this.setConfiguration)
  }
  setConfiguration () {
    var configurationElement = document.getElementById('main-configuration');
    if (configurationElement) {
      this.configuration = JSON.parse(configurationElement.innerText.trim()) || this.configuration;
    }
  }
  attachStyleSheet () {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '/css/style.css';
    const h = document.getElementsByTagName('head')[0];
    h.parentNode.insertBefore(l, h);
  }
  start () {
    this.attachStyleSheetOnReady()
    this.setConfigurationOnReady()
  }
}
/*
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
*/