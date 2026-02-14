# Architecture Overview

## Purpose
SitemapFlow is a web UI + API that stores a list of sitemap sources, fetches XML via a server-side proxy, and displays summaries and details in the browser.

## Technology Stack
- Runtime: Node.js
- Backend framework: Express
- HTTP client: undici (with optional insecure agent for TLS edge cases)
- HTML/XML parsing (server): cheerio
- Browser automation fallback: puppeteer-extra + stealth plugin
- Logging: pino + pino-http
- Sessions: express-session
- Rate limiting: express-rate-limit
- Frontend: vanilla JavaScript (no framework), DOM APIs, Fetch API
- Storage: JSON files on disk
- Validation: zod
- Streaming XML parsing: sax
- Containerization: Docker / docker-compose

## Components
- Frontend: `app.js` manages UI state, data fetching, filters, and rendering.
- Backend: `server.js` exposes API endpoints, proxies sitemap fetches, and handles discovery.
- Static UI: `index.html`, `styles.css`.
- Storage:
  - `data/sitemaps.json` stores the user-managed sitemap list.
  - `data/cache/*.xml` and `data/cache/*.json` store cached sitemap XML and metadata.

## UI Features (Frontend)
- Details accordion fetches page metadata (title/description/headings), plus layout and schema tabs.
- Heading analysis includes links inside headings (hash-only anchors are excluded).
- Compare flow: select two URLs from the details list, show a persistent compare bar, then open a modal with side-by-side metrics and heading lists.
- Domain-wide view: selecting a domain aggregates URLs across all sitemaps under that domain and renders them in the standard details table.

## Data Flow
### 1) Load sitemaps
1. UI loads the saved list via `GET /api/sitemaps`.
2. UI requests each sitemap XML through `GET /api/fetch-sitemap?url=...`.
3. XML is parsed in the browser (DOMParser) and summarized for table and detail views.

### 2) Fetch sitemap XML (cache + refresh)
1. Server checks disk cache for the sitemap URL.
2. If cache is fresh, XML is returned immediately (HIT).
3. If cache is stale, XML is returned immediately and a background refresh is started (STALE).
4. If cache is missing, the server fetches upstream, stores XML, then returns it (MISS).

Cache behavior is controlled by:
- `SITEMAP_CACHE_TTL_MS` (default 15 minutes)
- `SITEMAP_CACHE_REFRESH_INTERVAL_MS` (default 15 minutes)

### 3) Discover sitemaps
1. UI posts a domain or URL to `POST /api/sitemaps/discover?mode=fast`.
2. Server checks robots.txt, homepage DOM, and common sitemap paths.
3. UI then triggers `mode=verify` to validate candidates and expand sitemap index children.

### 4) Persistence
- Updates to the list are sent via `PUT /api/sitemaps` and stored in `data/sitemaps.json`.

### 5) Notifications (optional)
- Email notifications are sent through the Brevo API when enabled for a sitemap.

### 6) SEO health check (URL sampler)
1. UI triggers `POST /api/sitemaps/health` for a sitemap URL.
2. Server samples URLs from the sitemap (or child sitemaps for index files).
3. Server performs HTTP checks (HEAD with GET fallback) and returns a summary.
4. Server records the result in `data/health-history.json`, which can be queried via `GET /api/health-history?url=...`.
5. Server exposes a lightweight alert summary on `GET /api/sitemaps` for UI filtering.

## Discovery Pipeline Details
- robots.txt parsing: `Sitemap:` lines are extracted and normalized.
- DOM parsing: `<link rel="sitemap">` and anchor links with sitemap-like URLs are collected.
- Common path guesses: standard sitemap paths are tried under the detected origin and subpaths.
- Verification:
  - HEAD, then GET if needed.
  - XML is analyzed to detect sitemapindex/urlset or RSS/Atom.
- Expansion:
  - sitemapindex files are parsed to extract child sitemap URLs.
  - Discovery parsing uses streaming XML for sitemap counts and child extraction.
  - RSS/Atom discovery uses streaming parsing and reports line/column on invalid XML.

## Proxy Fetch Details
- Retry logic for transient errors and certain status codes.
- Optional insecure TLS agent for sites with invalid certs.
- Optional Puppeteer fallback for bot-protected sites.
- Gzip detection and decoding.
- Streaming XML parsing is used for health check sampling to avoid loading huge XML files into RAM.

## Operational Controls
- Request logging is enabled for all HTTP traffic.
- Discovery endpoint has a rate limiter to prevent abuse.
- Cache purge removes older cache entries based on `SITEMAP_CACHE_MAX_AGE_MS`.

## Scheduling
- On server start, all known sitemaps are refreshed once (warmup).
- A periodic job refreshes all sitemaps based on `SITEMAP_CACHE_REFRESH_INTERVAL_MS`.
- A periodic job purges stale cache files based on `SITEMAP_CACHE_PURGE_INTERVAL_MS`.

## Auth and Security
- Session-based auth with `express-session`.
- Protected API endpoints use `requireAuth` middleware.
- SSRF protection blocks requests to private IP ranges and localhost targets.

## Docker Notes
- The `data/` directory is mounted to persist `sitemaps.json` and cache files.

## Main Endpoints
- `GET /health`
- `GET /api/sitemaps`
- `PUT /api/sitemaps`
- `GET /api/fetch-sitemap?url=...`
- `POST /api/sitemaps/discover?mode=fast|verify`
- `POST /api/sitemaps/health`
- `GET /api/health-history?url=...`

## Config Summary
- Core: `PORT`, `NODE_ENV`
- Auth: `AUTH_USER`, `AUTH_PASS`, `SESSION_SECRET`, `COOKIE_SECURE`
- Cache: `SITEMAP_CACHE_TTL_MS`, `SITEMAP_CACHE_REFRESH_INTERVAL_MS`
- Cache purge: `SITEMAP_CACHE_MAX_AGE_MS`, `SITEMAP_CACHE_PURGE_INTERVAL_MS`
- Rate limit: `DISCOVERY_RATE_LIMIT_WINDOW_MS`, `DISCOVERY_RATE_LIMIT_MAX`
- Logging: `LOG_LEVEL`
- Health check sampling: `HEALTH_CHECK_SAMPLE_RATE`, `HEALTH_CHECK_SAMPLE_MAX`, `HEALTH_CHECK_CHILD_SITEMAPS`, `HEALTH_CHECK_TIMEOUT_MS`
- Health history: `HEALTH_HISTORY_RETENTION_DAYS`
- Alerting: `ALERT_SCORE_THRESHOLD`
- Fetch control: `FETCH_CONCURRENCY_LIMIT`, `DOMAIN_DELAY_MS`, `PUPPETEER_FIRST_HOSTS`
- Startup validation: required envs are validated on boot (fail-fast).
