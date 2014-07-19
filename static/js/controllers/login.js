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
            for (var key in validations) {
              errors.push.apply(errors, validations[key].call($this));
            }
            console.log(errors);
            $this.toggleClass('error', errors.length);
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
            $('#registration input').prop('required', this.getAttribute('id') !== 'register');
          } else {
            console.log(this.getAttribute('id'));
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