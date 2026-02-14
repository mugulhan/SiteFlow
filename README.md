# SitemapFlow

![SitemapFlow logo](docs/logo.svg)

![CI](https://github.com/<owner>/<repo>/actions/workflows/docker-ci.yml/badge.svg)
![Trivy](https://img.shields.io/badge/security-trivy-blue)
![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

SitemapFlow is a web-based sitemap management and monitoring panel. It discovers sitemaps, proxies and caches XML, tracks update cadence, and runs health checks with sampling. It also exports data for reporting.

## Features
- Sitemap list management with tags and inline editing
- Sitemap discovery (robots.txt + DOM + common paths + child index expansion)
- XML proxy with caching and background refresh
- Health check sampling with status code breakdown + failed URL list
- Alerts-only filter with lightweight alert status
- CSV/JSON export for sitemap list and details
- SSRF protection, rate limiting, and Docker healthcheck
- Streaming XML parsing (sax) for large sitemaps and feeds

## Screenshots
- Dashboard overview: `docs/screenshots/dashboard.png`
- Health check breakdown: `docs/screenshots/health-check.png`
- Discovery results: `docs/screenshots/discovery.png`

## Requirements
- Node.js 18+ (npm included)
- PowerShell 5+ (for Windows setup script)
- Internet access (for sitemap fetches)

## Quick Start (Node.js)
```powershell
npm install
npm run start
```
Note: After pulling updates, run `npm install` to fetch new dependencies (e.g. `node-cron`).
App runs at `http://localhost:3000` by default.

## Quick Start (Docker)
```powershell
docker compose up -d --build
```
App runs at `http://localhost:4000`.

## CI/CD (GitHub Actions)
This repo includes a workflow that builds and pushes Docker images to GHCR on `main` pushes and version tags.
- Image: `ghcr.io/<owner>/<repo>:latest`
- Release tags: `ghcr.io/<owner>/<repo>:v1.0.0`
- Security scan: Trivy runs on pushed images and fails the workflow on detected vulnerabilities.

## Authentication
Defaults (change in `docker-compose.yml` or env):
- `AUTH_USER=siteflow`
- `AUTH_PASS=Flow@2025!`
- `SESSION_SECRET=siteflow-secret-key-2025`

Warning: Change the default credentials before production use.

## Config
Env vars (subset):
- Core: `PORT`, `NODE_ENV`
- Auth: `AUTH_USER`, `AUTH_PASS`, `SESSION_SECRET`, `COOKIE_SECURE`
- Cache: `SITEMAP_CACHE_TTL_MS`, `SITEMAP_CACHE_REFRESH_INTERVAL_MS`
- Cache purge: `SITEMAP_CACHE_MAX_AGE_MS`, `SITEMAP_CACHE_PURGE_INTERVAL_MS`
- Rate limit: `DISCOVERY_RATE_LIMIT_WINDOW_MS`, `DISCOVERY_RATE_LIMIT_MAX`
- Health sampling: `HEALTH_CHECK_SAMPLE_RATE`, `HEALTH_CHECK_SAMPLE_MAX`, `HEALTH_CHECK_CHILD_SITEMAPS`, `HEALTH_CHECK_TIMEOUT_MS`
- Health history: `HEALTH_HISTORY_RETENTION_DAYS`
- Alerting: `ALERT_SCORE_THRESHOLD`
- Fetch control: `FETCH_CONCURRENCY_LIMIT`, `DOMAIN_DELAY_MS`, `PUPPETEER_FIRST_HOSTS`
- Brevo env: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`
- Alerts fallback: `GLOBAL_NOTIFICATION_EMAIL`
- Alert cooldown: `BREVO_ALERT_COOLDOWN_MS`
- Cron schedule: `CRON_SCHEDULE` (e.g. `0 */6 * * *`, set empty or `off` to disable)

On startup, config is validated (fail-fast) and the server exits if required vars are missing.

## Persistence
Mount `data/` as a volume to preserve:
- `data/sitemaps.json` (saved sitemaps)
- `data/cache/*.xml` and `data/cache/*.json` (cached XML + metadata)
- `data/health-history.json` (health check history)

## Health Check
- Liveness endpoint: `GET /health`
- Sitemap health sampling: `POST /api/sitemaps/health`
- Health history lookup: `GET /api/health-history?url=...`

## Performance Note
Streaming XML parsing keeps memory usage stable even for very large sitemap files.

## API Examples
```bash
curl http://localhost:4000/health
```
```bash
curl -c cookie.txt -X POST -H "Content-Type: application/json" \
  -d '{"username":"siteflow","password":"Flow@2025!"}' \
  http://localhost:4000/api/login
curl -b cookie.txt http://localhost:4000/api/sitemaps
```
```bash
curl -b cookie.txt "http://localhost:4000/api/fetch-sitemap?url=https://example.com/sitemap.xml"
```
```bash
curl -b cookie.txt -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/sitemap.xml"}' \
  http://localhost:4000/api/sitemaps/health
```
```bash
curl -b cookie.txt "http://localhost:4000/api/health-history?url=https://example.com/sitemap.xml"
```

## Reverse Proxy (Nginx)
```nginx
location / {
  proxy_pass http://localhost:4000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Development (Hot Reload)
```powershell
docker compose -f docker-compose.dev.yml up --build
```

## Notes
- Health check sampling uses streaming XML parsing and reservoir sampling.
- Discovery, RSS, and Atom parsing are fully streaming (sax) to keep RAM steady.
