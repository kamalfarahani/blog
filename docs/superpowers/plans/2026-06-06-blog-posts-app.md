# Blog Posts App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Django `posts` app with Category, Tag, and Post models, Django admin management, and two server-rendered public pages (list + detail).

**Architecture:** Single `posts` Django app. Three models (Category, Tag, Post) in `posts/models.py`. Admin-only content management via Django's built-in admin. Two class-based views (ListView + DetailView) rendering templates. Featured images stored in `media/posts/` and served in development via `urls.py`.

**Tech Stack:** Django 6.0.6, SQLite, Pillow (for ImageField), Django's built-in test framework (`manage.py test`)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `posts/__init__.py` | Create (via startapp) | App package |
| `posts/apps.py` | Create (via startapp) | AppConfig |
| `posts/models.py` | Create | Category, Tag, Post models |
| `posts/admin.py` | Create | PostAdmin, CategoryAdmin, TagAdmin |
| `posts/views.py` | Create | PostListView, PostDetailView |
| `posts/urls.py` | Create | URL patterns for list + detail |
| `posts/tests.py` | Create | Model and view tests |
| `posts/migrations/0001_initial.py` | Create (via makemigrations) | DB schema |
| `posts/templates/posts/base.html` | Create | Base layout |
| `posts/templates/posts/post_list.html` | Create | List page |
| `posts/templates/posts/post_detail.html` | Create | Detail page |
| `blog/settings.py` | Modify | Add posts to INSTALLED_APPS, MEDIA settings |
| `blog/urls.py` | Modify | Include posts URLs, serve media in dev |

---

## Task 1: Scaffold the app, install Pillow, update settings

**Files:**
- Create: `posts/` (via `startapp`)
- Modify: `blog/settings.py`
- Modify: `blog/urls.py`

- [ ] **Step 1: Create the Django app**

```bash
uv run python manage.py startapp posts
```

Expected output: creates `posts/` directory with `admin.py`, `apps.py`, `models.py`, `tests.py`, `views.py`, `migrations/`.

- [ ] **Step 2: Install Pillow**

```bash
uv add pillow
```

Expected: `pyproject.toml` updated, `pillow` added to dependencies.

- [ ] **Step 3: Add `posts` to INSTALLED_APPS and add MEDIA settings in `blog/settings.py`**

Add `'posts'` to the `INSTALLED_APPS` list (after `'django.contrib.staticfiles'`):

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'posts',
]
```

Add at the bottom of `blog/settings.py`:

```python
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

- [ ] **Step 4: Update `blog/urls.py` to include posts URLs and serve media in development**

Replace the full contents of `blog/urls.py` with:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

