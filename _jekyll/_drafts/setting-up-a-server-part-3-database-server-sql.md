---
layout: post
status: draft
title: 'Setting up a Server - Part 3 - Database Server (SQL)  '
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
excerpt: |
  The next step is installing a Relational or SQL-Based Database Server. While the trend is towards NoSQL, SQL-Based database would cover most business demands. Let's look at the following steps to install MySQL and Postgres on our Amazon Linux&#47;Centos server.
wordpress_id: 223
wordpress_url: http://leogdion.name/?p=96
date: '2012-12-14 14:43:22 -0500'
date_gmt: '2012-12-14 18:43:22 -0500'
categories:
- Code
tags: []
comments: []
---
<p>The next step is installing a Relational or SQL-Based Database Server. While the trend is towards NoSQL, SQL-Based database would cover most business demands. Let's look at the following steps to install MySQL and Postgres on our Amazon Linux&#47;Centos server.<br />
<a id="more"></a><a id="more-223"></a></p>
<p>Remember to complete these installation make sure to be logged in as root.</p>
<h1>MySQL<&#47;h1><br />
MySQL is still the most popular open-source database around, regardless of its lack of robustness. The command to install the MySQL on Centos using the yum installer is:</p>
<p>[bash light="true"]yum install mysql-server[&#47;bash]</p>
<p>Once it is installed go ahead and start the server:</p>
<p>[bash light="true"]service mysqld start[&#47;bash]</p>
<p>Next, you need to setup the root password and remove any anonymous accounts using:</p>
<p>[bash light="true"]mysql_secure_installation[&#47;bash]</p>
<p>Then install the initial databases using:</p>
<p>[bash light="true"]mysql_install_db[&#47;bash]</p>
<p>The setup mysql to startup on boot:</p>
<p>[bash light="true"]chkconfig --levels 235 mysqld on[&#47;bash]</p>
<p>Now you should be ready to go with MySQL.</p>
<h1>PostgreSQL<&#47;h1><br />
While PostgreSQL may not be as popular as MySQL, it is more robust. To install PostgreSQL, type:</p>
<p>[bash light="true"]postgressqlserver[&#47;bash]</p>
<p>And then to enable it at startup:</p>
<p>[bash light="true"]chkconfig postgresql on[&#47;bash]</p>
<p>To start it manually:</p>
<p>[bash light="true"]service postgresql start[&#47;bash]</p>
<p>Now you should be all set with PostgreSQL and MySQL. Next time we will look at installing some of the newer NoSQL-based database servers.</p>
