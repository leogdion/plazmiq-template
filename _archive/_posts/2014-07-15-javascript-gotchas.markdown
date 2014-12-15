---
layout: post
status: publish
published: true
title: JavaScript Gotchas
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: One of the difficulties in learning JavaScript are all the tricky quirks.
  With learning any new language, there are always quirks like this but with JavaScript
  they can especially drive you crazy.&nbsp;
wordpress_id: 836
wordpress_url: http://www.brightdigit.com/?p=836
date: '2014-07-15 20:36:36 -0400'
date_gmt: '2014-07-15 20:36:36 -0400'
categories:
- Uncategorized
tags: []
comments: []
---
<p>One of the difficulties in learning JavaScript are all the tricky quirks. With learning any new language, there are always quirks like this but with JavaScript they can especially drive you crazy.&nbsp;<a id="more"></a><a id="more-836"></a>Here are the top two issues:</p>
<h1>Double&nbsp;Equals is not what you think it is<&#47;h1><br />
<img class="aligncenter" src="http:&#47;&#47;sentencing.typepad.com&#47;.a&#47;6a00d83451574769e20133ec8bfc3b970b-pi" alt="" width="428" height="409" &#47;></p>
<p>There are two types of equality tests people can do in JavaScript: double-equals "<strong>==<&#47;strong>" uses <strong>type-coercion&nbsp;<&#47;strong>which&nbsp;attempts to convert the values into similar types; triple-equals "<strong>===<&#47;strong>"&nbsp;does a <strong>type-sensitive<&#47;strong> comparison.</p>
<p><iframe src="http:&#47;&#47;jsfiddle.net&#47;leogdion&#47;SpTx2&#47;43&#47;embedded&#47;result,js" width="100%" height="300" frameborder="0" allowfullscreen="allowfullscreen"><&#47;iframe></p>
<h2>Solution<&#47;h2><br />
If you want the same equals you'd find in other languages, you are going to want to use '==='. The consensus on '<strong>==<&#47;strong>' quite frankly is that it should <strong><a href="http:&#47;&#47;www.2ality.com&#47;2011&#47;12&#47;strict-equality-exemptions.html" target="_blank">never<&#47;a><&#47;strong>&nbsp;be used. <strong>However<&#47;strong>&nbsp;for conditionals (if, while, for, etc...)&nbsp;a similar type conversion to boolean is done. This is where type conversions can actually be really convenient,&nbsp;<strong>if<&#47;strong> you do not care about the value being strictly a boolean false and only care if it is not undefined or null or 0 or etc...</p>
<p>[javascript]</p>
<p>&#47;&#47; more code</p>
<p>if (a !== undefined || a !== null) {</p>
<p>}</p>
<p>&#47;&#47; simpler</p>
<p>if (!a) {</p>
<p>}</p>
<p>[&#47;javascript]</p>
<p>The '<strong>falsy<&#47;strong>' values in javascript are:</p>
<ul>
<li>false<&#47;li>
<li>0 (zero)<&#47;li>
<li>"" (empty string)<&#47;li>
<li>null<&#47;li>
<li>undefined<&#47;li>
<li>NaN (i.e. not a number such as dividing by zero)<&#47;li><br />
<&#47;ul></p>
<h1>Variable Scopes<&#47;h1><br />
How variables are scoped can be a bit confusing. Four&nbsp;things to note:</p>
<ol>
<li>If you do not use the&nbsp;"var" keyword, the&nbsp;value will be set as a property of "<strong>window<&#47;strong>", the browser's global variable.
<p>[javascript]value = "test";</p>
<p>console.log(window.value); &#47;&#47;"test"</p>
<p>[&#47;javascript]</p>
<p><&#47;li></p>
<li><strong>Scope is by function<&#47;strong> and will be carried into each function unless a new variable is declared with the same name.
<p>[javascript]<br />
function example () {<br />
  var value = "something";</p>
<p>  function inside () {<br />
    var value = "something else";<br />
    return value;<br />
  }</p>
<p>  return inside();<br />
}<br />
&#47;&#47; "something else"</p>
<p>[&#47;javascript]</p>
<p><&#47;li></p>
<li>Inside any function, <strong>"this" is assumed to be window unless it is declared a property of this<&#47;strong>. That could be set as a property of the object or as a property of the prototype.
<p>[javascript]<br />
_value = "Joe";</p>
<p>function example () {<br />
  this._value = "Fred";<br />
}</p>
<p>example.prototype.value = function () {<br />
  return function () {<br />
    return this._value;<br />
  }<br />
};</p>
<p>var item = new example();<br />
item.value() &#47;&#47; "Joe"</p>
<p>[&#47;javascript]</p>
<p><&#47;li></p>
<li><strong>There is no block scope<&#47;strong>. A declaration in a for-loop will not create a new variable. It will just change the current variable inside the scope.<&#47;li><br />
<&#47;ol><br />
<iframe src="http:&#47;&#47;jsfiddle.net&#47;leogdion&#47;AddcL&#47;16&#47;embedded&#47;js,result" width="100%" height="300" frameborder="0" allowfullscreen="allowfullscreen"><&#47;iframe></p>
<h2>Solution<&#47;h2></p>
<ul>
<li>always make sure to use different variable names or check for&nbsp;an existing value
<p>[javascript] var value = value ? value : newValue;[&#47;javascript]</p>
<p><&#47;li></p>
<li>for 'this' issues, take advantage of meta-functions: <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;call" target="_blank">call<&#47;a>, <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;apply" target="_blank">apply<&#47;a>, and <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;bind" target="_blank">bind<&#47;a>.<&#47;li><br />
<&#47;ul></p>
<h1>It's not all bad<&#47;h1><br />
These quirks can be really annoying at first but once you get use to it. When you do hit bugs make sure to:</p>
<ul>
<li>that&nbsp;you are using '==='<&#47;li>
<li>what is the current 'this', you are accessing<&#47;li>
<li>do not reuse variable names<&#47;li><br />
<&#47;ul><br />
Next time I will show one of the real powerful advantages of javascript: manipulating functions. I will talk about&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;call" target="_blank">call<&#47;a>,&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;apply" target="_blank">apply<&#47;a>, and&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;bind" target="_blank">bind<&#47;a>&nbsp;as well as the <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Array#Iteration_methods" target="_blank">array iterator methods.<&#47;a></p>
<h2>References<&#47;h2></p>
<ul>
<li><a href="http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;" target="_blank">http:&#47;&#47;www.2ality.com&#47;2011&#47;12&#47;strict-equality-exemptions.html<&#47;a><&#47;li>
<li><a href="http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;">http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;<&#47;a><&#47;li>
<li><a href="http:&#47;&#47;www.codeproject.com&#47;Articles&#47;182416&#47;A-Collection-of-JavaScript-Gotchas" target="_blank">http:&#47;&#47;www.codeproject.com&#47;Articles&#47;182416&#47;A-Collection-of-JavaScript-Gotchas<&#47;a><&#47;li><br />
<&#47;ul><br />
&nbsp;</p>
