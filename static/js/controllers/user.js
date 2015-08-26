var Spinner = require('spin.js');

var User = (function () {
  var constructor = function () {

  };

  constructor.prototype = {
    initialize: function (app) {
      this.app = app;
      console.log('user initialized');
      var form = document.getElementById("user-registration");
      var callout = document.getElementsByClassName("callout")[0];
      var videoBg = document.getElementsByClassName("video-bg")[0];
      var inputs = ["input", "select", "textarea", "button"].reduce(

      function (memo, tagName) {
        memo = memo.concat(Array.prototype.slice.call(form.getElementsByTagName(tagName)));
        return memo;
      }, []);
      var controller = this;
      form.addEventListener('submit', function (E) {
        var form = E.target;
        var data = inputs.reduce(function (memo, element) {
          var key = element.getAttribute('name') || element.getAttribute('id');
          var value = element.value || (element.selectedIndex && element.options && element.options[element.selectedIndex]);
          var ignore = element.hasAttribute('data-ignore');
          if (key && value && !ignore) {
            memo[key] = value;
          }
          return memo;
        }, {});
        var request = new XMLHttpRequest();
        request.open('POST', controller.app.configuration.server + '/api/v1/users', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function () {
          if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;
            console.log(resp);
          } else {
            // We reached our target server, but it returned an error
            console.log(this);
          }
        };

        request.onerror = function () {
          // There was a connection error of some sort
        };
        request.send(JSON.stringify(data));
        E.preventDefault();
        var spinner = new Spinner().spin();
        videoBg.appendChild(spinner.el);
        callout.classList.add('fade');

        for (var i = 0, len = inputs.length; i < len; i++) {
          inputs[i].disabled = true;
        }
      });
    }
  };

  return constructor;
})();