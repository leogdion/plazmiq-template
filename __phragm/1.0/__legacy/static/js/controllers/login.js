/*jshint multistr: true */
define(['zepto', 'hasher', 'store', 'smoke', '../libs/validation/index', '../libs/rest/index', '../libs/names/index', '../libs/shared/index'], function ($, hasher, store, smoke, validations, rest, names, shared) {
  console.log(smoke);

  function validate() {
    $('button').not('.inactive').not('#test').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').size());
  }

  return {
    templates: {
      'main': 'login',
      '#log-nav': 'login-nav'
    },
    events: {
      'input[data-char]': {
        'keypress': function (e) {
          console.log(String.fromCharCode(e.which));

          if (!(String.fromCharCode(e.which).match($(this).attr('data-char')))) {
            return false;
          }
        }
      },
      'input[data-char-transform]': {
        'blur': function (e) {
          var $this = $(this);
          $this.val($this.val()[$this.attr('data-char-transform')]());
        }
      },
      'input[type=text],input[type=password],input[type=email]': {
        'keyup': function (e) {
          var $this = $(this);
          var errors = [];

          console.log("input keyup: " + $this.val());
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
      'input': {
        'blur': function (e) {
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
              console.log(errorList);
              $.each(errors, function () {
                errorList.append("<li>" + this + "</li>");
              });
            }

          }
          validate();
        }
      },
      'button#test': {
        'click': function (e) {
          console.log("test - login");
          var data = names();
          $('input#email').val(data.email);
          $('input#name').val(data.username);
          $('input#password').val('testTEST123!');
          $('input#confirmPassword').val('testTEST123!');
          $('input').toggleClass('validated', true).toggleClass('error', false);
          $('ul.errors').empty();
          validate();
        }
      },
      'button': {
        'click': function (e) {
          if (this.classList.contains('inactive')) {
            console.log('switch');
            $('form h1 span').toggleClass('inactive');
            $('button').not("#test").toggleClass('inactive').prop('disabled', false);
            validate();
            $('#registration').toggleClass('collapse', this.getAttribute('id') !== 'register');
            $('#registration input').prop('required', this.getAttribute('id') === 'register');
          } else {
            if (this.getAttribute('id') === 'register') {
              console.log('begin posting registration');
              $('form fieldset').prop('disabled', true);
              rest.post('registrations', 'form', {
                success: function (data, status, xhr) {
                  data.name = $('input#name').val();
                  data.email = $('input#email').val();
                  data.password = $('input#password').val();
                  shared.set('registration', data);
                  console.log('posted registration');
                  hasher.setHash('confirmation');
                },
                error: function (xhr, errorType, error) {
                  console.log('error registration');
                  var message;
                  switch (xhr.status) {
                  case 409:
                    message = "Sorry. The email address is already in use. Please check for your username and password or request a password reset.";
                    break;
                  default:
                    message = "Sorry. There is an unknown server error. Please notify the <a href=\"mailto:www@phragm.com\">administrator</a>.";
                    break;
                  }
                  smoke.alert(message, function (e) {
                    $('form fieldset').prop('disabled', false);
                  });
                }
              });
            } else if (this.getAttribute('id') === 'signin') {
              console.log('begin posting session');
              $('form fieldset').prop('disabled', true);
              rest.post('sessions', 'form', {
                success: function (data, status, xhr) {
                  console.log('posted sessions');
                  shared.set('user', data.user);
                  delete data.user;
                  store(data);
                  hasher.setHash('profile');
                },
                error: function (xhr, errorType, error) {
                  console.log('error sessions');
                  var message;
                  switch (xhr.status) {
                  case 401:
                    message = "Sorry. The username and password you have entered are incorrect.";
                    break;
                  default:
                    message = "Sorry. There is an unknown server error. Please notify the <a href=\"mailto:www@phragm.com\">administrator</a>.";
                    break;
                  }
                  smoke.alert(message, function (e) {
                    $('form fieldset').prop('disabled', false);
                  });
                }
              });
            }
          }
        }
      }
    }
  };
});