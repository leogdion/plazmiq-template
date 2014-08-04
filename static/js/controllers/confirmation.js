define(['zepto', 'hasher', '../libs/validation/index', '../libs/rest/index', '../libs/shared/index'], function ($, hasher, validations, rest, shared) {

  return {
    template: 'confirmation',
    events: {
      "#confirm": {
        "click": function (e) {
          console.log("test");
        }
      },
      "input": {
        "blur": function (e) {
          var $this = $(this);
          var errors = validations($this);
          $this.toggleClass('error', errors.length);
          $this.toggleClass('validated', true);
          $('button').not('.inactive').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated').not('[readonly]').size());
        }
      }
    },
    initialize: function () {
      var data = shared.get('registration');
      console.log(data);
      this.find('#key').val(data.key);
      this.find('#name').val(data.name);
      this.find('#email').val(data.email);
    }
  };
});