import markdown as md
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def markdown(value):
    extensions = [
        "fenced_code",
        "codehilite",
        "tables",
        "nl2br",
    ]
    extension_configs = {
        "codehilite": {
            "css_class": "highlight",
            "guess_lang": False,
        },
    }
    return mark_safe(
        md.markdown(
            value or "", extensions=extensions, extension_configs=extension_configs
        )
    )
