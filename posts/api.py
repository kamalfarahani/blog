from rest_framework import viewsets

from .models import Category, Post, Tag
from .serializers import CategorySerializer, PostSerializer, TagSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related("categories", "tags").all()
    serializer_class = PostSerializer
    lookup_field = "slug"
