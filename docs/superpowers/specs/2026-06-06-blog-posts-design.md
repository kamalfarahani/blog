# Blog Posts App — Design Spec

**Date:** 2026-06-06
**Status:** Approved

## Overview

A Django app (`posts`) for managing and displaying blog posts. Posts are authored and managed exclusively via Django's built-in admin interface. The public site serves server-rendered HTML pages (list + detail).

---

## Models

All models live in `posts/models.py`.

### `Category`
| Field | Type | Notes |
|-------|------|-------|
| `name` | CharField | unique |
| `slug` | SlugField | unique, auto-generated from name |

### `Tag`
| Field | Type | Notes |
|-------|------|-------|
| `name` | CharField | unique |
| `slug` | SlugField | unique, auto-generated from name |

### `Post`
| Field | Type | Notes |
|-------|------|-------|
| `title` | CharField | |
| `slug` | SlugField | unique, auto-generated from title |
| `body` | TextField | plain text |
| `excerpt` | TextField | blank, short summary for list view |
| `featured_image` | ImageField | optional, stored in `media/posts/` |
| `category` | ForeignKey → Category | nullable, on_delete=SET_NULL |
| `tags` | ManyToManyField → Tag | blank |
| `status` | CharField | choices: `draft` / `published` |
| `published_at` | DateTimeField | nullable, set when published |
| `created_at` | DateTimeField | auto_now_add |
| `updated_at` | DateTimeField | auto_now |

---

## Admin Interface

Configured in `posts/admin.py`. No custom templates required.

### `PostAdmin`
- **List display:** title, category, status, published_at
- **List filters:** status, category, tags, published_at
- **Search fields:** title, body, excerpt
- **Prepopulate:** slug from title
- **Fieldsets:**
  - Content: title, slug, body, excerpt, featured_image
  - Taxonomy: category, tags
  - Publishing: status, published_at

### `CategoryAdmin`
- List display: name, slug
- Prepopulate slug from name

### `TagAdmin`
- List display: name, slug
- Prepopulate slug from name

---

## URLs & Views

Defined in `posts/urls.py`, included into `blog/urls.py`.

| URL | View | Description |
|-----|------|-------------|
| `/` | `PostListView` | Paginated list of published posts |
| `/<slug>/` | `PostDetailView` | Single published post by slug |

### `PostListView`
- Filters: `status=published`
- Order: `published_at` descending
- Pagination: 10 posts per page
- Context: title, excerpt, category, tags, published_at

### `PostDetailView`
- Lookup: by `slug`, `status=published`
- Returns 404 for drafts or unknown slugs

---

## Templates

Located in `posts/templates/posts/`.

| Template | Extends | Purpose |
|----------|---------|---------|
| `base.html` | — | Base layout: `<title>`, nav, `{% block content %}` |
| `post_list.html` | `base.html` | Post cards + pagination |
| `post_detail.html` | `base.html` | Full post: image, body, metadata |

- No external CSS frameworks
- Minimal inline stylesheet in `base.html` for basic readability
- Featured image shown only if present

---

## Settings Changes

- Add `'posts'` to `INSTALLED_APPS`
- Add `MEDIA_URL` and `MEDIA_ROOT` for featured image uploads
- Serve media files in development via `urls.py`

---

## Out of Scope

- Rich text / Markdown editor
- Comments
- User registration or multi-author support
- REST API
- Search functionality
- RSS feed
