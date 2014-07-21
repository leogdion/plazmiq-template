define(['zepto', '../libs/validation/index', '../libs/rest/index'], function ($, validations, rest) {
  function validate() {
    $('button').not('.inactive').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').size());
    // not(validated)required + error
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
                  console.log('posted registration');
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
                },
                error: function (xhr, errorType, error) {
                  console.log('error sessions');
                }
              });
            } else {
              throw "unknown button";
            }
          }
          //e.preventDefault();
          //e.stopPropagation();
          //$('button.inactive').prop('disabled', false);
        }
      },
/*
      '#register': {
        'click': function (e) {
          console.log(this.classList);
          if (!this.classList.contains('inactive')) {
            console.log('register');
          }
        }
      },
      '#signin': {
        'click': function (e) {
          console.log(this.classList);
          if (!this.classList.contains('inactive')) {
            console.log('signin');
          }
        }
      }
      */
    }
  };
});