define(['zepto', 'hasher', '../libs/validation/index', '../libs/rest/index', '../libs/names/index', '../libs/shared/index'], function ($, hasher, validations, rest, names, shared) {
  function validate() {
    $('button').not('.inactive').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').size());
  }
  return {
    template: 'login',
    events: {
      'input': {
        'blur': function (e) {
          var $this = $(this);
          var errors = [];
          if ($this.prop('required') || $this.val().trim().length > 0) {
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            console.log(errors);
            $this.toggleClass('error', errors.length);
            $this.toggleClass('validated', true);
          }
          validate();
        }
      },
      'button#test': {
        'click': function (e) {
          var data = names();
          $('input#email').val(data.email);
          $('input#name').val(data.username);
          $('input#password').val('testTEST123!');
          $('input#confirmPassword').val('testTEST123!');
          $('input').toggleClass('validated', true).toggleClass('error', false);
          validate();
        }
      },
      'button': {
        'click': function (e) {
          if (this.classList.contains('inactive')) {
            console.log('switch');
            $('form h1 span').toggleClass('inactive');
            $('button').toggleClass('inactive').prop('disabled', false);
            validate();
            $('#registration').toggleClass('collapse', this.getAttribute('id') !== 'register');
            $('#registration input').prop('required', this.getAttribute('id') === 'register');
          } else {
            if (this.getAttribute('id') === 'register') {
              console.log('begin posting registration');
              rest.post('registrations', 'form', {
                success: function (data, status, xhr) {
                  shared.set('registration', data);
                  console.log('posted registration');
                  hasher.setHash('confirmation');
                },
                error: function (xhr, errorType, error) {
                  console.log('error registration');
                }
              });
            } else if (this.getAttribute('id') === 'signin') {
              console.log('begin posting session');
              rest.post('sessions', 'form', {
                success: function (data, status, xhr) {
                  console.log('posted sessions');
                  hasher.setHash('profile');
                },
                error: function (xhr, errorType, error) {
                  console.log('error sessions');
                }
              });
            }
          }
        }
      }
    }
  };
});