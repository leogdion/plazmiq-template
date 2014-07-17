define(['templates', 'zepto'], function (templates, $) {
  var app = {};
  $('main').html(templates.home());

  return app;
});