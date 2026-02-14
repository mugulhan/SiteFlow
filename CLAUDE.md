# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SiteFlow (SitemapFlow) is a web-based sitemap viewer and manager that fetches, parses, and displays XML sitemaps. It allows users to track multiple sitemaps, view their contents, filter by date ranges, and organize them with tags. The application features persistent storage and handles CORS/SSL issues through a proxy server.

## Commands

### Development
```bash
npm start                 # Start the Express server on port 3000 (or PORT env var)
```

The server runs on `http://localhost:3000` by default.

## Architecture

### Backend (server.js)
- **Express server** that serves static files and provides REST API endpoints
- **Data persistence**: Stores sitemap configurations in `data/sitemaps.json`
- **Proxy endpoint**: `/api/fetch-sitemap` acts as a CORS-bypass proxy to fetch external sitemap XML files
  - Uses `undici` fetch with configurable SSL verification (retries with insecure agent on cert errors)
  - 15-second timeout on external requests
  - Handles various error cases: ECONNREFUSED, ENOTFOUND, timeout, etc.

### API Endpoints
- `GET /api/sitemaps` - Returns all stored sitemap configurations
- `PUT /api/sitemaps` - Updates the entire sitemap list (validates each entry)
- `GET /api/fetch-sitemap?url=<url>` - Proxies sitemap XML fetch with error handling

### Frontend Architecture (app.js + index.html)
- **Pure vanilla JavaScript** (no frameworks) with modern ES6+ features
- **State management**: Global `state` object maintains application state including:
  - `sitemaps`: List of sitemap configurations
  - `rows`: Rendered table data with parsed XML summaries
  - `selected`: Currently selected sitemap for detail view
  - `detailEntries`: Parsed URLs/sub-sitemaps from selected sitemap
  - Filters: `selectedDomain`, `selectedTag`, `filter`, `detailFilters`
  - UI state: `editingUrl`, `tagInputUrl`, `isLoadingDetails`

- **Two-panel layout**: Main table view + detail panel (sticky on desktop)
  - Main panel: Lists all sitemaps with filtering, tags, and inline editing
  - Detail panel: Shows individual URLs/sub-sitemaps from selected sitemap with date range filtering

### Data Flow
1. **Initialization**: `bootstrap()` → `syncSitemapsFromServer()` → `loadSitemaps()`
2. **Loading sitemaps**: Parallel fetch of all sitemap XML via proxy → parse with DOMParser → build summary
3. **Rendering**: `renderTable()` and `renderDetails()` rebuild DOM based on current state
4. **Persistence**: Any modification triggers `persistSitemaps()` which PUTs to `/api/sitemaps`

### XML Parsing
- Supports two sitemap types:
  - `urlset`: Contains individual URLs with `<loc>` and `<lastmod>` tags
  - `sitemapindex`: Contains references to other sitemaps
- Extracts entry count and latest modification date for each sitemap
- Uses native `DOMParser` for XML parsing

### Key Features
- **Inline editing**: Click "Duzenle" (Edit) to rename sitemap titles in-place
- **Tagging system**: Add/remove tags to organize sitemaps, with autocomplete from existing tags
- **Domain filtering**: Automatically groups sitemaps by hostname with URL counts
- **Tag filtering**: Filter sitemaps by assigned tags
- **Date range filtering**: Filter detail view URLs by modification date
- **Highlighting**: Most recently updated sitemap is highlighted in green
- **Localization**: All UI text is in Turkish

### Styling (styles.css)
- CSS custom properties for theming with automatic dark mode support
- Responsive design: Mobile-first with breakpoints at 640px and 1024px
- Two-column layout on desktop (≥1024px) with sticky detail panel

## Data Validation & Sanitization

Both client and server implement similar validation:
- **URL validation**: Ensures valid HTTP/HTTPS URLs using URL constructor
- **Tag sanitization**: Deduplicates tags (case-insensitive), trims whitespace
- **Entry sanitization**: Validates required fields (url, title) before persistence

## Error Handling

- Server-side errors return JSON with descriptive Turkish error messages
- Client catches fetch failures and displays user-friendly status messages
- Network issues (CORS, SSL, timeouts) are handled gracefully with fallback behaviors
- Invalid XML triggers parser error detection and user notification
