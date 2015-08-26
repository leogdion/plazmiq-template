var User = (function () {
  var constructor = function () {

  };

  constructor.prototype = {
    initialize: function () {
      console.log('user initialized');
      var form = document.getElementById("user-registration");
      var inputs = ["input", "select", "textarea"].reduce(

      function (memo, tagName) {
        memo = memo.concat(Array.prototype.slice.call(form.getElementsByTagName(tagName)));
        return memo;
      }, []);
      form.addEventListener('submit', function (E) {
        var form = E.target;
        var data = inputs.reduce(function (memo, element) {
          var key = element.getAttribute('name') || element.getAttribute('id');
          var value = element.value || (element.selectedIndex && element.options && element.options[element.selectedIndex]);
          var ignore = element.hasAttribute('data-ignore');
          if (key && value && !ignore) {
            memo[key] = value;
          }
          return memo;
        }, {});
        console.log(data);
        E.preventDefault();
      });
    }
  };

  return constructor;
})();