var svg = require('browsernizr/test/websockets');
var $ = require("browserify-zepto");

WebFontConfig = {
  google: {
    families: ['Oxygen+Mono::latin', 'Oxygen:700,400,300:latin', 'Cardo:400,700:latin']
  }
};
(function () {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

// SVG / PNG
if (!svg) {
  $('img[src*="svg"]').attr('src', function () {
    return $(this).attr('src').replace('.svg', '.png');
  });
}