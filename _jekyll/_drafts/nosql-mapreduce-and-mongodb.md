---
layout: post
status: draft
title: NoSQL, Map&#47;Reduce, and MongoDb
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: |-
  Remember joins? In plain old SQL, to join multiple tables&nbsp;together&nbsp;we use a join based on&nbsp;foreign&nbsp;keys. To do aggregates we use aggregate functions and "group by"s. But how does it work in the NoSQL world? Meet Map&#47;Reduce.
  <h1>
wordpress_id: 394
wordpress_url: http://leogdion.name/?p=127
date: '2012-10-26 08:30:00 -0400'
date_gmt: '2012-10-26 12:30:00 -0400'
categories:
- Code
tags:
- database
- map_reduce
- mongo
- nosql
comments: []
---
<p>Remember joins? In plain old SQL, to join multiple tables&nbsp;together&nbsp;we use a join based on&nbsp;foreign&nbsp;keys. To do aggregates we use aggregate functions and "group by"s. But how does it work in the NoSQL world? Meet Map&#47;Reduce.</p>
<h1><a id="more"></a><a id="more-394"></a>What is Map&#47;Reduce?<&#47;h1><br />
Map&#47;Reduce uses two methods, a map method and a reduce method, to aggregate data on a collection (similar to a table) in NoSQL.&nbsp;See the example below of how this is done in <a href="http:&#47;&#47;wiki.mongodb.org&#47;display&#47;DOCS&#47;MapReduce" target="_blank">MongoDB<&#47;a>:</p>
<pre>> db.things.insert( { _id : 1, tags : ['dog', 'cat'] } );<br />
> db.things.insert( { _id : 2, tags : ['cat'] } );<br />
> db.things.insert( { _id : 3, tags : ['mouse', 'cat', 'dog'] } );<br />
> db.things.insert( { _id : 4, tags : []  } );</p>
<p>> &#47;&#47; map function<br />
> m = function(){<br />
...    this.tags.forEach(<br />
...        function(z){<br />
...            emit( z , { count : 1 } );<br />
...        }<br />
...    );<br />
...};</p>
<p>> &#47;&#47; reduce function<br />
> r = function( key , values ){<br />
...    var total = 0;<br />
...    for ( var i=0; i<values.length; i++ )<br />
...        total += values[i].count;<br />
...    return { count : total };<br />
...};</p>
<p>> res = db.things.mapReduce(m, r, { out : "myoutput" } );<br />
> res<br />
{<br />
	"result" : "myoutput",<br />
	"timeMillis" : 12,<br />
	"counts" : {<br />
		"input" : 4,<br />
		"emit" : 6,<br />
		"output" : 3<br />
	},<br />
	"ok" : 1,<br />
}<br />
> db.myoutput.find()<br />
{"_id" : "cat" , "value" : {"count" : 3}}<br />
{"_id" : "dog" , "value" : {"count" : 2}}<br />
{"_id" : "mouse" , "value" : {"count" : 1}}</p>
<p>> db.myoutput.drop()<&#47;pre><br />
The purpose here is to count the number of times a tag is used for each tag. This shell example from MongoDB shows how the two &nbsp;methods are created. One, the m or map function to "emit" a key and value, which is then passed to a reduce function. The reduce function called r in this case, is used to aggregate the values based on the key returned in the map function. For more info check the <a href="http:&#47;&#47;www.mongodb.org&#47;display&#47;DOCS&#47;MapReduce" target="_blank">MongoDb's MapReduce tutorial<&#47;a>.</p>
