# About Page — Design Spec

**Date:** 2026-06-06
**Status:** Approved

## Overview

A new `pages` Django app with an admin-editable `AboutPage` singleton model, served at `/about/`. Content includes name, bio, profile photo, and social links (email, GitHub, LinkedIn, Twitter/X). The page inherits the existing zen theme via `posts/base.html`.

---

## New App: `pages`

All new code lives in a `pages/` Django app registered in `INSTALLED_APPS`.

---

## Model

**`pages/models.py`** — single model, treated as a singleton (only one row; no enforcement library needed).

| Field | Type | Notes |
|-------|------|-------|
| `name` | CharField (max 100) | Display name |
| `bio` | TextField | Rendered with `\|linebreaks` in template |
| `photo` | ImageField | Optional, stored in `media/pages/` |
| `email` | EmailField | Optional |
| `github_url` | URLField | Optional |
| `linkedin_url` | URLField | Optional |
| `twitter_url` | URLField | Optional, labelled "Twitter / X" in admin |

---

## Admin

**`pages/admin.py`** — `AboutPageAdmin` with:
- All fields displayed
- `has_add_permission` returns `False` when a row already exists (prevents duplicate instances)

---

## URL & View

**`pages/urls.py`**
```
/about/  →  about view  (name='about')
```

Included into `blog/urls.py` as `path('about/', include('pages.urls'))`.

**`pages/views.py`** — function view:
```python
def about(request):
    page = AboutPage.objects.first()
    return render(request, 'pages/about.html', {'page': page})
```

---

## Templates

### `pages/templates/pages/about.html`

Extends `posts/base.html`. Two states:

**Empty state** (`page is None`):
- Brief "Coming soon" message

**Populated state**:
- Profile photo (if set) — `class="post-image"` for consistent zen styling
- `<h1>` with name
- Bio rendered with `|linebreaks`
- Social links (email, GitHub, LinkedIn, Twitter/X) — each only shown if field is non-empty

Social links use existing `<a>` styles (amber, hover underline). No new CSS required.

---

## Nav Update

`posts/templates/posts/base.html` — add "About" link to nav:
```html
<nav>
  <a href="{% url 'post_list' %}">Blog</a>
  <a href="{% url 'about' %}">About</a>
</nav>
```

---

## Settings

Add `'pages'` to `INSTALLED_APPS` in `blog/settings.py`. No new media settings needed — `MEDIA_ROOT` already configured.

---

## Out of Scope

- Contact form
- Multiple static pages
- Markdown rendering for bio
- Page-level SEO meta tags
