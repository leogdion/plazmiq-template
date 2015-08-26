var User = (function () {
  var constructor = function () {

  };

  constructor.prototype = {
    initialize: function () {
      console.log('user initialized');
      var form = document.getElementById("user-registration");
      form.addEventListener('submit', function (E) {
        console.log('form submitted');
        E.preventDefault();
      });
    }
  };

  return constructor;
})();