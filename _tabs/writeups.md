---
layout: page
title: Write-Ups
icon: fas fa-shield-alt
order: 1
permalink: /writeups/
---

Welcome to the **DFIR & Threat Hunting Write-Ups** repository. This index categorizes investigation walkthroughs, malware analysis reports, and incident response CTF challenges solved across **CyberDefenders** and other defensive security platforms.

---

<div class="d-flex flex-wrap gap-2 mb-4">
  <span class="badge bg-primary fs-6 p-2">Total Labs: {{ site.posts | where_exp: "item", "item.categories contains 'CyberDefenders' or item.categories contains 'Writeups'" | size }}</span>
  <span class="badge bg-dark border fs-6 p-2">Platform: CyberDefenders</span>
</div>

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

---

## Filter by Category

- [Network Forensics]({{ '/categories/network-forensics/' | relative_url }})
- [Memory Forensics]({{ '/categories/memory-forensics/' | relative_url }})
- [Disk Forensics]({{ '/categories/disk-forensics/' | relative_url }})
- [Endpoint Security]({{ '/categories/endpoint/' | relative_url }})
