from rest_framework import serializers

from .models import AboutPage


class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = [
            "id",
            "name",
            "bio",
            "photo",
            "email",
            "github_url",
            "linkedin_url",
            "twitter_url",
        ]
