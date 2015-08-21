define(['zepto'], function ($) {
  return function () {
    if (this.data('match')) {
      console.log(this.val());
      console.log($(this.data('match')).val());
      if (this.val() !== $(this.data('match')).val()) {
        return ['This does not match the password.'];
      }
    }
    return [];
  };
});