- [ ] **Step 5: Create `posts/urls.py`** (empty for now — views don't exist yet, but the include above needs the file)

```python
from django.urls import path

urlpatterns = []
```

- [ ] **Step 6: Verify the project still starts**

```bash
uv run python manage.py check
```

Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 7: Commit**

```bash
git add posts/ blog/settings.py blog/urls.py pyproject.toml uv.lock
git commit -m "feat: scaffold posts app and configure settings"
```

---

## Task 2: Category and Tag models (TDD)

**Files:**
- Modify: `posts/tests.py`
- Modify: `posts/models.py`
- Create: `posts/migrations/0001_initial.py` (via makemigrations)

- [ ] **Step 1: Write failing tests for Category and Tag**

Replace the contents of `posts/tests.py` with:

```python
from django.test import TestCase
from django.utils import timezone
from posts.models import Category, Tag, Post


class CategoryModelTest(TestCase):
    def test_slug_auto_generated_from_name(self):
        cat = Category.objects.create(name='Django Tips')
        self.assertEqual(cat.slug, 'django-tips')

    def test_str_returns_name(self):
        cat = Category.objects.create(name='Python')
        self.assertEqual(str(cat), 'Python')


class TagModelTest(TestCase):
    def test_slug_auto_generated_from_name(self):
        tag = Tag.objects.create(name='Open Source')
        self.assertEqual(tag.slug, 'open-source')

    def test_str_returns_name(self):
        tag = Tag.objects.create(name='Django')
        self.assertEqual(str(tag), 'Django')
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: errors about `Category` and `Tag` not being importable (models not defined yet).

- [ ] **Step 3: Implement Category and Tag models in `posts/models.py`**

Replace the contents of `posts/models.py` with:

```python
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
```

- [ ] **Step 4: Create and run migrations**

```bash
uv run python manage.py makemigrations posts
uv run python manage.py migrate
```

Expected: `posts/migrations/0001_initial.py` created, migration applied.

- [ ] **Step 5: Run tests to confirm they pass**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add posts/models.py posts/tests.py posts/migrations/
git commit -m "feat: add Category and Tag models"
```

---

## Task 3: Post model (TDD)

**Files:**
- Modify: `posts/tests.py`
- Modify: `posts/models.py`
- Create: `posts/migrations/0002_post.py` (via makemigrations)

- [ ] **Step 1: Add failing Post model tests to `posts/tests.py`**

Add the following class at the bottom of `posts/tests.py` (keep existing tests intact):

```python
class PostModelTest(TestCase):
    def test_slug_auto_generated_from_title(self):
        post = Post.objects.create(title='Hello World', body='Body text', status='draft')
        self.assertEqual(post.slug, 'hello-world')

    def test_default_status_is_draft(self):
        post = Post.objects.create(title='My Post', body='Body')
        self.assertEqual(post.status, 'draft')

    def test_str_returns_title(self):
        post = Post.objects.create(title='Test Post', body='Body')
        self.assertEqual(str(post), 'Test Post')

    def test_category_nullable(self):
        post = Post.objects.create(title='No Category', body='Body')
        self.assertIsNone(post.category)

    def test_published_at_nullable(self):
        post = Post.objects.create(title='No Date', body='Body')
        self.assertIsNone(post.published_at)
```

- [ ] **Step 2: Run tests to confirm Post tests fail**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: errors on `Post` import — model not defined yet.

- [ ] **Step 3: Add Post model to `posts/models.py`**

Append the following to `posts/models.py` (after the `Tag` class):

```python

class Post(models.Model):
    DRAFT = 'draft'
    PUBLISHED = 'published'
    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    excerpt = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to='posts/', blank=True)
    category = models.ForeignKey(
        Category,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='posts',
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
```

- [ ] **Step 4: Create and run migrations**

```bash
uv run python manage.py makemigrations posts
uv run python manage.py migrate
```

Expected: `posts/migrations/0002_post.py` created, migration applied.

- [ ] **Step 5: Run all tests to confirm they pass**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: 9 tests pass.

- [ ] **Step 6: Commit**

```bash
git add posts/models.py posts/tests.py posts/migrations/
git commit -m "feat: add Post model"
```

---

## Task 4: Admin registration

**Files:**
- Modify: `posts/tests.py`
- Modify: `posts/admin.py`

- [ ] **Step 1: Add failing admin registration tests to `posts/tests.py`**

Add `from django.contrib.admin.sites import site as admin_site` to the imports at the **top** of `posts/tests.py` (alongside the existing imports).

Then add the following class at the **bottom** of `posts/tests.py`:

```python
class AdminRegistrationTest(TestCase):
    def test_category_registered_in_admin(self):
        self.assertIn(Category, admin_site._registry)

    def test_tag_registered_in_admin(self):
        self.assertIn(Tag, admin_site._registry)

    def test_post_registered_in_admin(self):
        self.assertIn(Post, admin_site._registry)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test posts.tests.AdminRegistrationTest --verbosity=2
```

Expected: 3 failures — models not registered yet.

- [ ] **Step 3: Implement `posts/admin.py`**

Replace the contents of `posts/admin.py` with:

```python
from django.contrib import admin
from .models import Category, Tag, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'published_at')
    list_filter = ('status', 'category', 'tags', 'published_at')
    search_fields = ('title', 'body', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'body', 'excerpt', 'featured_image'),
        }),
        ('Taxonomy', {
            'fields': ('category', 'tags'),
        }),
        ('Publishing', {
            'fields': ('status', 'published_at'),
        }),
    )
```

- [ ] **Step 4: Run all tests**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: 12 tests pass.

- [ ] **Step 5: Commit**

```bash
git add posts/admin.py posts/tests.py
git commit -m "feat: register models in Django admin"
```

---

## Task 5: Views and URLs (TDD)

**Files:**
- Modify: `posts/tests.py`
- Modify: `posts/views.py`
- Modify: `posts/urls.py`

- [ ] **Step 1: Add failing view tests to `posts/tests.py`**

Add at the bottom of `posts/tests.py`:

```python
from django.urls import reverse


class PostListViewTest(TestCase):
    def test_list_returns_200(self):
        response = self.client.get(reverse('post_list'))
        self.assertEqual(response.status_code, 200)

    def test_list_uses_correct_template(self):
        response = self.client.get(reverse('post_list'))
        self.assertTemplateUsed(response, 'posts/post_list.html')

    def test_only_published_posts_shown(self):
        Post.objects.create(title='Draft Post', body='body', status='draft')
        Post.objects.create(
            title='Published Post',
            body='body',
            status='published',
            published_at=timezone.now(),
        )
        response = self.client.get(reverse('post_list'))
        self.assertContains(response, 'Published Post')
        self.assertNotContains(response, 'Draft Post')

    def test_list_ordered_by_published_at_descending(self):
        older = Post.objects.create(
            title='Older Post', body='body', status='published',
            published_at=timezone.now() - timezone.timedelta(days=1),
        )
        newer = Post.objects.create(
            title='Newer Post', body='body', status='published',
            published_at=timezone.now(),
        )
        response = self.client.get(reverse('post_list'))
        posts = list(response.context['posts'])
        self.assertEqual(posts[0], newer)
        self.assertEqual(posts[1], older)


class PostDetailViewTest(TestCase):
    def setUp(self):
        self.post = Post.objects.create(
            title='Hello World',
            body='Body text',
            status='published',
            published_at=timezone.now(),
        )

    def test_detail_returns_200_for_published_post(self):
        response = self.client.get(reverse('post_detail', kwargs={'slug': self.post.slug}))
        self.assertEqual(response.status_code, 200)

    def test_detail_uses_correct_template(self):
        response = self.client.get(reverse('post_detail', kwargs={'slug': self.post.slug}))
        self.assertTemplateUsed(response, 'posts/post_detail.html')

    def test_detail_returns_404_for_draft(self):
        draft = Post.objects.create(title='Draft Post', body='body', status='draft')
        response = self.client.get(reverse('post_detail', kwargs={'slug': draft.slug}))
        self.assertEqual(response.status_code, 404)

    def test_detail_returns_404_for_unknown_slug(self):
        response = self.client.get(reverse('post_detail', kwargs={'slug': 'no-such-post'}))
        self.assertEqual(response.status_code, 404)
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
uv run python manage.py test posts.tests.PostListViewTest posts.tests.PostDetailViewTest --verbosity=2
```

Expected: failures — `NoReverseMatch` for `post_list` / `post_detail` (URLs not defined yet).

- [ ] **Step 3: Implement views in `posts/views.py`**

Replace the contents of `posts/views.py` with:

```python
from django.views.generic import ListView, DetailView
from .models import Post


class PostListView(ListView):
    template_name = 'posts/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(status=Post.PUBLISHED).order_by('-published_at')


class PostDetailView(DetailView):
    template_name = 'posts/post_detail.html'
    context_object_name = 'post'

    def get_queryset(self):
        return Post.objects.filter(status=Post.PUBLISHED)
```

- [ ] **Step 4: Implement `posts/urls.py`**

Replace the contents of `posts/urls.py` with:

```python
from django.urls import path
from .views import PostListView, PostDetailView

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('<slug:slug>/', PostDetailView.as_view(), name='post_detail'),
]
```

- [ ] **Step 5: Run tests — expect template errors (templates not created yet)**

```bash
uv run python manage.py test posts.tests.PostListViewTest posts.tests.PostDetailViewTest --verbosity=2
```

Expected: `TemplateDoesNotExist` errors — that's correct, templates come next.

- [ ] **Step 6: Commit views and URLs before adding templates**

```bash
git add posts/views.py posts/urls.py posts/tests.py
git commit -m "feat: add PostListView and PostDetailView"
```

---

## Task 6: Templates

**Files:**
- Create: `posts/templates/posts/base.html`
- Create: `posts/templates/posts/post_list.html`
- Create: `posts/templates/posts/post_detail.html`

- [ ] **Step 1: Create the templates directory**

```bash
mkdir -p posts/templates/posts
```

- [ ] **Step 2: Create `posts/templates/posts/base.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Blog{% endblock %}</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; color: #222; }
        nav { margin-bottom: 1rem; }
        nav a { margin-right: 1rem; text-decoration: none; font-weight: bold; }
        .post-meta { color: #666; font-size: 0.9rem; }
        .tags { margin-top: 0.5rem; }
        .tags span { background: #eee; padding: 0.2rem 0.5rem; border-radius: 3px; margin-right: 0.3rem; font-size: 0.85rem; }
        hr { border: none; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <nav><a href="{% url 'post_list' %}">Blog</a></nav>
    <hr>
    {% block content %}{% endblock %}
</body>
</html>
```

- [ ] **Step 3: Create `posts/templates/posts/post_list.html`**

```html
{% extends 'posts/base.html' %}

{% block title %}Blog{% endblock %}

{% block content %}
<h1>Posts</h1>

{% for post in posts %}
<article>
    <h2><a href="{% url 'post_detail' post.slug %}">{{ post.title }}</a></h2>
    <p class="post-meta">
        {{ post.published_at|date:"F j, Y" }}
        {% if post.category %} &middot; {{ post.category }}{% endif %}
    </p>
    {% if post.excerpt %}<p>{{ post.excerpt }}</p>{% endif %}
    {% if post.tags.all %}
    <div class="tags">
        {% for tag in post.tags.all %}<span>{{ tag }}</span>{% endfor %}
    </div>
    {% endif %}
</article>
<hr>
{% empty %}
<p>No posts yet.</p>
{% endfor %}

{% if is_paginated %}
<nav>
    {% if page_obj.has_previous %}
    <a href="?page={{ page_obj.previous_page_number }}">&larr; Previous</a>
    {% endif %}
    Page {{ page_obj.number }} of {{ page_obj.num_pages }}
    {% if page_obj.has_next %}
    <a href="?page={{ page_obj.next_page_number }}">Next &rarr;</a>
    {% endif %}
</nav>
{% endif %}
{% endblock %}
```

- [ ] **Step 4: Create `posts/templates/posts/post_detail.html`**

```html
{% extends 'posts/base.html' %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
<article>
    <h1>{{ post.title }}</h1>
    <p class="post-meta">
        {{ post.published_at|date:"F j, Y" }}
        {% if post.category %} &middot; {{ post.category }}{% endif %}
    </p>
    {% if post.featured_image %}
    <img src="{{ post.featured_image.url }}" alt="{{ post.title }}" style="max-width:100%;margin-bottom:1rem;">
    {% endif %}
    <div>{{ post.body|linebreaks }}</div>
    {% if post.tags.all %}
    <div class="tags">
        {% for tag in post.tags.all %}<span>{{ tag }}</span>{% endfor %}
    </div>
    {% endif %}
</article>
<p><a href="{% url 'post_list' %}">&larr; Back to all posts</a></p>
{% endblock %}
```

- [ ] **Step 5: Run the full test suite**

```bash
uv run python manage.py test posts --verbosity=2
```

Expected: all 20 tests pass.

- [ ] **Step 6: Create a superuser and smoke-test the admin**

```bash
uv run python manage.py createsuperuser
```

Then run the dev server:

```bash
uv run python manage.py runserver
```

Visit `http://127.0.0.1:8000/admin/` — log in, create a Category, a Tag, and a published Post. Then visit `http://127.0.0.1:8000/` to confirm the post appears on the list, and click through to the detail page.

- [ ] **Step 7: Commit**

```bash
git add posts/templates/
git commit -m "feat: add post list and detail templates"
```
