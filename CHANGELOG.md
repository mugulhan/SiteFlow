# Changelog

## Unreleased
- Added disk-backed sitemap cache with stale-while-refresh behavior for /api/fetch-sitemap.
- Added periodic cache refresh for stored sitemap list.
- Added ARCHITECTURE.md to document the system flow.
- Added request logging via pino.
- Added rate limiting for sitemap discovery.
- Added cache purge job for old sitemap XML.
- Added schema validation for sitemap list updates.
- Added user-friendly validation errors for sitemap updates.
- Added graceful shutdown for log flushing.
- Added SSRF protection for user-supplied URLs.
- Added health check endpoint for container liveness/readiness.
- Added field-based validation error payloads for sitemap updates.
- Added graceful shutdown with HTTP server drain.
- Added Docker healthcheck configuration for /health.
- Added SEO health check endpoint and UI action for sitemap URL sampling.
- Fixed i18n syntax errors that blocked app.js execution.
- Added health check status breakdowns with failed URL lists.
- Added health check history persistence with a retention window and `/api/health-history` endpoint.
- Added sitemap list export to CSV/JSON.
- Added streaming XML parsing for health check sampling (sax).
- Added streaming XML parsing for discovery sitemap analysis (sax).
- Added streaming RSS/Atom parsing for discovery with XML line/column errors.
- Added discovery invalid-XML tooltip badge with line/column details.
- Added startup config validation for required environment variables.
- Added professional README with features, setup, and config overview.
- Expanded README with screenshots placeholders, warnings, proxy guide, and API examples.
- Added logo placeholder assets under `docs/`.
- Added GitHub Actions workflow for Docker build/push to GHCR.
- Added Trivy security scan to the CI workflow.
- Added Trivy scan for tag builds and README badges.
- Added health history sparkline in the expanded sitemap view.
- Added hover tooltips for health history sparklines (date/score/status counts).
- Added 3xx/4xx/5xx breakdowns to health history tooltips.
- Updated health history tooltips to show 2xx totals and 404 details.
- Added alert badges for critical 5xx/score drops and 404 increases.
- Added alerts-only toggle to filter sitemaps by alert status.
- Added alert metadata to `/api/sitemaps` responses for lightweight filtering.
- Added alert popover panel with copy action for warning/critical badges.
- Added alert counts in domain/tag filters when alerts-only is enabled.

## 1.1.0 - 2025-10-14
- JSON tabanlı kalıcı saklama için Express API eklendi (`/api/sitemaps`), veriler `data/sitemaps.json` içinde tutuluyor.
- Tarayıcıdaki CORS engellerini aşmak için sitemap istekleri sunucu üzerinden proxy edildi (`/api/fetch-sitemap`), TLS doğrulama sorunları için gerekli durumlarda `undici` ajanı devreye alındı.
- Arayüz iyileştirmeleri:
  - URL sayısı toplamları sütun başlığına ve alan adı filtrelerine üst simge olarak yansıtılıyor.
  - Filtrelerle uyumlu toplamlar hesaplanıyor.
- Bağımlılıklar güncellendi (`express`, `undici`).




