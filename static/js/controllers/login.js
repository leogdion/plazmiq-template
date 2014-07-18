define(['zepto'], function ($) {
  function validate() {
    $('button').not('.inactive').prop('disabled', true);

  }
  return {
    template: 'login',
    events: {
      'input': {
        'blur': function (e) {
          var $this = $(this);
          if ($this.prop('required') || $this.val().trim().length > 0) {

          }
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