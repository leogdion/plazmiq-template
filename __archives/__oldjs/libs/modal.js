var templates = require('../templates');

var Modal = (function () {

  function close(E) {
    var target = E.target;
    while (target && !target.classList.contains('modal')) {
      target = target.parentNode;
    }
    if (target) {
      target.parentNode.removeChild(target);
    }
  }

  function modal(message) {
    var d = document.createElement('div');
    d.innerHTML = templates.modal({
      message: message.substring(0, 150)
    });
    var result = document.body.appendChild(d.firstChild);
    var closeButtons = ["i", "button"].reduce(

    function (memo, tagName) {
      memo = memo.concat(Array.prototype.slice.call(result.getElementsByTagName(tagName)));
      return memo;
    }, []);
    for (var i = 0, len = closeButtons.length; i < len; i++) {
      closeButtons[i].addEventListener('click', close);
    }
  }
  return modal;
})();