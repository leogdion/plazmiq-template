define(function () {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return function () {
    var valid = (this.attr('type') !== 'email') || regex.test(this.val());
    if (!valid) {
      return ["This does not match a valid email address."];
    }
  };
});