from django.db import migrations


def copy_category_to_categories(apps, schema_editor):
    Post = apps.get_model("posts", "Post")
    for post in Post.objects.filter(category__isnull=False):
        post.categories.add(post.category)


def reverse_categories_to_category(apps, schema_editor):
    Post = apps.get_model("posts", "Post")
    for post in Post.objects.all():
        first = post.categories.first()
        if first:
            post.category = first
            post.save(update_fields=["category"])


class Migration(migrations.Migration):
    dependencies = [
        ("posts", "0003_post_add_categories"),
    ]

    operations = [
        migrations.RunPython(
            copy_category_to_categories,
            reverse_categories_to_category,
        ),
    ]
