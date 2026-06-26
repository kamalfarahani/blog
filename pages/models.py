from django.db import models


class AboutPage(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    photo = models.ImageField(upload_to="pages/", blank=True)
    email = models.EmailField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    def __str__(self):
        return self.name
