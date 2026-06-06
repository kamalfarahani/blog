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
