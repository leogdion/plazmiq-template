---
layout: post.hbt
publish: draft
title: {{ title }}
date:  {{ isoDate now }}{{#if tags_list}}
tags: {{ tags_list }}{{/if}}{{#if has_image}}
image: {{ image.src }}{{/if}}
{{meta_yaml}}
---

{{ excerpt }}

<!--more-->

{{#if has_video}}
<div class='embed-container'><iframe src="{{video.src}}" height="337" width="600" allowfullscreen="" frameborder="0"></iframe></div>
{{else if has_image}}
<a style="background-image: url({{image.src}})" class="featured" href="{{url}}"></a>
{{/if}}

**[[{{site_url}}]]({{url}})**