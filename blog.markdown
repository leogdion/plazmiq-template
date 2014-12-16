---
layout: page
status: publish
published: true
title: Blog
author:
  display_name: leogdion
  login: leogdion
  email: leogdion@brightdigit.com
  url: ''
author_login: leogdion
author_email: leogdion@brightdigit.com
wordpress_id: 106
wordpress_url: http://staging.brightdigit.com/?page_id=106
date: '2014-01-26 02:22:09 -0500'
date_gmt: '2014-01-26 02:22:09 -0500'
categories: []
tags: []
comments: []
---
 {% for post in site.posts %}
  <article class="post type-post status-publish format-standard hentry category-uncategorized">
  <header>
    <h2 class="entry-title"><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h2>
    <time class="published" datetime="%Y-%m-%dT%H:%M:00+00:00">{{ post.date | date: "%Y-%m-%dT%H:%M:00+00:00" }}</time>
  </header>
  <div class="entry-summary">
    {{ post.excerpt }}
  </div>
  </article>
    {% endfor %}
