from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView

from .models import Category, Post


class PostListView(ListView):
    template_name = "posts/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(status=Post.PUBLISHED).order_by("-published_at")


class PostDetailView(DetailView):
    template_name = "posts/post_detail.html"
    context_object_name = "post"

    def get_queryset(self):
        return Post.objects.filter(status=Post.PUBLISHED)


class CategoryDetailView(ListView):
    template_name = "posts/category_detail.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        self.category = get_object_or_404(Category, slug=self.kwargs["slug"])
        return Post.objects.filter(
            categories=self.category,
            status=Post.PUBLISHED,
        ).order_by("-published_at")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["category"] = self.category
        return context
