# syntax=docker/dockerfile:1
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Install production dependencies first (cached unless lockfile changes).
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# App code.
COPY . .
RUN uv sync --frozen --no-dev

EXPOSE 8000

# Migrate + collect static, then serve with gunicorn.
CMD ["sh", "-c", "uv run python manage.py migrate --noinput && uv run python manage.py ensure_superuser && uv run python manage.py collectstatic --noinput && uv run gunicorn blog.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
