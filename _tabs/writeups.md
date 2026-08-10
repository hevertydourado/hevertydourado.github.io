---
layout: page
title: Write-Ups
icon: fas fa-shield-alt
order: 1
permalink: /writeups/
---

Welcome to the **DFIR & Threat Hunting Write-Ups** repository. This index categorizes investigation walkthroughs, malware analysis reports, and incident response CTF challenges solved across **CyberDefenders** and other defensive security platforms.

---

- **Total Labs:** {{ site.posts | where_exp: "item", "item.categories contains 'CyberDefenders' or item.categories contains 'Writeups'" | size }}
- **Primary Platform:** CyberDefenders
- **Publish Frequency:** Weekly Walkthroughs

## CyberDefenders Challenges

{% assign writeup_posts = site.posts | where_exp: "item", "item.categories contains 'CyberDefenders' or item.categories contains 'Writeups'" %}

{% if writeup_posts.size > 0 %}
<div class="list-group mb-4">
  {% for post in writeup_posts %}
  <a href="{{ post.url | relative_url }}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
    <div>
      <h5 class="mb-1 text-primary">{{ post.title }}</h5>
      <p class="mb-1 text-muted small">{{ post.description }}</p>
      <small class="text-secondary">
        <i class="far fa-calendar-alt me-1"></i>{{ post.date | date: "%B %d, %Y" }}
        {% if post.tags %}
        &nbsp;•&nbsp;
        {% for tag in post.tags %}
          <span class="badge bg-secondary opacity-75">{{ tag }}</span>
        {% endfor %}
        {% endif %}
      </small>
    </div>
    <i class="fas fa-chevron-right text-muted"></i>
  </a>
  {% endfor %}
</div>
{% else %}
<div class="alert alert-info" role="alert">
  <i class="fas fa-info-circle me-2"></i> No write-ups published yet. New CyberDefenders challenge walkthroughs are posted weekly!
</div>
{% endif %}
