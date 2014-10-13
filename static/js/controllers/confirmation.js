define(['zepto', 'hasher', 'store', 'smoke', '../libs/validation/index', '../libs/rest/index', '../libs/shared/index'], function ($, hasher, store, smoke, validations, rest, shared) {
  console.log(smoke);

  function validate() {
    $('button').not('.inactive').not('#test').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated,[readonly],[type="hidden"]').size());
  }
  return {
    templates: {
      'main': 'confirmation',
      '#log-nav': 'login-nav'
    },
    events: {
      "#confirm": {
        "click": function (e) {
          console.log("test");
        }
      },
      'input[type=text],input[type=password]': {
        'keyup': function (e) {
          var $this = $(this);
          var errors = [];
          console.log("input blur");
          if ($this.prop('required') || $this.val().trim().length > 0) {
/*
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            */
            errors = validations($this);
            console.log(errors);

            var errorList = $this.next("ul.errors").empty();
            errorList = errorList.length ? errorList : $('<ul class="errors"></ul>').insertAfter($this);
            $this.toggleClass('validated', true);
            if ($this.toggleClass('error', errors.length).hasClass('error')) {
/*
              console.log(errorList);
              $.each(errors, function () {
                errorList.append("<li>" + this + "</li>");
              });
              */
            }

          }
          validate();
        }
      },
      "input": {
        "blur": function (e) {
          var $this = $(this);
          var errors = [];
          console.log("input blur");
          if ($this.prop('required') || $this.val().trim().length > 0) {
/*
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            */
            errors = validations($this);
            console.log(errors);
            $this.toggleClass('error', errors.length);
            $this.toggleClass('validated', true);
          }
          validate();
        }
      },
/*"input#secret": {
        "keypress": function (e) {
          var $this = $(this);
          var errors = validations($this);
          $this.toggleClass('error', errors.length);
          $this.toggleClass('validated', true);
          $('button').not('.inactive').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').not('[readonly]').size());

        }
      },*/
      'button#test': {
        'click': function (e) {
          console.log("test - confirm");
          $('input#secret').val('testTEST123!');
          $('input').toggleClass('validated', true).toggleClass('error', false);
          validate();
        }
      },
      'button#confirm': {
        'click': function (e) {
          console.log('begin posting user');
          $('form fieldset').prop('disabled', true);
          rest.post('users', 'form', {
            success: function (data, status, xhr) {
              console.log('posted user');
              smoke.signal("Welcome! Your account has been created. Please login to begin.", function (e) {
                hasher.setHash('login');
              }, {
                duration: 3000,
                classname: "custom-class"
              });
            },
            error: function (xhr, errorType, error) {
              console.log(errorType);
              console.log(error);
              console.log('error user confirmation');
              var message;
              switch (xhr.status) {
              case 409:
                message = "Sorry. The username you have chosen is already in use. Please try a different one.";
                break;
              case 404:
                message = "The information you have entered does not match our records. Please check your confirmation information or try registering again.";
                break;
              default:
                message = "Sorry. There is an unknown server error. Please notify the <a href=\"mailto:www@phragm.com\">administrator</a>.";
                break;
              }
              smoke.alert(message, function (e) {
                $('form fieldset').prop('disabled', false);
              });
              // confirmation incorrect
              // username in use
              // app key unknown
            }
          });
        }
      }
    },
    setup: function () {
      var $this = this.find('#name');
      var errors = [];
      console.log("input blur");
      if ($this.prop('required') || $this.val().trim().length > 0) {
/*
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            */
        errors = validations($this);
        console.log(errors);

        var errorList = $this.next("ul.errors").empty();
        errorList = errorList.length ? errorList : $('<ul class="errors"></ul>').insertAfter($this);
        $this.toggleClass('validated', true);
        if ($this.toggleClass('error', errors.length).hasClass('error')) {
/*
              console.log(errorList);
              $.each(errors, function () {
                errorList.append("<li>" + this + "</li>");
              });
              */
        }

      }
    },
    prepare: function (cb) {
      var data = {
        registration: shared.get('registration')
      };
      console.log(data);
      this.find('#key').val(data.key);
      this.find('#name').val(data.name);
      this.find('#email').val(data.email);
      this.find('#password').val(data.password);
      cb(data);
    }
  };
});