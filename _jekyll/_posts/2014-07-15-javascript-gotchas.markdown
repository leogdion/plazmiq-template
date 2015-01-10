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
<h1>Double&nbsp;Equals is not what you think it is</h1><p>
<img class="aligncenter" src="http:&#47;&#47;sentencing.typepad.com&#47;.a&#47;6a00d83451574769e20133ec8bfc3b970b-pi" alt="" width="428" height="409" /></p>
<p>There are two types of equality tests people can do in JavaScript: double-equals "<strong>==</strong>" uses <strong>type-coercion&nbsp;</strong>which&nbsp;attempts to convert the values into similar types; triple-equals "<strong>===</strong>"&nbsp;does a <strong>type-sensitive</strong> comparison.</p>
<p><iframe src="http:&#47;&#47;jsfiddle.net&#47;leogdion&#47;SpTx2&#47;43&#47;embedded&#47;result,js" width="100%" height="300" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>
<h2>Solution</h2><br />
If you want the same equals you'd find in other languages, you are going to want to use '==='. The consensus on '<strong>==</strong>' quite frankly is that it should <strong><a href="http:&#47;&#47;www.2ality.com&#47;2011&#47;12&#47;strict-equality-exemptions.html" target="_blank">never</a></strong>&nbsp;be used. <strong>However</strong>&nbsp;for conditionals (if, while, for, etc...)&nbsp;a similar type conversion to boolean is done. This is where type conversions can actually be really convenient,&nbsp;<strong>if</strong> you do not care about the value being strictly a boolean false and only care if it is not undefined or null or 0 or etc...</p>
<pre><code class="javascript">&#47;&#47; more code
if (a !== undefined || a !== null) {
}
&#47;&#47; simpler
if (!a) {
}</code></pre>
<p>The '<strong>falsy</strong>' values in javascript are:</p>
<ul>
<li>false</li>
<li>0 (zero)</li>
<li>"" (empty string)</li>
<li>null</li>
<li>undefined</li>
<li>NaN (i.e. not a number such as dividing by zero)</li><br />
</ul>
<h1>Variable Scopes</h1><br />
How variables are scoped can be a bit confusing. Four&nbsp;things to note:</p>
<ol>
<li>If you do not use the&nbsp;"var" keyword, the&nbsp;value will be set as a property of "<strong>window</strong>", the browser's global variable.
<pre><code class="javascript">value = "test";
console.log(window.value); &#47;&#47;"test"
</code></pre>
<p></li></p>
<li><strong>Scope is by function</strong> and will be carried into each function unless a new variable is declared with the same name.
<pre><code class="javascript">function example () {
  var value = "something";
  function inside () {
    var value = "something else";
    return value;<br />
  }
  return inside();
}
&#47;&#47; "something else"</code></pre>
<p></li></p>
<li>Inside any function, <strong>"this" is assumed to be window unless it is declared a property of this</strong>. That could be set as a property of the object or as a property of the prototype.
<pre><code class="javascript">_value = "Joe";
function example () {
  this._value = "Fred";
}
example.prototype.value = function () {
  return function () {
    return this._value;
  }
};
var item = new example();
item.value() &#47;&#47; "Joe"</code></pre>
<p></li></p>
<li><strong>There is no block scope</strong>. A declaration in a for-loop will not create a new variable. It will just change the current variable inside the scope.</li><br />
</ol><br />
<iframe src="http:&#47;&#47;jsfiddle.net&#47;leogdion&#47;AddcL&#47;16&#47;embedded&#47;js,result" width="100%" height="300" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>
<h2>Solution</h2></p>
<ul>
<li>always make sure to use different variable names or check for&nbsp;an existing value
<p><code class="javascript"> var value = value ? value : newValue;</code></p>
<p></li></p>
<li>for 'this' issues, take advantage of meta-functions: <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;call" target="_blank">call</a>, <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;apply" target="_blank">apply</a>, and <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;bind" target="_blank">bind</a>.</li><br />
</ul></p>
<h1>It's not all bad</h1><br />
These quirks can be really annoying at first but once you get use to it. When you do hit bugs make sure to:</p>
<ul>
<li>that&nbsp;you are using '==='</li>
<li>what is the current 'this', you are accessing</li>
<li>do not reuse variable names</li><br />
</ul><br />
Next time I will show one of the real powerful advantages of javascript: manipulating functions. I will talk about&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;call" target="_blank">call</a>,&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;apply" target="_blank">apply</a>, and&nbsp;<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;bind" target="_blank">bind</a>&nbsp;as well as the <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Array#Iteration_methods" target="_blank">array iterator methods.</a></p>
<h2>References</h2></p>
<ul>
<li><a href="http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;" target="_blank">http:&#47;&#47;www.2ality.com&#47;2011&#47;12&#47;strict-equality-exemptions.html</a></li>
<li><a href="http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;">http:&#47;&#47;www.sitepoint.com&#47;javascript-truthy-falsy&#47;</a></li>
<li><a href="http:&#47;&#47;www.codeproject.com&#47;Articles&#47;182416&#47;A-Collection-of-JavaScript-Gotchas" target="_blank">http:&#47;&#47;www.codeproject.com&#47;Articles&#47;182416&#47;A-Collection-of-JavaScript-Gotchas</a></li><br />
</ul><br />
&nbsp;</p>
