define(['zepto', 'hasher', '../libs/validation/index', '../libs/rest/index', '../libs/shared/index'], function ($, hasher, validations, rest, shared) {

  return {
    template: 'confirmation',
    events: {},
    initialize: function () {
      var data = shared.get('registration');
      console.log(data);
      this.find('#key').val(data.key);
      this.find('#name').val(data.name);
      this.find('#email').val(data.email);
    }
  };
});