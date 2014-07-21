define(['zepto'], function ($) {
  function serialize(selector) {
    return $(selector).serializeArray().reduce(function (memo, item) {
      memo[item.name] = item.value;
      return memo;
    }, {});
  }

  function request(memo, method) {
    function _request(method, resource, selector, settings) {
      return $.ajax($.extend(settings, {
        type: method,
        url: '/api/v1/' + resource,
        data: serialize(selector)
      }));
    }
    memo[method] = _request.bind(undefined, method);
    return memo;
  }
  return ['post', 'get', 'put'].reduce(request, {});
});