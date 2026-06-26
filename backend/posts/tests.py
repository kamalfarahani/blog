from django.contrib.admin.sites import site as admin_site
from django.test import TestCase

from posts.models import Category, Post, Tag


class CategoryModelTest(TestCase):
    def test_slug_auto_generated_from_name(self):
        cat = Category.objects.create(name="Django Tips")
        self.assertEqual(cat.slug, "django-tips")

    def test_str_returns_name(self):
        cat = Category.objects.create(name="Python")
        self.assertEqual(str(cat), "Python")


class TagModelTest(TestCase):
    def test_slug_auto_generated_from_name(self):
        tag = Tag.objects.create(name="Open Source")
        self.assertEqual(tag.slug, "open-source")

    def test_str_returns_name(self):
        tag = Tag.objects.create(name="Django")
        self.assertEqual(str(tag), "Django")


class PostModelTest(TestCase):
    def test_slug_auto_generated_from_title(self):
        post = Post.objects.create(
            title="Hello World", body="Body text", status="draft"
        )
        self.assertEqual(post.slug, "hello-world")

    def test_default_status_is_draft(self):
        post = Post.objects.create(title="My Post", body="Body")
        self.assertEqual(post.status, "draft")

    def test_str_returns_title(self):
        post = Post.objects.create(title="Test Post", body="Body")
        self.assertEqual(str(post), "Test Post")

    def test_published_at_nullable(self):
        post = Post.objects.create(title="No Date", body="Body")
        self.assertIsNone(post.published_at)


class AdminRegistrationTest(TestCase):
    def test_category_registered_in_admin(self):
        self.assertIn(Category, admin_site._registry)

    def test_tag_registered_in_admin(self):
        self.assertIn(Tag, admin_site._registry)

    def test_post_registered_in_admin(self):
        self.assertIn(Post, admin_site._registry)
