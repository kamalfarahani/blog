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
