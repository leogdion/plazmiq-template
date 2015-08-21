define(['zepto', 'hasher', '../libs/validation/index', '../libs/rest/index', '../libs/shared/index'], function ($, hasher, validations, rest, shared) {
  function validate() {
    $('button').not('.inactive').not('#test').prop('disabled', $('form input.error').size() + $('form input[required]').not('.validated,[readonly],[type="hidden"]').size());
  }
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
              hasher.setHash('profile');
            },
            error: function (xhr, errorType, error) {
              console.log('error user confirmation');
            }
          });
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