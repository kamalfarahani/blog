from django.test import TestCase

from pages.models import AboutPage


class AboutPageModelTest(TestCase):
    def test_str_returns_name(self):
        page = AboutPage.objects.create(name="Kamal", bio="Hello world")
        self.assertEqual(str(page), "Kamal")

    def test_optional_fields_default_blank(self):
        page = AboutPage.objects.create(name="Kamal", bio="Hello")
        self.assertEqual(page.email, "")
        self.assertEqual(page.github_url, "")
        self.assertEqual(page.linkedin_url, "")
        self.assertEqual(page.twitter_url, "")
