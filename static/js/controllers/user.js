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
        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:5000/api/v1/users', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function () {
          if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;
            console.log(resp);
          } else {
            // We reached our target server, but it returned an error
            console.log(this);
          }
        };

        request.onerror = function () {
          // There was a connection error of some sort
        };
        request.send(JSON.stringify(data));
        E.preventDefault();
      });
    }
  };

  return constructor;
})();