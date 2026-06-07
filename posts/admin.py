from django.contrib import admin

from .models import Category, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "get_categories", "status", "published_at")
    list_filter = ("status", "categories", "tags", "published_at")
    search_fields = ("title", "body", "excerpt")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (
            "Content",
            {
                "fields": ("title", "slug", "body", "excerpt", "featured_image"),
            },
        ),
        (
            "Taxonomy",
            {
                "fields": ("categories", "tags"),
            },
        ),
        (
            "Publishing",
            {
                "fields": ("status", "published_at"),
            },
        ),
    )

    @admin.display(description="Categories")
    def get_categories(self, obj):
        return ", ".join(c.name for c in obj.categories.all())
