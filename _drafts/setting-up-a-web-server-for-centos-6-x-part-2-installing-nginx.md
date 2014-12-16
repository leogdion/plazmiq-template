---
layout: post
status: draft
title: " Setting Up a Web Server for Centos 6.x - Part 2 - Installing Nginx"
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
wordpress_id: 222
wordpress_url: http://leogdion.name/?p=93
date: '2012-11-04 22:38:48 -0500'
date_gmt: '2012-11-05 02:38:48 -0500'
categories:
- Code
tags: []
comments: []
---
<p>According to Wikipedia, "Nginx is&nbsp;an&nbsp;open source&nbsp;Web server&nbsp;and a&nbsp;reverse proxy&nbsp;server for&nbsp;HTTP,&nbsp;SMTP,&nbsp;POP3&nbsp;and&nbsp;IMAP&nbsp;protocols, with a strong focus on high&nbsp;concurrency, performance and low&nbsp;memory&nbsp;usage." (<a href="http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;Nginx">wikipedia<&#47;a>) It has become a popular new web server due to its emphasis on low memory usage among other reasons.</p>
<p>Unfortunately, nginx is not included it with the native yum installation. To install, you need to include the EPEL.<br />
[bash light="true"]<br />
rpm -Uvh [path_to_epel_package]<br />
[&#47;bash]<br />
The path is either</p>
<p>http:&#47;&#47;dl.fedoraproject.org&#47;pub&#47;epel&#47;6&#47;x86_64&#47;epel-release-6-7.noarch.rpm (x64)</p>
<p>http:&#47;&#47;dl.fedoraproject.org&#47;pub&#47;epel&#47;6&#47;i386&#47;epel-release-6-7.noarch.rpm</p>
<p>Now, you can install<br />
[bash light="true"]<br />
yum install nginx<br />
[&#47;bash]<br />
Next make sure that nginx is started on bootup.<br />
[bash light="true"]<br />
chkconfig nginx on<br />
[&#47;bash]<br />
Go ahead now and restart the server or launch it by typing &nbsp;in:<br />
[bash light="true"]<br />
&#47;etc&#47;init.d&#47;nginx start<br />
[&#47;bash]<br />
Next make sure you open the web server port on your firewall. You may want to look at the details on something like iptables or your cloud management page.</p>
