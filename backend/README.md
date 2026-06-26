# Blog backend

Django + Django REST Framework API for the blog. Serves JSON at `/api/` and the
admin at `/admin/`.

## Development

```bash
uv sync
cp .env.example .env        # then edit values
uv run python manage.py migrate
uv run python manage.py runserver
```

With `DEBUG=true`, uploaded media is stored on local disk under `media/` and
served by Django for convenience.

## Production

### Environment

Set these (see `.env.example` for the full list):

- `DEBUG=false`
- `SECRET_KEY` — a long, random value
- `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` — your domain(s)
- Database `DB_*` vars

When `DEBUG=false`, security hardening is applied automatically: HTTPS redirect,
HSTS, secure/HTTP-only session & CSRF cookies, `X-Frame-Options: DENY`, and
`SECURE_PROXY_SSL_HEADER` (assumes TLS terminates at a proxy that sets
`X-Forwarded-Proto`).

### Media (object storage)

User-uploaded images (`Post.featured_image`, `AboutPage.photo`) must **not** be
served by Django in production. Set `USE_S3=true` and the bucket vars to store
media in S3-compatible object storage (AWS S3, Cloudflare R2, Backblaze B2, …):

```
USE_S3=true
AWS_STORAGE_BUCKET_NAME=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_REGION_NAME=...            # e.g. us-east-1 (or "auto" for R2)
AWS_S3_ENDPOINT_URL=...           # required for R2/B2/MinIO
AWS_S3_CUSTOM_DOMAIN=cdn.example.com   # public CDN/bucket domain
```

Uploads then go straight to the bucket and `ImageField.url` returns the public
CDN URL — the frontend needs no changes. Objects are public (no signed URLs) so
browsers and CDNs can cache them. The bucket should allow public reads on the
`media/` prefix.

> WhiteNoise serves **static** files only (admin, DRF browsable API); it does
> not handle runtime-uploaded media. That's why media uses object storage.

### Static files

Collected at build/deploy time and served by WhiteNoise (compressed + hashed
manifest):

```bash
DEBUG=false uv run python manage.py collectstatic --noinput
```

### App server

Run under gunicorn (installed) behind your TLS-terminating proxy:

```bash
uv run gunicorn blog.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

### Pre-deploy check

```bash
DEBUG=false uv run python manage.py check --deploy
```
