define(['zepto', '../libs/validation/index'], function ($, validations) {
  function validate() {
    $('button').not('.inactive').prop('disabled', $('form input.error').size());

  }
  return {
    template: 'login',
    events: {
      'input': {
        'blur': function (e) {
          var $this = $(this);
          var errors = [];
          if ($this.prop('required') || $this.val().trim().length > 0) {
            if ($this.attr('pattern')) {
              if (!(new RegExp($this.attr('pattern'))).test($this.val().trim())) {
                errors.push($this.data('error'));
              }
            } else {
              for (var key in validations) {
                errors.push.apply(errors, validations[key].call($this));
              }
            }
            $this.toggleClass('error', errors.length);
          }
          validate();
        }
      },
      'button.inactive': {
        'click': function (e) {
          console.log('switch');
          $('form h1 span').toggleClass('inactive');
          $('button').toggleClass('inactive').prop('disabled', false);
          validate();
          $('#registration').toggleClass('collapse', this.getAttribute('id') !== 'register');
          $('#registration input').prop('required', this.getAttribute('id') !== 'register');

          //$('button.inactive').prop('disabled', false);
          //return false;
        }
      },
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
    }
  };
});