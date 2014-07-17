define(function () {
  return {
    template: 'login',
    events: {
      'button.inactive': {
        'click': function (e) {
          console.log('switch');
          return false;
        }
      },
      '#register': {
        'click': function (e) {
          if (!this.classList.contains('inactive')) {
            console.log('register');
          }
        }
      },
      '#signin': {
        'click': function (e) {
          if (!this.classList.contains('inactive')) {
            console.log('signin');
          }
        }
      }
    }
  };
});