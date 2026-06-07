from django.urls import path

from .views import CategoryDetailView, PostDetailView, PostListView

urlpatterns = [
    path("", PostListView.as_view(), name="post_list"),
    path("categories/<slug:slug>/", CategoryDetailView.as_view(), name="category_detail"),
    path("<slug:slug>/", PostDetailView.as_view(), name="post_detail"),
]
