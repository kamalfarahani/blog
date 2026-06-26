from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from pages.api import AboutPageViewSet
from posts.api import CategoryViewSet, PostViewSet, TagViewSet

router = DefaultRouter()
router.register("posts", PostViewSet)
router.register("categories", CategoryViewSet)
router.register("tags", TagViewSet)
router.register("about", AboutPageViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
