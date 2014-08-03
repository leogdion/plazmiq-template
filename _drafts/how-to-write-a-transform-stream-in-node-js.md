---
layout: post
status: draft
title: How to write a transform stream in node.js?
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
wordpress_id: 783
wordpress_url: http://www.brightdigit.com/?p=783
date: '2014-03-22 19:22:50 -0400'
date_gmt: '2014-03-22 19:22:50 -0400'
categories:
- Uncategorized
tags: []
comments: []
---
<p>Transform streams are a powerful way to take input from one stream and output it to another. Today we will look at creating a transform which splits the data by a particular character such as a newline character.</p>
<p>In this case, I need to take a stream from the http request with tab-separated data and split it by lines so it can easily be imported into a database row.</p>
<p>&nbsp;</p>
