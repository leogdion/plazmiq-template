---
layout: post
status: publish
published: true
title: How to allow Chosen to add new tags?
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: "<a href=\"http:&#47;&#47;harvesthq.github.com&#47;chosen&#47;\" target=\"_blank\">Chosen</a>
  is a terrific javascript plugin which makes large dropdown selection more user-friendly.
  For <a href=\"http:&#47;&#47;teenytrackr.com\" target=\"_blank\">teenytrackr</a>,
  I was looking for a way to allow easy tagging of different entries. Unfortunately,
  Chosen does not come with a built it way to add new items to the selector on the
  fly.\r\n\r\n"
wordpress_id: 230
wordpress_url: http://leogdion.name/?p=217
date: '2012-10-22 08:30:00 -0400'
date_gmt: '2012-10-22 12:30:00 -0400'
categories:
- Code
tags: []
comments: []
---
<p><a href="http:&#47;&#47;harvesthq.github.com&#47;chosen&#47;" target="_blank">Chosen<&#47;a> is a terrific javascript plugin which makes large dropdown selection more user-friendly. For <a href="http:&#47;&#47;teenytrackr.com" target="_blank">teenytrackr<&#47;a>, I was looking for a way to allow easy tagging of different entries. Unfortunately, Chosen does not come with a built it way to add new items to the selector on the fly.</p>
<p><a id="more"></a><a id="more-230"></a></p>
<p>Check out my entry at <a href="http:&#47;&#47;stackoverflow.com&#47;a&#47;12961228&#47;97705" target="_blank">stackoverflow<&#47;a>, where I explain how to take an initialized "chosen" object and add the ability to add new tags. Check out the code snippet below:</p>
<p>[js]<br />
var dropDown = $('select.chosen');<br />
dropDown<br />
   .parent()<br />
   .find('.chzn-container .search-field input[type=text]')<br />
   .keydown( function (evt) {<br />
var stroke, _ref, target, list;<br />
&#47;&#47; get keycode<br />
stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;<br />
target = $(evt.target);<br />
&#47;&#47; get the list of current options<br />
list = target<br />
       .parents('.chzn-container')<br />
       .find('.chzn-choices li.search-choice &amp;amp;amp;gt; span').map(<br />
           function () { return $(this).text(); })<br />
       .get();<br />
if (stroke === 9 || stroke === 13) {<br />
var value = $.trim(target.val());<br />
&#47;&#47; if the option does not exists<br />
if ($.inArray(value,list) &amp;amp;amp;lt; 0) {<br />
var option = $('&amp;amp;amp;lt;option&amp;amp;amp;gt;');<br />
option.text(value).val(value).appendTo(dropDown);<br />
option.attr('selected','selected');<br />
&#47;&#47; add the option and set as selected<br />
}<br />
&#47;&#47; trigger the update event<br />
dropDown.trigger(&amp;amp;amp;quot;liszt:updated&amp;amp;amp;quot;);<br />
return false;<br />
}<br />
});<br />
[&#47;js]</p>
<p><a href="http:&#47;&#47;stackoverflow.com&#47;a&#47;12961228&#47;97705" target="_blank">&nbsp; [stackoverflow]<&#47;a></p>
