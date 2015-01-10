---
layout: post
status: draft
title: Setting Up a Web Server for Centos 6.x - Part 1 - Getting Started...
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
wordpress_id: 221
wordpress_url: http://leogdion.name/?p=88
date: '2012-11-02 13:30:47 -0400'
date_gmt: '2012-11-02 17:30:47 -0400'
categories:
- Code
tags: []
comments: []
---
<p>I am in the process of setting up a web server on a Centos vm. The first thing is to make sure you update yum.</p>
<p>[bash light="true"]sudo yum update[&#47;bash]</p>
<p>Next I am going install screen, a virutal console manger. That way we can sudo into screen and not need to sudo for each command.</p>
<p>[bash light="true"]sudo yum install screen[&#47;bash]</p>
<p>Once screen is installed, we will start a new sudo session</p>
<p>[bash light="true"]sudo screen[&#47;bash]</p>
<p>Next we'll look at installing nginx.</p>
