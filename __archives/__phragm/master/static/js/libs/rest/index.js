define(['zepto'], function ($) {
  function serialize(selector) {
    var $form = $(selector);
    $form.find('input').each(function () {
      $(this).attr('name', $(this).attr('name') || $(this).attr('id'));
    });
    console.log($form.serializeArray());
    return JSON.stringify($form.serializeArray().reduce(function (memo, item) {
      memo[item.name] = item.value;
      return memo;
    }, {}));
  }

  function request(memo, method) {
    function _request(method, resource, selector, settings) {
      return $.ajax($.extend(settings, {
        type: method,
        url: '/api/v1/' + resource,
        contentType: 'application/json',
        data: serialize(selector)
      }));
    }
    memo[method] = _request.bind(undefined, method);
    return memo;
  }
  return ['post', 'get', 'put'].reduce(request, {});
});