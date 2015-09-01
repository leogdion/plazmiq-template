var Spinner = require('spin.js');
var modal = require("../libs/modal");
var templates = require('../templates');

var User = (function () {
  var constructor = function () {

  };

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
  }

  function validate(controller, evt) {
    if (evt.target.value !== undefined && evt.target.dataset.charTransform) {
      evt.target.value = evt.target.value[evt.target.dataset.charTransform]();
    }

    var pattern = evt.target.getAttribute('pattern');
    if (pattern) {
      if (!(new RegExp(pattern)).test(evt.target.value.trim())) {
        evt.target.setCustomValidity(evt.target.dataset.error);
      } else {
        evt.target.setCustomValidity("");
      }
    }

    evt.target.dataset.validated = true;
    controller.applyValidate(evt);
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  constructor.prototype = {
    applyValidate: function (evt) {
      var isValid = true;
      for (var i = 0, len = this.inputs.length; i < len && isValid; i++) {
        var input = this.inputs[i];
        isValid = input.tagName.toLowerCase() == "button" || (input.dataset.validated && input.validity.valid);
      }
      this.submitButton.disabled = !isValid;
    },
    changeActivation: function (data) {
      var transitionEvent = whichTransitionEvent();
      if (transitionEvent) {
        this.form.addEventListener(transitionEvent, function () {
          console.log('Transition complete!  This is the callback, no library needed!');
        });
      }
      this.form.classList.add('fade');
      var d = document.createElement('div');
      d.innerHTML = templates.activation(data);
      var activationForm = this.form.parentNode.appendChild(d.firstChild);
      activationForm.classList.add('fade');
      setTimeout(function () {
        activationForm.classList.add('in');

      }, 100);
      var inputs = activationForm.getElementsByTagName('input');
      for (var i = 0, len = inputs.length; i < len; i++) {
        inputs[i].readOnly = !! (inputs[i].value);
      }
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
        inputs[i].parentNode.addEventListener('mouseover', function (evt) {
          var target = evt.target.tagName.toLowerCase() === 'input' ? evt.target.parentNode : evt.target;
          var errorMsg = target.classList.contains('error-message') ? target : target.getElementsByClassName('error-message')[0];
          if (errorMsg) {
            errorMsg.classList.add("active");
          }
        });
        inputs[i].parentNode.addEventListener('mouseout', function (evt) {
          var target = evt.target.tagName.toLowerCase() === 'input' ? evt.target.parentNode : evt.target;
          var errorMsg = target.getElementsByClassName('error-message')[0];
          if (errorMsg) {
            errorMsg.classList.remove("active");
          }
        });
        var errorMessage = inputs[i].dataset.error;
        if (errorMessage) {
          var divContainer = document.createElement("div");
          var paragraphElement = document.createElement("p");
          paragraphElement.innerHTML = errorMessage;
          divContainer.classList.add("error-message");
          divContainer.appendChild(paragraphElement);

        }
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
            }
          }
        });
      }
      this.form = form;
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
          var i = 0;
          if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;

            videoBg.removeChild(spinner.el);
            callout.classList.remove('fade');

            for (i = 0, len = inputs.length; i < len; i++) {
              inputs[i].disabled = false;
            }
            controller.changeActivation(JSON.parse(resp));
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