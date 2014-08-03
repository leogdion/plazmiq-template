---
layout: post
status: draft
title: How do you find the httpd.conf file in a bash script?
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: |+
  So you have installed apache and want to write a script to know where the log file (or files) is located on the server. You could hard-code it, which means you have another place to edit the file path for later. Or you can get the log path and the httpd config path in your bash script.

wordpress_id: 396
wordpress_url: http://leogdion.name/?p=190
date: '2012-12-04 14:20:39 -0500'
date_gmt: '2012-12-04 18:20:39 -0500'
categories:
- Code
tags:
- apache
- bash
comments: []
---
<p>So you have installed apache and want to write a script to know where the log file (or files) is located on the server. You could hard-code it, which means you have another place to edit the file path for later. Or you can get the log path and the httpd config path in your bash script.</p>
<p><a id="more"></a><a id="more-396"></a></p>
<p>To get the path to your httpd.conf file try:</p>
<p>[bash light="true"]HTTPD_CONF=$(apachectl -V | grep -Po '(?&amp;amp;lt;=SERVER_CONFIG_FILE=&amp;amp;quot;).+(?=&amp;amp;quot;)')[&#47;bash]</p>
<p>Now let's say you want to get the paths to the log files stored in the httpd.conf file, then you can do:</p>
<p>[bash light="true"]LOG_PATHS=$(grep -Po '(?&amp;amp;lt;=ErrorLog &amp;amp;quot;).+(?=&amp;amp;quot;)' $HTTPD_CONF)[&#47;bash]</p>
<p>Now you have the path or paths and can do whatever you want with it.</p>
<p>Feel free to comment or ask questions below.</p>
