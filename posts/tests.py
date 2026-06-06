from datetime import timedelta

from django.contrib.admin.sites import site as admin_site
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

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

    def test_category_nullable(self):
        post = Post.objects.create(title="No Category", body="Body")
        self.assertIsNone(post.category)

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


class PostListViewTest(TestCase):
    def test_list_returns_200(self):
        response = self.client.get(reverse("post_list"))
        self.assertEqual(response.status_code, 200)

    def test_list_uses_correct_template(self):
        response = self.client.get(reverse("post_list"))
        self.assertTemplateUsed(response, "posts/post_list.html")

    def test_only_published_posts_shown(self):
        Post.objects.create(title="Draft Post", body="body", status="draft")
        Post.objects.create(
            title="Published Post",
            body="body",
            status="published",
            published_at=timezone.now(),
        )
        response = self.client.get(reverse("post_list"))
        self.assertContains(response, "Published Post")
        self.assertNotContains(response, "Draft Post")

    def test_list_ordered_by_published_at_descending(self):
        older = Post.objects.create(
            title="Older Post",
            body="body",
            status="published",
            published_at=timezone.now() - timedelta(days=1),
        )
        newer = Post.objects.create(
            title="Newer Post",
            body="body",
            status="published",
            published_at=timezone.now(),
        )
        response = self.client.get(reverse("post_list"))
        posts = list(response.context["posts"])
        self.assertEqual(posts[0], newer)
        self.assertEqual(posts[1], older)


class PostDetailViewTest(TestCase):
    def setUp(self):
        self.post = Post.objects.create(
            title="Hello World",
            body="Body text",
            status="published",
            published_at=timezone.now(),
        )

    def test_detail_returns_200_for_published_post(self):
        response = self.client.get(
            reverse("post_detail", kwargs={"slug": self.post.slug})
        )
        self.assertEqual(response.status_code, 200)

    def test_detail_uses_correct_template(self):
        response = self.client.get(
            reverse("post_detail", kwargs={"slug": self.post.slug})
        )
        self.assertTemplateUsed(response, "posts/post_detail.html")

    def test_detail_returns_404_for_draft(self):
        draft = Post.objects.create(title="Draft Post", body="body", status="draft")
        response = self.client.get(reverse("post_detail", kwargs={"slug": draft.slug}))
        self.assertEqual(response.status_code, 404)

    def test_detail_returns_404_for_unknown_slug(self):
        response = self.client.get(
            reverse("post_detail", kwargs={"slug": "no-such-post"})
        )
        self.assertEqual(response.status_code, 404)
