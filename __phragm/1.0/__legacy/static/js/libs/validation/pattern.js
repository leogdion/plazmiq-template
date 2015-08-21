define(function () {
  return function () {
    if (this.attr('pattern')) {
      if (!(new RegExp(this.attr('pattern'))).test(this.val().trim())) {
        return [this.data('error')];
      }
    }
    return [];
  };
});