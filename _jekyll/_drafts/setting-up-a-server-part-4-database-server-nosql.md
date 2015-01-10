---
layout: post
status: draft
title: Setting up a Server - Part 4 - Database Server (NoSQL)
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: The latest in database servers refers are called NoSQL database system. Primarily
  the difference is that it&nbsp;usually&nbsp;isn't a relational database system.
  The most popular ones are MongoDB and Redis.
wordpress_id: 224
wordpress_url: http://leogdion.name/?p=98
date: '2014-02-25 20:13:39 -0500'
categories:
- Code
tags: []
comments: []
---
<p>The latest in database servers refers are called NoSQL database system. Primarily the difference is that it&nbsp;usually&nbsp;isn't a relational database system. The most popular ones are MongoDB and Redis.<a id="more"></a><a id="more-224"></a></p>
<h1>MongoDB<&#47;h1><br />
With Centos or Amazon Linux (AWS), the yum installer requires a repository added so that it can find the Mongo package. So...</p>
<ol>
<li>Create a file at &#47;etc&#47;yum.repos.d&#47;10gen.repo<&#47;li>
<li>For 64-bit place the text:[bash]<br />
[10gen]<br />
name=10gen&nbsp;Repository<br />
baseurl=http:&#47;&#47;downloads-distro.mongodb.org&#47;repo&#47;redhat&#47;os&#47;x86_64<br />
gpgcheck=0<br />
enabled=1<br />
[&#47;bash]</p>
<p>For 32-bit:</p>
<p>[bash]<br />
[10gen]<br />
name=10gen Repository<br />
baseurl=http:&#47;&#47;downloads-distro.mongodb.org&#47;repo&#47;redhat&#47;os&#47;i686<br />
gpgcheck=0<br />
enabled=1<br />
[&#47;bash]<&#47;li><br />
<&#47;ol><br />
mongoserver - http:&#47;&#47;docs.mongodb.org&#47;manual&#47;tutorial&#47;install-mongodb-on-redhat-centos-or-fedora-linux&#47;</p>
<h1>enable at startup<br />
install redis<br />
enable at startup<br />
http:&#47;&#47;www.ebrueggeman.com&#47;blog&#47;install-redis-centos-56<&#47;h1></p>
