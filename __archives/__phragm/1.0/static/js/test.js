function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

ready(function () {
  var secret = getParameterByName("secret");
  if (secret) {
    localStorage.setItem("registration-secret", secret);
  }
  var email = getParameterByName("email");
  document.getElementById("registration").querySelectorAll('button')[0].addEventListener('click', function (evt) {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3001/api/v1/registrations', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = this.response;
        var data = JSON.parse(resp);
        localStorage.setItem('registration-key', data.key);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send(JSON.stringify({
      'email': 'leo.dion@gmail.com',
      'apiKey': 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/',
      'redirect': {
        'uri': 'http://localhost:8081/test/'
      }
    }));
    evt.preventDefault();
  });

  var confirmation = document.getElementById("confirmation");
  var secret = localStorage.getItem("registration-secret");
  var key = localStorage.getItem("registration-key");
  if (secret) {
    confirmation.querySelectorAll('[name="secret"]')[0].setAttribute('value', secret);
  }
  if (key) {
    confirmation.querySelectorAll('[name="key"]')[0].setAttribute('value', key);
  }
  if (email) {
    confirmation.querySelectorAll('[name="email"]')[0].setAttribute('value', email);

  }
  confirmation.querySelectorAll('button')[0].addEventListener('click', function (evt) {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3001/api/v1/users', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = this.response;
        console.log(resp);
        //var data = JSON.parse(resp);
        //localStorage.setItem('registration-key', data.key);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };
    var data = Array.prototype.reduce.call(confirmation.querySelectorAll('[name]'), function (memo, elem) {
      memo[elem.getAttribute('name')] = elem.value;
      return memo;
    }, {});
    data.apiKey = 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/';
    console.log(data);
    request.send(JSON.stringify(data));
    evt.preventDefault();
  });


  var login = document.getElementById("login");
  login.querySelectorAll('button')[0].addEventListener('click', function (evt) {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3001/api/v1/sessions', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = this.response;
        console.log(resp);
        //var data = JSON.parse(resp);
        //localStorage.setItem('registration-key', data.key);
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };
    var data = Array.prototype.reduce.call(login.querySelectorAll('[name]'), function (memo, elem) {
      memo[elem.getAttribute('name')] = elem.value;
      return memo;
    }, {});
    data.apiKey = 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/';
    request.send(JSON.stringify(data));
    evt.preventDefault();
  });
});