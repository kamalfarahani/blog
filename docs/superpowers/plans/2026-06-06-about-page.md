# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-editable About page at `/about/` with name, bio, photo, and social links (email, GitHub, LinkedIn, Twitter/X).

**Architecture:** New `pages` Django app with a singleton `AboutPage` model. A function view renders `pages/templates/pages/about.html` (extends the existing zen `posts/base.html`). The nav in `base.html` gains an "About" link. No new CSS needed.

**Tech Stack:** Django 6.0.6, SQLite, Pillow (already installed), Django's built-in test framework

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `pages/__init__.py` | Create (via startapp) | App package |
| `pages/apps.py` | Create (via startapp) | AppConfig |
| `pages/models.py` | Create | AboutPage singleton model |
| `pages/admin.py` | Create | AboutPageAdmin with singleton guard |
| `pages/views.py` | Create | `about` function view |
| `pages/urls.py` | Create | `/about/` URL pattern |
| `pages/tests.py` | Create | Model, admin, and view tests |
| `pages/migrations/0001_initial.py` | Create (via makemigrations) | DB schema |
| `pages/templates/pages/about.html` | Create | About page template |
| `blog/settings.py` | Modify | Add `'pages'` to INSTALLED_APPS |
| `blog/urls.py` | Modify | Include `pages.urls` at `about/` |
| `posts/templates/posts/base.html` | Modify | Add "About" nav link |

---

## Task 1: Scaffold `pages` app and wire up settings/URLs

**Files:**
- Create: `pages/` (via startapp)
- Modify: `blog/settings.py`
- Modify: `blog/urls.py`
- Create: `pages/urls.py`

- [ ] **Step 1: Create the Django app**

```bash
uv run python manage.py startapp pages
```

Expected: creates `pages/` with `admin.py`, `apps.py`, `models.py`, `tests.py`, `views.py`, `migrations/`.

- [ ] **Step 2: Add `'pages'` to INSTALLED_APPS in `blog/settings.py`**

Add after `'posts'`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'posts',
    'pages',
]
```

- [ ] **Step 3: Create `pages/urls.py`** (empty for now)

```python
from django.urls import path

urlpatterns = []
```

- [ ] **Step 4: Include pages URLs in `blog/urls.py`**

Replace the full contents of `blog/urls.py` with:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls')),
    path('about/', include('pages.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

- [ ] **Step 5: Verify project still starts**

```bash
uv run python manage.py check
```

Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 6: Commit**

```bash
git add pages/ blog/settings.py blog/urls.py
git commit -m "feat: scaffold pages app and wire up URLs"
```

---

## Task 2: AboutPage model (TDD)

**Files:**
- Modify: `pages/tests.py`
- Modify: `pages/models.py`
- Create: `pages/migrations/0001_initial.py` (via makemigrations)

- [ ] **Step 1: Write failing model tests in `pages/tests.py`**

Replace the contents of `pages/tests.py` with:

```python
from django.contrib.admin.sites import site as admin_site
from django.test import TestCase
from django.urls import reverse

from pages.models import AboutPage


class AboutPageModelTest(TestCase):
    def test_str_returns_name(self):
        page = AboutPage.objects.create(name='Kamal', bio='Hello world')
        self.assertEqual(str(page), 'Kamal')

    def test_optional_fields_default_blank(self):
        page = AboutPage.objects.create(name='Kamal', bio='Hello')
        self.assertEqual(page.email, '')
        self.assertEqual(page.github_url, '')
        self.assertEqual(page.linkedin_url, '')
        self.assertEqual(page.twitter_url, '')
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test pages --verbosity=2
```

Expected: `ImportError: cannot import name 'AboutPage' from 'pages.models'`

- [ ] **Step 3: Implement `AboutPage` in `pages/models.py`**

Replace the contents of `pages/models.py` with:

```python
from django.db import models


