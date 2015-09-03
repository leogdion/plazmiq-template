var Spinner = require('spin.js');
var modal = require("../libs/modal");
var templates = require('../templates');

var User = (function () {
  var constructor = function () {

  };

  function closest(elem, selector) {

    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      } else {
        elem = elem.parentElement;
      }
    }
    return false;
  }

  function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  function keypress(controller, evt) {
    var regex = evt.target.dataset.char;

    if (regex) {
      if (!(String.fromCharCode(evt.which).match(regex))) {
        evt.preventDefault();
      }
    }

    if (navigator.userAgent.indexOf("Safari") > -1) {
      var errorMessage;
      if (evt.target.dataset.equalto) {
        var selector = evt.target.dataset.equalto;
        var element = closest(evt.target, "form").querySelector(selector);
        if (element && element.value !== evt.target.value) {
          errorMessage = evt.target.dataset.error || "This does not match.";
        }
      } else {
        evt.target.setCustomValidity("");
        if (!evt.target.checkValidity() && evt.target.dataset.error) {
          errorMessage = evt.target.dataset.error;
        }
      }
      if (errorMessage) {
        evt.target.setCustomValidity(errorMessage);
      } else {
        evt.target.setCustomValidity("");
      }
    }
  }

  function validate(controller, evt) {
    if (evt.target.value !== undefined && evt.target.dataset.charTransform) {
      evt.target.value = evt.target.value[evt.target.dataset.charTransform]();
    }
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  constructor.prototype = {
    changeActivation: function (data, done) {
      var transitionEvent = whichTransitionEvent();
      if (transitionEvent && done && done.apply) {
        this.form.addEventListener(transitionEvent, done && done.bind(this));
      }
      this.form.classList.add('fade');
      var d = document.createElement('div');
      d.innerHTML = templates.activation(data);
      var activationForm = this.form.parentNode.appendChild(d.firstChild);
      activationForm.classList.add('fade');
      setTimeout(function () {
        activationForm.classList.add('in');

      }, 100);
      var that = this;
      var videoBg = that.videoBg;
      var inputs = Array.prototype.slice.call(activationForm.getElementsByTagName('input'));
      for (var i = 0, len = inputs.length; i < len; i++) {
        inputs[i].readOnly = !! (inputs[i].value);
      }
      activationForm.addEventListener('submit', function (evt) {
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
        request.open('PUT', that.app.configuration.server + '/api/v1/users/' + data.name, true);
        delete data.name;
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function () {
          var i = 0;
          if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;

            that.callout.classList.remove('half');
            for (i = 0, len = inputs.length; i < len; i++) {
              inputs[i].disabled = false;
            }

            videoBg.removeChild(spinner.el);
            //activationForm.classList.add('fade');
/*controller.changeActivation(JSON.parse(resp), function () {

              videoBg.removeChild(spinner.el);
              });
*/
          } else {
            // We reached our target server, but it returned an error
            //vex.dialog.alert('Thanks for checking out Vex!');
            videoBg.removeChild(spinner.el);
            that.callout.classList.remove('fade');

            for (i = 0, len = inputs.length; i < len; i++) {
              inputs[i].disabled = false;
            }
            modal(this.response);
          }
        };

        request.onerror = function () {
          // There was a connection error of some sort
          videoBg.removeChild(spinner.el);
          that.callout.classList.remove('fade');

          for (var i = 0, len = inputs.length; i < len; i++) {
            inputs[i].disabled = false;
          }
        };
        request.send(JSON.stringify(data));
        var spinner = new Spinner().spin();
        videoBg.appendChild(spinner.el);
        that.callout.classList.add('fade');

        for (var i = 0, len = inputs.length; i < len; i++) {
          inputs[i].disabled = true;
        }
        evt.preventDefault();
      });
    },
    hashChange: function (evt) {
      var activationKey = getParameterByName('activationKey');
      if (activationKey) {
        this.changeActivation({
          activationKey: activationKey
        });
      }
    },
    initialize: function (app) {
      this.app = app;
      this.app.hashChange(this);
      var controller = this;

      var form = document.getElementById("user-registration");

      var callout = document.getElementsByClassName("callout")[0];
      var videoBg = document.getElementsByClassName("video-bg")[0];
      var submitBtn = Array.prototype.slice.call(form.getElementsByTagName("button")).filter(function (btn) {
        return btn.type == "submit";
      })[0];
      this.callout = callout;
      this.videoBg = videoBg;
      var inputs = ["input", "select", "textarea", "button"].reduce(

      function (memo, tagName) {
        memo = memo.concat(Array.prototype.slice.call(form.getElementsByTagName(tagName)));
        return memo;
      }, []);
      for (var i = 0, len = inputs.length; i < len; i++) {
        var v = validate.bind(undefined, controller);
        var k = keypress.bind(undefined, controller);
        inputs[i].addEventListener('keypress', k);
        inputs[i].addEventListener('keyup', v);
        inputs[i].addEventListener('blur', v);

        inputs[i].addEventListener('invalid', function (evt) {
          var errorMessage;
          if (evt.target.dataset.error) {
            errorMessage = evt.target.dataset.error;
          }
          if (errorMessage) {
            evt.target.setCustomValidity(errorMessage);
          }
        });
        inputs[i].addEventListener('input', function (evt) {
          var errorMessage;
          if (evt.target.dataset.equalto) {
            var selector = evt.target.dataset.equalto;
            var element = closest(evt.target, "form").querySelector(selector);
            if (element && element.value !== evt.target.value) {
              errorMessage = evt.target.dataset.error || "This does not match.";
            }
          } else {
            evt.target.setCustomValidity("");
            if (!evt.target.checkValidity() && evt.target.dataset.error) {
              errorMessage = evt.target.dataset.error;
            }
          }
          if (errorMessage) {
            evt.target.setCustomValidity(errorMessage);
          } else {
            evt.target.setCustomValidity("");
          }

        });
      }
      this.inputs = inputs;
      this.submitButton = submitBtn;
      if (controller.app.configuration.debug) {
        var faker = require('faker');
        var username = faker.fake('{{name.firstName}}{{name.lastName}}').toLowerCase().substring(0, 14);
        var btnParent = document.createElement('div');
        btnParent.innerHTML = "<button class=\"test\" type=\"button\">Test</button>";

        var testButton = submitBtn.parentNode.insertBefore(btnParent.firstChild, submitBtn);
        testButton.addEventListener('click', function (evt) {
          var data = {
            name: username,
            email: "test+" + username + "@brightdigit.com",
            password: "testTEST123!",
            "confirm-password": "testTEST123!"
          };
          var inputEvt;
          for (var i = 0, len = inputs.length; i < len; i++) {
            var name = inputs[i].getAttribute('name');
            var value = name && data[name];
            if (value) {
              inputEvt = document.createEvent('HTMLEvents');
              inputEvt.initEvent('blur', true, false);
              inputs[i].value = value;
              inputs[i].dispatchEvent(inputEvt);
              inputs[i].setCustomValidity("");
            }
          }
        });
      }
      this.form = form;
      form.addEventListener('submit', function (E) {
        var form = E.target;
        if (navigator.userAgent.indexOf("Safari") > -1) {
          for (var i = 0, len = inputs.length; i < len; i++) {
            var errorMessage;
            if (inputs[i].dataset.equalto) {
              var selector = inputs[i].dataset.equalto;
              var element = closest(inputs[i], "form").querySelector(selector);
              if (element && element.value !== inputs[i].value) {
                errorMessage = inputs[i].dataset.error || "This does not match.";
              }
            } else {
              inputs[i].setCustomValidity("");
              if (!inputs[i].checkValidity() && inputs[i].dataset.error) {
                errorMessage = inputs[i].dataset.error;
              }
            }
            if (errorMessage) {
              inputs[i].setCustomValidity(errorMessage);
            } else {
              inputs[i].setCustomValidity("");
            }
            inputs[i].checkValidity();
          }
        }
        if (navigator.userAgent.indexOf("Safari") < 0 || form.checkValidity()) {
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
            var i = 0;
            if (this.status >= 200 && this.status < 400) {
              // Success!
              var resp = this.response;

              callout.classList.remove('fade');

              for (i = 0, len = inputs.length; i < len; i++) {
                inputs[i].disabled = false;
              }
              controller.changeActivation(JSON.parse(resp), function () {

                videoBg.removeChild(spinner.el);
              });
            } else {
              // We reached our target server, but it returned an error
              //vex.dialog.alert('Thanks for checking out Vex!');
              videoBg.removeChild(spinner.el);
              callout.classList.remove('fade');

              for (i = 0, len = inputs.length; i < len; i++) {
                inputs[i].disabled = false;
              }
              modal(this.response);
            }
          };

          request.onerror = function () {
            // There was a connection error of some sort
            videoBg.removeChild(spinner.el);
            callout.classList.remove('fade');

            for (var i = 0, len = inputs.length; i < len; i++) {
              inputs[i].disabled = false;
            }
          };
          request.send(JSON.stringify(data));
          var spinner = new Spinner().spin();
          videoBg.appendChild(spinner.el);
          callout.classList.add('fade');

          for (var i = 0, len = inputs.length; i < len; i++) {
            inputs[i].disabled = true;
          }
        } else if (navigator.userAgent.indexOf("Safari") > -1) {
          for (var i = 0, len = inputs.length; i < len; i++) {
            console.log(inputs[i].getAttribute('name'), inputs[i].validity);
            inputs[i].classList.toggle("invalid", !inputs[i].checkValidity());
          }
        }
        E.preventDefault();

      });
    }
  };

  return constructor;
})();