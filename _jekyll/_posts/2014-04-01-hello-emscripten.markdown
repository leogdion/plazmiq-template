---
layout: post
status: publish
published: true
title: Hello Emscripten!
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: "It has been often said JavaScript is the assembly language of the web, then
  I suppose that would make <a href=\"https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;wiki\"
  target=\"_blank\">emscripten</a> a compiler(or transcompiler). <a href=\"https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;wiki\"
  target=\"_blank\">Emscripten</a> is powerful tool which is able to take compiled
  c&#47;c++ byte code and translate it to JavaScript.\r\n\r\n"
wordpress_id: 758
wordpress_url: http://www.brightdigit.com/?p=758
date: '2014-04-01 13:59:14 -0400'
date_gmt: '2014-04-01 13:59:14 -0400'
categories:
- Uncategorized
tags:
- javascript
- nodejs
- emscripten
comments: []
---
<p>It has been often said JavaScript is the assembly language of the web, then I suppose that would make <a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;wiki" target="_blank">emscripten</a> a compiler(or transcompiler). <a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;wiki" target="_blank">Emscripten</a> is powerful tool which is able to take compiled c&#47;c++ byte code and translate it to JavaScript.</p>
<p><a id="more"></a><a id="more-758"></a>Right now I am working on taking the <a href="https:&#47;&#47;code.google.com&#47;p&#47;game-music-emu&#47;" target="_blank">game music emulator library</a> and <a href="https:&#47;&#47;github.com&#47;leogdion&#47;gmemujs" target="_blank">making a JavaScript library</a> to play <a href="http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;NES_Sound_Format" target="_blank">nsf (NES Sound Format)</a> and other console music files playable on the browser.&nbsp;Let's take a basic look at how to compile a JavaScript library from c&#47;c++ code with our old friend "hello world".</p>
<h1>Requirements and Components</h1>
<p>First let's look at the requirements:</p>
<h2>Requirements</h2>
<dl>
<dt><a href="http:&#47;&#47;nodejs.org&#47;" target="_blank">NodeJS</a></dt>
<dd>for building the project, this should be easy to install. Just follow the instructions on the website.</dd>
<dt><a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten" target="_blank">Emscripten</a></dt>
<dd>for compiling the c+ code to JavaScript. On my mac using the portable installation this seemed to work fine. On windows, the nsis package worked well. Just make sure to add the paths to the binary executables (ie emcc)</p>
<div class="well">
<p>On Windows XP, I had to install <a href="http:&#47;&#47;java.com&#47;en&#47;" target="_blank">Java </a>and the <a href="http:&#47;&#47;www.microsoft.com&#47;en-us&#47;download&#47;details.aspx?id=5555" target="_blank">Visual C++ 2010 Redistributable Package</a>.<br> You may need to install it for Windows Vista, 7, and 8.</p>
<p></div>
</dd>
<dt><a href="http:&#47;&#47;gruntjs.com&#47;" target="_blank">Grunt</a></dt>
<dd>once you've installed nodejs and npm, install the grunt command globally using npm<pre><code class="bash">npm -g install grunt</code></pre></p>
<p></dd></dl></p>
<h2>Components</h2></p>
<dl>
<dt>package.json</dt>
<dd>for what node modules that need to be installed</dd>
<dt>Gruntfile.js</dt>
<dd>the "make" file</dd>
<dt>public</dt>
<dd>web site with the sample</dd>
<dt>src&#47;c&#47;hello-emscripten.c</dt>
<dd>sample c code</dd>
<dt>src&#47;js&#47;hello-emscripten.js</dt>
<dd>sample js code to interface with the c code</dd></dl></p>
<h1>Transcompiling</h1><br />
The c code in this case would be for a static library. In order to compile the c code to JavaScript, we simply run:</p>
<p><pre><code class="bash">emcc src&#47;c&#47;hello-emscripten.c</code></pre></p>
<p>This will give a map file and a usable JavaScript file. The JavaScript file a.out.js contains a global Module you can then access to call the c methods. However you need the expose the methods you would like to call. In this case we use:</p>
<p><pre><code class="bash">emcc -s EXPORTED_FUNCTIONS=['_hello_world'] src&#47;c&#47;hello-emscripten.c</code></pre></p>
<p>The other arguments which are passed include optimizations and cleaning warnings:</p>
<p><pre><code class="bash">emcc -s EXPORTED_FUNCTIONS=['_hello_world'] -O2 -o tmp&#47;hello-emscripten.js
\ -Wno-deprecated -Qunused-arguments -Wno-logical-op-parentheses src&#47;c&#47;hello-emscripten.c</code></pre></p>
<p>For more details on options, look at the documentation <a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;blob&#47;master&#47;src&#47;settings.js" target="_blank">here:</a></p>
<p><a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;blob&#47;master&#47;src&#47;settings.js" target="_blank">https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;blob&#47;master&#47;src&#47;settings.js</a></p>
<h1>Interfacing with the code</h1><br />
The a.out.js gives you a variable called <strong>Module</strong>. All Modules have four methods which are mainly used:</p>
<dl>
<dt><code>ccall(functionName, jsReturnType, [jsparameterTypes], [args])</code></dt>
<dd>Calls the encapsulated c method. The JavaScript type is either number or string.</dd>
<dt><code>cwrap(functionName, jsReturnType, [jsparameterTypes])</code></dt>
<dd>Creates a JavaScript method, which can be called directory. It is to <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;bind" target="_blank">bind</a> what ccall is to <a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Function&#47;call" target="_blank">call</a>.</dd>
<dt><code>getValue(ptr, type)</code></dt>
<dd>Gets the value based the pointer.</dd>
<dt><code>setValue(ptr, value, type)</code></dt>
<dd>Sets the value based on the pointer. The type must be one of i8,i16,i32,i64,float,double or a pointer type like i8* (or just *)</dd></dl>With our c function looking like:</p>
<pre><code class="c">char* hello_world () {
 return "hello world!";
}</code></pre>
<p>We'll just use cwrap to create an ordinary JavaScript to call and return a string.</p>
<pre><code class="bash">return {
  hello : Module.cwrap('hello_world', 'string', [])
};</code></pre>
<p>Now all we have to do is call <code>hello_emscripten.hello()</code> to return the string. Go <a href="http:&#47;&#47;leogdion.github.io&#47;hello-emscripten&#47;" target="_blank">here</a> to look at the resulting demo. To build the project your self, install the node modules required and run grunt.</p>
<pre><code class="bash">npm install
grunt</code></pre>
<h1>Conclusion</h1><br />
Emscripten is powerful tool for taking complex c code and running it in the browser. There are already <a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten&#47;wiki#demos" target="_blank">hundreds of projects</a> doing the same thing. Next time I will show how to the <a href="https:&#47;&#47;github.com&#47;leogdion&#47;gmemujs" target="_blank">gmemujs</a> works in playing old video game music using <a href="https:&#47;&#47;github.com&#47;kripken&#47;emscripten" target="_blank">emscripten</a>, <a href="https:&#47;&#47;code.google.com&#47;p&#47;game-music-emu&#47;" target="_blank">gmemu</a>, and the<a href="https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web_Audio_API" target="_blank"> Web Audio API</a>.</p>