class AboutPage(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    photo = models.ImageField(upload_to='pages/', blank=True)
    email = models.EmailField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    def __str__(self):
        return self.name
```

- [ ] **Step 4: Create and run migrations**

```bash
uv run python manage.py makemigrations pages
uv run python manage.py migrate
```

Expected: `pages/migrations/0001_initial.py` created, migration applied.

- [ ] **Step 5: Run tests to confirm they pass**

```bash
uv run python manage.py test pages --verbosity=2
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit**

```bash
git add pages/models.py pages/tests.py pages/migrations/
git commit -m "feat: add AboutPage model"
```

---

## Task 3: Admin registration (TDD)

**Files:**
- Modify: `pages/tests.py`
- Modify: `pages/admin.py`

- [ ] **Step 1: Add failing admin tests to `pages/tests.py`**

Add the following class at the bottom of `pages/tests.py`:

```python
class AboutPageAdminTest(TestCase):
    def test_about_page_registered_in_admin(self):
        self.assertIn(AboutPage, admin_site._registry)

    def test_has_add_permission_true_when_no_instance(self):
        admin_obj = admin_site._registry[AboutPage]
        self.assertTrue(admin_obj.has_add_permission(None))

    def test_has_add_permission_false_when_instance_exists(self):
        AboutPage.objects.create(name='Kamal', bio='Hello')
        admin_obj = admin_site._registry[AboutPage]
        self.assertFalse(admin_obj.has_add_permission(None))
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test pages.tests.AboutPageAdminTest --verbosity=2
```

Expected: 3 failures — model not registered yet.

- [ ] **Step 3: Implement `pages/admin.py`**

Replace the contents of `pages/admin.py` with:

```python
from django.contrib import admin

from .models import AboutPage


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not AboutPage.objects.exists()
```

- [ ] **Step 4: Run all pages tests**

```bash
uv run python manage.py test pages --verbosity=2
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add pages/admin.py pages/tests.py
git commit -m "feat: register AboutPage in admin with singleton guard"
```

---

## Task 4: View and URL (TDD)

**Files:**
- Modify: `pages/tests.py`
- Modify: `pages/views.py`
- Modify: `pages/urls.py`

- [ ] **Step 1: Add failing view tests to `pages/tests.py`**

Add the following class at the bottom of `pages/tests.py`:

```python
class AboutViewTest(TestCase):
    def test_about_returns_200(self):
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)

    def test_about_uses_correct_template(self):
        response = self.client.get(reverse('about'))
        self.assertTemplateUsed(response, 'pages/about.html')

    def test_about_context_is_none_when_no_page(self):
        response = self.client.get(reverse('about'))
        self.assertIsNone(response.context['page'])

    def test_about_context_has_page_when_exists(self):
        page = AboutPage.objects.create(name='Kamal', bio='Hello world')
        response = self.client.get(reverse('about'))
        self.assertEqual(response.context['page'], page)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test pages.tests.AboutViewTest --verbosity=2
```

Expected: `NoReverseMatch` for `about` — URL not defined yet.

- [ ] **Step 3: Implement `pages/views.py`**

Replace the contents of `pages/views.py` with:

```python
from django.shortcuts import render

from .models import AboutPage


def about(request):
    page = AboutPage.objects.first()
    return render(request, 'pages/about.html', {'page': page})
```

- [ ] **Step 4: Implement `pages/urls.py`**

Replace the contents of `pages/urls.py` with:

```python
from django.urls import path

from .views import about

urlpatterns = [
    path('', about, name='about'),
]
```

- [ ] **Step 5: Run tests — expect TemplateDoesNotExist**

```bash
uv run python manage.py test pages.tests.AboutViewTest --verbosity=2
```

Expected: `TemplateDoesNotExist: pages/about.html` — view and URL are wired correctly, template comes next.

- [ ] **Step 6: Commit**

```bash
git add pages/views.py pages/urls.py pages/tests.py
git commit -m "feat: add about view and URL"
```

---

## Task 5: Template and nav link

**Files:**
- Create: `pages/templates/pages/about.html`
- Modify: `posts/templates/posts/base.html`

- [ ] **Step 1: Create the templates directory**

```bash
mkdir -p pages/templates/pages
```

- [ ] **Step 2: Create `pages/templates/pages/about.html`**

```html
{% extends 'posts/base.html' %}

{% block title %}About{% endblock %}

{% block content %}
{% if page %}
<article>
  {% if page.photo %}
  <img class="post-image" src="{{ page.photo.url }}" alt="{{ page.name }}" />
  {% endif %}
  <h1>{{ page.name }}</h1>
  <div class="post-body">{{ page.bio|linebreaks }}</div>
  {% if page.email or page.github_url or page.linkedin_url or page.twitter_url %}
  <div class="about-links post-meta">
    {% if page.email %}<a href="mailto:{{ page.email }}">Email</a> {% endif %}
    {% if page.github_url %}<a href="{{ page.github_url }}">GitHub</a> {% endif %}
    {% if page.linkedin_url %}<a href="{{ page.linkedin_url }}">LinkedIn</a> {% endif %}
    {% if page.twitter_url %}<a href="{{ page.twitter_url }}">Twitter / X</a>{% endif %}
  </div>
  {% endif %}
</article>
{% else %}
<p>Coming soon.</p>
{% endif %}
{% endblock %}
```

- [ ] **Step 3: Add "About" link to nav in `posts/templates/posts/base.html`**

Replace:
```html
      <nav><a href="{% url 'post_list' %}">Blog</a></nav>
```

With:
```html
      <nav>
        <a href="{% url 'post_list' %}">Blog</a>
        <a href="{% url 'about' %}">About</a>
      </nav>
```

- [ ] **Step 4: Run the full test suite**

```bash
uv run python manage.py test --verbosity=1
```

Expected:
```
Ran 29 tests in ...s

OK
```

- [ ] **Step 5: Commit**

```bash
git add pages/templates/ posts/templates/posts/base.html
git commit -m "feat: add about page template and nav link"
```
