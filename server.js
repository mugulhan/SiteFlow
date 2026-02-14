const express = require("express");
require("dotenv").config();
const fs = require("fs/promises");
const fsSync = require("fs");
const zlib = require("zlib");
const path = require("path");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const net = require("net");
const dns = require("dns").promises;
const { Blob } = require("buffer");
const { Readable } = require("stream");
const { Agent } = require("undici");
const pino = require("pino");
const pinoHttp = require("pino-http");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const sax = require("sax");
const { addExtra } = require("puppeteer-extra");
const puppeteerBase = require("puppeteer");
const puppeteer = addExtra(puppeteerBase);
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const session = require("express-session");
const cron = require("node-cron");
const { analyzeUrlSimilarities } = require("./similarityEngine");

if (typeof globalThis.File === "undefined") {
  class NodeCompatibleFile extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options);
      this.name = typeof name === "string" ? name : "";
      this.lastModified =
        typeof options.lastModified === "number" ? options.lastModified : Date.now();
    }

    get [Symbol.toStringTag]() {
      return "File";
    }
  }

  globalThis.File = NodeCompatibleFile;
}

const cheerio = require("cheerio");

const envSchema = z.object({
  AUTH_USER: z.string().min(1, "AUTH_USER gerekli."),
  AUTH_PASS: z.string().min(1, "AUTH_PASS gerekli."),
  SESSION_SECRET: z.string().min(12, "SESSION_SECRET en az 12 karakter olmali."),
  PORT: z
    .string()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), "PORT sayi olmali."),
  SITEMAP_CACHE_TTL_MS: z
    .string()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), "SITEMAP_CACHE_TTL_MS sayi olmali."),
  SITEMAP_CACHE_REFRESH_INTERVAL_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "SITEMAP_CACHE_REFRESH_INTERVAL_MS sayi olmali."
    ),
  SITEMAP_CACHE_MAX_AGE_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "SITEMAP_CACHE_MAX_AGE_MS sayi olmali."
    ),
  SITEMAP_CACHE_PURGE_INTERVAL_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "SITEMAP_CACHE_PURGE_INTERVAL_MS sayi olmali."
    ),
  CRAWL_ERRORS_TTL_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "CRAWL_ERRORS_TTL_MS sayi olmali."
    ),
  DISCOVERY_RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "DISCOVERY_RATE_LIMIT_WINDOW_MS sayi olmali."
    ),
  DISCOVERY_RATE_LIMIT_MAX: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "DISCOVERY_RATE_LIMIT_MAX sayi olmali."
    ),
  HEALTH_CHECK_SAMPLE_RATE: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "HEALTH_CHECK_SAMPLE_RATE sayi olmali."
    ),
  HEALTH_CHECK_SAMPLE_MAX: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "HEALTH_CHECK_SAMPLE_MAX sayi olmali."
    ),
  HEALTH_CHECK_CHILD_SITEMAPS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "HEALTH_CHECK_CHILD_SITEMAPS sayi olmali."
    ),
  HEALTH_CHECK_TIMEOUT_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "HEALTH_CHECK_TIMEOUT_MS sayi olmali."
    ),
  HEALTH_HISTORY_RETENTION_DAYS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "HEALTH_HISTORY_RETENTION_DAYS sayi olmali."
    ),
  ALERT_SCORE_THRESHOLD: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "ALERT_SCORE_THRESHOLD sayi olmali."
    ),
  FETCH_CONCURRENCY_LIMIT: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "FETCH_CONCURRENCY_LIMIT sayi olmali."
    ),
  DOMAIN_DELAY_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "DOMAIN_DELAY_MS sayi olmali."
    ),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "BREVO_SENDER_EMAIL gecersiz."
    ),
  BREVO_SENDER_NAME: z.string().optional(),
  GLOBAL_NOTIFICATION_EMAIL: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "GLOBAL_NOTIFICATION_EMAIL gecersiz."
    ),
  BREVO_ALERT_COOLDOWN_MS: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isFinite(Number(value)),
      "BREVO_ALERT_COOLDOWN_MS sayi olmali."
    ),
  CRON_SCHEDULE: z
    .string()
    .optional()
    .refine((value) => !value || cron.validate(value), "CRON_SCHEDULE gecersiz."),
  LOG_LEVEL: z.string().optional(),
}).passthrough();

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (result.success) {
    return;
  }
  console.error("Config validation failed:");
  result.error.issues.forEach((issue) => {
    console.error(`- ${issue.message}`);
  });
  process.exit(1);
}

validateEnv();

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();
app.use(pinoHttp({ logger }));
const DEFAULT_PORT = 3000;
const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);
const hasCustomPort = Boolean(rawPort);
const preferredPort =
  Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
const enforcePreferredPort = hasCustomPort && preferredPort === parsedPort;

if (hasCustomPort && !enforcePreferredPort) {
  console.warn(
    `PORT degiskeni gecerli degil (${rawPort}). ${DEFAULT_PORT} portu kullanilacak.`
  );
}

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "sitemaps.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const CACHE_DIR = path.join(DATA_DIR, "cache");
const CRAWL_ERRORS_DIR = path.join(DATA_DIR, "crawl-errors");
const LINK_MAP_DIR = path.join(DATA_DIR, "link-maps");
const HEALTH_HISTORY_FILE = path.join(DATA_DIR, "health-history.json");
const SCAN_DB_PATH = process.env.SCAN_DB_PATH || path.join(DATA_DIR, "sitemap-monitor.db");
const SESSION_DB_PATH = process.env.SESSION_DB_PATH || path.join(DATA_DIR, "sessions.db");
const parsedLinkMapMaxUrls = Number(process.env.LINK_MAP_MAX_URLS);
const LINK_MAP_MAX_URLS_DEFAULT = Number.isFinite(parsedLinkMapMaxUrls)
  ? Math.max(10, Math.min(parsedLinkMapMaxUrls, 2000))
  : 300;
const LINK_MAP_FETCH_BATCH = 10;
const LINK_MAP_TARGET_PROBE_BATCH = 10;
const LINK_MAP_TARGET_PROBE_MAX = 5000;
const LINK_MAP_TARGET_PROBE_TIMEOUT_MS = 10000;
const parsedLinkMapJobTtl = Number(process.env.LINK_MAP_JOB_TTL_MS);
const LINK_MAP_JOB_TTL_MS = Number.isFinite(parsedLinkMapJobTtl)
  ? Math.max(60 * 1000, parsedLinkMapJobTtl)
  : 30 * 60 * 1000;
const LINK_MAP_JOB_MAX = 200;
const parsedScanRetention = Number(process.env.SCAN_RETENTION_COUNT);
const parsedScanSampleRate = Number(process.env.SCAN_SAMPLE_RATE);
const parsedScanSampleMax = Number(process.env.SCAN_SAMPLE_MAX);
const SCAN_RETENTION_COUNT = Number.isFinite(parsedScanRetention) ? Math.max(1, parsedScanRetention) : 10;
const SCAN_SAMPLE_RATE = Number.isFinite(parsedScanSampleRate) ? Math.max(0, parsedScanSampleRate) : 0.1;
const SCAN_SAMPLE_MAX = Number.isFinite(parsedScanSampleMax) ? Math.max(1, parsedScanSampleMax) : 2000;
const SCAN_DIFF_URL_SAMPLE_LIMIT = 100;
const SCAN_NOTIFICATION_RETENTION_DAYS = 30;
const parsedCacheTtl = Number(process.env.SITEMAP_CACHE_TTL_MS);
const parsedRefreshInterval = Number(process.env.SITEMAP_CACHE_REFRESH_INTERVAL_MS);
const parsedCacheMaxAge = Number(process.env.SITEMAP_CACHE_MAX_AGE_MS);
const parsedCachePurgeInterval = Number(process.env.SITEMAP_CACHE_PURGE_INTERVAL_MS);
const parsedCrawlErrorsTtl = Number(process.env.CRAWL_ERRORS_TTL_MS);
const CACHE_TTL_MS = Number.isFinite(parsedCacheTtl) ? parsedCacheTtl : 15 * 60 * 1000;
const CACHE_REFRESH_INTERVAL_MS = Number.isFinite(parsedRefreshInterval)
  ? parsedRefreshInterval
  : 15 * 60 * 1000;
const CACHE_MAX_AGE_MS = Number.isFinite(parsedCacheMaxAge)
  ? parsedCacheMaxAge
  : 7 * 24 * 60 * 60 * 1000;
const CACHE_PURGE_INTERVAL_MS = Number.isFinite(parsedCachePurgeInterval)
  ? parsedCachePurgeInterval
  : 6 * 60 * 60 * 1000;
const CRAWL_ERRORS_TTL_MS = Number.isFinite(parsedCrawlErrorsTtl)
  ? parsedCrawlErrorsTtl
  : 6 * 60 * 60 * 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const PROXY_TIMEOUT_MS = 30000; // 30 saniye
const MAX_RETRIES = 3;
const INSECURE_AGENT = new Agent({ connect: { rejectUnauthorized: false } });
const DEFAULT_PUPPETEER_FIRST_HOSTS = [
  ".acibadem.com.tr",
  ".memorial.com.tr",
  ".medicana.com.tr",
  ".medicalpark.com.tr",
  ".anadolusaglik.org",
  ".okanhastanesi.com.tr",
  ".florence.com.tr",
  ".uskudardishastanesi.com",
  ".livhospital.com",
  "onedio.com",
  ".milliyet.com.tr",
  "www.aa.com.tr",
  "useinsider.com",
  "www.sozcu.com.tr",
  "www.reuters.com",
  "medipol.com.tr",
  "yeditepehastaneleri.com",
  "cevrehastanesi.com.tr",
  "www.mph.com.tr",
];
const PUPPETEER_FIRST_HOSTS = new Set([
  ...DEFAULT_PUPPETEER_FIRST_HOSTS,
  ...String(process.env.PUPPETEER_FIRST_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
]);

class SqliteSessionStore extends session.Store {
  constructor({ dbPath, ttlMs } = {}) {
    super();
    fsSync.mkdirSync(DATA_DIR, { recursive: true });
    this.db = new Database(dbPath || SESSION_DB_PATH);
    // Some mounted filesystems (especially on Docker Desktop bind mounts)
    // cannot create SQLite SHM/WAL files reliably. Fall back to DELETE mode.
    try {
      this.db.pragma("journal_mode = WAL");
    } catch (error) {
      console.warn("SQLite WAL mode unavailable, falling back to DELETE journal mode:", error?.code || error?.message || error);
      try {
        this.db.pragma("journal_mode = DELETE");
      } catch (fallbackError) {
        console.warn(
          "SQLite DELETE journal pragma also failed, continuing with default mode:",
          fallbackError?.code || fallbackError?.message || fallbackError
        );
      }
    }
    this.ttlMs = Number.isFinite(Number(ttlMs)) ? Number(ttlMs) : SESSION_TTL_MS;
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expires INTEGER
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires);
    `);
    this.lastCleanup = 0;
  }

  get(sid, callback) {
    try {
      const row = this.db
        .prepare("SELECT sess, expires FROM sessions WHERE sid = ?")
        .get(sid);
      if (!row) {
        callback(null, null);
        return;
      }
      if (row.expires && row.expires <= Date.now()) {
        this.db.prepare("DELETE FROM sessions WHERE sid = ?").run(sid);
        callback(null, null);
        return;
      }
      const sessionData = JSON.parse(row.sess);
      callback(null, sessionData);
    } catch (error) {
      callback(error);
    }
  }

  set(sid, sess, callback) {
    try {
      const expires = this.resolveExpires(sess);
      const payload = JSON.stringify(sess);
      this.db
        .prepare(
          "INSERT INTO sessions (sid, sess, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expires = excluded.expires"
        )
        .run(sid, payload, expires);
      this.maybeCleanup();
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sid, sess, callback) {
    try {
      const expires = this.resolveExpires(sess);
      this.db
        .prepare("UPDATE sessions SET expires = ? WHERE sid = ?")
        .run(expires, sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback) {
    try {
      this.db.prepare("DELETE FROM sessions WHERE sid = ?").run(sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  resolveExpires(sess) {
    if (sess && sess.cookie) {
      if (sess.cookie.expires) {
        const timestamp = Date.parse(sess.cookie.expires);
        if (Number.isFinite(timestamp)) {
          return timestamp;
        }
      }
      if (Number.isFinite(Number(sess.cookie.maxAge))) {
        return Date.now() + Number(sess.cookie.maxAge);
      }
    }
    return Date.now() + this.ttlMs;
  }

  maybeCleanup() {
    const now = Date.now();
    if (now - this.lastCleanup < 10 * 60 * 1000) {
      return;
    }
    this.lastCleanup = now;
    this.db
      .prepare("DELETE FROM sessions WHERE expires IS NOT NULL AND expires <= ?")
      .run(now);
  }
}
function isPuppeteerFirstHost(hostname) {
  if (!hostname) {
    return false;
  }
  const lowered = hostname.toLowerCase();
  if (PUPPETEER_FIRST_HOSTS.has(lowered)) {
    return true;
  }
  for (const entry of PUPPETEER_FIRST_HOSTS) {
    if (!entry.startsWith(".")) {
      continue;
    }
    const suffix = entry.slice(1);
    if (!suffix) {
      continue;
    }
    if (lowered === suffix || lowered.endsWith("." + suffix)) {
      return true;
    }
  }
  return false;
}

function detectResponseType(text) {
  if (typeof text !== "string") {
    return "xml";
  }
  const trimmed = text.trim().toLowerCase();
  if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html")) {
    return "html";
  }
  return "xml";
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_API_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_ACCOUNT_ENDPOINT = "https://api.brevo.com/v3/account";
const ENV_BREVO_API_KEY =
  typeof process.env.BREVO_API_KEY === "string" ? process.env.BREVO_API_KEY.trim() : "";
const ENV_BREVO_SENDER_EMAIL =
  typeof process.env.BREVO_SENDER_EMAIL === "string" ? process.env.BREVO_SENDER_EMAIL.trim() : "";
const ENV_BREVO_SENDER_NAME =
  typeof process.env.BREVO_SENDER_NAME === "string" ? process.env.BREVO_SENDER_NAME.trim() : "";
const GLOBAL_NOTIFICATION_EMAIL =
  typeof process.env.GLOBAL_NOTIFICATION_EMAIL === "string"
    ? process.env.GLOBAL_NOTIFICATION_EMAIL.trim()
    : "";
const parsedBrevoCooldown = Number(process.env.BREVO_ALERT_COOLDOWN_MS);
const BREVO_ALERT_COOLDOWN_MS = Number.isFinite(parsedBrevoCooldown)
  ? parsedBrevoCooldown
  : 60 * 60 * 1000;
const brevoAlertCooldowns = new Map();
const rawCronSchedule =
  typeof process.env.CRON_SCHEDULE === "string" ? process.env.CRON_SCHEDULE.trim() : "";
const CRON_SCHEDULE =
  rawCronSchedule && rawCronSchedule.toLowerCase() !== "off" ? rawCronSchedule : "";
const FETCH_CONCURRENCY_LIMIT = Number(process.env.FETCH_CONCURRENCY_LIMIT || 3);
let activeFetchCount = 0;
const fetchQueue = [];
const linkMapJobs = new Map();
const domainLastRequest = new Map();
const DOMAIN_DELAY_MS = Number(process.env.DOMAIN_DELAY_MS || 1500);
const inflightCacheRefresh = new Map();
const parsedDiscoveryRateWindow = Number(process.env.DISCOVERY_RATE_LIMIT_WINDOW_MS);
const parsedDiscoveryRateMax = Number(process.env.DISCOVERY_RATE_LIMIT_MAX);
const DISCOVERY_RATE_LIMIT_WINDOW_MS = Number.isFinite(parsedDiscoveryRateWindow)
  ? parsedDiscoveryRateWindow
  : 5 * 60 * 1000;
const DISCOVERY_RATE_LIMIT_MAX = Number.isFinite(parsedDiscoveryRateMax)
  ? parsedDiscoveryRateMax
  : 30;
const parsedHealthSampleRate = Number(process.env.HEALTH_CHECK_SAMPLE_RATE);
const parsedHealthSampleMax = Number(process.env.HEALTH_CHECK_SAMPLE_MAX);
const parsedHealthChildMax = Number(process.env.HEALTH_CHECK_CHILD_SITEMAPS);
const parsedHealthTimeout = Number(process.env.HEALTH_CHECK_TIMEOUT_MS);
const parsedHealthHistoryDays = Number(process.env.HEALTH_HISTORY_RETENTION_DAYS);
const HEALTH_CHECK_SAMPLE_RATE = Number.isFinite(parsedHealthSampleRate)
  ? parsedHealthSampleRate
  : 0.1;
const HEALTH_CHECK_SAMPLE_MAX = Number.isFinite(parsedHealthSampleMax)
  ? parsedHealthSampleMax
  : 20;
const HEALTH_CHECK_CHILD_SITEMAPS = Number.isFinite(parsedHealthChildMax)
  ? parsedHealthChildMax
  : 5;
const HEALTH_CHECK_TIMEOUT_MS = Number.isFinite(parsedHealthTimeout)
  ? parsedHealthTimeout
  : 8000;
const HEALTH_HISTORY_RETENTION_DAYS = Number.isFinite(parsedHealthHistoryDays)
  ? parsedHealthHistoryDays
  : 30;
const parsedAlertThreshold = Number(process.env.ALERT_SCORE_THRESHOLD);
const ALERT_SCORE_THRESHOLD = Number.isFinite(parsedAlertThreshold)
  ? parsedAlertThreshold
  : 50;

async function waitForDomainSlot(hostname) {
  if (!hostname) {
    return;
  }
  const lastTime = domainLastRequest.get(hostname) || 0;
  const elapsed = Date.now() - lastTime;
  if (elapsed < DOMAIN_DELAY_MS) {
    await new Promise((resolve) => setTimeout(resolve, DOMAIN_DELAY_MS - elapsed));
  }
  domainLastRequest.set(hostname, Date.now());
}

const DISCOVERY_COMMON_PATHS = [
  "/sitemap.xml",
  "/sitemap_index.xml",
  "/sitemap-index.xml",
  "/sitemap1.xml",
  "/news-sitemap.xml",
  "/sitemap-news.xml",
  "/google-news-sitemap.xml",
  "/sitemaps/sitemap.xml",
  "/sitemaps/index.xml",
  "/sitemaps/sitemap_index.xml",
  "/sitemap/sitemap.xml",
  "/sitemap/index.xml",
  "/xml/sitemap.xml",
  "/feed",
  "/rss",
  "/feeds/sitemapindex",
  "/feeds/sitemap.xml",
  "/feeds/sitemap_index.xml",
  "/feeds/feed.xml",
  "/feeds/rss.xml",
  "/feeds/posts/default?alt=rss",
  "/feeds/posts/default",
];
const DISCOVERY_MAX_RESULTS = 50;
const DISCOVERY_HTML_MAX_BYTES = 512 * 1024; // 512 KB
const DISCOVERY_FETCH_TIMEOUT_MS = 15000;
const DISCOVERY_VERIFY_TIMEOUT_MS = 8000;
const DISCOVERY_CHILD_MAX_PER_PARENT = 20;
const DISCOVERY_CHILD_MAX_BYTES = 1024 * 1024;
const DISCOVERY_CRAWL_MAX_PAGES = 10;
const DISCOVERY_CRAWL_MAX_DEPTH = 2;
const DISCOVERY_CRAWL_LINKS_PER_PAGE = 12;
const HEADING_LINK_STATUS_MAX_URLS = Number(process.env.HEADING_LINK_STATUS_MAX_URLS || 50);
const HEADING_LINK_STATUS_TIMEOUT_MS = Number(process.env.HEADING_LINK_STATUS_TIMEOUT_MS || 10000);

class BrevoKeyValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BrevoKeyValidationError";
  }
}

function validateBrevoApiKey(value) {
  if (typeof value !== "string") {
    throw new BrevoKeyValidationError("Brevo API anahtari gecerli bir metin olmali.");
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new BrevoKeyValidationError("Brevo API anahtari bos olamaz.");
  }
  if (!/^xkeysib-[A-Za-z0-9]{10,}/.test(trimmed)) {
    throw new BrevoKeyValidationError("Brevo API anahtari beklenen formatta degil.");
  }
  return trimmed;
}

function sanitizeBrevoAccountResponse(data) {
  if (!data || typeof data !== "object") {
    return {};
  }

  const plan = data.plan && typeof data.plan === "object" ? data.plan : {};

  return {
    email: typeof data.email === "string" ? data.email : "",
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    companyName: typeof data.companyName === "string" ? data.companyName : "",
    planType: typeof plan.type === "string" ? plan.type : "",
    planCredits: typeof plan.credits === "number" ? plan.credits : null,
  };
}

async function withFetchSlot(task) {
  if (activeFetchCount >= FETCH_CONCURRENCY_LIMIT) {
    await new Promise((resolve) => fetchQueue.push(resolve));
  }
  activeFetchCount += 1;
  try {
    return await task();
  } finally {
    activeFetchCount -= 1;
    const next = fetchQueue.shift();
    if (next) {
      next();
    }
  }
}

function getCacheKey(url) {
  return crypto.createHash("sha1").update(url).digest("hex");
}

function getCachePaths(url) {
  const key = getCacheKey(url);
  return {
    key,
    xmlPath: path.join(CACHE_DIR, `${key}.xml`),
    metaPath: path.join(CACHE_DIR, `${key}.json`),
  };
}

async function ensureCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

async function ensureCrawlErrorsDir() {
  await fs.mkdir(CRAWL_ERRORS_DIR, { recursive: true });
}

async function ensureLinkMapDir() {
  await fs.mkdir(LINK_MAP_DIR, { recursive: true });
}

async function readCacheMeta(url) {
  const { metaPath } = getCachePaths(url);
  try {
    const raw = await fs.readFile(metaPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

async function readCachedSitemap(url) {
  const { xmlPath } = getCachePaths(url);
  const [meta, xml] = await Promise.all([
    readCacheMeta(url),
    fs.readFile(xmlPath, "utf8").catch(() => null),
  ]);
  return { meta, xml };
}

function getCrawlErrorsPaths(url) {
  const key = getCacheKey(url);
  return {
    key,
    jsonPath: path.join(CRAWL_ERRORS_DIR, `${key}.json`),
  };
}

async function readCrawlErrorsCache(url) {
  const { jsonPath } = getCrawlErrorsPaths(url);
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(raw);
    const scannedAtMs =
      Number(parsed && parsed.scannedAtMs) ||
      Date.parse(parsed && parsed.scannedAt) ||
      0;
    if (!Number.isFinite(scannedAtMs) || scannedAtMs <= 0) {
      return null;
    }
    if (Date.now() - scannedAtMs > CRAWL_ERRORS_TTL_MS) {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

async function readCrawlErrorsSnapshot(url) {
  const { jsonPath } = getCrawlErrorsPaths(url);
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function getActiveCrawlErrors(payload) {
  if (!payload || !Array.isArray(payload.errors)) {
    return [];
  }
  return payload.errors.filter((entry) => entry && entry.state !== "resolved");
}

function buildCrawlErrorsDiff(currentErrors, previousErrors, scannedAtIso) {
  const previousByUrl = new Map();
  (previousErrors || []).forEach((entry) => {
    if (entry && typeof entry.url === "string" && entry.url.trim()) {
      previousByUrl.set(entry.url, entry);
    }
  });

  const merged = (currentErrors || []).map((entry) => {
    if (!entry || typeof entry.url !== "string") {
      return entry;
    }
    if (previousByUrl.has(entry.url)) {
      previousByUrl.delete(entry.url);
      return { ...entry, state: "ongoing" };
    }
    return { ...entry, state: "new" };
  });

  const resolved = [];
  previousByUrl.forEach((entry) => {
    if (!entry || typeof entry.url !== "string") {
      return;
    }
    resolved.push({
      url: entry.url,
      status: entry.status ?? null,
      category: entry.category || "unknown",
      message: entry.message || "",
      state: "resolved",
      resolvedAt: scannedAtIso,
    });
  });

  return [...merged, ...resolved];
}

async function writeCrawlErrorsCache(url, payload) {
  await ensureCrawlErrorsDir();
  const { jsonPath } = getCrawlErrorsPaths(url);
  const serialized = JSON.stringify(payload, null, 2);
  await fs.writeFile(jsonPath, serialized, "utf8");
  return payload;
}

function isCacheFresh(meta) {
  const fetchedAt = Number(meta && meta.fetchedAt);
  if (!Number.isFinite(fetchedAt)) {
    return false;
  }
  return Date.now() - fetchedAt < CACHE_TTL_MS;
}

async function writeCache(url, xml, meta = {}) {
  await ensureCacheDir();
  const { xmlPath, metaPath } = getCachePaths(url);
  const payload = {
    url,
    fetchedAt: Date.now(),
    statusCode: meta.statusCode || 200,
    contentType: meta.contentType || "application/xml; charset=utf-8",
    fetchMode: meta.fetchMode || "fetch",
    responseType: meta.responseType || "xml",
    staleReason: meta.staleReason || "",
    bytes: Buffer.byteLength(xml || "", "utf8"),
    etag: meta.etag || "",
    lastModified: meta.lastModified || "",
  };
  await fs.writeFile(xmlPath, xml, "utf8");
  await fs.writeFile(metaPath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

async function updateCacheMeta(url, updates = {}) {
  const { metaPath } = getCachePaths(url);
  let current;
  try {
    const raw = await fs.readFile(metaPath, "utf8");
    current = JSON.parse(raw);
  } catch (_error) {
    return null;
  }
  const next = { ...current, ...updates };
  await fs.writeFile(metaPath, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function purgeCache({ maxAgeMs = CACHE_MAX_AGE_MS } = {}) {
  if (!Number.isFinite(maxAgeMs) || maxAgeMs <= 0) {
    return;
  }
  await ensureCacheDir();
  let entries = [];
  try {
    entries = await fs.readdir(CACHE_DIR, { withFileTypes: true });
  } catch (_error) {
    return;
  }

  const now = Date.now();
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }
    const metaPath = path.join(CACHE_DIR, entry.name);
    let fetchedAt = null;
    try {
      const raw = await fs.readFile(metaPath, "utf8");
      const meta = JSON.parse(raw);
      fetchedAt = Number(meta && meta.fetchedAt);
    } catch (_error) {
      fetchedAt = null;
    }
    if (!Number.isFinite(fetchedAt)) {
      try {
        const stat = await fs.stat(metaPath);
        fetchedAt = stat.mtimeMs;
      } catch (_error) {
        continue;
      }
    }
    if (now - fetchedAt <= maxAgeMs) {
      continue;
    }
    const baseName = entry.name.slice(0, -".json".length);
    const xmlPath = path.join(CACHE_DIR, `${baseName}.xml`);
    await fs.unlink(metaPath).catch(() => null);
    await fs.unlink(xmlPath).catch(() => null);
  }
}

class SitemapFetchError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.name = "SitemapFetchError";
    this.status = status;
    this.code = code;
  }
}

function classifyFetchError({ status, code, message }) {
  const safeCode = code || "";
  const safeMessage = message || "";

  if (
    safeCode === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    safeCode === "ERR_TLS_CERT_ALTNAME_INVALID"
  ) {
    return "tls";
  }
  if (
    safeCode === "UND_ERR_CONNECT_TIMEOUT" ||
    safeCode === "UND_ERR_HEADERS_TIMEOUT" ||
    safeCode === "ETIMEDOUT" ||
    safeMessage.toLowerCase().includes("zaman asimina")
  ) {
    return "timeout";
  }
  if (safeCode === "ENOTFOUND") {
    return "dns";
  }
  if (safeCode === "UND_ERR_SOCKET" || safeCode === "ECONNRESET") {
    return "connection";
  }
  if (status === 429) {
    return "rate_limit";
  }
  if (status === 403) {
    return "waf";
  }
  if (status >= 500) {
    return "upstream";
  }
  if (status >= 400) {
    return "http";
  }
  return "unknown";
}

function sendFetchError(res, { status, message, code }) {
  const safeStatus = Number.isFinite(Number(status)) ? Number(status) : 500;
  const safeMessage = typeof message === "string" && message.trim() ? message.trim() : "Unknown error";
  const safeCode = typeof code === "string" && code.trim() ? code.trim() : null;
  const type = classifyFetchError({ status: safeStatus, code: safeCode, message: safeMessage });

  res.set("X-Fetch-Error-Type", type);
  if (safeCode) {
    res.set("X-Fetch-Error-Code", safeCode);
  }
  res.status(safeStatus).json({ message: safeMessage, type, code: safeCode, status: safeStatus });
}

function mapFetchErrorToResponse(error) {
  const code = error?.code || error?.cause?.code;
  if (code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "ERR_TLS_CERT_ALTNAME_INVALID") {
    return { status: 502, message: "SSL sertifikasi dogrulanamadi." };
  }
  if (code === "UND_ERR_SOCKET" || code === "ECONNRESET") {
    return { status: 502, message: "Hedef sunucu baglantiyi kapatti." };
  }
  if (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_HEADERS_TIMEOUT" ||
    code === "ETIMEDOUT"
  ) {
    return { status: 504, message: "Sitemap istegi zaman asimina ugradi." };
  }
  if (error?.name === "AbortError") {
    return { status: 504, message: "Sitemap istegi zaman asimina ugradi." };
  }
  if (error?.cause && error.cause.code === "ECONNREFUSED") {
    return { status: 502, message: "Hedef sunucuya baglanilamadi." };
  }
  if (error?.code === "ENOTFOUND") {
    return { status: 404, message: "Sitemap adresi bulunamadi." };
  }
  return null;
}

function normalizeCharsetLabel(value) {
  if (typeof value !== "string") {
    return "";
  }
  const cleaned = value.trim().replace(/^["']+|["']+$/g, "").toLowerCase();
  if (!cleaned) {
    return "";
  }
  if (cleaned === "utf8") {
    return "utf-8";
  }
  if (
    cleaned === "iso8859-9" ||
    cleaned === "iso88599" ||
    cleaned === "latin5" ||
    cleaned === "iso-ir-148"
  ) {
    return "iso-8859-9";
  }
  if (cleaned === "cp1254" || cleaned === "x-cp1254" || cleaned === "windows1254") {
    return "windows-1254";
  }
  return cleaned;
}

function extractCharsetFromContentType(contentType) {
  if (typeof contentType !== "string" || !contentType) {
    return "";
  }
  const match = contentType.match(/charset\s*=\s*["']?\s*([^\s;,"']+)/i);
  return normalizeCharsetLabel(match ? match[1] : "");
}

function extractCharsetFromHtmlMeta(htmlText) {
  if (typeof htmlText !== "string" || !htmlText) {
    return "";
  }
  const directMatch = htmlText.match(/<meta[^>]*charset\s*=\s*["']?\s*([a-z0-9._-]+)/i);
  if (directMatch && directMatch[1]) {
    return normalizeCharsetLabel(directMatch[1]);
  }
  const httpEquivMatch = htmlText.match(
    /<meta[^>]*http-equiv\s*=\s*["']?content-type["']?[^>]*content\s*=\s*["'][^"']*charset\s*=\s*([a-z0-9._-]+)/i
  );
  if (httpEquivMatch && httpEquivMatch[1]) {
    return normalizeCharsetLabel(httpEquivMatch[1]);
  }
  return "";
}

function countMojibakeArtifacts(value) {
  if (typeof value !== "string" || !value) {
    return 0;
  }
  const matches = value.match(/[ÃÄÅÂ]/g);
  return matches ? matches.length : 0;
}

function decodeBufferWithCharset(buffer, charsetLabel) {
  const safeCharset = normalizeCharsetLabel(charsetLabel);
  if (!safeCharset) {
    return null;
  }
  try {
    const decoder = new TextDecoder(safeCharset);
    return decoder.decode(buffer);
  } catch (_error) {
    return null;
  }
}

function decodeHtmlBuffer(buffer, contentType = "") {
  const safeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer || []);
  let usedCharset = "";

  const decodeUsing = (label) => {
    const normalized = normalizeCharsetLabel(label);
    if (!normalized) {
      return null;
    }
    const decoded = decodeBufferWithCharset(safeBuffer, normalized);
    if (typeof decoded !== "string") {
      return null;
    }
    return { text: decoded, charset: normalized };
  };

  let decoded =
    decodeUsing(extractCharsetFromContentType(contentType)) ||
    decodeUsing("utf-8") || {
      text: safeBuffer.toString("utf8"),
      charset: "utf-8",
    };
  usedCharset = decoded.charset;

  const metaCharset = extractCharsetFromHtmlMeta(decoded.text.slice(0, 12000));
  if (metaCharset && metaCharset !== usedCharset) {
    const metaDecoded = decodeUsing(metaCharset);
    if (metaDecoded) {
      decoded = metaDecoded;
      usedCharset = metaDecoded.charset;
    }
  }

  const fallbackDecoded = decodeUsing("windows-1254");
  if (
    fallbackDecoded &&
    countMojibakeArtifacts(fallbackDecoded.text) < countMojibakeArtifacts(decoded.text)
  ) {
    decoded = fallbackDecoded;
    usedCharset = fallbackDecoded.charset;
  }

  return { text: decoded.text, charset: usedCharset || "utf-8" };
}

function repairCommonMojibake(value) {
  const source = value == null ? "" : String(value);
  if (!source || !/[ÃÄÅÂ]/.test(source)) {
    return source;
  }
  let repaired = source;
  try {
    repaired = Buffer.from(source, "latin1").toString("utf8");
  } catch (_error) {
    return source;
  }
  if (!repaired || repaired.includes("\uFFFD")) {
    return source;
  }
  const sourceArtifacts = countMojibakeArtifacts(source);
  const repairedArtifacts = countMojibakeArtifacts(repaired);
  const sourceTurkish = (source.match(/[çğıöşüÇĞİÖŞÜ]/g) || []).length;
  const repairedTurkish = (repaired.match(/[çğıöşüÇĞİÖŞÜ]/g) || []).length;
  if (repairedArtifacts < sourceArtifacts || repairedTurkish > sourceTurkish) {
    return repaired;
  }
  return source;
}

async function fetchSitemapXmlWithRetry(targetUrl) {
  return fetchSitemapXmlWithRetryInternal(targetUrl, { stream: false });
}

function toNodeReadable(response) {
  if (!response || !response.body) {
    return Readable.from([]);
  }
  if (typeof Readable.fromWeb === "function" && response.body?.getReader) {
    return Readable.fromWeb(response.body);
  }
  return response.body;
}

async function fetchSitemapStreamWithRetry(targetUrl) {
  return fetchSitemapXmlWithRetryInternal(targetUrl, { stream: true });
}

async function fetchPageHtmlWithRetry(targetUrl) {
  let target;
  try {
    target = new URL(targetUrl);
  } catch (error) {
    throw new SitemapFetchError("Gecerli bir URL saglayin.", 400);
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new SitemapFetchError("Sadece HTTP veya HTTPS adresleri desteklenir.", 400);
  }

  await assertPublicUrl(target.href);

  if (isPuppeteerFirstHost(target.hostname)) {
    try {
      const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
      return {
        html: puppeteerContent,
        statusCode: 200,
        contentType: "text/html; charset=utf-8",
        fetchMode: "puppeteer",
      };
    } catch (error) {
      console.warn("Puppeteer primary page fetch hatasi:", error.message || error);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  const createOptions = (userAgent, attempt = 1) => {
    const headers = {
      "User-Agent": userAgent || getRandomUserAgent(),
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
    };

    if (attempt === 1) {
      headers["Cache-Control"] = "max-age=0";
    } else {
      headers["Cache-Control"] = "no-cache";
      headers["Pragma"] = "no-cache";
    }

    if (attempt > 1) {
      headers["Referer"] = target.origin + "/";
    }

    return {
      signal: controller.signal,
      headers,
    };
  };

  const shouldRetryInsecure = (error) => {
    const code = error?.code || error?.cause?.code;
    return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "ERR_TLS_CERT_ALTNAME_INVALID";
  };

  const shouldRetry = (error, response) => {
    if (error) {
      const code = error?.code || error?.cause?.code;
      if (
        [
          "ECONNRESET",
          "ETIMEDOUT",
          "ENOTFOUND",
          "UND_ERR_CONNECT_TIMEOUT",
          "UND_ERR_HEADERS_TIMEOUT",
        ].includes(code)
      ) {
        return true;
      }
      if (shouldRetryInsecure(error)) {
        return true;
      }
    }
    if (
      response &&
      (response.status === 403 ||
        response.status === 429 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504)
    ) {
      return true;
    }
    return false;
  };

  const shouldFallbackToPuppeteer = (error) => {
    const code = error?.code || error?.cause?.code;
    return code === "UND_ERR_SOCKET" || code === "ECONNRESET";
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    let response;
    let lastError;
    let useInsecure = false;
    let currentUserAgent = getRandomUserAgent();
    let responseContentType = "text/html; charset=utf-8";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const baseOpts = createOptions(currentUserAgent, attempt);
        const options = useInsecure
          ? { ...baseOpts, dispatcher: INSECURE_AGENT }
          : baseOpts;

        await waitForDomainSlot(target.hostname);
        response = await fetch(target.href, options);
        responseContentType = response.headers.get("content-type") || responseContentType;

        if (response.ok || !shouldRetry(null, response)) {
          break;
        }

        if (response.status === 403 && attempt < MAX_RETRIES) {
          currentUserAgent = getRandomUserAgent();
          await sleep(2000 * attempt);
          continue;
        }

        if (response.status === 429 && attempt < MAX_RETRIES) {
          const retryAfter = response.headers.get("retry-after");
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000 * attempt;
          await sleep(waitTime);
          continue;
        }

        if (
          (response.status === 502 || response.status === 503 || response.status === 504) &&
          attempt < MAX_RETRIES
        ) {
          await sleep(1000 * attempt);
          continue;
        }

        break;
      } catch (error) {
        lastError = error;

        if (shouldRetryInsecure(error) && !useInsecure) {
          useInsecure = true;
          attempt--;
          continue;
        }

        if (shouldRetry(error, null) && attempt < MAX_RETRIES) {
          await sleep(1000 * attempt);
          continue;
        }

        throw error;
      }
    }

    if (!response) {
      if (lastError && shouldFallbackToPuppeteer(lastError)) {
        try {
          const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
          return {
            html: puppeteerContent,
            statusCode: 200,
            contentType: "text/html; charset=utf-8",
            fetchMode: "puppeteer",
          };
        } catch (puppeteerError) {
          lastError = puppeteerError;
        }
      }
      throw lastError || new Error("Tum denemeler basarisiz oldu");
    }

    if (!response.ok) {
      if (response.status === 403 || response.status === 429 || response.status >= 500) {
        try {
          const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
          return {
            html: puppeteerContent,
            statusCode: 200,
            contentType: "text/html; charset=utf-8",
            fetchMode: "puppeteer",
          };
        } catch (puppeteerError) {
          console.error("Puppeteer fetch hatasi:", puppeteerError.message);
        }
      }
      const message = `${response.status} ${response.statusText || "Upstream hata"}`;
      throw new SitemapFetchError(message, response.status);
    }

    const htmlBuffer = Buffer.from(await response.arrayBuffer());
    const decodedHtml = decodeHtmlBuffer(htmlBuffer, responseContentType);
    const html = decodedHtml.text;
    return {
      html,
      statusCode: response.status,
      contentType: responseContentType,
      fetchMode: "fetch",
    };
  } catch (error) {
    if (shouldFallbackToPuppeteer(error) || shouldRetryInsecure(error)) {
      try {
        const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
        return {
          html: puppeteerContent,
          statusCode: 200,
          contentType: "text/html; charset=utf-8",
          fetchMode: "puppeteer",
        };
      } catch (puppeteerError) {
        console.error("Puppeteer fallback fetch hatasi:", puppeteerError.message);
      }
    }

    if (error instanceof SitemapFetchError) {
      throw error;
    }

    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      throw new SitemapFetchError(mapped.message, mapped.status, error?.code || error?.cause?.code);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSitemapXmlWithRetryInternal(targetUrl, { stream }) {
  let target;
  try {
    target = new URL(targetUrl);
  } catch (error) {
    throw new SitemapFetchError("Gecerli bir URL saglayin.", 400);
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new SitemapFetchError("Sadece HTTP veya HTTPS adresleri desteklenir.", 400);
  }

  await assertPublicUrl(target.href);

  if (isPuppeteerFirstHost(target.hostname)) {
    try {
      const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
      const responseType = detectResponseType(puppeteerContent);
      if (stream) {
        return {
          stream: Readable.from([puppeteerContent]),
          statusCode: 200,
          contentType: "application/xml; charset=utf-8",
          fetchMode: "puppeteer",
          responseType,
        };
      }
      return {
        xml: puppeteerContent,
        statusCode: 200,
        contentType: "application/xml; charset=utf-8",
        fetchMode: "puppeteer",
        responseType,
      };
    } catch (error) {
      console.warn("Puppeteer primary fetch hatasi:", error.message || error);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  const createOptions = (userAgent, attempt = 1) => {
    const headers = {
      "User-Agent": userAgent || getRandomUserAgent(),
      Accept: "application/xml,text/xml,application/xhtml+xml,text/html;q=0.9,*/*;q=0.8",
      "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
    };

    if (attempt === 1) {
      headers["Cache-Control"] = "max-age=0";
    } else {
      headers["Cache-Control"] = "no-cache";
      headers["Pragma"] = "no-cache";
    }

    if (attempt > 1) {
      headers["Referer"] = target.origin + "/";
    }

    return {
      signal: controller.signal,
      headers,
    };
  };

  const shouldRetryInsecure = (error) => {
    const code = error?.code || error?.cause?.code;
    return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "ERR_TLS_CERT_ALTNAME_INVALID";
  };

  const shouldRetry = (error, response) => {
    if (error) {
      const code = error?.code || error?.cause?.code;
      if (
        [
          "ECONNRESET",
          "ETIMEDOUT",
          "ENOTFOUND",
          "UND_ERR_CONNECT_TIMEOUT",
          "UND_ERR_HEADERS_TIMEOUT",
        ].includes(code)
      ) {
        return true;
      }
      if (shouldRetryInsecure(error)) {
        return true;
      }
    }
    if (
      response &&
      (response.status === 403 ||
        response.status === 429 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504)
    ) {
      return true;
    }
    return false;
  };

  const shouldFallbackToPuppeteer = (error) => {
    const code = error?.code || error?.cause?.code;
    return code === "UND_ERR_SOCKET" || code === "ECONNRESET";
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    let response;
    let lastError;
    let useInsecure = false;
    let currentUserAgent = getRandomUserAgent();
    let responseContentType = "application/xml; charset=utf-8";
    let responseEncoding = "";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const baseOpts = createOptions(currentUserAgent, attempt);
        const options = useInsecure
          ? { ...baseOpts, dispatcher: INSECURE_AGENT }
          : baseOpts;

        await waitForDomainSlot(target.hostname);
        response = await fetch(target.href, options);
        responseContentType = response.headers.get("content-type") || responseContentType;
        responseEncoding = (response.headers.get("content-encoding") || "").toLowerCase();

        if (response.ok || !shouldRetry(null, response)) {
          break;
        }

        if (response.status === 403 && attempt < MAX_RETRIES) {
          currentUserAgent = getRandomUserAgent();
          await sleep(2000 * attempt);
          continue;
        }

        if (response.status === 429 && attempt < MAX_RETRIES) {
          const retryAfter = response.headers.get("retry-after");
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000 * attempt;
          await sleep(waitTime);
          continue;
        }

        if (
          (response.status === 502 || response.status === 503 || response.status === 504) &&
          attempt < MAX_RETRIES
        ) {
          await sleep(1000 * attempt);
          continue;
        }

        break;
      } catch (error) {
        lastError = error;

        if (shouldRetryInsecure(error) && !useInsecure) {
          useInsecure = true;
          attempt--;
          continue;
        }

        if (shouldRetry(error, null) && attempt < MAX_RETRIES) {
          await sleep(1000 * attempt);
          continue;
        }

        throw error;
      }
    }

    if (!response) {
      if (lastError && shouldFallbackToPuppeteer(lastError)) {
        console.log(
          `Fetch connection closed (${lastError?.code || lastError?.cause?.code}), retrying with Puppeteer: ${target.href}`
        );
        try {
          const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
          const responseType = detectResponseType(puppeteerContent);
          if (stream) {
            return {
              stream: Readable.from([puppeteerContent]),
              statusCode: 200,
              contentType: "application/xml; charset=utf-8",
              fetchMode: "puppeteer",
              responseType,
            };
          }
          return {
            xml: puppeteerContent,
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            fetchMode: "puppeteer",
            responseType,
          };
        } catch (puppeteerError) {
          console.error("Puppeteer fallback fetch hatasi:", puppeteerError.message);
          lastError = puppeteerError;
        }
      }
      throw lastError || new Error("Tum denemeler basarisiz oldu");
    }

    if (!response.ok) {
      if (response.status === 403) {
        console.log(`403 alindi, Puppeteer ile deneniyor: ${target.href}`);
        try {
          const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
          const responseType = detectResponseType(puppeteerContent);
          if (stream) {
            return {
              stream: Readable.from([puppeteerContent]),
              statusCode: 200,
              contentType: "application/xml; charset=utf-8",
              fetchMode: "puppeteer",
              responseType,
            };
          }
          return {
            xml: puppeteerContent,
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            fetchMode: "puppeteer",
            responseType,
          };
        } catch (puppeteerError) {
          console.error("Puppeteer fetch hatasi:", puppeteerError.message);
          throw new SitemapFetchError(
            "403 Forbidden - Bot korumasi asilamadi. Lutfen URL'i manuel olarak ziyaret edin.",
            403
          );
        }
      }
      if (response.status === 502 || response.status === 503 || response.status === 504) {
        console.log(`${response.status} alindi, Puppeteer ile deneniyor: ${target.href}`);
        try {
          const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
          const responseType = detectResponseType(puppeteerContent);
          if (stream) {
            return {
              stream: Readable.from([puppeteerContent]),
              statusCode: 200,
              contentType: "application/xml; charset=utf-8",
              fetchMode: "puppeteer",
              responseType,
            };
          }
          return {
            xml: puppeteerContent,
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            fetchMode: "puppeteer",
            responseType,
          };
        } catch (puppeteerError) {
          console.error("Puppeteer fetch hatasi:", puppeteerError.message);
        }
      }

      const message = `${response.status} ${response.statusText || "Upstream hata"}`;
      throw new SitemapFetchError(message, response.status);
    }

    const contentType = responseContentType.toLowerCase();
    const encoding = responseEncoding;
    if (stream) {
      const shouldGunzip =
        encoding.includes("gzip") ||
        encoding.includes("x-gzip") ||
        contentType.includes("application/gzip") ||
        contentType.includes("application/x-gzip");
      let nodeStream = toNodeReadable(response);
      if (shouldGunzip) {
        nodeStream = nodeStream.pipe(zlib.createGunzip());
      }
      return {
        stream: nodeStream,
        statusCode: response.status,
        contentType: responseContentType,
        etag: response.headers.get("etag") || "",
        lastModified: response.headers.get("last-modified") || "",
        fetchMode: "fetch",
        responseType: "xml",
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const hasGzipMagic = buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
    const shouldGunzip =
      encoding.includes("gzip") ||
      encoding.includes("x-gzip") ||
      contentType.includes("application/gzip") ||
      contentType.includes("application/x-gzip") ||
      hasGzipMagic;

    let xml;
    if (shouldGunzip && !hasGzipMagic) {
      const preview = buffer.slice(0, 32).toString("utf-8").trim().toLowerCase();
      if (preview.startsWith("<!doctype html") || preview.startsWith("<html") || preview.startsWith("<?xml")) {
        xml = buffer.toString("utf-8");
      } else {
        try {
          xml = zlib.gunzipSync(buffer).toString("utf-8");
        } catch (gunzipError) {
          console.warn(
            `Gzip olarak isaretlenen sitemap cozumlenemedi (${target.href}), fallback uygulanacak.`,
            gunzipError.message
          );
          xml = buffer.toString("utf-8");
        }
      }
    } else if (shouldGunzip) {
      try {
        xml = zlib.gunzipSync(buffer).toString("utf-8");
      } catch (gunzipError) {
        console.warn(
          `Gzip olarak isaretlenen sitemap cozumlenemedi (${target.href}), fallback uygulanacak.`,
          gunzipError.message
        );
        xml = buffer.toString("utf-8");
      }
    } else {
      xml = buffer.toString("utf-8");
    }
    const responseType = detectResponseType(xml);
    return {
      xml,
      statusCode: response.status,
      contentType: response.headers.get("content-type") || "application/xml; charset=utf-8",
      etag: response.headers.get("etag") || "",
      lastModified: response.headers.get("last-modified") || "",
      fetchMode: "fetch",
      responseType,
    };
  } catch (error) {
    console.error("fetch-sitemap error:", {
      url: target.href,
      message: error.message,
      code: error?.code || error?.cause?.code,
      name: error.name,
    });

    if (shouldFallbackToPuppeteer(error) || shouldRetryInsecure(error)) {
      console.log(`Fetch error (${error?.code || "unknown"}), Puppeteer ile deneniyor: ${target.href}`);
      try {
        const puppeteerContent = await fetchWithPuppeteer(target.href, PROXY_TIMEOUT_MS);
        if (stream) {
          return {
            stream: Readable.from([puppeteerContent]),
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            fetchMode: "puppeteer",
            responseType: detectResponseType(puppeteerContent),
          };
        }
        return {
          xml: puppeteerContent,
          statusCode: 200,
          contentType: "application/xml; charset=utf-8",
          fetchMode: "puppeteer",
          responseType: detectResponseType(puppeteerContent),
        };
      } catch (puppeteerError) {
        console.error("Puppeteer fallback fetch hatasi:", puppeteerError.message);
      }
    }

    if (error instanceof SitemapFetchError) {
      throw error;
    }

    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      throw new SitemapFetchError(mapped.message, mapped.status, error?.code || error?.cause?.code);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshCacheForUrl(url, { force = false } = {}) {
  if (!force) {
    const meta = await readCacheMeta(url);
    if (meta && isCacheFresh(meta)) {
      return { skipped: true, meta };
    }
  }

  return withFetchSlot(async () => {
    const result = await fetchSitemapXmlWithRetry(url);
    if (result.responseType === "html") {
      const cached = await readCachedSitemap(url);
      if (cached && typeof cached.xml === "string" && cached.xml) {
        const meta = await updateCacheMeta(url, {
          staleReason: "waf",
          lastAttemptAt: Date.now(),
          lastAttemptFetchMode: result.fetchMode || "",
          lastAttemptResponseType: result.responseType || "html",
        });
        return {
          ...result,
          xml: cached.xml,
          statusCode: cached.meta?.statusCode || 200,
          contentType: cached.meta?.contentType || result.contentType,
          etag: cached.meta?.etag || "",
          lastModified: cached.meta?.lastModified || "",
          meta: meta || cached.meta || null,
          skipped: false,
          cacheSkipped: true,
          staleReason: "waf",
          servedFromCache: true,
        };
      }

      // Some WAFs return HTTP 200 with an HTML challenge page. In that case,
      // try Puppeteer once before declaring a hard failure.
      console.warn(`HTML response detected for ${url} (likely WAF). Trying Puppeteer...`);
      try {
        const puppeteerContent = await fetchWithPuppeteer(url, PROXY_TIMEOUT_MS);
        const responseType = detectResponseType(puppeteerContent);
        if (responseType !== "html") {
          const meta = await writeCache(url, puppeteerContent, {
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            etag: "",
            lastModified: "",
            fetchMode: "puppeteer",
            responseType: responseType,
          });
          return {
            xml: puppeteerContent,
            statusCode: 200,
            contentType: "application/xml; charset=utf-8",
            fetchMode: "puppeteer",
            responseType,
            meta,
            skipped: false,
          };
        }
      } catch (puppeteerError) {
        console.error("Puppeteer WAF retry failed:", puppeteerError.message || puppeteerError);
      }

      throw new SitemapFetchError("Site WAF tarafindan engellendi. HTML yaniti alindi.", 502);
    }
    const meta = await writeCache(url, result.xml, {
      statusCode: result.statusCode,
      contentType: result.contentType,
      etag: result.etag,
      lastModified: result.lastModified,
      fetchMode: result.fetchMode,
      responseType: result.responseType,
    });
    return { ...result, meta, skipped: false };
  });
}

function scheduleCacheRefresh(url, { force = false } = {}) {
  if (!url) {
    return null;
  }
  const key = url.toLowerCase();
  if (inflightCacheRefresh.has(key)) {
    return inflightCacheRefresh.get(key);
  }
  const task = refreshCacheForUrl(url, { force }).finally(() => {
    inflightCacheRefresh.delete(key);
  });
  inflightCacheRefresh.set(key, task);
  return task;
}

async function fetchBrevoAccount(apiKey) {
  const validated = validateBrevoApiKey(apiKey);

  let response;
  try {
    response = await fetch(BREVO_ACCOUNT_ENDPOINT, {
      method: "GET",
      headers: {
        "api-key": validated,
        accept: "application/json",
      },
      dispatcher: INSECURE_AGENT,
    });
  } catch (error) {
    const message =
      error && error.cause && error.cause.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
        ? "Brevo API sertifikasi dogrulanamadi. Sunucuda guvenilir CA sertifikalari eksik olabilir."
        : "Brevo API'ye baglanilirken hata olustu.";
    const wrapped = new Error(message);
    wrapped.status = 502;
    throw wrapped;
  }

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Brevo API anahtari gecersiz veya yetkisiz.");
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const message =
      errorText && errorText.trim()
        ? `${response.status} ${errorText}`
        : `Brevo hesabi dogrulanamadi (HTTP ${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  return sanitizeBrevoAccountResponse(data);
}

function normalizeUrl(value) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  try {
    return new URL(trimmed).href;
  } catch (error) {
    return trimmed;
  }
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
]);
const ALLOWED_HOSTS_FILE = path.join(__dirname, "allowed-hosts.json");
const ALLOWED_HOSTS_TTL_MS = 60 * 1000;
let allowedHostsCache = {
  hosts: new Set(),
  loadedAt: 0,
};
let allowedHostsWatcher = null;
let allowedHostsReloadTimer = null;

function normalizeAllowedHostsList(input) {
  if (!input) {
    return [];
  }
  const rawList = Array.isArray(input) ? input : String(input).split(",");
  return rawList
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean);
}

function parseAllowedHostsFile(raw) {
  if (!raw) {
    return [];
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (_error) {
    return [];
  }
  if (Array.isArray(payload)) {
    return normalizeAllowedHostsList(payload);
  }
  if (payload && Array.isArray(payload.allowed_hosts)) {
    return normalizeAllowedHostsList(payload.allowed_hosts);
  }
  return [];
}

async function loadAllowedHostsFile({ force = false } = {}) {
  const now = Date.now();
  if (!force && allowedHostsCache.loadedAt && now - allowedHostsCache.loadedAt < ALLOWED_HOSTS_TTL_MS) {
    return allowedHostsCache;
  }
  try {
    const raw = await fs.readFile(ALLOWED_HOSTS_FILE, "utf8");
    const hosts = parseAllowedHostsFile(raw);
    allowedHostsCache = {
      hosts: new Set(hosts),
      loadedAt: now,
    };
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      console.warn("Allowed hosts list okunamadi:", error.message || error);
    }
  }
  return allowedHostsCache;
}

function scheduleAllowedHostsReload() {
  if (allowedHostsReloadTimer) {
    clearTimeout(allowedHostsReloadTimer);
  }
  allowedHostsReloadTimer = setTimeout(() => {
    loadAllowedHostsFile({ force: true }).catch((error) => {
      console.warn("Allowed hosts list yenilenemedi:", error.message || error);
    });
  }, 250);
  if (allowedHostsReloadTimer && typeof allowedHostsReloadTimer.unref === "function") {
    allowedHostsReloadTimer.unref();
  }
}

function initializeAllowedHostsWatcher() {
  if (allowedHostsWatcher) {
    return;
  }
  try {
    allowedHostsWatcher = fsSync.watch(ALLOWED_HOSTS_FILE, { persistent: false }, () => {
      scheduleAllowedHostsReload();
    });
  } catch (error) {
    console.warn("Allowed hosts watcher baslatilamadi:", error.message || error);
  }
  try {
    fsSync.watchFile(ALLOWED_HOSTS_FILE, { interval: 2000 }, () => {
      scheduleAllowedHostsReload();
    });
  } catch (error) {
    console.warn("Allowed hosts watchFile baslatilamadi:", error.message || error);
  }
}

async function ensureAllowedHostsLoaded() {
  await loadAllowedHostsFile();
}

function resolveAllowedHostsSet() {
  const combined = new Set();
  for (const host of normalizeAllowedHostsList(process.env.ALLOWED_HOSTNAMES)) {
    combined.add(host);
  }
  for (const host of allowedHostsCache.hosts) {
    combined.add(host);
  }
  return combined;
}

function isHostnameAllowed(hostname, allowedHosts) {
  if (!hostname || !allowedHosts || !allowedHosts.size) {
    return false;
  }
  const lowered = hostname.toLowerCase();
  if (allowedHosts.has(lowered)) {
    return true;
  }
  for (const entry of allowedHosts) {
    if (!entry.startsWith(".")) {
      continue;
    }
    const suffix = entry.slice(1);
    if (!suffix) {
      continue;
    }
    if (lowered === suffix || lowered.endsWith("." + suffix)) {
      return true;
    }
  }
  return false;
}

function normalizeIpAddress(ip) {
  if (typeof ip !== "string") {
    return "";
  }
  const trimmed = ip.trim().toLowerCase();
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice("::ffff:".length);
  }
  return trimmed;
}

function isPrivateIpv4(ip) {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIpv6(ip) {
  if (ip === "::1") return true;
  if (ip.startsWith("fe80:")) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true;
  if (ip === "::") return true;
  return false;
}

function isPrivateIp(ip) {
  const normalized = normalizeIpAddress(ip);
  if (!normalized) {
    return false;
  }
  const ipVersion = net.isIP(normalized);
  if (ipVersion === 4) {
    return isPrivateIpv4(normalized);
  }
  if (ipVersion === 6) {
    return isPrivateIpv6(normalized);
  }
  return false;
}

async function assertPublicHostname(hostname) {
  if (!hostname) {
    return;
  }
  const lowered = hostname.toLowerCase();
  await ensureAllowedHostsLoaded();
  const allowedHosts = resolveAllowedHostsSet();
  if (isHostnameAllowed(lowered, allowedHosts)) {
    return;
  }
  if (BLOCKED_HOSTNAMES.has(lowered)) {
    throw new SitemapFetchError("Guvenlik nedeniyle bu adres engellendi.", 403);
  }
  const ipVersion = net.isIP(lowered);
  if (ipVersion) {
    if (isPrivateIp(lowered)) {
      throw new SitemapFetchError("Guvenlik nedeniyle bu adres engellendi.", 403);
    }
    return;
  }
  let records;
  try {
    records = await dns.lookup(hostname, { all: true });
  } catch (_error) {
    return;
  }
  if (!records || !records.length) {
    return;
  }
  for (const record of records) {
    if (record && record.address && isPrivateIp(record.address)) {
      throw new SitemapFetchError("Guvenlik nedeniyle bu adres engellendi.", 403);
    }
  }
}

async function assertPublicUrl(url) {
  let target;
  try {
    target = new URL(url);
  } catch (_error) {
    return;
  }
  await assertPublicHostname(target.hostname);
}

// Puppeteer browser pool
let browserInstance = null;
let refreshTimer = null;
let scanDb = null;
let purgeTimer = null;
let cronTask = null;
let cronHealthCheckRunning = false;
let cronCrawlErrorsRunning = false;
let serverInstance = null;
let isShuttingDown = false;
const activeSockets = new Set();

function resolveBrowserExecutablePath() {
  const envPath = String(process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || "").trim();
  if (envPath) {
    if (!path.isAbsolute(envPath) || fsSync.existsSync(envPath)) {
      return envPath;
    }
    console.warn("Configured Puppeteer executable path does not exist:", envPath);
  }

  const candidates = [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  for (const candidate of candidates) {
    if (fsSync.existsSync(candidate)) {
      return candidate;
    }
  }

  if (typeof puppeteerBase.executablePath === "function") {
    const bundledPath = String(puppeteerBase.executablePath() || "").trim();
    if (bundledPath && fsSync.existsSync(bundledPath)) {
      return bundledPath;
    }
  }
  return "";
}

async function getBrowser() {
  if (!browserInstance || !browserInstance.isConnected()) {
    const resolvedExecutablePath = resolveBrowserExecutablePath();
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-blink-features=AutomationControlled',
      ],
    };
    if (resolvedExecutablePath) {
      launchOptions.executablePath = resolvedExecutablePath;
    }
    browserInstance = await puppeteer.launch(launchOptions);
  }
  return browserInstance;
}

async function fetchWithPuppeteer(url, timeout = 45000) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  let responseBody = null;
  let responseContentType = "";

  try {
    await page.setUserAgent(getRandomUserAgent());
    const viewport = getRandomViewport();
    await page.setViewport(viewport);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (resourceType === "image" || resourceType === "media" || resourceType === "font" || resourceType === "stylesheet") {
        request.abort();
        return;
      }
      request.continue();
    });

    // Capture raw response text for the main document request.
    page.on("response", async (response) => {
      try {
        const responseUrl = response.url();
        const normalizedResponse = responseUrl.replace(/\/$/, "");
        const normalizedTarget = url.replace(/\/$/, "");
        if (responseUrl !== url && normalizedResponse !== normalizedTarget) {
          return;
        }
        responseContentType = response.headers()["content-type"] || "";
        responseBody = await response.text();
      } catch (_error) {
        // Ignore response capture errors.
      }
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      const originalQuery = window.navigator.permissions.query.bind(window.navigator.permissions);
      window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters);
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => ['tr-TR', 'tr', 'en-US', 'en'],
      });
      window.chrome = {
        runtime: {},
      };
    });

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1500));

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout,
    });

    if (typeof page.waitForTimeout === "function") {
      await page.waitForTimeout(800 + Math.floor(Math.random() * 1600));
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.floor(Math.random() * 1600)));
    }

    if (!response || !response.ok()) {
      throw new Error('HTTP ' + (response ? response.status() : 'unknown'));
    }

    if (responseBody) {
      return responseBody;
    }

    const content = await page.content();
    if (!responseContentType.toLowerCase().includes("html")) {
      const xmlMatch = content.match(
        /<\?xml[\s\S]*?<\/(?:urlset|sitemapindex|rss|feed)>/i
      );
      if (xmlMatch) {
        return xmlMatch[0];
      }
    }
    return content;
  } finally {
    await page.close();
  }
}
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_10) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/122.0.2365.80",
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

const VIEWPORTS = [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

function getRandomViewport() {
  return VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];
}

// Authentication credentials
const AUTH_USER = process.env.AUTH_USER || "siteflow";
const AUTH_PASS = process.env.AUTH_PASS || "Flow@2025!";
const SESSION_SECRET = process.env.SESSION_SECRET || "siteflow-secret-key-2025";
const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

const SOURCE_TYPES = new Set(["sitemap", "rss"]);
const DEFAULT_SOURCE_TYPE = "sitemap";

const DEFAULT_SITEMAPS = [
  {
    title: "Acibadem - Genel Sitemap",
    url: "https://www.acibadem.com.tr/sitemap.xml",
    sourceType: DEFAULT_SOURCE_TYPE,
    tags: [],
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
    autoCrawl: false,
  },
  {
    title: "Memorial - Saglik Rehberi",
    url: "https://www.memorial.com.tr/sitemaps/sitemaps-details/tr-saglik-rehberi.xml",
    sourceType: DEFAULT_SOURCE_TYPE,
    tags: [],
    notificationsEnabled: false,
    emailEnabled: false,
    emailRecipients: [],
    autoCrawl: false,
  },
];

const DEFAULT_SETTINGS = {
  brevo: {
    apiKey: "",
    senderEmail: "",
    senderName: "",
  },
};

if (IS_PROD && SESSION_SECRET === "siteflow-secret-key-2025") {
  console.warn("SESSION_SECRET environment variable is not set. Using default value is insecure.");
}
if (IS_PROD && !COOKIE_SECURE) {
  console.warn("COOKIE_SECURE is disabled while NODE_ENV=production. Enable HTTPS and set COOKIE_SECURE=true for secure cookies.");
}

// Session middleware
const sessionStore = new SqliteSessionStore({ ttlMs: SESSION_TTL_MS });
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: COOKIE_SECURE, // enable via env when behind HTTPS
      httpOnly: true,
      maxAge: SESSION_TTL_MS,
    },
  })
);

app.use(express.json({ limit: "20mb" }));

const discoveryLimiter = rateLimit({
  windowMs: DISCOVERY_RATE_LIMIT_WINDOW_MS,
  max: DISCOVERY_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Cok fazla istek. Lutfen daha sonra tekrar deneyin." },
});

const isValidUrl = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  try {
    new URL(trimmed);
    return true;
  } catch (_error) {
    return false;
  }
};

const sitemapInputSchema = z.object({
  url: z
    .string()
    .min(1, "Gecersiz URL formati.")
    .refine(isValidUrl, { message: "Gecersiz URL formati." }),
}).passthrough();
const sitemapListSchema = z.array(sitemapInputSchema);

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }

  // Check if this is an API request
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ message: "Oturum acmaniz gerekiyor" });
  }

  // Redirect to login
  return res.redirect('/login.html');
}

function flushLogger() {
  if (!logger) {
    return;
  }
  if (typeof logger.flush === "function") {
    try {
      logger.flush();
    } catch (_error) {
      // Ignore logger flush errors during shutdown.
    }
  }
  if (typeof logger.end === "function") {
    try {
      logger.end();
    } catch (_error) {
      // Ignore logger close errors during shutdown.
    }
  }
}

// Serve static files (login.html doesn't need auth)
app.use(express.static(__dirname));

app.get("/health", async (req, res) => {
  const checks = {
    dataFile: true,
    settingsFile: true,
    cacheWritable: true,
    healthHistoryFile: true,
  };
  try {
    await ensureDataFile();
  } catch (_error) {
    checks.dataFile = false;
  }
  try {
    await ensureSettingsFile();
  } catch (_error) {
    checks.settingsFile = false;
  }
  try {
    await ensureHealthHistoryFile();
  } catch (_error) {
    checks.healthHistoryFile = false;
  }
  checks.cacheWritable = await checkCacheWritable();

  const ok = Object.values(checks).every(Boolean);
  res.status(ok ? 200 : 503).json({
    ok,
    checks,
  });
});

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  const seen = new Set();
  const result = [];
  for (const raw of tags) {
    if (typeof raw !== "string") {
      continue;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }
    const normalized = trimmed.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(trimmed);
  }
  return result;
}

function sanitizeEmailList(emails) {
  if (!Array.isArray(emails)) {
    return [];
  }
  const seen = new Set();
  const result = [];
  for (const raw of emails) {
    if (typeof raw !== "string") {
      continue;
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }
    const lowered = trimmed.toLowerCase();
    if (seen.has(lowered)) {
      continue;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      continue;
    }
    seen.add(lowered);
    result.push(trimmed);
  }
  return result;
}

function resolveBrevoSettings(settings) {
  const resolved = {
    apiKey: ENV_BREVO_API_KEY || settings?.brevo?.apiKey || "",
    senderEmail: ENV_BREVO_SENDER_EMAIL || settings?.brevo?.senderEmail || "",
    senderName: ENV_BREVO_SENDER_NAME || settings?.brevo?.senderName || "SitemapFlow",
  };

  if (resolved.apiKey) {
    try {
      resolved.apiKey = validateBrevoApiKey(resolved.apiKey);
    } catch (error) {
      console.warn("Brevo API anahtari gecersiz, devre disi birakildi.");
      resolved.apiKey = "";
    }
  }

  if (resolved.senderEmail && !EMAIL_PATTERN.test(resolved.senderEmail)) {
    console.warn("Brevo gonderici e-posta adresi gecersiz, devre disi birakildi.");
    resolved.senderEmail = "";
  }

  return resolved;
}

function resolveGlobalNotificationRecipients() {
  if (!GLOBAL_NOTIFICATION_EMAIL) {
    return [];
  }
  if (!EMAIL_PATTERN.test(GLOBAL_NOTIFICATION_EMAIL)) {
    return [];
  }
  return [GLOBAL_NOTIFICATION_EMAIL];
}

function resolveNotificationRecipients(sitemap) {
  const recipients = sanitizeEmailList(sitemap?.emailRecipients);
  if (recipients.length) {
    return recipients;
  }
  return resolveGlobalNotificationRecipients();
}

function summarizeBreakdownCounts(breakdown) {
  const counts = {
    count4xx: 0,
    count5xx: 0,
    count404: 0,
  };
  if (!breakdown || typeof breakdown !== "object") {
    return counts;
  }
  Object.entries(breakdown).forEach(([key, value]) => {
    const status = Number(key);
    if (!Number.isFinite(status)) {
      return;
    }
    const count = Number(value) || 0;
    if (status >= 400 && status < 500) {
      counts.count4xx += count;
      if (status === 404) {
        counts.count404 += count;
      }
    } else if (status >= 500 && status < 600) {
      counts.count5xx += count;
    }
  });
  return counts;
}

function isCriticalHealthAlert(percent, breakdown) {
  const score = Number(percent);
  const counts = summarizeBreakdownCounts(breakdown);
  if (counts.count5xx > 0) {
    return true;
  }
  if (Number.isFinite(score) && score < ALERT_SCORE_THRESHOLD) {
    return true;
  }
  return false;
}

function canSendBrevoAlert(url) {
  if (!url) {
    return false;
  }
  const key = url.toLowerCase();
  const lastSent = brevoAlertCooldowns.get(key) || 0;
  return Date.now() - lastSent >= BREVO_ALERT_COOLDOWN_MS;
}

function markBrevoAlertSent(url) {
  if (!url) {
    return;
  }
  brevoAlertCooldowns.set(url.toLowerCase(), Date.now());
}

function getRequestBaseUrl(req) {
  if (!req) {
    return "";
  }
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto || req.protocol || "http";
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.get("host") || "";
  if (!host) {
    return "";
  }
  return `${protocol}://${host}`;
}

function buildCriticalAlertEmail({ sitemap, percent, breakdown, failedEntries, baseUrl }) {
  const title = sitemap?.title || sitemap?.url || "Sitemap";
  const url = sitemap?.url || "";
  const counts = summarizeBreakdownCounts(breakdown);
  const score = Number.isFinite(Number(percent)) ? Math.round(Number(percent)) : null;
  const limited = Array.isArray(failedEntries) ? failedEntries.slice(0, 10) : [];
  const dashboardUrl = baseUrl ? `${baseUrl}/` : "";
  const isCritical = isCriticalHealthAlert(percent, breakdown);
  const statusText = isCritical ? "Kritik" : "Uyari";
  const statusBg = isCritical ? "#fee2e2" : "#fef3c7";
  const statusTextColor = isCritical ? "#dc2626" : "#d97706";

  const totalChecked = Object.values(breakdown || {}).reduce((sum, value) => {
    const count = Number(value);
    return sum + (Number.isFinite(count) ? count : 0);
  }, 0);

  const errorCount = Object.entries(breakdown || {}).reduce((sum, [key, value]) => {
    const count = Number(value) || 0;
    if (key === "ERR") {
      return sum + count;
    }
    const status = Number(key);
    if (!Number.isFinite(status)) {
      return sum;
    }
    return status >= 400 ? sum + count : sum;
  }, 0);

  const subject = `[SitemapFlow] Critical Alert: ${title}`;
  const failedLines = limited
    .map((entry) => {
      const status = entry?.status ? String(entry.status) : "ERR";
      const target = entry?.url || "";
      return `${status} - ${target}`;
    })
    .filter(Boolean);

  const textParts = [
    `Sitemap: ${title}`,
    url ? `URL: ${url}` : "",
    `Durum: ${statusText}`,
    score !== null ? `Skor: ${score}%` : "",
    `Toplam tarama: ${totalChecked} | Hata: ${errorCount}`,
    `5xx: ${counts.count5xx} | 4xx: ${counts.count4xx} (404: ${counts.count404})`,
    failedLines.length ? "Ilk 10 hatali URL:" : "",
    ...failedLines,
    dashboardUrl ? `Panel: ${dashboardUrl}` : "",
  ].filter(Boolean);

  const issueRows = limited
    .map((entry) => {
      const status = entry?.status ? String(entry.status) : "ERR";
      const target = entry?.url || "";
      if (!target) {
        return "";
      }
      const statusNum = Number(status);
      const is5xx = Number.isFinite(statusNum) && statusNum >= 500;
      const is4xx = Number.isFinite(statusNum) && statusNum >= 400 && statusNum < 500;
      const chipBg = is5xx ? "#fee2e2" : is4xx ? "#fef3c7" : "#e2e8f0";
      const chipColor = is5xx ? "#dc2626" : is4xx ? "#d97706" : "#334155";
      return `
        <tr>
          <td style="padding:8px 0;">
            <span style="display:inline-block;padding:4px 8px;border-radius:999px;background:${chipBg};color:${chipColor};font-size:12px;font-weight:600;">
              ${status}
            </span>
          </td>
          <td style="padding:8px 0;">
            <a href="${target}" style="color:#2563eb;text-decoration:none;" target="_blank" rel="noopener noreferrer">${target}</a>
          </td>
        </tr>`;
    })
    .filter(Boolean)
    .join("");

  const timestamp = new Date().toISOString().replace("T", " ").replace("Z", " UTC");
  const htmlParts = [];
  htmlParts.push(`<div style="background:#f8fafc;padding:24px;font-family:Montserrat,Inter,Arial,sans-serif;">`);
  htmlParts.push(`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">`);
  htmlParts.push(`<tr><td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">`);
  htmlParts.push(`<div style="font-size:20px;font-weight:700;color:#0f172a;">[~] SitemapFlow Insight</div>`);
  htmlParts.push(`<div style="font-size:12px;color:#64748b;margin-top:4px;">${timestamp}</div>`);
  htmlParts.push(`</td></tr>`);

  htmlParts.push(`<tr><td style="padding:20px 24px;">`);
  htmlParts.push(`<div style="background:${statusBg};border:1px solid #e2e8f0;border-radius:10px;padding:16px;">`);
  htmlParts.push(`<div style="font-size:14px;color:${statusTextColor};font-weight:700;">Durum: ${statusText}</div>`);
  htmlParts.push(`<div style="font-size:16px;color:#0f172a;font-weight:700;margin-top:6px;">${title}</div>`);
  htmlParts.push(`<div style="font-size:13px;color:#475569;margin-top:6px;">Skor: <strong>${score !== null ? `${score}%` : "N/A"}</strong></div>`);
  htmlParts.push(`<div style="font-size:13px;color:#475569;margin-top:4px;">Toplam tarama: <strong>${totalChecked}</strong> | Hata: <strong>${errorCount}</strong></div>`);
  htmlParts.push(`<div style="font-size:13px;color:#475569;margin-top:4px;">5xx: <strong>${counts.count5xx}</strong> | 4xx: <strong>${counts.count4xx}</strong> (404: ${counts.count404})</div>`);
  if (url) {
    htmlParts.push(`<div style="font-size:12px;color:#64748b;margin-top:6px;">${url}</div>`);
  }
  htmlParts.push(`</div></td></tr>`);

  htmlParts.push(`<tr><td style="padding:0 24px 16px 24px;">`);
  htmlParts.push(`<div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:8px;">Ilk 10 hatali URL</div>`);
  htmlParts.push(`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e2e8f0;">`);
  htmlParts.push(issueRows || `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Hata bulunamadi.</td></tr>`);
  htmlParts.push(`</table></td></tr>`);

  if (dashboardUrl) {
    htmlParts.push(`<tr><td style="padding:0 24px 24px 24px;">`);
    htmlParts.push(`<a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;" target="_blank" rel="noopener noreferrer">Hemen Dashboard'u Ac ve Incele</a>`);
    htmlParts.push(`</td></tr>`);
  }

  htmlParts.push(`<tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">Bu e-posta SitemapFlow Sentinel Mode tarafindan otomatik gonderilmistir.</td></tr>`);
  htmlParts.push(`</table></div>`);
  const html = htmlParts.join("");

  return {
    subject,
    textContent: textParts.join("\n"),
    htmlContent: html,
  };
}

async function maybeSendCriticalHealthAlert({ url, percent, breakdown, results, req }) {
  if (!url) {
    return;
  }
  if (!isCriticalHealthAlert(percent, breakdown)) {
    return;
  }
  if (!canSendBrevoAlert(url)) {
    return;
  }

  const [settings, sitemaps] = await Promise.all([readSettings(), readSitemaps()]);
  const brevo = resolveBrevoSettings(settings);
  const match = sitemaps.find((item) => urlsEqual(item.url, url));
  const sitemap = match || { url };
  const recipients = resolveNotificationRecipients(sitemap);
  if (!recipients.length) {
    return;
  }

  if (!brevo.apiKey || !brevo.senderEmail) {
    return;
  }

  const failedEntries = Array.isArray(results)
    ? results
        .filter((entry) => !entry.status || entry.status >= 400)
        .map((entry) => ({
          url: entry.url || "",
          status: entry.status || "ERR",
        }))
    : [];

  const baseUrl = getRequestBaseUrl(req);
  const content = buildCriticalAlertEmail({
    sitemap,
    percent,
    breakdown,
    failedEntries,
    baseUrl,
  });

  const delivery = await sendBrevoEmailWithConfig({
    brevo,
    recipients,
    subject: content.subject,
    htmlContent: content.htmlContent,
    textContent: content.textContent,
  });

  const messageId =
    typeof delivery?.messageId === "string" && delivery.messageId.trim()
      ? delivery.messageId.trim()
      : null;

  if (messageId) {
    console.info(`Brevo kritik uyarisi gonderildi: ${messageId} (${url})`);
  } else {
    console.info(`Brevo kritik uyarisi gonderildi (ID bulunamadi) (${url})`);
  }

  markBrevoAlertSent(url);
}

function urlsEqual(a, b) {
  const normalizedA = normalizeUrl(a);
  const normalizedB = normalizeUrl(b);
  return normalizedA === normalizedB;
}

function normalizeSourceType(value) {
  if (typeof value !== "string") {
    return DEFAULT_SOURCE_TYPE;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return DEFAULT_SOURCE_TYPE;
  }
  if (normalized === "feed") {
    return "rss";
  }
  return SOURCE_TYPES.has(normalized) ? normalized : DEFAULT_SOURCE_TYPE;
}

function sanitizeEntry(input) {
  if (!input || typeof input.url !== "string") {
    return null;
  }

  let normalizedUrl;
  try {
    normalizedUrl = new URL(input.url.trim()).href;
  } catch (error) {
    return null;
  }

  const title =
    input.title && typeof input.title === "string" && input.title.trim()
      ? input.title.trim()
      : normalizedUrl;

  const tags = sanitizeTags(input.tags);
  const notificationsEnabled =
    typeof input.notificationsEnabled === "boolean"
      ? input.notificationsEnabled
      : typeof input.notifications === "boolean"
      ? input.notifications
      : false;

  const emailEnabled =
    typeof input.emailEnabled === "boolean"
      ? input.emailEnabled
      : false;

  const emailRecipients = sanitizeEmailList(input.emailRecipients);
  const autoCrawl = typeof input.autoCrawl === "boolean" ? input.autoCrawl : false;

  return {
    title,
    url: normalizedUrl,
    sourceType: normalizeSourceType(input.sourceType || input.type),
    tags,
    notificationsEnabled,
    emailEnabled: emailRecipients.length ? emailEnabled : false,
    emailRecipients,
    autoCrawl,
  };
}

function normalizeDiscoveryTarget(value) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const candidate = hasProtocol ? trimmed : `https://${trimmed}`;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch (error) {
    return null;
  }
  if (!parsed.hostname) {
    return null;
  }
  parsed.hash = "";
  parsed.search = "";
  return parsed;
}

function buildDiscoveryOrigins(parsed) {
  if (!parsed) {
    return [];
  }
  const origins = [`${parsed.protocol}//${parsed.host}`];
  if (parsed.protocol === "https:") {
    origins.push(`http://${parsed.host}`);
  } else if (parsed.protocol === "http:") {
    origins.push(`https://${parsed.host}`);
  }
  return [...new Set(origins)];
}

function ensureAbsoluteUrl(value, base) {
  if (typeof value !== "string" || !base) {
    return null;
  }
  try {
    const parsed = new URL(value, base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    parsed.hash = "";
    return parsed.href;
  } catch (error) {
    return null;
  }
}

function inferSourceTypeFromUrl(url, hint = "") {
  const haystack = `${url || ""} ${hint || ""}`.toLowerCase();
  if (haystack.includes("rss") || haystack.includes("feed") || haystack.includes("atom")) {
    return "rss";
  }
  return "sitemap";
}

function parseRobotsForSitemaps(content, baseOrigin) {
  if (typeof content !== "string" || !baseOrigin) {
    return [];
  }
  const lines = content.split(/\r?\n/);
  const results = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const lowered = line.toLowerCase();
    if (!lowered.startsWith("sitemap:")) {
      continue;
    }
    const [, value] = line.split(/:(.+)/);
    if (!value) {
      continue;
    }
    const absolute = ensureAbsoluteUrl(value.trim(), baseOrigin);
    if (!absolute) {
      continue;
    }
    results.push({
      url: absolute,
      source: "robots",
      hint: "sitemap",
      type: inferSourceTypeFromUrl(absolute),
    });
  }
  return results;
}

function parseDomForSitemaps(html, baseUrl) {
  if (typeof html !== "string" || !baseUrl) {
    return [];
  }
  let $;
  try {
    $ = cheerio.load(html);
  } catch (error) {
    return [];
  }

  const results = [];
  $("link").each((_index, element) => {
    const rel = ($(element).attr("rel") || "").toLowerCase();
    const typeAttr = ($(element).attr("type") || "").toLowerCase();
    const href = $(element).attr("href");
    if (!href) {
      return;
    }
    const matchesRel = rel.includes("sitemap");
    const matchesType =
      typeAttr.includes("xml") || typeAttr.includes("rss") || typeAttr.includes("atom");
    if (!matchesRel && !matchesType) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, baseUrl);
    if (!absolute) {
      return;
    }
    results.push({
      url: absolute,
      source: "dom",
      hint: "link",
      type: inferSourceTypeFromUrl(absolute, `${rel} ${typeAttr}`),
    });
  });

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");
    const text = ($(element).text() || "").trim();
    if (!href) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, baseUrl);
    if (!absolute) {
      return;
    }
    const loweredHref = href.toLowerCase();
    const loweredText = text.toLowerCase();
    const likelyMatch =
      loweredHref.endsWith(".xml") ||
      loweredHref.endsWith(".gz") ||
      loweredHref.includes("sitemap") ||
      loweredHref.includes("rss") ||
      loweredHref.includes("feed") ||
      loweredText.includes("sitemap");
    if (!likelyMatch) {
      return;
    }
    results.push({
      url: absolute,
      source: "dom",
      hint: "anchor",
      type: inferSourceTypeFromUrl(absolute, `${loweredHref} ${loweredText}`),
    });
  });

  return results;
}

function buildCommonPathGuesses(baseOrigin) {
  return buildCommonPathGuessesWithPrefixes(baseOrigin, ["/"]);
}

function derivePathPrefixes(pathname) {
  const prefixes = ["/"];
  if (!pathname) {
    return prefixes;
  }
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);
  if (!segments.length) {
    return prefixes;
  }
  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    prefixes.push(current.endsWith("/") ? current : `${current}/`);
  }
  return [...new Set(prefixes)];
}

function joinPathSegments(basePath, relativePath) {
  const normalizedBase =
    !basePath || basePath === "/" ? "/" : basePath.replace(/\/+$/, "/");
  const trimmedRelative = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  if (!trimmedRelative) {
    return normalizedBase;
  }
  if (normalizedBase === "/") {
    return `/${trimmedRelative}`;
  }
  return `${normalizedBase}${trimmedRelative}`;
}

function buildCommonPathGuessesWithPrefixes(baseOrigin, prefixes = ["/"]) {
  if (!baseOrigin || !Array.isArray(prefixes) || !prefixes.length) {
    return [];
  }
  const guesses = [];
  const seen = new Set();
  for (const prefix of prefixes) {
    for (const pathCandidate of DISCOVERY_COMMON_PATHS) {
      const joined = joinPathSegments(prefix || "/", pathCandidate);
      const absolute = ensureAbsoluteUrl(joined, baseOrigin);
      if (!absolute) {
        continue;
      }
      if (seen.has(absolute)) {
        continue;
      }
      seen.add(absolute);
      guesses.push({
        url: absolute,
        source: "guess",
        hint: "common",
        type: inferSourceTypeFromUrl(absolute),
      });
    }
  }
  return guesses;
}

async function fetchOptionalText(origins, resourcePath, { sizeLimit = DISCOVERY_HTML_MAX_BYTES } = {}) {
  if (!Array.isArray(origins) || !origins.length) {
    return null;
  }
  for (const origin of origins) {
    const target = ensureAbsoluteUrl(resourcePath, origin);
    if (!target) {
      continue;
    }
    try {
      const response = await fetch(target, {
        method: "GET",
        redirect: "follow",
        dispatcher: INSECURE_AGENT,
        signal: AbortSignal.timeout(DISCOVERY_FETCH_TIMEOUT_MS),
      });
      if (!response.ok) {
        continue;
      }
      const htmlBuffer = Buffer.from(await response.arrayBuffer());
      const decodedHtml = decodeHtmlBuffer(htmlBuffer, response.headers.get("content-type") || "");
      let text = decodedHtml.text;
      if (sizeLimit && text.length > sizeLimit) {
        text = text.slice(0, sizeLimit);
      }
      return { origin, url: target, text };
    } catch (error) {
      continue;
    }
  }
  return null;
}

async function fetchPageHtml(targetUrl, { sizeLimit = DISCOVERY_HTML_MAX_BYTES } = {}) {
  if (!targetUrl) {
    return null;
  }
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      dispatcher: INSECURE_AGENT,
      signal: AbortSignal.timeout(DISCOVERY_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    const htmlBuffer = Buffer.from(await response.arrayBuffer());
    const decodedHtml = decodeHtmlBuffer(htmlBuffer, response.headers.get("content-type") || "");
    let text = decodedHtml.text;
    if (sizeLimit && text.length > sizeLimit) {
      text = text.slice(0, sizeLimit);
    }
    return text;
  } catch (error) {
    return null;
  }
}

function extractSameOriginLinks(html, baseUrl, origin, limit = DISCOVERY_CRAWL_LINKS_PER_PAGE) {
  if (typeof html !== "string" || !baseUrl || !origin) {
    return [];
  }
  let $;
  try {
    $ = cheerio.load(html);
  } catch (error) {
    return [];
  }
  const targetOrigin = (() => {
    try {
      return new URL(origin).origin;
    } catch (error) {
      return null;
    }
  })();
  if (!targetOrigin) {
    return [];
  }
  const nextLinks = [];
  const seen = new Set();
  $("a[href]").each((_idx, element) => {
    if (nextLinks.length >= limit) {
      return false;
    }
    const href = $(element).attr("href");
    if (!href) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, baseUrl);
    if (!absolute) {
      return;
    }
    if (!absolute.startsWith(targetOrigin)) {
      return;
    }
    const lowered = absolute.toLowerCase();
    if (
      lowered.endsWith(".xml") ||
      lowered.endsWith(".gz") ||
      lowered.endsWith(".zip") ||
      lowered.match(/\.(jpg|jpeg|png|gif|svg|ico|mp4|mp3|pdf|css|js)(\?|$)/)
    ) {
      return;
    }
    if (seen.has(absolute)) {
      return;
    }
    seen.add(absolute);
    nextLinks.push(absolute);
  });
  return nextLinks;
}

function normalizeHostForLinkMap(hostname) {
  if (!hostname || typeof hostname !== "string") {
    return "";
  }
  return hostname.trim().toLowerCase().replace(/^www\./, "");
}

function normalizeLinkMapUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    parsed.hash = "";
    if (!parsed.pathname) {
      parsed.pathname = "/";
    }
    return parsed.href;
  } catch (_error) {
    return "";
  }
}

function toLinkMapStatusCode(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.trunc(parsed);
}

function createLinkMapCancelledError() {
  const cancellationError = new Error("Link map job cancelled");
  cancellationError.code = "LINK_MAP_JOB_CANCELLED";
  return cancellationError;
}

function extractInternalLinksFromHtml(html, pageUrl, sitemapHost) {
  if (typeof html !== "string" || !html.trim()) {
    return [];
  }
  const sourceUrl = normalizeLinkMapUrl(pageUrl);
  if (!sourceUrl) {
    return [];
  }
  let $;
  try {
    $ = cheerio.load(html);
  } catch (_error) {
    return [];
  }

  const targetHost = normalizeHostForLinkMap(sitemapHost);
  if (!targetHost) {
    return [];
  }

  const links = new Map();
  $("a[href]").each((_idx, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("#")) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, sourceUrl);
    const normalizedTarget = normalizeLinkMapUrl(absolute);
    if (!normalizedTarget) {
      return;
    }
    let targetParsed;
    try {
      targetParsed = new URL(normalizedTarget);
    } catch (_error) {
      return;
    }
    if (normalizeHostForLinkMap(targetParsed.hostname) !== targetHost) {
      return;
    }
    const lowered = normalizedTarget.toLowerCase();
    if (
      lowered.endsWith(".xml") ||
      lowered.endsWith(".gz") ||
      lowered.endsWith(".zip") ||
      lowered.match(/\.(jpg|jpeg|png|gif|svg|ico|mp4|mp3|pdf|css|js)(\?|$)/)
    ) {
      return;
    }
    const anchorText = String($(element).text() || "").replace(/\s+/g, " ").trim().slice(0, 160);
    const key = `${normalizedTarget}\u0001${anchorText}`;
    const current = links.get(key) || 0;
    links.set(key, current + 1);
  });

  const entries = [];
  for (const [key, count] of links.entries()) {
    const [targetUrl, anchorText = ""] = key.split("\u0001");
    entries.push({
      sourceUrl,
      targetUrl,
      anchorText,
      count,
    });
  }
  return entries;
}

function sanitizeLinkMapMaxUrls(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return LINK_MAP_MAX_URLS_DEFAULT;
  }
  return Math.max(10, Math.min(Math.floor(parsed), 2000));
}

function chunkList(items, size) {
  if (!Array.isArray(items) || !items.length) {
    return [];
  }
  const safeSize = Math.max(1, Math.floor(size || 1));
  const chunks = [];
  for (let i = 0; i < items.length; i += safeSize) {
    chunks.push(items.slice(i, i + safeSize));
  }
  return chunks;
}

function getLinkMapPath(sitemapUrl) {
  return path.join(LINK_MAP_DIR, `${getCacheKey(sitemapUrl)}.json`);
}

async function readSavedLinkMap(sitemapUrl) {
  const mapPath = getLinkMapPath(sitemapUrl);
  try {
    const raw = await fs.readFile(mapPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

async function writeSavedLinkMap(sitemapUrl, payload) {
  await ensureLinkMapDir();
  const mapPath = getLinkMapPath(sitemapUrl);
  await fs.writeFile(mapPath, JSON.stringify(payload, null, 2), "utf8");
}

function normalizeLinkMapJobStatus(status) {
  const safeStatus = String(status || "").toLowerCase();
  if (
    safeStatus === "queued" ||
    safeStatus === "running" ||
    safeStatus === "complete" ||
    safeStatus === "error" ||
    safeStatus === "cancelled"
  ) {
    return safeStatus;
  }
  return "queued";
}

function sanitizeLinkMapJob(job) {
  if (!job || typeof job !== "object") {
    return null;
  }
  return {
    id: String(job.id || ""),
    sitemapUrl: String(job.sitemapUrl || ""),
    status: normalizeLinkMapJobStatus(job.status),
    force: Boolean(job.force),
    maxUrls: Number.isFinite(Number(job.maxUrls)) ? Number(job.maxUrls) : LINK_MAP_MAX_URLS_DEFAULT,
    cached: Boolean(job.cached),
    progress: {
      processed: Number.isFinite(Number(job?.progress?.processed)) ? Number(job.progress.processed) : 0,
      total: Number.isFinite(Number(job?.progress?.total)) ? Number(job.progress.total) : 0,
      percent: Number.isFinite(Number(job?.progress?.percent)) ? Number(job.progress.percent) : 0,
      etaSeconds:
        job?.progress?.etaSeconds != null && Number.isFinite(Number(job.progress.etaSeconds))
          ? Number(job.progress.etaSeconds)
          : null,
    },
    createdAt: job.createdAt || null,
    startedAt: job.startedAt || null,
    completedAt: job.completedAt || null,
    updatedAt: job.updatedAt || null,
    error: job.error || null,
    result: job.result || null,
  };
}

function pruneLinkMapJobs() {
  const now = Date.now();
  for (const [jobId, job] of linkMapJobs.entries()) {
    const isDone = job.status === "complete" || job.status === "error" || job.status === "cancelled";
    const updatedAtMs = Date.parse(job.updatedAt || job.completedAt || job.createdAt || "");
    if (isDone && Number.isFinite(updatedAtMs) && now - updatedAtMs > LINK_MAP_JOB_TTL_MS) {
      linkMapJobs.delete(jobId);
    }
  }
  if (linkMapJobs.size <= LINK_MAP_JOB_MAX) {
    return;
  }
  const sorted = [...linkMapJobs.values()].sort((a, b) => Date.parse(a.createdAt || "") - Date.parse(b.createdAt || ""));
  const removeCount = linkMapJobs.size - LINK_MAP_JOB_MAX;
  for (let i = 0; i < removeCount; i += 1) {
    const job = sorted[i];
    if (job && job.id) {
      linkMapJobs.delete(job.id);
    }
  }
}

function createLinkMapJob({ sitemapUrl, maxUrls, force }) {
  const nowIso = new Date().toISOString();
  const safeMaxUrls = sanitizeLinkMapMaxUrls(maxUrls);
  const job = {
    id: crypto.randomUUID(),
    sitemapUrl,
    maxUrls: safeMaxUrls,
    force: force === true,
    cached: false,
    status: "queued",
    progress: {
      processed: 0,
      total: 0,
      percent: 0,
      etaSeconds: null,
    },
    createdAt: nowIso,
    startedAt: null,
    completedAt: null,
    updatedAt: nowIso,
    cancelRequested: false,
    error: null,
    result: null,
  };
  linkMapJobs.set(job.id, job);
  pruneLinkMapJobs();
  return job;
}

function updateLinkMapJobProgress(job, { processedUrls = 0, totalUrls = 0 } = {}) {
  if (!job || typeof job !== "object") {
    return;
  }
  const safeTotal = Math.max(0, Number(totalUrls) || 0);
  const safeProcessed = Math.max(0, Math.min(Number(processedUrls) || 0, safeTotal || Number(processedUrls) || 0));
  let etaSeconds = null;
  if (job.startedAt && safeProcessed > 0 && safeTotal > safeProcessed) {
    const elapsedSeconds = Math.max(0, (Date.now() - Date.parse(job.startedAt)) / 1000);
    const rate = elapsedSeconds > 0 ? safeProcessed / elapsedSeconds : 0;
    if (rate > 0) {
      etaSeconds = Math.max(0, Math.round((safeTotal - safeProcessed) / rate));
    }
  }
  job.progress = {
    processed: safeProcessed,
    total: safeTotal,
    percent: safeTotal > 0 ? Math.min(100, Math.round((safeProcessed / safeTotal) * 100)) : 0,
    etaSeconds,
  };
  job.updatedAt = new Date().toISOString();
}

async function runLinkMapJob(job) {
  if (!job || typeof job !== "object") {
    return;
  }
  job.status = "running";
  job.startedAt = new Date().toISOString();
  job.updatedAt = job.startedAt;
  try {
    if (!job.force) {
      const existing = await readSavedLinkMap(job.sitemapUrl);
      if (existing) {
        const total = Number(existing.totalUrls) || 0;
        job.cached = true;
        job.result = existing;
        updateLinkMapJobProgress(job, { processedUrls: total, totalUrls: total });
        job.status = "complete";
        job.completedAt = new Date().toISOString();
        job.updatedAt = job.completedAt;
        pruneLinkMapJobs();
        return;
      }
    }

    const payload = await buildInternalLinkMapForSitemap(job.sitemapUrl, {
      maxUrls: job.maxUrls,
      onProgress: ({ processedUrls, totalUrls }) => {
        updateLinkMapJobProgress(job, { processedUrls, totalUrls });
      },
      shouldStop: () => Boolean(job.cancelRequested),
    });
    await writeSavedLinkMap(job.sitemapUrl, payload);
    job.cached = false;
    job.result = payload;
    updateLinkMapJobProgress(job, {
      processedUrls: Number(payload.processedUrls) || Number(payload.totalUrls) || 0,
      totalUrls: Number(payload.totalUrls) || Number(payload.processedUrls) || 0,
    });
    job.status = "complete";
    job.completedAt = new Date().toISOString();
    job.updatedAt = job.completedAt;
  } catch (error) {
    const isCancelled = job.cancelRequested || error?.code === "LINK_MAP_JOB_CANCELLED";
    job.status = isCancelled ? "cancelled" : "error";
    job.error = isCancelled ? "Job cancelled" : error?.message || "Link map build failed";
    job.completedAt = new Date().toISOString();
    job.updatedAt = job.completedAt;
  } finally {
    pruneLinkMapJobs();
  }
}

function buildLinkMapCsv(payload) {
  const header = ["Source URL", "Target URL", "Anchor Text", "Link Count", "Status Code"];
  const safeLinks = Array.isArray(payload?.links) ? payload.links : [];
  const safePages = Array.isArray(payload?.pages) ? payload.pages : [];
  const pageStatusByUrl = new Map();
  safePages.forEach((page) => {
    const key = normalizeLinkMapUrl(page?.url || "");
    if (!key) {
      return;
    }
    const statusCode = toLinkMapStatusCode(page?.statusCode);
    pageStatusByUrl.set(key, statusCode);
  });
  const delimiter = ";";
  const rows = safeLinks.map((entry) => {
    const normalizedTarget = normalizeLinkMapUrl(entry?.targetUrl || "");
    const mappedStatus = normalizedTarget ? pageStatusByUrl.get(normalizedTarget) : null;
    const entryStatus = toLinkMapStatusCode(entry?.statusCode);
    const statusCode = mappedStatus != null ? mappedStatus : entryStatus;
    return [
      entry.sourceUrl || "",
      entry.targetUrl || "",
      repairCommonMojibake(entry.anchorText || ""),
      Number.isFinite(Number(entry.count)) ? Number(entry.count) : 0,
      statusCode != null ? statusCode : "Unknown",
    ];
  });
  const csvEscape = (value) => {
    const stringValue = value == null ? "" : String(value);
    if (/[";,\n\r]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };
  const csvRows = [header, ...rows].map((row) => row.map(csvEscape).join(delimiter)).join("\n");
  return `\uFEFFsep=${delimiter}\n${csvRows}`;
}

async function buildInternalLinkMapForSitemap(
  sitemapUrl,
  { maxUrls, onProgress = null, shouldStop = null } = {}
) {
  const limit = sanitizeLinkMapMaxUrls(maxUrls);
  const collected = await collectSimilarityUrls(sitemapUrl, {
    maxUrls: limit,
    maxChildSitemaps: 200,
    sampleStrategy: "deterministic",
  });
  const urls = Array.from(
    new Set((collected.urls || []).map((item) => normalizeLinkMapUrl(item)).filter(Boolean))
  );
  const progressCallback = typeof onProgress === "function" ? onProgress : null;
  const shouldStopCallback = typeof shouldStop === "function" ? shouldStop : null;
  if (progressCallback) {
    progressCallback({ processedUrls: 0, totalUrls: urls.length });
  }

  const sitemapHost = (() => {
    try {
      return new URL(sitemapUrl).hostname;
    } catch (_error) {
      return "";
    }
  })();

  const linksByEdge = new Map();
  const incomingTotals = new Map();
  const outgoingTotals = new Map();
  const incomingSources = new Map();
  const pageSummaries = new Map(
    urls.map((url) => [
      url,
      {
        url,
        statusCode: null,
        fetchMode: "",
        outgoingLinks: 0,
        uniqueOutgoingTargets: 0,
        incomingLinks: 0,
        failed: false,
      },
    ])
  );
  const failedPages = [];
  let processedUrls = 0;

  const batches = chunkList(urls, LINK_MAP_FETCH_BATCH);
  for (const batch of batches) {
    if (shouldStopCallback && shouldStopCallback()) {
      throw createLinkMapCancelledError();
    }
    const results = await Promise.all(
      batch.map((pageUrl) =>
        withFetchSlot(async () => {
          if (shouldStopCallback && shouldStopCallback()) {
            throw createLinkMapCancelledError();
          }
          try {
            const page = await fetchPageHtmlWithRetry(pageUrl);
            const statusCode = toLinkMapStatusCode(page?.statusCode) ?? 200;
            if (statusCode >= 400) {
              return {
                ok: false,
                pageUrl,
                statusCode,
                fetchMode: page?.fetchMode || "",
                error: `HTTP ${statusCode}`,
              };
            }
            const links = extractInternalLinksFromHtml(page?.html || "", pageUrl, sitemapHost);
            return {
              ok: true,
              pageUrl,
              links,
              statusCode,
              fetchMode: page?.fetchMode || "",
            };
          } catch (error) {
            const errorStatusCode = toLinkMapStatusCode(error?.status);
            return {
              ok: false,
              pageUrl,
              statusCode: errorStatusCode,
              fetchMode: "",
              error: error?.message || "Unknown error",
            };
          }
        }).then((result) => {
          processedUrls += 1;
          if (progressCallback) {
            progressCallback({ processedUrls, totalUrls: urls.length });
          }
          return result;
        })
      )
    );

    for (const result of results) {
      if (!result.ok) {
        failedPages.push({ url: result.pageUrl, statusCode: result.statusCode ?? null, error: result.error });
        const pageSummary = pageSummaries.get(result.pageUrl);
        if (pageSummary) {
          pageSummary.failed = true;
          pageSummary.statusCode = result.statusCode ?? null;
          pageSummary.fetchMode = result.fetchMode || "";
        }
        continue;
      }

      const uniqueTargets = new Set();
      for (const link of result.links) {
        const edgeKey = `${link.sourceUrl}\u0001${link.targetUrl}\u0001${link.anchorText || ""}`;
        const edgeCount = linksByEdge.get(edgeKey) || 0;
        linksByEdge.set(edgeKey, edgeCount + (Number(link.count) || 1));
        uniqueTargets.add(link.targetUrl);

        const outgoingCount = outgoingTotals.get(link.sourceUrl) || 0;
        outgoingTotals.set(link.sourceUrl, outgoingCount + (Number(link.count) || 1));

        const incomingCount = incomingTotals.get(link.targetUrl) || 0;
        incomingTotals.set(link.targetUrl, incomingCount + (Number(link.count) || 1));

        if (!incomingSources.has(link.targetUrl)) {
          incomingSources.set(link.targetUrl, new Set());
        }
        incomingSources.get(link.targetUrl).add(link.sourceUrl);
      }

      const pageSummary = pageSummaries.get(result.pageUrl);
      if (pageSummary) {
        pageSummary.statusCode = result.statusCode ?? 200;
        pageSummary.fetchMode = result.fetchMode || "";
        pageSummary.outgoingLinks = outgoingTotals.get(result.pageUrl) || 0;
        pageSummary.uniqueOutgoingTargets = uniqueTargets.size;
      }
    }
  }

  const links = Array.from(linksByEdge.entries()).map(([key, count]) => {
    const [sourceUrl, targetUrl, anchorText = ""] = key.split("\u0001");
    return {
      sourceUrl,
      targetUrl,
      anchorText,
      count,
    };
  });

  const uniqueTargetUrls = Array.from(
    new Set(links.map((item) => item.targetUrl).filter(Boolean))
  );
  const targetStatusByUrl = new Map();
  for (const [url, summary] of pageSummaries.entries()) {
    const statusCode = toLinkMapStatusCode(summary?.statusCode);
    if (statusCode == null) {
      continue;
    }
    targetStatusByUrl.set(url, {
      statusCode,
      category: categorizeLinkStatus(statusCode).category,
      source: "page",
    });
  }

  const missingTargets = uniqueTargetUrls.filter((targetUrl) => !targetStatusByUrl.has(targetUrl));
  const targetProbeCandidates = missingTargets.slice(0, LINK_MAP_TARGET_PROBE_MAX);
  const skippedTargetProbeCount = Math.max(0, missingTargets.length - targetProbeCandidates.length);
  let probedTargets = 0;
  if (targetProbeCandidates.length) {
    const totalWork = urls.length + targetProbeCandidates.length;
    if (progressCallback) {
      progressCallback({ processedUrls, totalUrls: totalWork });
    }
    const probeBatches = chunkList(targetProbeCandidates, LINK_MAP_TARGET_PROBE_BATCH);
    for (const probeBatch of probeBatches) {
      if (shouldStopCallback && shouldStopCallback()) {
        throw createLinkMapCancelledError();
      }
      const probeResults = await Promise.all(
        probeBatch.map((targetUrl) =>
          withFetchSlot(async () => {
            if (shouldStopCallback && shouldStopCallback()) {
              throw createLinkMapCancelledError();
            }
            const probe = await probeUrlStatus(targetUrl, {
              timeoutMs: LINK_MAP_TARGET_PROBE_TIMEOUT_MS,
              maxRedirects: 5,
            });
            return { targetUrl, probe };
          })
        )
      );
      for (const probeResult of probeResults) {
        probedTargets += 1;
        const statusCode = toLinkMapStatusCode(probeResult?.probe?.status);
        targetStatusByUrl.set(probeResult.targetUrl, {
          statusCode,
          category:
            probeResult?.probe?.category ||
            (statusCode != null ? categorizeLinkStatus(statusCode).category : "unknown"),
          source: "target_probe",
        });
      }
      if (progressCallback) {
        progressCallback({
          processedUrls: urls.length + probedTargets,
          totalUrls: totalWork,
        });
      }
    }
  }

  const linksWithStatus = links.map((item) => {
    const targetStatus = targetStatusByUrl.get(item.targetUrl) || null;
    return {
      ...item,
      statusCode: targetStatus?.statusCode ?? null,
      statusCategory: targetStatus?.category || null,
      statusSource: targetStatus?.source || null,
    };
  });

  for (const [url, summary] of pageSummaries.entries()) {
    summary.incomingLinks = incomingTotals.get(url) || 0;
    summary.uniqueIncomingSources = incomingSources.has(url) ? incomingSources.get(url).size : 0;
  }

  const pageList = Array.from(pageSummaries.values());
  const orphanPages = pageList.filter((entry) => !entry.incomingLinks && !entry.failed).map((entry) => entry.url);
  const topIncomingPages = [...pageList]
    .sort((a, b) => (b.incomingLinks || 0) - (a.incomingLinks || 0))
    .slice(0, 20);
  const topOutgoingPages = [...pageList]
    .sort((a, b) => (b.outgoingLinks || 0) - (a.outgoingLinks || 0))
    .slice(0, 20);

  const totalLinkCount = linksWithStatus.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const uniqueTargetsWithStatus = new Set(
    linksWithStatus
      .filter((item) => toLinkMapStatusCode(item?.statusCode) != null)
      .map((item) => item.targetUrl)
  ).size;
  const failed4xx = pageList.filter(
    (item) =>
      item.failed &&
      Number.isFinite(Number(item.statusCode)) &&
      Number(item.statusCode) >= 400 &&
      Number(item.statusCode) < 500
  ).length;
  const failed5xx = pageList.filter(
    (item) =>
      item.failed &&
      Number.isFinite(Number(item.statusCode)) &&
      Number(item.statusCode) >= 500
  ).length;

  return {
    sitemapUrl,
    generatedAt: new Date().toISOString(),
    totalUrls: urls.length,
    totalDiscoveredUrls: Number(collected.totalCount) || urls.length,
    processedUrls,
    failedPages,
    sampled: Boolean(collected.sampled),
    links: linksWithStatus.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0)),
    pages: pageList,
    orphanPages,
    topIncomingPages,
    topOutgoingPages,
    metrics: {
      totalEdges: linksWithStatus.length,
      totalLinks: totalLinkCount,
      orphanPages: orphanPages.length,
      failedPages: failedPages.length,
      failed4xx,
      failed5xx,
      uniqueTargets: uniqueTargetUrls.length,
      targetStatusesResolved: uniqueTargetsWithStatus,
      targetStatusesMissing: Math.max(0, uniqueTargetUrls.length - uniqueTargetsWithStatus),
      targetProbeCount: probedTargets,
      targetProbeSkipped: skippedTargetProbeCount,
      pagesWithOutgoing: pageList.filter((item) => (item.outgoingLinks || 0) > 0).length,
      pagesWithIncoming: pageList.filter((item) => (item.incomingLinks || 0) > 0).length,
    },
  };
}

async function crawlDomainForSitemaps(
  baseOrigin,
  {
    startPath = "/",
    maxPages = DISCOVERY_CRAWL_MAX_PAGES,
    maxDepth = DISCOVERY_CRAWL_MAX_DEPTH,
    timeBudgetMs = 8000,
  } = {}
) {
  if (!baseOrigin) {
    return [];
  }
  const startUrls = new Set();
  const normalizedStart = ensureAbsoluteUrl(startPath || "/", baseOrigin);
  const rootUrl = ensureAbsoluteUrl("/", baseOrigin);
  if (normalizedStart) {
    startUrls.add(normalizedStart);
  }
  if (rootUrl) {
    startUrls.add(rootUrl);
  }
  if (!startUrls.size) {
    return [];
  }
  const queue = Array.from(startUrls).map((url) => ({ url, depth: 0 }));
  const visitedPages = new Set();
  const collected = [];
  const deadline = Date.now() + Math.max(1000, Number(timeBudgetMs) || 0);

  while (queue.length && visitedPages.size < maxPages) {
    if (Date.now() >= deadline) {
      break;
    }
    const task = queue.shift();
    if (!task || !task.url || visitedPages.has(task.url)) {
      continue;
    }
    visitedPages.add(task.url);
    const html = await fetchPageHtml(task.url);
    if (!html) {
      continue;
    }
    const domCandidates = parseDomForSitemaps(html, task.url);
    if (domCandidates.length) {
      collected.push(...domCandidates);
    }
    if (task.depth >= maxDepth || Date.now() >= deadline) {
      continue;
    }
    const nextLinks = extractSameOriginLinks(html, task.url, baseOrigin);
    for (const nextUrl of nextLinks) {
      if (Date.now() >= deadline) {
        break;
      }
      if (visitedPages.has(nextUrl)) {
        continue;
      }
      queue.push({ url: nextUrl, depth: task.depth + 1 });
      if (queue.length + visitedPages.size >= maxPages) {
        break;
      }
    }
  }
  return collected;
}

function dedupeDiscoveryResults(lists) {
  const entries = Array.isArray(lists) ? lists.flat() : [];
  const seen = new Set();
  const result = [];
  for (const item of entries) {
    if (!item || typeof item.url !== "string") {
      continue;
    }
    let normalized;
    try {
      normalized = new URL(item.url).href;
    } catch (error) {
      continue;
    }
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    const normalizedType = normalizeSourceType(item.type);
    result.push({
      url: normalized,
      source: item.source || "unknown",
      type: normalizedType,
      hint: item.hint || "",
      parent:
        typeof item.parent === "string" && item.parent.trim()
          ? item.parent.trim()
          : "",
      verification: item.verification
        ? {
            ok: Boolean(item.verification.ok),
            statusCode:
              typeof item.verification.statusCode === "number"
                ? item.verification.statusCode
                : item.verification.statusCode && Number.isFinite(item.verification.statusCode)
                ? Number(item.verification.statusCode)
                : null,
            contentType:
              typeof item.verification.contentType === "string"
                ? item.verification.contentType
                : "",
            reason:
              typeof item.verification.reason === "string"
                ? item.verification.reason
                : "",
            detail:
              item.verification.detail &&
              typeof item.verification.detail === "object"
                ? {
                    line:
                      Number.isFinite(Number(item.verification.detail.line))
                        ? Number(item.verification.detail.line)
                        : null,
                    column:
                      Number.isFinite(Number(item.verification.detail.column))
                        ? Number(item.verification.detail.column)
                        : null,
                  }
                : null,
          }
        : null,
      entryCount:
        typeof item.entryCount === "number" ? item.entryCount : null,
      xmlText:
        typeof item.xmlText === "string" ? item.xmlText : null,
    });
  }
  return result.slice(0, DISCOVERY_MAX_RESULTS);
}

async function verifyCandidateUrl(url, { timeout = DISCOVERY_VERIFY_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      dispatcher: INSECURE_AGENT,
      signal: controller.signal,
    });
    if (headResponse.ok) {
      return {
        ok: true,
        statusCode: headResponse.status,
        contentType: headResponse.headers.get("content-type") || "",
      };
    }
    return await verifyWithGet(url, timeout, {
      fallbackStatus: headResponse.status,
      fallbackContentType: headResponse.headers.get("content-type") || "",
    });
  } catch (_error) {
    return await verifyWithGet(url, timeout);
  } finally {
    clearTimeout(timer);
  }
}

async function verifyWithGet(url, timeout, fallbackMeta = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      dispatcher: INSECURE_AGENT,
      signal: controller.signal,
    });
    const verification = {
      ok: response.ok,
      statusCode: response.status,
      contentType: response.headers.get("content-type") || "",
    };
    return verification;
  } catch (_error) {
    return (
      fallbackMeta || {
        ok: false,
        statusCode: null,
        contentType: "",
      }
    );
  } finally {
    clearTimeout(timer);
  }
}

async function annotateCandidateStatuses(candidates) {
  const annotated = [];
  for (const candidate of candidates) {
    const verification = await verifyCandidateUrl(candidate.url);
    let xmlText = null;
    let entryCount = null;
    const expectsXml = candidate.type === "sitemap" || candidate.type === "rss";
    if (verification.ok && expectsXml) {
      if (candidate.type === "sitemap") {
        try {
          const analysis = await analyzeSitemapCandidateStream(candidate.url, {
            maxChildSitemaps: 0,
          });
          if (analysis.isHtml) {
            verification.ok = false;
            verification.reason = "html";
            verification.detail = null;
          } else if (!analysis.kind) {
            verification.ok = false;
            verification.reason = "invalid-xml";
            verification.detail = analysis.errorDetail || null;
          } else {
            entryCount = analysis.entryCount;
          }
        } catch (_error) {
          verification.ok = false;
          verification.reason = "invalid-xml";
          verification.detail = null;
        }
      } else if (candidate.type === "rss") {
        try {
          const analysis = await analyzeFeedCandidateStream(candidate.url);
          if (analysis.isHtml) {
            verification.ok = false;
            verification.reason = "html";
            verification.detail = null;
          } else if (!analysis.kind) {
            verification.ok = false;
            verification.reason = "invalid-xml";
            verification.detail = analysis.errorDetail || null;
          } else {
            entryCount = analysis.entryCount;
          }
        } catch (_error) {
          verification.ok = false;
          verification.reason = "invalid-xml";
          verification.detail = null;
        }
      } else {
        const { text, analysis } = await fetchCandidateXml(candidate.url, {
          sizeLimit: DISCOVERY_CHILD_MAX_BYTES,
          allowBrowserFallback: true,
        });
        xmlText = text;
        if (!xmlText) {
          verification.ok = false;
          verification.reason = "invalid-xml";
          verification.detail = null;
        } else if (analysis.isHtml) {
          verification.ok = false;
          verification.reason = "html";
          verification.detail = null;
        } else if (!analysis.kind) {
          verification.ok = false;
          verification.reason = "invalid-xml";
          verification.detail = null;
        } else {
          if (candidate.type !== analysis.kind) {
            candidate.type = analysis.kind;
          }
          entryCount = analysis.entryCount;
        }
      }
    }
    annotated.push({
      ...candidate,
      verification,
      xmlText,
      entryCount,
    });
  }
  return annotated;
}

async function fetchCandidateContent(url, { sizeLimit = DISCOVERY_CHILD_MAX_BYTES } = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      dispatcher: INSECURE_AGENT,
      signal: AbortSignal.timeout(DISCOVERY_VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    let text = await response.text();
    if (sizeLimit && text.length > sizeLimit) {
      text = text.slice(0, sizeLimit);
    }
    return text;
  } catch (error) {
    return null;
  }
}

async function fetchCandidateXml(
  url,
  { sizeLimit = DISCOVERY_CHILD_MAX_BYTES, allowBrowserFallback = false } = {}
) {
  let text = await fetchCandidateContent(url, { sizeLimit });
  let analysis = analyzeXmlContent(text);

  const needsFallback =
    allowBrowserFallback &&
    (!text || (analysis && (analysis.isHtml || !analysis.kind)));

  if (needsFallback) {
    try {
      const browserText = await fetchWithPuppeteer(url, PROXY_TIMEOUT_MS);
      if (browserText && typeof browserText === "string") {
        text = browserText;
        analysis = analyzeXmlContent(text);
      }
    } catch (error) {
      console.warn("Browser fallback failed for discovery candidate:", error.message || error);
    }
  }

  return { text, analysis: analysis || { kind: null, entryCount: null, isHtml: false } };
}

function extractChildSitemapsFromXml(xml, baseUrl) {
  if (typeof xml !== "string" || !xml.trim()) {
    return [];
  }
  let $;
  try {
    $ = cheerio.load(xml, { xmlMode: true });
  } catch (error) {
    return [];
  }
  const children = [];
  $("sitemap > loc").each((_idx, element) => {
    const href = $(element).text().trim();
    if (!href) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, baseUrl);
    if (!absolute) {
      return;
    }
    children.push(absolute);
  });
  return [...new Set(children)];
}

function extractUrlEntriesFromXml(xml, baseUrl) {
  if (typeof xml !== "string" || !xml.trim()) {
    return [];
  }
  let $;
  try {
    $ = cheerio.load(xml, { xmlMode: true });
  } catch (error) {
    return [];
  }
  const urls = [];
  $("url > loc").each((_idx, element) => {
    const href = $(element).text().trim();
    if (!href) {
      return;
    }
    const absolute = ensureAbsoluteUrl(href, baseUrl);
    if (!absolute) {
      return;
    }
    urls.push(absolute);
  });
  return urls;
}

function sampleUrls(urls, sampleRate, maxSamples) {
  if (!Array.isArray(urls) || !urls.length) {
    return [];
  }
  const rate = Number.isFinite(sampleRate) ? Math.max(0, sampleRate) : 0;
  const maxCount = Number.isFinite(maxSamples) ? Math.max(1, maxSamples) : 1;
  const targetCount = Math.min(
    maxCount,
    Math.max(1, Math.ceil(urls.length * rate))
  );
  const unique = Array.from(new Set(urls));
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, targetCount);
}

function sampleUrlList(urls, targetCount) {
  if (!Array.isArray(urls) || !urls.length) {
    return [];
  }
  const limit = Number.isFinite(targetCount) ? Math.max(1, targetCount) : urls.length;
  if (urls.length <= limit) {
    return [...urls];
  }
  const shuffled = [...new Set(urls)];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}

function hashUrlDeterministic(value) {
  const input = String(value || "");
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
  }
  return hash >>> 0;
}

function rankUrlDeterministic(url) {
  return hashUrlDeterministic(url);
}

function insertDeterministicRanked(ranked, url, maxCount) {
  if (!url || maxCount <= 0) {
    return;
  }
  const rank = rankUrlDeterministic(url);
  let inserted = false;
  for (let i = 0; i < ranked.length; i += 1) {
    if (rank < ranked[i].rank || (rank === ranked[i].rank && url.localeCompare(ranked[i].url) < 0)) {
      ranked.splice(i, 0, { rank, url });
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    ranked.push({ rank, url });
  }
  if (ranked.length > maxCount) {
    ranked.pop();
  }
}

function sampleUrlListDeterministic(urls, targetCount) {
  if (!Array.isArray(urls) || !urls.length) {
    return [];
  }
  const unique = Array.from(new Set(urls));
  const limit = Number.isFinite(targetCount) ? Math.max(1, targetCount) : unique.length;
  if (unique.length <= limit) {
    return unique
      .map((url) => ({ url, rank: rankUrlDeterministic(url) }))
      .sort((a, b) => a.rank - b.rank || a.url.localeCompare(b.url))
      .map((entry) => entry.url);
  }
  const ranked = [];
  unique.forEach((url) => {
    insertDeterministicRanked(ranked, url, limit);
  });
  return ranked.map((entry) => entry.url);
}

function finalizeSampleUrls(reservoir, totalCount, sampleRate, maxSamples) {
  if (!Array.isArray(reservoir) || !reservoir.length || totalCount <= 0) {
    return [];
  }
  const rate = Number.isFinite(sampleRate) ? Math.max(0, sampleRate) : 0;
  const maxCount = Number.isFinite(maxSamples) ? Math.max(1, maxSamples) : 1;
  const targetCount = Math.min(
    maxCount,
    Math.max(1, Math.ceil(totalCount * rate))
  );
  const unique = Array.from(new Set(reservoir));
  if (unique.length <= targetCount) {
    return unique;
  }
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, targetCount);
}

function parseSitemapStream(
  stream,
  baseUrl,
  { maxSamples, maxChildSitemaps, sampleStrategy = "random" }
) {
  return new Promise((resolve, reject) => {
    const parser = sax.createStream(true, { trim: true });
    const maxSampleLimit = Number.isFinite(maxSamples) ? Math.max(1, maxSamples) : 1;
    const maxChildLimit = Number.isFinite(maxChildSitemaps) ? Math.max(0, maxChildSitemaps) : 0;
    let inUrl = false;
    let inSitemap = false;
    let inLoc = false;
    let locBuffer = "";
    let urlCount = 0;
    let sitemapCount = 0;
    let firstTag = "";
    let isHtml = false;
    const reservoir = [];
    const deterministicReservoir = [];
    const childSitemaps = [];

    const considerUrl = (href) => {
      if (!href) {
        return;
      }
      const absolute = ensureAbsoluteUrl(href, baseUrl);
      if (!absolute) {
        return;
      }
      if (sampleStrategy === "deterministic") {
        insertDeterministicRanked(deterministicReservoir, absolute, maxSampleLimit);
        return;
      }
      const totalSeen = urlCount + 1;
      if (reservoir.length < maxSampleLimit) {
        reservoir.push(absolute);
      } else {
        const j = Math.floor(Math.random() * totalSeen);
        if (j < maxSampleLimit) {
          reservoir[j] = absolute;
        }
      }
    };

    const considerChild = (href) => {
      if (!href || childSitemaps.length >= maxChildLimit) {
        return;
      }
      const absolute = ensureAbsoluteUrl(href, baseUrl);
      if (!absolute) {
        return;
      }
      childSitemaps.push(absolute);
    };

    parser.on("opentag", (node) => {
      const name = node.name.toLowerCase();
      if (!firstTag) {
        firstTag = name;
        if (firstTag === "html") {
          isHtml = true;
        }
      }
      if (name === "url") {
        inUrl = true;
      } else if (name === "sitemap") {
        inSitemap = true;
      } else if (name === "loc") {
        inLoc = true;
        locBuffer = "";
      }
    });

    parser.on("doctype", (value) => {
      if (typeof value === "string" && value.toLowerCase().includes("html")) {
        isHtml = true;
      }
    });

    parser.on("text", (text) => {
      if (inLoc) {
        locBuffer += text;
      }
    });

    parser.on("cdata", (text) => {
      if (inLoc) {
        locBuffer += text;
      }
    });

    parser.on("closetag", (name) => {
      const lower = String(name).toLowerCase();
      if (lower === "loc") {
        const value = locBuffer.trim();
        if (inUrl) {
          considerUrl(value);
        } else if (inSitemap) {
          considerChild(value);
        }
        inLoc = false;
        locBuffer = "";
      } else if (lower === "url") {
        if (inUrl) {
          urlCount += 1;
        }
        inUrl = false;
      } else if (lower === "sitemap") {
        if (inSitemap) {
          sitemapCount += 1;
        }
        inSitemap = false;
      }
    });

    parser.on("error", (error) => {
      reject(error);
    });

    parser.on("end", () => {
      const kind = urlCount > 0 ? "urlset" : sitemapCount > 0 ? "sitemapindex" : "unknown";
      resolve({
        kind,
        urlCount,
        sitemapCount,
        reservoir: sampleStrategy === "deterministic"
          ? deterministicReservoir.map((entry) => entry.url)
          : reservoir,
        childSitemaps,
        isHtml,
      });
    });

    stream.on("error", reject);
    stream.pipe(parser);
  });
}

function parseFeedStream(stream) {
  return new Promise((resolve, reject) => {
    const parser = sax.createStream(true, { trim: true });
    let rssCount = 0;
    let atomCount = 0;
    let firstTag = "";
    let isHtml = false;

    parser.on("opentag", (node) => {
      const name = node.name.toLowerCase();
      if (!firstTag) {
        firstTag = name;
        if (firstTag === "html") {
          isHtml = true;
        }
      }
      if (name === "item") {
        rssCount += 1;
      } else if (name === "entry") {
        atomCount += 1;
      }
    });

    parser.on("doctype", (value) => {
      if (typeof value === "string" && value.toLowerCase().includes("html")) {
        isHtml = true;
      }
    });

    parser.on("error", (error) => {
      reject(error);
    });

    parser.on("end", () => {
      resolve({
        rssCount,
        atomCount,
        isHtml,
      });
    });

    stream.on("error", reject);
    stream.pipe(parser);
  });
}

function buildXmlErrorDetail(error) {
  if (!error) {
    return null;
  }
  const line = Number(error.line);
  const column = Number(error.column);
  if (!Number.isFinite(line) || !Number.isFinite(column)) {
    return null;
  }
  return {
    line: line + 1,
    column: column + 1,
  };
}

function categorizeStatus(status, message) {
  if (status >= 500) {
    return { category: "5xx", message: message || "Server error" };
  }
  if (status === 404) {
    return { category: "404", message: message || "Not Found" };
  }
  if (status >= 400) {
    return { category: "4xx", message: message || "Client error" };
  }
  return { category: "ok", message: message || "OK" };
}

function categorizeFetchError(error) {
  const code = error?.code || error?.cause?.code;
  if (code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "ERR_TLS_CERT_ALTNAME_INVALID") {
    return { category: "ssl_error", message: "SSL sertifikasi dogrulanamadi." };
  }
  if (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_HEADERS_TIMEOUT" ||
    code === "ETIMEDOUT" ||
    error?.name === "AbortError"
  ) {
    return { category: "timeout", message: "Zaman asimi." };
  }
  return { category: "timeout", message: error?.message || "Baglanti hatasi." };
}

function categorizeLinkStatus(status) {
  if (!Number.isFinite(status)) {
    return { category: "unknown", message: "Bilinmeyen durum." };
  }
  if (status >= 300 && status < 400) {
    return { category: "3xx", message: "Yonlendirme." };
  }
  if (status >= 500) {
    return { category: "5xx", message: "Server error" };
  }
  if (status === 404) {
    return { category: "404", message: "Not Found" };
  }
  if (status >= 400) {
    return { category: "4xx", message: "Client error" };
  }
  return { category: "ok", message: "OK" };
}

function normalizeLinkStatusUrls(input) {
  if (!Array.isArray(input)) {
    return [];
  }
  const seen = new Set();
  const normalized = [];
  for (const entry of input) {
    if (typeof entry !== "string") {
      continue;
    }
    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }
    let parsed;
    try {
      parsed = new URL(trimmed);
    } catch (_error) {
      continue;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      continue;
    }
    const href = parsed.href;
    if (seen.has(href)) {
      continue;
    }
    seen.add(href);
    normalized.push(href);
    if (normalized.length >= HEADING_LINK_STATUS_MAX_URLS) {
      break;
    }
  }
  return normalized;
}

async function checkHeadingLinkStatus(url, { timeoutMs = HEADING_LINK_STATUS_TIMEOUT_MS } = {}) {
  let target;
  try {
    target = new URL(url);
  } catch (_error) {
    return { url, status: null, category: "invalid", message: "Gecersiz URL." };
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return { url, status: null, category: "invalid", message: "Sadece HTTP/HTTPS desteklenir." };
  }

  try {
    await assertPublicUrl(target.href);
  } catch (error) {
    return {
      url,
      status: null,
      category: "blocked",
      message: error?.message || "Guvenlik nedeniyle engellendi.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await waitForDomainSlot(target.hostname);
    const response = await fetch(target.href, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    const status = response.status;
    const categorized = categorizeLinkStatus(status);
    return {
      url,
      status,
      category: categorized.category,
      message: response.statusText || categorized.message,
    };
  } catch (error) {
    const categorized = categorizeFetchError(error);
    return {
      url,
      status: null,
      category: categorized.category || "error",
      message: categorized.message || "Baglanti hatasi.",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeUrlStatus(url, { timeoutMs = 10000, maxRedirects = 5 } = {}) {
  let currentUrl = url;
  const visited = new Set();
  let redirectCount = 0;

  while (true) {
    let response;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      await waitForDomainSlot(new URL(currentUrl).hostname);
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timer);
      return { status: null, ...categorizeFetchError(error) };
    }
    clearTimeout(timer);

    const status = response.status;
    if (status >= 300 && status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { status, category: "redirect_loop", message: "Yonlendirme konumu yok." };
      }
      redirectCount += 1;
      if (redirectCount > maxRedirects) {
        return { status, category: "redirect_loop", message: "Cok fazla yonlendirme." };
      }
      const nextUrl = new URL(location, currentUrl).href;
      if (visited.has(nextUrl)) {
        return { status, category: "redirect_loop", message: "Yonlendirme dongusu." };
      }
      visited.add(nextUrl);
      currentUrl = nextUrl;
      continue;
    }

    const statusText = response.statusText || "";
    const categorized = categorizeStatus(status, statusText);
    return { status, ...categorized };
  }
}

async function analyzeSitemapCandidateStream(
  url,
  { maxChildSitemaps = DISCOVERY_CHILD_MAX_PER_PARENT } = {}
) {
  const fetchResult = await fetchSitemapStreamWithRetry(url);
  const contentType = (fetchResult.contentType || "").toLowerCase();
  if (contentType.includes("text/html")) {
    return { kind: null, entryCount: null, isHtml: true, childSitemaps: [] };
  }

  let parsed;
  try {
    parsed = await parseSitemapStream(fetchResult.stream, url, {
      maxSamples: 0,
      maxChildSitemaps,
    });
  } catch (error) {
    return {
      kind: null,
      entryCount: null,
      isHtml: false,
      childSitemaps: [],
      errorDetail: buildXmlErrorDetail(error),
    };
  }

  if (parsed.isHtml || parsed.kind === "unknown") {
    return {
      kind: null,
      entryCount: null,
      isHtml: parsed.isHtml,
      childSitemaps: [],
      errorDetail: null,
    };
  }

  const entryCount = parsed.urlCount > 0 ? parsed.urlCount : parsed.sitemapCount;
  return {
    kind: "sitemap",
    entryCount,
    isHtml: false,
    childSitemaps: parsed.childSitemaps,
    errorDetail: null,
  };
}

async function analyzeFeedCandidateStream(url) {
  const fetchResult = await fetchSitemapStreamWithRetry(url);
  const contentType = (fetchResult.contentType || "").toLowerCase();
  if (contentType.includes("text/html")) {
    return { kind: null, entryCount: null, isHtml: true, errorDetail: null };
  }
  let parsed;
  try {
    parsed = await parseFeedStream(fetchResult.stream);
  } catch (error) {
    return {
      kind: null,
      entryCount: null,
      isHtml: false,
      errorDetail: buildXmlErrorDetail(error),
    };
  }
  if (parsed.isHtml || (!parsed.rssCount && !parsed.atomCount)) {
    return {
      kind: null,
      entryCount: null,
      isHtml: parsed.isHtml,
      errorDetail: null,
    };
  }
  const entryCount = parsed.rssCount || parsed.atomCount || 0;
  return {
    kind: "rss",
    entryCount,
    isHtml: false,
    errorDetail: null,
  };
}

async function checkUrlStatus(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    }
    return response.status;
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function collectHealthCheckUrls(targetUrl) {
  const sitemapFetch = await fetchSitemapStreamWithRetry(targetUrl);
  const parsed = await parseSitemapStream(sitemapFetch.stream, targetUrl, {
    maxSamples: HEALTH_CHECK_SAMPLE_MAX,
    maxChildSitemaps: HEALTH_CHECK_CHILD_SITEMAPS,
  });

  if (parsed.kind === "urlset") {
    return finalizeSampleUrls(
      parsed.reservoir,
      parsed.urlCount,
      HEALTH_CHECK_SAMPLE_RATE,
      HEALTH_CHECK_SAMPLE_MAX
    );
  }

  if (parsed.kind !== "sitemapindex" || !parsed.childSitemaps.length) {
    return [];
  }

  const sampledUrls = [];
  let totalUrls = 0;
  for (const childUrl of parsed.childSitemaps) {
    try {
      await assertPublicUrl(childUrl);
    } catch (_error) {
      continue;
    }
    try {
      const childFetch = await fetchSitemapStreamWithRetry(childUrl);
      const childParsed = await parseSitemapStream(childFetch.stream, childUrl, {
        maxSamples: HEALTH_CHECK_SAMPLE_MAX,
        maxChildSitemaps: 0,
      });
      totalUrls += childParsed.urlCount;
      sampledUrls.push(...childParsed.reservoir);
    } catch (_error) {
      continue;
    }
  }
  return finalizeSampleUrls(
    sampledUrls,
    totalUrls,
    HEALTH_CHECK_SAMPLE_RATE,
    HEALTH_CHECK_SAMPLE_MAX
  );
}

async function collectSimilarityUrls(
  targetUrl,
  { maxUrls = 2000, maxChildSitemaps = 50, sampleStrategy = "random" } = {}
) {
  const deterministic = sampleStrategy === "deterministic";
  const fetchResult = await fetchSitemapStreamWithRetry(targetUrl);
  const parsed = await parseSitemapStream(fetchResult.stream, targetUrl, {
    maxSamples: maxUrls,
    maxChildSitemaps,
    sampleStrategy,
  });

  if (parsed.kind === "urlset") {
    return {
      urls: parsed.reservoir || [],
      sampled: parsed.urlCount > maxUrls,
      totalCount: parsed.urlCount || 0,
      childLimitHit: false,
    };
  }

  if (parsed.kind !== "sitemapindex" || !parsed.childSitemaps.length) {
    return { urls: [], sampled: false, totalCount: 0, childLimitHit: false };
  }

  const urls = new Set();
  const deterministicUrls = [];
  let totalCount = 0;
  let sampled = parsed.sitemapCount > parsed.childSitemaps.length;

  for (const childUrl of parsed.childSitemaps) {
    if (!deterministic && urls.size >= maxUrls) {
      sampled = true;
      break;
    }
    try {
      await assertPublicUrl(childUrl);
    } catch (_error) {
      continue;
    }
    try {
      const remaining = deterministic ? maxUrls : Math.max(maxUrls - urls.size, 0);
      const childFetch = await fetchSitemapStreamWithRetry(childUrl);
      const childParsed = await parseSitemapStream(childFetch.stream, childUrl, {
        maxSamples: remaining || 1,
        maxChildSitemaps: 0,
        sampleStrategy,
      });
      totalCount += childParsed.urlCount || 0;
      (childParsed.reservoir || []).forEach((entry) => {
        if (deterministic) {
          insertDeterministicRanked(deterministicUrls, entry, maxUrls);
        } else if (urls.size < maxUrls) {
          urls.add(entry);
        } else {
          sampled = true;
        }
      });
      if ((childParsed.urlCount || 0) > (childParsed.reservoir || []).length) {
        sampled = true;
      }
    } catch (_error) {
      continue;
    }
  }

  return {
    urls: deterministic ? deterministicUrls.map((entry) => entry.url) : Array.from(urls),
    sampled,
    totalCount,
    childLimitHit: parsed.sitemapCount > parsed.childSitemaps.length,
  };
}
async function collectScanUrls(targetUrl, { sampleRate = SCAN_SAMPLE_RATE, maxSamples = SCAN_SAMPLE_MAX } = {}) {
  const maxLimit = Number.isFinite(maxSamples) ? Math.max(1, maxSamples) : SCAN_SAMPLE_MAX;
  const parsed = await collectSimilarityUrls(targetUrl, {
    maxUrls: maxLimit,
    sampleStrategy: "deterministic",
  });
  const totalCount = Number(parsed.totalCount) || 0;
  const rate = Number.isFinite(sampleRate) ? Math.max(0, sampleRate) : SCAN_SAMPLE_RATE;
  const targetCount = totalCount > 0
    ? Math.min(maxLimit, Math.max(1, Math.ceil(totalCount * rate)))
    : Math.min(maxLimit, (parsed.urls || []).length);
  const urls = sampleUrlListDeterministic(parsed.urls || [], targetCount);
  return {
    urls,
    totalCount,
    sampledCount: urls.length,
    sampled: parsed.sampled || false,
    childLimitHit: parsed.childLimitHit || false,
  };
}

function cleanupScanRuns(db, sitemapUrl) {
  if (!db || !sitemapUrl) {
    return;
  }
  const stmt = db.prepare(`
    DELETE FROM scan_runs
    WHERE sitemap_url = ?
      AND id NOT IN (
        SELECT id FROM scan_runs
        WHERE sitemap_url = ?
        ORDER BY started_at DESC
        LIMIT ?
      )
  `);
  stmt.run(sitemapUrl, sitemapUrl, SCAN_RETENTION_COUNT);
}

function cleanupScanNotifications(db, sitemapUrl) {
  if (!db || !sitemapUrl) {
    return;
  }
  const cutoffDate = new Date(Date.now() - SCAN_NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const cutoffIso = cutoffDate.toISOString();
  db.prepare(`
    DELETE FROM scan_notifications
    WHERE sitemap_url = ?
      AND created_at < ?
  `).run(sitemapUrl, cutoffIso);
  db.prepare(`
    DELETE FROM scan_notifications
    WHERE sitemap_url = ?
      AND id NOT IN (
        SELECT id
        FROM scan_notifications
        WHERE sitemap_url = ?
        ORDER BY created_at DESC
        LIMIT 500
      )
  `).run(sitemapUrl, sitemapUrl);
}

function classifyScanStatusCode(statusCode) {
  const code = Number(statusCode);
  if (!Number.isFinite(code)) {
    return "other";
  }
  if (code >= 500) {
    return "5xx";
  }
  if (code === 404) {
    return "404";
  }
  if (code >= 400) {
    return "4xx";
  }
  if (code >= 300) {
    return "3xx";
  }
  if (code >= 200) {
    return "2xx";
  }
  return "other";
}

function isScanErrorStatus(statusCode) {
  const code = Number(statusCode);
  return Number.isFinite(code) && code >= 400;
}

function normalizeScanDiffUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  return normalizeLinkMapUrl(value) || normalizeUrl(value) || value.trim();
}

function buildScanResultStatusMap(rows) {
  const map = new Map();
  if (!Array.isArray(rows)) {
    return map;
  }
  for (const row of rows) {
    const normalizedUrl = normalizeScanDiffUrl(row?.url);
    if (!normalizedUrl) {
      continue;
    }
    const statusCode = Number.isFinite(Number(row?.statusCode))
      ? Number(row.statusCode)
      : Number.isFinite(Number(row?.status_code))
      ? Number(row.status_code)
      : null;
    map.set(normalizedUrl, {
      statusCode,
      category: row?.category || classifyScanStatusCode(statusCode),
    });
  }
  return map;
}

function computeScanScoreFromResults(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    return null;
  }
  let total = 0;
  let ok = 0;
  for (const row of rows) {
    const statusCode = Number.isFinite(Number(row?.statusCode))
      ? Number(row.statusCode)
      : Number.isFinite(Number(row?.status_code))
      ? Number(row.status_code)
      : null;
    if (!Number.isFinite(statusCode)) {
      continue;
    }
    total += 1;
    if (statusCode >= 200 && statusCode < 300) {
      ok += 1;
    }
  }
  if (!total) {
    return null;
  }
  return Math.round((ok / total) * 100);
}

function computeScanSummaryCounts(rows) {
  const counts = {
    count2xx: 0,
    count3xx: 0,
    count404: 0,
    count4xx: 0,
    count5xx: 0,
    countTimeout: 0,
    countOther: 0,
  };
  if (!Array.isArray(rows)) {
    return counts;
  }
  for (const row of rows) {
    const statusCode = Number.isFinite(Number(row?.statusCode))
      ? Number(row.statusCode)
      : Number.isFinite(Number(row?.status_code))
      ? Number(row.status_code)
      : null;
    const category = String(row?.category || "").toLowerCase();
    if (category === "timeout") {
      counts.countTimeout += 1;
      continue;
    }
    if (statusCode >= 200 && statusCode < 300) {
      counts.count2xx += 1;
    } else if (statusCode >= 300 && statusCode < 400) {
      counts.count3xx += 1;
    } else if (statusCode >= 500 && statusCode < 600) {
      counts.count5xx += 1;
    } else if (statusCode >= 400 && statusCode < 500) {
      counts.count4xx += 1;
      if (statusCode === 404) {
        counts.count404 += 1;
      }
    } else {
      counts.countOther += 1;
    }
  }
  return counts;
}

function pushDiffSample(list, item, maxCount = SCAN_DIFF_URL_SAMPLE_LIMIT) {
  if (!Array.isArray(list) || !item) {
    return;
  }
  if (list.length < maxCount) {
    list.push(item);
  }
}

function resolveDiffSeverity(summary) {
  if (!summary) {
    return "low";
  }
  if ((summary.new404Count || 0) > 0 || (summary.new5xxCount || 0) > 0) {
    return "high";
  }
  if ((summary.regressedCount || 0) > 0 || (summary.new4xxCount || 0) > 0 || (summary.redirectChangeCount || 0) > 0) {
    return "medium";
  }
  if ((summary.improvedCount || 0) > 0 || (summary.resolvedErrorCount || 0) > 0) {
    return "low";
  }
  return "low";
}

function buildScanDiffSummary({
  sitemapUrl,
  runId,
  previousRunId = null,
  currentResults = [],
  previousResults = [],
  currentScore = null,
  previousScore = null,
  computedAt = new Date().toISOString(),
} = {}) {
  const currentMap = buildScanResultStatusMap(currentResults);
  const previousMap = buildScanResultStatusMap(previousResults);
  const hasPreviousRun = Number.isFinite(Number(previousRunId)) && Number(previousRunId) > 0;
  if (!hasPreviousRun) {
    return {
      runId: Number(runId) || null,
      previousRunId: null,
      sitemapUrl: sitemapUrl || "",
      computedAt,
      comparedCount: 0,
      unchangedCount: 0,
      improvedCount: 0,
      regressedCount: 0,
      newErrorCount: 0,
      resolvedErrorCount: 0,
      new404Count: 0,
      new4xxCount: 0,
      new5xxCount: 0,
      redirectChangeCount: 0,
      scoreDelta: null,
      severity: "low",
      hasChanges: false,
      payload: {
        baseline: true,
        samples: {
          improvedUrls: [],
          regressedUrls: [],
          newErrorUrls: [],
          resolvedErrorUrls: [],
          redirectChangedUrls: [],
        },
        totals: {
          previousUrls: 0,
          currentUrls: currentMap.size,
          comparedUrls: 0,
        },
      },
    };
  }

  const allUrls = new Set([...previousMap.keys(), ...currentMap.keys()]);

  let unchangedCount = 0;
  let improvedCount = 0;
  let regressedCount = 0;
  let newErrorCount = 0;
  let resolvedErrorCount = 0;
  let new404Count = 0;
  let new4xxCount = 0;
  let new5xxCount = 0;
  let redirectChangeCount = 0;

  const samples = {
    improvedUrls: [],
    regressedUrls: [],
    newErrorUrls: [],
    resolvedErrorUrls: [],
    redirectChangedUrls: [],
  };

  for (const url of allUrls) {
    const previous = previousMap.get(url) || null;
    const current = currentMap.get(url) || null;
    const previousStatus = previous ? previous.statusCode : null;
    const currentStatus = current ? current.statusCode : null;
    const previousClass = classifyScanStatusCode(previousStatus);
    const currentClass = classifyScanStatusCode(currentStatus);
    const previousError = isScanErrorStatus(previousStatus);
    const currentError = isScanErrorStatus(currentStatus);

    if (previous && current && previousStatus === currentStatus) {
      unchangedCount += 1;
      continue;
    }

    if (previous && current) {
      if (previousError && !currentError) {
        improvedCount += 1;
        resolvedErrorCount += 1;
        pushDiffSample(samples.improvedUrls, {
          url,
          fromStatus: previousStatus,
          toStatus: currentStatus,
        });
        pushDiffSample(samples.resolvedErrorUrls, {
          url,
          fromStatus: previousStatus,
          toStatus: currentStatus,
        });
      } else if (!previousError && currentError) {
        regressedCount += 1;
        pushDiffSample(samples.regressedUrls, {
          url,
          fromStatus: previousStatus,
          toStatus: currentStatus,
        });
      }

      if (
        (previousClass === "3xx" || currentClass === "3xx") &&
        (previousClass !== currentClass || previousStatus !== currentStatus)
      ) {
        redirectChangeCount += 1;
        pushDiffSample(samples.redirectChangedUrls, {
          url,
          fromStatus: previousStatus,
          toStatus: currentStatus,
        });
      }
    } else if (!previous && current && currentError) {
      newErrorCount += 1;
      pushDiffSample(samples.newErrorUrls, {
        url,
        fromStatus: null,
        toStatus: currentStatus,
      });
    } else if (previous && !current && previousError) {
      resolvedErrorCount += 1;
      pushDiffSample(samples.resolvedErrorUrls, {
        url,
        fromStatus: previousStatus,
        toStatus: null,
      });
    }

    if (currentError && !previousError) {
      if (currentClass === "404") {
        new404Count += 1;
      } else if (currentClass === "5xx") {
        new5xxCount += 1;
      } else {
        new4xxCount += 1;
      }
    }
  }

  const comparedCount = allUrls.size;
  const hasChanges =
    improvedCount > 0 ||
    regressedCount > 0 ||
    newErrorCount > 0 ||
    resolvedErrorCount > 0 ||
    new404Count > 0 ||
    new4xxCount > 0 ||
    new5xxCount > 0 ||
    redirectChangeCount > 0;

  const scoreDelta =
    Number.isFinite(Number(currentScore)) && Number.isFinite(Number(previousScore))
      ? Number(currentScore) - Number(previousScore)
      : null;

  const summary = {
    runId: Number(runId) || null,
    previousRunId: Number(previousRunId) || null,
    sitemapUrl: sitemapUrl || "",
    computedAt,
    comparedCount,
    unchangedCount,
    improvedCount,
    regressedCount,
    newErrorCount,
    resolvedErrorCount,
    new404Count,
    new4xxCount,
    new5xxCount,
    redirectChangeCount,
    scoreDelta,
    severity: resolveDiffSeverity({
      improvedCount,
      regressedCount,
      new404Count,
      new4xxCount,
      new5xxCount,
      resolvedErrorCount,
      redirectChangeCount,
    }),
    hasChanges,
    payload: {
      samples,
      totals: {
        previousUrls: previousMap.size,
        currentUrls: currentMap.size,
        comparedUrls: comparedCount,
      },
    },
  };

  return summary;
}

function buildScanDiffNotification(summary) {
  if (!summary || !summary.hasChanges || !summary.previousRunId) {
    return null;
  }
  const severity = summary.severity || "low";
  const title =
    severity === "high"
      ? "Kritik tarama degisikligi"
      : severity === "medium"
      ? "Tarama uyarisi"
      : "Tarama ozeti";
  const messageParts = [];
  if ((summary.improvedCount || 0) > 0) {
    messageParts.push(`${summary.improvedCount} duzelme`);
  }
  if ((summary.regressedCount || 0) > 0) {
    messageParts.push(`${summary.regressedCount} bozulma`);
  }
  if ((summary.newErrorCount || 0) > 0) {
    messageParts.push(`${summary.newErrorCount} yeni hata`);
  }
  if ((summary.new404Count || 0) > 0) {
    messageParts.push(`${summary.new404Count} yeni 404`);
  }
  if ((summary.new5xxCount || 0) > 0) {
    messageParts.push(`${summary.new5xxCount} yeni 5xx`);
  }
  if ((summary.scoreDelta || 0) !== 0) {
    const delta = Number(summary.scoreDelta);
    const sign = delta > 0 ? "+" : "";
    messageParts.push(`skor ${sign}${delta.toFixed(1)}`);
  }
  const message = messageParts.length
    ? messageParts.join(" | ")
    : "Degisiklik algilandi.";
  return {
    type: "scan_diff",
    severity,
    title,
    message,
    payload: {
      runId: summary.runId,
      previousRunId: summary.previousRunId,
      sitemapUrl: summary.sitemapUrl,
      totals: {
        comparedCount: summary.comparedCount,
        unchangedCount: summary.unchangedCount,
        improvedCount: summary.improvedCount,
        regressedCount: summary.regressedCount,
        newErrorCount: summary.newErrorCount,
        resolvedErrorCount: summary.resolvedErrorCount,
        new404Count: summary.new404Count,
        new4xxCount: summary.new4xxCount,
        new5xxCount: summary.new5xxCount,
        redirectChangeCount: summary.redirectChangeCount,
        scoreDelta: summary.scoreDelta,
      },
      samples: summary.payload?.samples || {},
    },
  };
}

function countSitemapEntries(xml) {
  if (typeof xml !== "string" || !xml.trim()) {
    return null;
  }
  let $;
  try {
    $ = cheerio.load(xml, { xmlMode: true });
  } catch (error) {
    return null;
  }
  const urlCount = $("urlset > url").length;
  if (urlCount > 0) {
    return urlCount;
  }
  const sitemapCount = $("sitemapindex > sitemap").length;
  if (sitemapCount > 0) {
    return sitemapCount;
  }
  return null;
}

function countRssEntries(xml) {
  if (typeof xml !== "string" || !xml.trim()) {
    return null;
  }
  let $;
  try {
    $ = cheerio.load(xml, { xmlMode: true });
  } catch (error) {
    return null;
  }
  const rssCount = $("rss > channel > item").length;
  if (rssCount > 0) {
    return rssCount;
  }
  const atomCount = $("feed > entry").length;
  if (atomCount > 0) {
    return atomCount;
  }
  return null;
}

function analyzeXmlContent(xml) {
  if (typeof xml !== "string" || !xml.trim()) {
    return { kind: null, entryCount: null, isHtml: false };
  }
  const trimmed = xml.trim().slice(0, 200).toLowerCase();
  if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html")) {
    return { kind: null, entryCount: null, isHtml: true };
  }

  const sitemapCount = countSitemapEntries(xml);
  if (typeof sitemapCount === "number") {
    return { kind: "sitemap", entryCount: sitemapCount, isHtml: false };
  }

  const rssCount = countRssEntries(xml);
  if (typeof rssCount === "number") {
    return { kind: "rss", entryCount: rssCount, isHtml: false };
  }

  return { kind: null, entryCount: null, isHtml: false };
}

async function expandSitemapChildren(candidates) {
  if (!Array.isArray(candidates) || !candidates.length) {
    return [];
  }
  const extended = [...candidates];
  for (const candidate of candidates) {
    if (!candidate || candidate.type !== "sitemap" || !candidate?.verification?.ok) {
      continue;
    }
    let entryCount =
      typeof candidate.entryCount === "number" && Number.isFinite(candidate.entryCount)
        ? candidate.entryCount
        : null;
    let children = [];
    try {
      const analysis = await analyzeSitemapCandidateStream(candidate.url, {
        maxChildSitemaps: DISCOVERY_CHILD_MAX_PER_PARENT,
      });
      if (entryCount === null && Number.isFinite(analysis.entryCount)) {
        entryCount = analysis.entryCount;
      }
      children = Array.isArray(analysis.childSitemaps) ? analysis.childSitemaps : [];
    } catch (_error) {
      children = [];
    }
    if (entryCount !== null) {
      candidate.entryCount = entryCount;
    }
    if (!children.length) {
      continue;
    }
    const limitedChildren = children.slice(0, DISCOVERY_CHILD_MAX_PER_PARENT);
    for (const childUrl of limitedChildren) {
      const verification = await verifyCandidateUrl(childUrl);
      let childXmlText = null;
      let childEntryCount = null;
      if (verification.ok) {
        try {
          const analysis = await analyzeSitemapCandidateStream(childUrl, {
            maxChildSitemaps: 0,
          });
          if (Number.isFinite(analysis.entryCount)) {
            childEntryCount = analysis.entryCount;
          }
          if (!analysis.kind) {
            verification.ok = false;
            verification.reason = analysis.isHtml ? "html" : "invalid-xml";
            verification.detail = analysis.errorDetail || null;
          }
        } catch (_error) {
          verification.ok = false;
          verification.reason = "invalid-xml";
          verification.detail = null;
        }
      }
      extended.push({
        url: childUrl,
        source: "child",
        parent: candidate.url,
        type: "sitemap",
        verification,
        xmlText: childXmlText,
        entryCount: childEntryCount,
      });
    }
  }
  return dedupeDiscoveryResults([extended]);
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await writeSitemaps(DEFAULT_SITEMAPS);
  }
}

async function ensureSettingsFile() {
  try {
    await fs.access(SETTINGS_FILE);
  } catch (_error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf8");
  }
}

async function ensureHealthHistoryFile() {
  try {
    await fs.access(HEALTH_HISTORY_FILE);
  } catch (_error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(HEALTH_HISTORY_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}
function initScanDb() {
  if (scanDb) {
    return scanDb;
  }
  scanDb = new Database(SCAN_DB_PATH);
  scanDb.pragma("journal_mode = WAL");
  scanDb.pragma("foreign_keys = ON");
  scanDb.exec(`
    CREATE TABLE IF NOT EXISTS scan_runs (
      id INTEGER PRIMARY KEY,
      sitemap_url TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      status TEXT NOT NULL,
      total_urls INTEGER,
      sampled_urls INTEGER
    );
    CREATE TABLE IF NOT EXISTS scan_summary (
      id INTEGER PRIMARY KEY,
      run_id INTEGER NOT NULL,
      count_2xx INTEGER DEFAULT 0,
      count_3xx INTEGER DEFAULT 0,
      count_404 INTEGER DEFAULT 0,
      count_4xx INTEGER DEFAULT 0,
      count_5xx INTEGER DEFAULT 0,
      count_timeout INTEGER DEFAULT 0,
      count_other INTEGER DEFAULT 0,
      score REAL,
      FOREIGN KEY (run_id) REFERENCES scan_runs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS scan_url_results (
      id INTEGER PRIMARY KEY,
      run_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      status_code INTEGER,
      category TEXT,
      title TEXT,
      description TEXT,
      response_time_ms INTEGER,
      FOREIGN KEY (run_id) REFERENCES scan_runs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS scan_heading_links (
      id INTEGER PRIMARY KEY,
      run_id INTEGER NOT NULL,
      page_url TEXT NOT NULL,
      link_url TEXT NOT NULL,
      status_code INTEGER,
      category TEXT,
      anchor_text TEXT,
      FOREIGN KEY (run_id) REFERENCES scan_runs(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS latest_url_results (
      sitemap_url TEXT NOT NULL,
      url TEXT NOT NULL,
      status_code INTEGER,
      category TEXT,
      title TEXT,
      description TEXT,
      response_time_ms INTEGER,
      crawled_at TEXT,
      PRIMARY KEY (sitemap_url, url)
    );
    CREATE TABLE IF NOT EXISTS latest_heading_links (
      sitemap_url TEXT NOT NULL,
      page_url TEXT NOT NULL,
      link_url TEXT NOT NULL,
      status_code INTEGER,
      category TEXT,
      anchor_text TEXT,
      checked_at TEXT,
      PRIMARY KEY (sitemap_url, page_url, link_url, anchor_text)
    );
    CREATE TABLE IF NOT EXISTS scan_diffs (
      id INTEGER PRIMARY KEY,
      run_id INTEGER NOT NULL UNIQUE,
      previous_run_id INTEGER,
      sitemap_url TEXT NOT NULL,
      computed_at TEXT NOT NULL,
      compared_count INTEGER DEFAULT 0,
      unchanged_count INTEGER DEFAULT 0,
      improved_count INTEGER DEFAULT 0,
      regressed_count INTEGER DEFAULT 0,
      new_error_count INTEGER DEFAULT 0,
      resolved_error_count INTEGER DEFAULT 0,
      new_404_count INTEGER DEFAULT 0,
      new_4xx_count INTEGER DEFAULT 0,
      new_5xx_count INTEGER DEFAULT 0,
      redirect_change_count INTEGER DEFAULT 0,
      score_delta REAL,
      severity TEXT,
      payload_json TEXT,
      FOREIGN KEY (run_id) REFERENCES scan_runs(id) ON DELETE CASCADE,
      FOREIGN KEY (previous_run_id) REFERENCES scan_runs(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS scan_notifications (
      id INTEGER PRIMARY KEY,
      sitemap_url TEXT NOT NULL,
      run_id INTEGER,
      diff_id INTEGER,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      payload_json TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      read_at TEXT,
      FOREIGN KEY (run_id) REFERENCES scan_runs(id) ON DELETE SET NULL,
      FOREIGN KEY (diff_id) REFERENCES scan_diffs(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_scan_runs_url_started ON scan_runs (sitemap_url, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_scan_url_results_run ON scan_url_results (run_id);
    CREATE INDEX IF NOT EXISTS idx_scan_heading_links_run ON scan_heading_links (run_id);
    CREATE INDEX IF NOT EXISTS idx_latest_url_results_sitemap ON latest_url_results (sitemap_url);
    CREATE INDEX IF NOT EXISTS idx_latest_heading_links_sitemap ON latest_heading_links (sitemap_url);
    CREATE INDEX IF NOT EXISTS idx_scan_diffs_run ON scan_diffs (run_id);
    CREATE INDEX IF NOT EXISTS idx_scan_diffs_prev_run ON scan_diffs (previous_run_id);
    CREATE INDEX IF NOT EXISTS idx_scan_diffs_sitemap_time ON scan_diffs (sitemap_url, computed_at DESC);
    CREATE INDEX IF NOT EXISTS idx_scan_notifications_sitemap_time ON scan_notifications (sitemap_url, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_scan_notifications_read_sitemap ON scan_notifications (is_read, sitemap_url, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_scan_notifications_run ON scan_notifications (run_id);
  `);
  return scanDb;
}

async function readHealthHistory() {
  await ensureHealthHistoryFile();
  try {
    const raw = await fs.readFile(HEALTH_HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch (_error) {
    return {};
  }
}

async function writeHealthHistory(history) {
  await ensureHealthHistoryFile();
  const payload = history && typeof history === "object" ? history : {};
  const tempPath = `${HEALTH_HISTORY_FILE}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tempPath, HEALTH_HISTORY_FILE);
}

function pruneHealthHistory(entries, retentionDays) {
  if (!Array.isArray(entries) || !entries.length) {
    return [];
  }
  const days = Number.isFinite(retentionDays) ? retentionDays : 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((item) => {
    const timestamp = Date.parse(item && item.timestamp);
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  });
}

async function appendHealthHistory(url, record) {
  if (!url || !record || typeof record !== "object") {
    return;
  }
  const history = await readHealthHistory();
  const existing = Array.isArray(history[url]) ? history[url] : [];
  const next = [...existing, record];
  history[url] = pruneHealthHistory(next, HEALTH_HISTORY_RETENTION_DAYS);
  await writeHealthHistory(history);
}

function summarizeAlertCounts(details) {
  const counts = {
    fiveXX: 0,
    fourOFour: 0,
  };
  if (!details || typeof details !== "object") {
    return counts;
  }
  Object.entries(details).forEach(([key, value]) => {
    const status = Number(key);
    if (!Number.isFinite(status)) {
      return;
    }
    const count = Number(value) || 0;
    if (status >= 500 && status < 600) {
      counts.fiveXX += count;
    }
    if (status === 404) {
      counts.fourOFour += count;
    }
  });
  return counts;
}

function buildAlertForHistory(entries) {
  if (!Array.isArray(entries) || !entries.length) {
    return null;
  }
  const sorted = [...entries].sort(
    (a, b) => Date.parse(a?.timestamp || 0) - Date.parse(b?.timestamp || 0)
  );
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const latestCounts = summarizeAlertCounts(latest?.details);
  const prevCounts = previous ? summarizeAlertCounts(previous?.details) : null;
  const score = Number(latest?.score);
  const scoreTooLow = Number.isFinite(score) && score < ALERT_SCORE_THRESHOLD;
  const hasFiveXX = latestCounts.fiveXX > 0;
  const increased404 =
    prevCounts && latestCounts.fourOFour > prevCounts.fourOFour;

  let level = null;
  if (hasFiveXX || scoreTooLow) {
    level = "critical";
  } else if (increased404) {
    level = "warning";
  }

  if (!level) {
    return null;
  }

  return {
    level,
    fiveXX: latestCounts.fiveXX,
    score: Number.isFinite(score) ? Math.round(score) : null,
    threshold: ALERT_SCORE_THRESHOLD,
    prev404: prevCounts ? prevCounts.fourOFour : 0,
    current404: latestCounts.fourOFour,
  };
}

async function checkCacheWritable() {
  await ensureCacheDir();
  const probePath = path.join(CACHE_DIR, `.healthcheck-${Date.now()}.tmp`);
  try {
    await fs.writeFile(probePath, "ok", "utf8");
    await fs.unlink(probePath);
    return true;
  } catch (_error) {
    return false;
  }
}

async function readSettings() {
  await ensureSettingsFile();
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const brevo = parsed && typeof parsed === "object" ? parsed.brevo || {} : {};
    const sanitized = {
      brevo: {
        apiKey: typeof brevo.apiKey === "string" ? brevo.apiKey.trim() : "",
        senderEmail: EMAIL_PATTERN.test(brevo.senderEmail || "")
          ? brevo.senderEmail.trim()
          : "",
        senderName:
          typeof brevo.senderName === "string" && brevo.senderName.trim()
            ? brevo.senderName.trim()
            : "",
      },
    };
    return sanitized;
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

async function writeSettings(settings) {
  const next = {
    brevo: {
      apiKey:
        typeof settings?.brevo?.apiKey === "string"
          ? settings.brevo.apiKey.trim()
          : "",
      senderEmail: EMAIL_PATTERN.test(settings?.brevo?.senderEmail || "")
        ? settings.brevo.senderEmail.trim()
        : "",
      senderName:
        typeof settings?.brevo?.senderName === "string" && settings.brevo.senderName.trim()
          ? settings.brevo.senderName.trim()
          : "",
    },
  };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function readSitemaps() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_SITEMAPS];
    }
    if (parsed.length === 0) {
      return [];
    }
    const sanitized = [];
    for (const item of parsed) {
      const sanitizedItem = sanitizeEntry(item);
      if (sanitizedItem) {
        sanitized.push(sanitizedItem);
      }
    }
    return sanitized.length ? sanitized : [...DEFAULT_SITEMAPS];
  } catch (error) {
    return [...DEFAULT_SITEMAPS];
  }
}

async function writeSitemaps(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

async function refreshAllSitemaps({ force = false } = {}) {
  let sitemaps = [];
  try {
    sitemaps = await readSitemaps();
  } catch (error) {
    console.warn("Sitemap listesi okunamadi, cache refresh atlandi.", error.message || error);
    return;
  }

  const tasks = [];
  for (const item of sitemaps) {
    const url = item && typeof item.url === "string" ? item.url.trim() : "";
    if (!url) {
      continue;
    }
    tasks.push(
      scheduleCacheRefresh(url, { force }).catch((err) => {
        console.warn("Cache refresh skipped:", err.message || err);
      })
    );
  }

  await Promise.allSettled(tasks);
}

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once("error", (error) => {
        if (error.code === "EADDRINUSE") {
          resolve(false);
        } else {
          reject(error);
        }
      })
      .once("listening", () => {
        tester.close(() => resolve(true));
      });

    tester.unref();
    tester.listen(port, "0.0.0.0");
  });
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const tempServer = net
      .createServer()
      .once("error", reject)
      .once("listening", () => {
        const address = tempServer.address();
        tempServer.close(() => resolve(address.port));
      });

    tempServer.unref();
    tempServer.listen(0, "0.0.0.0");
  });
}

async function choosePort(port, { strict } = {}) {
  try {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    if (strict) {
      throw Object.assign(new Error(`Port ${port} kullanilamaz.`), {
        code: "EADDRINUSE",
      });
    }
    const fallback = await findAvailablePort();
    console.warn(
      `Port ${port} kullanimda oldugu icin ${fallback} portu secildi.`
    );
    return fallback;
  } catch (error) {
    if (error.code === "EACCES") {
      throw new Error(
        `Port ${port} icin gerekli yetkiler bulunmuyor. Farkli bir PORT degeri deneyin.`
      );
    }
    throw error;
  }
}

// Authentication endpoints
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Kullanici adi ve sifre gerekli" });
  }

  if (username === AUTH_USER && password === AUTH_PASS) {
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ message: "Giris basarili" });
  }

  return res.status(401).json({ message: "Kullanici adi veya sifre hatali" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Cikis yapilirken hata olustu" });
    }
    res.json({ message: "Cikis basarili" });
  });
});

app.get("/api/check-auth", (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.json({
      authenticated: true,
      username: req.session.username || "siteflow"
    });
  }
  return res.json({ authenticated: false });
});

// Redirect root to login if not authenticated
app.get("/", (req, res, next) => {
  if (!req.session || !req.session.authenticated) {
    return res.redirect('/login.html');
  }
  next();
});

// Protected API routes
app.get("/api/sitemaps", requireAuth, async (req, res, next) => {
  try {
    const sitemaps = await readSitemaps();
    const history = await readHealthHistory();
    const enriched = sitemaps.map((entry) => {
      const url = typeof entry?.url === "string" ? normalizeUrl(entry.url) : null;
      const alert = url ? buildAlertForHistory(history[url]) : null;
      return {
        ...entry,
        alert,
      };
    });
    res.json(enriched);
  } catch (error) {
    next(error);
  }
});

app.post("/api/sitemaps/discover", requireAuth, discoveryLimiter, async (req, res, next) => {
  const mode = String((req.query && req.query.mode) || "").toLowerCase();
  const isFast = mode === "fast";

  try {
    const rawTarget =
      req.body && typeof req.body.target === "string" ? req.body.target.trim() : "";
    if (!rawTarget) {
      res.status(400).json({ message: "Alan adi veya URL gerekli." });
      return;
    }

    const normalizedTarget = normalizeDiscoveryTarget(rawTarget);
    if (!normalizedTarget) {
      res.status(400).json({ message: "Gecerli bir alan adi veya URL girin." });
      return;
    }

    await assertPublicHostname(normalizedTarget.hostname);

    const origins = buildDiscoveryOrigins(normalizedTarget);
    if (!origins.length) {
      res.status(400).json({ message: "Gecerli bir alan adi veya URL girin." });
      return;
    }

    const pathPrefixes = derivePathPrefixes(normalizedTarget.pathname || "/");

    const [robotsHit, homeHit] = await Promise.all([
      fetchOptionalText(origins, "/robots.txt", { sizeLimit: 128 * 1024 }),
      fetchOptionalText(origins, "/", { sizeLimit: DISCOVERY_HTML_MAX_BYTES }),
    ]);

    const robotsResults = robotsHit
      ? parseRobotsForSitemaps(robotsHit.text, robotsHit.origin)
      : [];
    const domResults = homeHit ? parseDomForSitemaps(homeHit.text, homeHit.url) : [];
    const fallbackOrigin = homeHit?.origin || robotsHit?.origin || origins[0];
    const guessResults = fallbackOrigin
      ? buildCommonPathGuessesWithPrefixes(fallbackOrigin, pathPrefixes)
      : [];
    let crawlResults = [];
    if (fallbackOrigin && !isFast) {
      try {
        crawlResults = await crawlDomainForSitemaps(fallbackOrigin, {
          startPath: normalizedTarget.pathname || "/",
          timeBudgetMs: 7000,
        });
      } catch (error) {
        console.warn("Crawl discovery skipped:", error.message || error);
        crawlResults = [];
      }
    }

    const deduped = dedupeDiscoveryResults([
      robotsResults,
      domResults,
      guessResults,
      crawlResults,
    ]);
    const verifiedResults = await annotateCandidateStatuses(deduped);
    const reachableResults = verifiedResults.filter(
      (entry) => entry && entry.verification && entry.verification.ok
    );
    const expandedResults = await expandSitemapChildren(reachableResults);
    const combinedResults = dedupeDiscoveryResults([verifiedResults, expandedResults]);
    const finalResults = combinedResults.map((entry) => {
      const { xmlText, ...rest } = entry || {};
      return rest;
    });

    res.json({
      query: normalizedTarget.hostname,
      baseUrl: fallbackOrigin || "",
      results: finalResults,
    });
  } catch (error) {
    next(error);
  }
});

async function runHealthCheckForUrl(normalizedUrl, { sampleRate, maxSamples, req } = {}) {

  const allUrls = await collectHealthCheckUrls(normalizedUrl);
  const resolvedSampleRate = Number.isFinite(Number(sampleRate))
    ? Number(sampleRate)
    : HEALTH_CHECK_SAMPLE_RATE;
  const resolvedMaxSamples = Number.isFinite(Number(maxSamples))
    ? Number(maxSamples)
    : HEALTH_CHECK_SAMPLE_MAX;
  const sampled = sampleUrls(allUrls, resolvedSampleRate, resolvedMaxSamples);

  const safeTargets = [];
  for (const target of sampled) {
    try {
      await assertPublicUrl(target);
      safeTargets.push(target);
    } catch (_error) {
      continue;
    }
  }

  const results = await Promise.all(
    safeTargets.map((target) =>
      withFetchSlot(() => checkUrlStatus(target)).then((status) => ({
        url: target,
        status,
      }))
    )
  );

  const total = results.length;
  const okCount = results.filter((entry) => entry.status && entry.status >= 200 && entry.status < 400).length;
  const percent = total ? Math.round((okCount / total) * 100) : 0;
  const breakdown = results.reduce((acc, entry) => {
    const key = entry.status ? String(entry.status) : "ERR";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const errorUrls = results
    .filter((entry) => !entry.status || entry.status >= 400)
    .map((entry) => entry.url);
  const historyRecord = {
    timestamp: new Date().toISOString(),
    score: percent,
    details: breakdown,
    errors: errorUrls,
  };
  await appendHealthHistory(normalizedUrl, historyRecord);
  maybeSendCriticalHealthAlert({
    url: normalizedUrl,
    percent,
    breakdown,
    results,
    req,
  }).catch((error) => {
    console.warn("Brevo alert failed:", error.message || error);
  });

  return {
    url: normalizedUrl,
    sampleSize: total,
    okCount,
    percent,
    results,
    breakdown,
    errorUrls,
  };
}

async function runCrawlErrorsForUrl(
  normalizedUrl,
  { sampleRate, maxUrls, force = false } = {}
) {
  if (!normalizedUrl) {
    throw new SitemapFetchError("Gecerli bir sitemap URL'i gerekli.", 400);
  }

  if (!force) {
    const cached = await readCrawlErrorsCache(normalizedUrl);
    if (cached) {
      return cached;
    }
  }

  const previousSnapshot = await readCrawlErrorsSnapshot(normalizedUrl);
  const previousErrors = getActiveCrawlErrors(previousSnapshot);

  const parsedSampleRate = Number(sampleRate);
  const resolvedSampleRate = Number.isFinite(parsedSampleRate)
    ? Math.max(0, Math.min(parsedSampleRate, 1))
    : 0.1;
  const parsedMaxUrls = Number(maxUrls);
  const maxUrlLimit = Number.isFinite(parsedMaxUrls)
    ? Math.min(Math.max(parsedMaxUrls, 50), 5000)
    : 2000;

  await assertPublicUrl(normalizedUrl);

  const { urls, totalCount } = await collectSimilarityUrls(normalizedUrl, {
    maxUrls: maxUrlLimit,
    sampleStrategy: "deterministic",
  });
  const totalUrls = Number.isFinite(totalCount) && totalCount > 0 ? totalCount : urls.length;
  const desiredSampleCount = Math.min(
    maxUrlLimit,
    Math.max(1, Math.ceil(totalUrls * resolvedSampleRate))
  );
  const sampled = sampleUrlListDeterministic(urls, desiredSampleCount);

  const safeTargets = [];
  for (const target of sampled) {
    try {
      await assertPublicUrl(target);
      safeTargets.push(target);
    } catch (_error) {
      continue;
    }
  }

  const results = await Promise.all(
    safeTargets.map((target) =>
      withFetchSlot(() => probeUrlStatus(target, { timeoutMs: 10000, maxRedirects: 5 })).then(
        (result) => ({ url: target, ...result })
      )
    )
  );

  const summary = {
    ok: 0,
    "5xx": 0,
    "404": 0,
    "4xx": 0,
    timeout: 0,
    redirect_loop: 0,
    ssl_error: 0,
  };
  const errors = [];
  for (const entry of results) {
    const category = entry.category || "ok";
    if (summary[category] === undefined) {
      summary[category] = 0;
    }
    summary[category] += 1;
    if (category !== "ok") {
      errors.push({
        url: entry.url,
        status: entry.status,
        category,
        message: entry.message || "",
      });
    }
  }

  const scannedAtMs = Date.now();
  const scannedAt = new Date(scannedAtMs).toISOString();
  const errorsWithState = buildCrawlErrorsDiff(errors, previousErrors, scannedAt);

  const payload = {
    url: normalizedUrl,
    scannedAt,
    scannedAtMs,
    totalUrls,
    sampledUrls: safeTargets.length,
    summary,
    errors: errorsWithState,
  };

  await writeCrawlErrorsCache(normalizedUrl, payload);
  return payload;
}

async function runScheduledHealthChecks() {
  if (cronHealthCheckRunning || isShuttingDown) {
    return;
  }
  cronHealthCheckRunning = true;
  try {
    let sitemaps = [];
    try {
      sitemaps = await readSitemaps();
    } catch (error) {
      console.warn("Scheduled health check skipped: sitemap listesi okunamadi.", error.message || error);
      return;
    }

    for (const item of sitemaps) {
      const rawUrl = item && typeof item.url === "string" ? item.url.trim() : "";
      if (!rawUrl) {
        continue;
      }
      const normalizedUrl = normalizeUrl(rawUrl);
      if (!normalizedUrl) {
        continue;
      }
      try {
        await runHealthCheckForUrl(normalizedUrl, {
          sampleRate: HEALTH_CHECK_SAMPLE_RATE,
          maxSamples: HEALTH_CHECK_SAMPLE_MAX,
        });
      } catch (error) {
        console.warn(`Scheduled health check failed for ${normalizedUrl}:`, error.message || error);
      }
    }
  } finally {
    cronHealthCheckRunning = false;
  }
}

async function runScheduledCrawlErrors() {
  if (cronCrawlErrorsRunning || isShuttingDown) {
    return;
  }
  cronCrawlErrorsRunning = true;
  try {
    let sitemaps = [];
    try {
      sitemaps = await readSitemaps();
    } catch (error) {
      console.warn(
        "Scheduled crawl errors skipped: sitemap listesi okunamadi.",
        error.message || error
      );
      return;
    }

    for (const item of sitemaps) {
      const rawUrl = item && typeof item.url === "string" ? item.url.trim() : "";
      if (!rawUrl || !item.autoCrawl) {
        continue;
      }
      const normalizedUrl = normalizeUrl(rawUrl);
      if (!normalizedUrl) {
        continue;
      }
      try {
        await runCrawlErrorsForUrl(normalizedUrl, { force: false });
      } catch (error) {
        console.warn(
          `Scheduled crawl errors failed for ${normalizedUrl}:`,
          error.message || error
        );
      }
    }
  } finally {
    cronCrawlErrorsRunning = false;
  }
}
app.post("/api/sitemaps/health", requireAuth, async (req, res, next) => {
  try {
    const { url, sampleRate, maxSamples } = req.body || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const payload = await runHealthCheckForUrl(normalizedUrl, {
      sampleRate,
      maxSamples,
      req,
    });
    res.json(payload);
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      res.status(mapped.status).json({ message: mapped.message });
      return;
    }
    next(error);
  }
});

app.post("/api/sitemaps/crawl-errors", requireAuth, async (req, res, next) => {
  try {
    const { url, sampleRate, maxUrls, force } = req.body || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const payload = await runCrawlErrorsForUrl(normalizedUrl, {
      sampleRate,
      maxUrls,
      force: Boolean(force),
    });
    res.json(payload);
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      res.status(mapped.status).json({ message: mapped.message });
      return;
    }
    next(error);
  }
});

app.get("/api/sitemaps/analyze-similarity", requireAuth, async (req, res, next) => {
  try {
    const { url, threshold, maxUrls, maxGroupSize, minClusterSize, maxPairsPerGroup } =
      req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }

    const parsedThreshold = Number(threshold);
    const similarityThreshold = Number.isFinite(parsedThreshold)
      ? Math.min(Math.max(parsedThreshold, 0), 1)
      : 0.8;
    const parsedMaxUrls = Number(maxUrls);
    const maxUrlLimit = Number.isFinite(parsedMaxUrls)
      ? Math.min(Math.max(parsedMaxUrls, 50), 5000)
      : 2000;
    const parsedMaxGroupSize = Number(maxGroupSize);
    const maxGroupLimit = Number.isFinite(parsedMaxGroupSize)
      ? Math.min(Math.max(parsedMaxGroupSize, 10), 500)
      : 200;
    const parsedMinClusterSize = Number(minClusterSize);
    const minClusterLimit = Number.isFinite(parsedMinClusterSize)
      ? Math.min(Math.max(parsedMinClusterSize, 2), 50)
      : 2;
    const parsedMaxPairsPerGroup = Number(maxPairsPerGroup);
    const maxPairsLimit = Number.isFinite(parsedMaxPairsPerGroup)
      ? Math.min(Math.max(parsedMaxPairsPerGroup, 5), 100)
      : 20;

    await assertPublicUrl(normalizedUrl);
    const { urls, sampled, totalCount, childLimitHit } = await collectSimilarityUrls(
      normalizedUrl,
      { maxUrls: maxUrlLimit, sampleStrategy: "deterministic" }
    );

    const analysis = analyzeUrlSimilarities(urls, {
      threshold: similarityThreshold,
      maxGroupSize: maxGroupLimit,
      minClusterSize: minClusterLimit,
      maxPairsPerGroup: maxPairsLimit,
    });

    const clusters = [];
    const clusterUrls = new Set();
    analysis.groups.forEach((group) => {
      (group.clusters || []).forEach((cluster) => {
        clusters.push({
          clusterId: cluster.clusterId,
          groupKey: cluster.groupKey || group.groupKey || "/",
          size: cluster.size,
          pivot: cluster.pivot,
          avgSimilarity: cluster.avgSimilarity,
          maxSimilarity: cluster.maxSimilarity,
          risk: cluster.risk,
          items: cluster.items,
          pairs: cluster.pairs,
        });
        (cluster.items || []).forEach((item) => {
          if (item && item.url) {
            clusterUrls.add(item.url);
          }
        });
      });
    });

    const summary = {
      clusterCount: clusters.length,
      highRiskCount: clusters.filter((cluster) => cluster.risk === "high").length,
      mediumRiskCount: clusters.filter((cluster) => cluster.risk === "medium").length,
      lowRiskCount: clusters.filter((cluster) => cluster.risk === "low").length,
      cannibalizationScore: analysis.analyzedUrls
        ? Number((clusterUrls.size / analysis.analyzedUrls).toFixed(4))
        : 0,
    };

    res.json({
      url: normalizedUrl,
      threshold: similarityThreshold,
      maxUrls: maxUrlLimit,
      totalUrls: totalCount || analysis.totalUrls,
      analyzedUrls: analysis.analyzedUrls,
      skippedUrls: analysis.skippedUrls,
      sampled,
      childLimitHit,
      maxGroupSize: maxGroupLimit,
      minClusterSize: minClusterLimit,
      maxPairsPerGroup: maxPairsLimit,
      clusters,
      summary,
    });
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      res.status(mapped.status).json({ message: mapped.message });
      return;
    }
    next(error);
  }
});

app.get("/api/health-history", requireAuth, async (req, res, next) => {
  try {
    const { url } = req.query || {};
    const history = await readHealthHistory();
    if (typeof url === "string" && url.trim()) {
      const normalized = normalizeUrl(url);
      if (!normalized) {
        res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
        return;
      }
      res.json({
        url: normalized,
        history: Array.isArray(history[normalized]) ? history[normalized] : [],
      });
      return;
    }
    res.json(history);
  } catch (error) {
    next(error);
  }
});

app.put("/api/sitemaps", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ message: "Beklenen format bir dizi olmali." });
      return;
    }

    const parsedInput = sitemapListSchema.safeParse(req.body);
    if (!parsedInput.success) {
      const issues = Array.isArray(parsedInput.error?.issues)
        ? parsedInput.error.issues
        : [];
      const errors = issues.map((issue) => ({
        path: Array.isArray(issue.path) ? issue.path.join(".") : "",
        message: issue.message || "Gecersiz sitemap girdisi.",
      }));
      res.status(400).json({
        message: "Gecersiz sitemap girdisi.",
        errors,
      });
      return;
    }

    const sanitized = [];
    for (const item of parsedInput.data) {
      const sanitizedItem = sanitizeEntry(item);
      if (!sanitizedItem) {
        res.status(400).json({ message: "Gecersiz sitemap girdisi." });
        return;
      }
      sanitized.push(sanitizedItem);
    }

    await writeSitemaps(sanitized);
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

app.get("/api/settings/brevo", requireAuth, async (req, res, next) => {
  try {
    const settings = await readSettings();
    res.json({
      hasApiKey: Boolean(settings.brevo.apiKey),
      senderEmail: settings.brevo.senderEmail || "",
      senderName: settings.brevo.senderName || "",
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/settings/brevo", requireAuth, async (req, res, next) => {
  try {
    const payload = req.body || {};
    const current = await readSettings();
    const nextSettings = {
      brevo: {
        apiKey:
          typeof payload.apiKey === "string"
            ? payload.apiKey.trim()
            : current.brevo.apiKey,
        senderEmail:
          typeof payload.senderEmail === "string"
            ? payload.senderEmail.trim()
            : current.brevo.senderEmail,
        senderName:
          typeof payload.senderName === "string"
            ? payload.senderName.trim()
            : current.brevo.senderName,
      },
    };

    if (nextSettings.brevo.apiKey) {
      try {
        nextSettings.brevo.apiKey = validateBrevoApiKey(nextSettings.brevo.apiKey);
      } catch (error) {
        if (error instanceof BrevoKeyValidationError) {
          res.status(400).json({ message: error.message });
          return;
        }
        throw error;
      }
    }

    if (nextSettings.brevo.senderEmail && !EMAIL_PATTERN.test(nextSettings.brevo.senderEmail)) {
      res.status(400).json({ message: "Ge+Ã¯Â¿Â½erli bir g+Ã¯Â¿Â½nderici e-posta adresi saÃ¯Â¿Â½Ã¯Â¿Â½layÃ¯Â¿Â½-n." });
      return;
    }

    const saved = await writeSettings(nextSettings);
    res.json({
      hasApiKey: Boolean(saved.brevo.apiKey),
      senderEmail: saved.brevo.senderEmail || "",
      senderName: saved.brevo.senderName || "",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/settings/brevo/test", requireAuth, async (req, res, next) => {
  try {
    const rawApiKey = typeof req.body?.apiKey === "string" ? req.body.apiKey.trim() : "";
    let apiKeyToTest = rawApiKey;

    if (!apiKeyToTest) {
      const settings = await readSettings();
      apiKeyToTest = settings?.brevo?.apiKey || "";
    }

    if (!apiKeyToTest) {
      res.status(400).json({ message: "Test icin Brevo API anahtari gerekli." });
      return;
    }

    const account = await fetchBrevoAccount(apiKeyToTest);
    res.json({
      ok: true,
      usingStoredKey: !rawApiKey,
      account,
    });
  } catch (error) {
    if (error instanceof BrevoKeyValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error && typeof error.status === "number") {
      res.status(error.status).json({ message: error.message || "Brevo API anahtari dogrulanamadi." });
      return;
    }
    next(error);
  }
});

app.post("/api/email/send", requireAuth, async (req, res, next) => {
  try {
    const { url, subject, htmlContent, textContent, isTest = false } = req.body || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Ge+Ã¯Â¿Â½erli bir sitemap URL'i gerekli." });
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Ge+Ã¯Â¿Â½erli bir sitemap URL'i gerekli." });
      return;
    }

    const [settings, sitemaps] = await Promise.all([readSettings(), readSitemaps()]);
    const brevo = resolveBrevoSettings(settings);
    if (!brevo.apiKey) {
      res.status(400).json({ message: "Brevo API anahtarÃ¯Â¿Â½- tanÃ¯Â¿Â½-mlÃ¯Â¿Â½- deÃ¯Â¿Â½Ã¯Â¿Â½il." });
      return;
    }

    if (!brevo.senderEmail) {
      res.status(400).json({ message: "G+Ã¯Â¿Â½nderici e-posta adresi tanÃ¯Â¿Â½-mlÃ¯Â¿Â½- deÃ¯Â¿Â½Ã¯Â¿Â½il." });
      return;
    }

    const match = sitemaps.find((item) => urlsEqual(item.url, normalizedUrl));
    if (!match) {
      res.status(404).json({ message: "Sitemap kaydÃ¯Â¿Â½- bulunamadÃ¯Â¿Â½-." });
      return;
    }

    if (!match.emailEnabled) {
      res.status(400).json({ message: "Bu sitemap i+Ã¯Â¿Â½in e-posta bildirimleri etkin deÃ¯Â¿Â½Ã¯Â¿Â½il." });
      return;
    }

    const recipients = Array.isArray(match.emailRecipients) ? sanitizeEmailList(match.emailRecipients) : [];
    if (!recipients.length) {
      res.status(400).json({ message: "Bu sitemap i+Ã¯Â¿Â½in tanÃ¯Â¿Â½-mlÃ¯Â¿Â½- e-posta alÃ¯Â¿Â½-cÃ¯Â¿Â½-sÃ¯Â¿Â½- yok." });
      return;
    }

    const finalSubject =
      typeof subject === "string" && subject.trim()
        ? subject.trim()
        : `[SitemapFlow] ${isTest ? "Test" : "G+-ncelleme"}: ${match.title || match.url}`;

    const fallbackText =
      typeof textContent === "string" && textContent.trim()
        ? textContent.trim()
        : `${match.title || match.url} sitemap'i i+Ã¯Â¿Â½in ${isTest ? "test" : "g+-ncelleme"} bildirimi.`;

    const fallbackHtml =
      typeof htmlContent === "string" && htmlContent.trim()
        ? htmlContent
        : `<p>${match.title || match.url} sitemap'i i+Ã¯Â¿Â½in ${isTest ? "test" : "g+-ncelleme"} bildirimi.</p>`;

    const delivery = await sendBrevoEmailWithConfig({
      brevo,
      recipients,
      subject: finalSubject,
      htmlContent: fallbackHtml,
      textContent: fallbackText,
    });

    const brevoMessageId =
      typeof delivery?.messageId === "string" && delivery.messageId.trim()
        ? delivery.messageId.trim()
        : null;

    if (brevoMessageId) {
      console.info(`Brevo e-posta g+Ã¯Â¿Â½nderildi: ${brevoMessageId} (${normalizedUrl})`);
    } else {
      console.info(`Brevo e-posta isteÃ¯Â¿Â½Ã¯Â¿Â½i tamamlandÃ¯Â¿Â½- (ID bulunamadÃ¯Â¿Â½-) (${normalizedUrl})`);
    }

    res.json({
      message: isTest
        ? `Test e-postasÃ¯Â¿Â½- g+Ã¯Â¿Â½nderildi.${brevoMessageId ? ` (Brevo ID: ${brevoMessageId})` : ""}`
        : `E-posta bildirimi g+Ã¯Â¿Â½nderildi.${brevoMessageId ? ` (Brevo ID: ${brevoMessageId})` : ""}`,
      brevo: delivery,
    });
  } catch (error) {
    next(error);
  }
});

async function sendBrevoEmailWithConfig({ brevo, recipients, subject, htmlContent, textContent }) {
  if (!brevo?.apiKey) {
    throw new Error("Brevo API anahtari tanimli degil.");
  }
  if (!brevo?.senderEmail) {
    throw new Error("Brevo gonderici e-posta adresi tanimli degil.");
  }
  if (!Array.isArray(recipients) || !recipients.length) {
    throw new Error("E-posta alici listesi bos.");
  }

  const payload = {
    sender: {
      email: brevo.senderEmail,
      name: brevo.senderName || "SitemapFlow",
    },
    to: recipients.map((email) => ({ email })),
    subject,
    htmlContent,
    textContent,
  };

  const response = await fetch(BREVO_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevo.apiKey,
    },
    body: JSON.stringify(payload),
    dispatcher: INSECURE_AGENT,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const message = errorText
      ? `${response.status} ${errorText}`
      : `Brevo istegi ${response.status} durumuyla basarisiz oldu.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  let responseBody = null;
  const text = await response.text().catch(() => "");
  if (text) {
    try {
      responseBody = JSON.parse(text);
    } catch (parseError) {
      responseBody = { raw: text };
    }
  }

  return responseBody || {};
}

async function sendBrevoEmail({ settings, recipients, subject, htmlContent, textContent }) {
  const brevo = resolveBrevoSettings(settings);
  return sendBrevoEmailWithConfig({
    brevo,
    recipients,
    subject,
    htmlContent,
    textContent,
  });
}

app.get("/api/fetch-page", requireAuth, async (req, res, next) => {
  const { url } = req.query;

  if (typeof url !== "string" || !url.trim()) {
    res.status(400).json({ message: "Gecerli bir url parametresi gerekli." });
    return;
  }

  let target;
  try {
    target = new URL(url.trim());
  } catch (error) {
    res.status(400).json({ message: "Gecerli bir URL saglayin." });
    return;
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    res.status(400).json({ message: "Sadece HTTP veya HTTPS adresleri desteklenir." });
    return;
  }

  try {
    const result = await fetchPageHtmlWithRetry(target.href);
    res.set("Content-Type", result.contentType || "text/html; charset=utf-8");
    if (result.fetchMode) {
      res.set("X-Page-Fetch", result.fetchMode);
    }
    res.send(result.html || "");
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      sendFetchError(res, {
        status: error.status,
        message: error.message,
        code: error.code || null,
      });
      return;
    }
    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      sendFetchError(res, {
        status: mapped.status,
        message: mapped.message,
        code: error?.code || error?.cause?.code || null,
      });
      return;
    }
    next(error);
  }
});
app.get("/api/fetch-sitemap", requireAuth, async (req, res, next) => {
  const { url } = req.query;

  if (typeof url !== "string" || !url.trim()) {
    res.status(400).json({ message: "Gecerli bir url parametresi gerekli." });
    return;
  }

  let target;
  try {
    target = new URL(url.trim());
  } catch (error) {
    res.status(400).json({ message: "Gecerli bir URL saglayin." });
    return;
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    res.status(400).json({ message: "Sadece HTTP veya HTTPS adresleri desteklenir." });
    return;
  }

  const targetUrl = target.href;

  try {
    const cached = await readCachedSitemap(targetUrl);
    if (cached && cached.meta && cached.meta.responseType === "html") {
      console.warn(
        `Poisoned cache detected, skipping cached HTML for ${targetUrl}.`
      );
    } else if (cached && typeof cached.xml === "string" && cached.xml) {
      res.set("Content-Type", "application/xml; charset=utf-8");
      if (cached.meta && isCacheFresh(cached.meta)) {
        res.set("X-Sitemap-Cache", "HIT");
        if (cached.meta.fetchMode) {
          res.set("X-Sitemap-Fetch", cached.meta.fetchMode);
        }
        if (cached.meta.responseType) {
          res.set("X-Sitemap-Response", cached.meta.responseType);
        }
        if (cached.meta.staleReason) {
          res.set("X-Sitemap-Stale", cached.meta.staleReason);
        }
        res.send(cached.xml);
        return;
      }
      res.set("X-Sitemap-Cache", "STALE");
      if (cached.meta && cached.meta.fetchMode) {
        res.set("X-Sitemap-Fetch", cached.meta.fetchMode);
      }
      if (cached.meta && cached.meta.responseType) {
        res.set("X-Sitemap-Response", cached.meta.responseType);
      }
      if (cached.meta && cached.meta.staleReason) {
        res.set("X-Sitemap-Stale", cached.meta.staleReason);
      }
      res.send(cached.xml);
      scheduleCacheRefresh(targetUrl, { force: true }).catch((error) => {
        console.warn("Cache refresh failed:", error.message || error);
      });
      return;
    }

    const result = await scheduleCacheRefresh(targetUrl, { force: true });
    if (!result || !result.xml) {
      throw new SitemapFetchError("Sitemap getirilemedi.", 502);
    }
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("X-Sitemap-Cache", "MISS");
    if (result.meta && result.meta.fetchMode) {
      res.set("X-Sitemap-Fetch", result.meta.fetchMode);
    } else if (result.fetchMode) {
      res.set("X-Sitemap-Fetch", result.fetchMode);
    }
    if (result.meta && result.meta.responseType) {
      res.set("X-Sitemap-Response", result.meta.responseType);
    } else if (result.responseType) {
      res.set("X-Sitemap-Response", result.responseType);
    }
    if (result.staleReason) {
      res.set("X-Sitemap-Stale", result.staleReason);
    }
    res.send(result.xml);
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      sendFetchError(res, {
        status: error.status,
        message: error.message,
        code: error.code || null,
      });
      return;
    }
    const mapped = mapFetchErrorToResponse(error);
    if (mapped) {
      sendFetchError(res, {
        status: mapped.status,
        message: mapped.message,
        code: error?.code || error?.cause?.code || null,
      });
      return;
    }
    next(error);
  }
});

app.post("/api/scans/start", requireAuth, async (req, res, next) => {
  try {
    const { url, sampleRate, maxSamples } = req.body || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    try {
      await assertPublicUrl(normalizedUrl);
    } catch (error) {
      res.status(400).json({ message: error?.message || "URL engellendi." });
      return;
    }

    const scanInfo = await collectScanUrls(normalizedUrl, {
      sampleRate,
      maxSamples,
    });

    const db = initScanDb();
    const startedAt = new Date().toISOString();
    const startTx = db.transaction(() => {
      db.prepare("DELETE FROM latest_url_results WHERE sitemap_url = ?").run(normalizedUrl);
      db.prepare("DELETE FROM latest_heading_links WHERE sitemap_url = ?").run(normalizedUrl);
      const insertRun = db.prepare(`
        INSERT INTO scan_runs (sitemap_url, started_at, status, total_urls, sampled_urls)
        VALUES (?, ?, ?, ?, ?)
      `);
      return insertRun.run(
        normalizedUrl,
        startedAt,
        "running",
        scanInfo.totalCount || null,
        scanInfo.sampledCount || 0
      );
    });
    const result = startTx();

    res.json({
      runId: result.lastInsertRowid,
      sitemapUrl: normalizedUrl,
      startedAt,
      totalCount: scanInfo.totalCount || 0,
      sampledCount: scanInfo.sampledCount || 0,
      urls: scanInfo.urls || [],
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/scans/progress", requireAuth, async (req, res, next) => {
  try {
    const { sitemapUrl, urlResults, headingLinks } = req.body || {};
    if (typeof sitemapUrl !== "string" || !sitemapUrl.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(sitemapUrl);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const safeResults = Array.isArray(urlResults) ? urlResults : [];
    const safeHeadingLinks = Array.isArray(headingLinks) ? headingLinks : [];
    if (!safeResults.length && !safeHeadingLinks.length) {
      res.json({ ok: true });
      return;
    }

    const db = initScanDb();
    const upsertUrl = db.prepare(`
      INSERT INTO latest_url_results
        (sitemap_url, url, status_code, category, title, description, response_time_ms, crawled_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sitemap_url, url)
      DO UPDATE SET
        status_code = excluded.status_code,
        category = excluded.category,
        title = excluded.title,
        description = excluded.description,
        response_time_ms = excluded.response_time_ms,
        crawled_at = excluded.crawled_at
    `);
    const upsertLink = db.prepare(`
      INSERT INTO latest_heading_links
        (sitemap_url, page_url, link_url, status_code, category, anchor_text, checked_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sitemap_url, page_url, link_url, anchor_text)
      DO UPDATE SET
        status_code = excluded.status_code,
        category = excluded.category,
        checked_at = excluded.checked_at
    `);

    const tx = db.transaction(() => {
      for (const entry of safeResults) {
        if (!entry || typeof entry.url !== "string") {
          continue;
        }
        upsertUrl.run(
          normalizedUrl,
          entry.url,
          Number.isFinite(Number(entry.statusCode)) ? Number(entry.statusCode) : null,
          entry.category || null,
          entry.title || "",
          entry.description || "",
          Number.isFinite(Number(entry.responseTimeMs)) ? Number(entry.responseTimeMs) : null,
          typeof entry.crawledAt === "string" ? entry.crawledAt : new Date().toISOString()
        );
      }
      for (const entry of safeHeadingLinks) {
        if (!entry || typeof entry.pageUrl !== "string" || typeof entry.linkUrl !== "string") {
          continue;
        }
        upsertLink.run(
          normalizedUrl,
          entry.pageUrl,
          entry.linkUrl,
          Number.isFinite(Number(entry.statusCode)) ? Number(entry.statusCode) : null,
          entry.category || null,
          entry.anchorText || "",
          typeof entry.checkedAt === "string" ? entry.checkedAt : new Date().toISOString()
        );
      }
    });

    tx();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/scans/complete", requireAuth, async (req, res, next) => {
  try {
    const { runId, sitemapUrl, totalUrls, sampledUrls, summary, urlResults, headingLinks } = req.body || {};
    const parsedRunId = Number(runId);
    if (!Number.isFinite(parsedRunId)) {
      res.status(400).json({ message: "Gecerli bir runId gerekli." });
      return;
    }

    const db = initScanDb();
    const run = db.prepare("SELECT id, sitemap_url FROM scan_runs WHERE id = ?").get(parsedRunId);
    if (!run) {
      res.status(404).json({ message: "Scan run bulunamadi." });
      return;
    }

    const finalSitemapUrl = sitemapUrl || run.sitemap_url;
    const finishedAt = new Date().toISOString();
    const safeSummary = summary && typeof summary === "object" ? summary : {};
    const safeResults = Array.isArray(urlResults) ? urlResults : [];
    const safeHeadingLinks = Array.isArray(headingLinks) ? headingLinks : [];

    const tx = db.transaction(() => {
      const effectiveResults = safeResults.length
        ? safeResults
        : db.prepare(`
          SELECT
            url,
            status_code AS statusCode,
            category,
            title,
            description,
            response_time_ms AS responseTimeMs
          FROM latest_url_results
          WHERE sitemap_url = ?
        `).all(finalSitemapUrl);
      const effectiveHeadingLinks = safeHeadingLinks.length
        ? safeHeadingLinks
        : db.prepare(`
          SELECT
            page_url AS pageUrl,
            link_url AS linkUrl,
            status_code AS statusCode,
            category,
            anchor_text AS anchorText
          FROM latest_heading_links
          WHERE sitemap_url = ?
        `).all(finalSitemapUrl);
      const previousRun = db.prepare(`
        SELECT id
        FROM scan_runs
        WHERE sitemap_url = ?
          AND status = 'completed'
          AND id <> ?
        ORDER BY COALESCE(finished_at, started_at) DESC
        LIMIT 1
      `).get(finalSitemapUrl, parsedRunId);

      db.prepare(`
        UPDATE scan_runs
        SET finished_at = ?, status = ?, total_urls = ?, sampled_urls = ?
        WHERE id = ?
      `).run(
        finishedAt,
        "completed",
        Number.isFinite(Number(totalUrls)) ? Number(totalUrls) : null,
        Number.isFinite(Number(sampledUrls)) ? Number(sampledUrls) : effectiveResults.length,
        parsedRunId
      );

      db.prepare("DELETE FROM scan_summary WHERE run_id = ?").run(parsedRunId);
      const fallbackSummary = computeScanSummaryCounts(effectiveResults);
      const currentScore = Number.isFinite(Number(safeSummary.score))
        ? Number(safeSummary.score)
        : computeScanScoreFromResults(effectiveResults);
      db.prepare(`
        INSERT INTO scan_summary
          (run_id, count_2xx, count_3xx, count_404, count_4xx, count_5xx, count_timeout, count_other, score)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        parsedRunId,
        Number.isFinite(Number(safeSummary.count2xx)) ? Number(safeSummary.count2xx) : fallbackSummary.count2xx,
        Number.isFinite(Number(safeSummary.count3xx)) ? Number(safeSummary.count3xx) : fallbackSummary.count3xx,
        Number.isFinite(Number(safeSummary.count404)) ? Number(safeSummary.count404) : fallbackSummary.count404,
        Number.isFinite(Number(safeSummary.count4xx)) ? Number(safeSummary.count4xx) : fallbackSummary.count4xx,
        Number.isFinite(Number(safeSummary.count5xx)) ? Number(safeSummary.count5xx) : fallbackSummary.count5xx,
        Number.isFinite(Number(safeSummary.countTimeout)) ? Number(safeSummary.countTimeout) : fallbackSummary.countTimeout,
        Number.isFinite(Number(safeSummary.countOther)) ? Number(safeSummary.countOther) : fallbackSummary.countOther,
        currentScore
      );

      db.prepare("DELETE FROM scan_url_results WHERE run_id = ?").run(parsedRunId);
      const insertUrl = db.prepare(`
        INSERT INTO scan_url_results
          (run_id, url, status_code, category, title, description, response_time_ms)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const entry of effectiveResults) {
        if (!entry || typeof entry.url !== "string") {
          continue;
        }
        insertUrl.run(
          parsedRunId,
          entry.url,
          Number.isFinite(Number(entry.statusCode)) ? Number(entry.statusCode) : null,
          entry.category || null,
          entry.title || "",
          entry.description || "",
          Number.isFinite(Number(entry.responseTimeMs)) ? Number(entry.responseTimeMs) : null
        );
      }

      db.prepare("DELETE FROM scan_heading_links WHERE run_id = ?").run(parsedRunId);
      const insertLink = db.prepare(`
        INSERT INTO scan_heading_links
          (run_id, page_url, link_url, status_code, category, anchor_text)
        VALUES
          (?, ?, ?, ?, ?, ?)
      `);
      for (const entry of effectiveHeadingLinks) {
        if (!entry || typeof entry.pageUrl !== "string" || typeof entry.linkUrl !== "string") {
          continue;
        }
        insertLink.run(
          parsedRunId,
          entry.pageUrl,
          entry.linkUrl,
          Number.isFinite(Number(entry.statusCode)) ? Number(entry.statusCode) : null,
          entry.category || null,
          entry.anchorText || ""
        );
      }

      const previousResults = previousRun
        ? db.prepare(`
          SELECT url, status_code AS statusCode, category
          FROM scan_url_results
          WHERE run_id = ?
        `).all(previousRun.id)
        : [];
      const previousScoreRow = previousRun
        ? db.prepare("SELECT score FROM scan_summary WHERE run_id = ?").get(previousRun.id)
        : null;
      const previousScore = previousScoreRow && Number.isFinite(Number(previousScoreRow.score))
        ? Number(previousScoreRow.score)
        : null;
      const diffSummary = buildScanDiffSummary({
        sitemapUrl: finalSitemapUrl,
        runId: parsedRunId,
        previousRunId: previousRun ? previousRun.id : null,
        currentResults: effectiveResults,
        previousResults,
        currentScore,
        previousScore,
        computedAt: finishedAt,
      });

      db.prepare("DELETE FROM scan_diffs WHERE run_id = ?").run(parsedRunId);
      const diffInsert = db.prepare(`
        INSERT INTO scan_diffs (
          run_id, previous_run_id, sitemap_url, computed_at,
          compared_count, unchanged_count, improved_count, regressed_count,
          new_error_count, resolved_error_count, new_404_count, new_4xx_count, new_5xx_count,
          redirect_change_count, score_delta, severity, payload_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        parsedRunId,
        diffSummary.previousRunId,
        finalSitemapUrl,
        finishedAt,
        diffSummary.comparedCount,
        diffSummary.unchangedCount,
        diffSummary.improvedCount,
        diffSummary.regressedCount,
        diffSummary.newErrorCount,
        diffSummary.resolvedErrorCount,
        diffSummary.new404Count,
        diffSummary.new4xxCount,
        diffSummary.new5xxCount,
        diffSummary.redirectChangeCount,
        Number.isFinite(Number(diffSummary.scoreDelta)) ? Number(diffSummary.scoreDelta) : null,
        diffSummary.severity || "low",
        JSON.stringify(diffSummary.payload || {})
      );

      let notificationId = null;
      const notification = buildScanDiffNotification(diffSummary);
      if (notification) {
        const insertedNotification = db.prepare(`
          INSERT INTO scan_notifications (
            sitemap_url, run_id, diff_id, type, severity, title, message, payload_json, is_read, created_at, read_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NULL)
        `).run(
          finalSitemapUrl,
          parsedRunId,
          diffInsert.lastInsertRowid,
          notification.type,
          notification.severity,
          notification.title,
          notification.message,
          JSON.stringify(notification.payload || {}),
          finishedAt
        );
        notificationId = insertedNotification.lastInsertRowid;
      }

      cleanupScanRuns(db, finalSitemapUrl);
      cleanupScanNotifications(db, finalSitemapUrl);
      return {
        diff: {
          id: diffInsert.lastInsertRowid,
          ...diffSummary,
        },
        notificationId,
      };
    });

    const result = tx();
    res.json({
      ok: true,
      finishedAt,
      diff: result?.diff || null,
      notificationId: result?.notificationId || null,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/scans/latest", requireAuth, async (req, res, next) => {
  try {
    const { url } = req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }

    const db = initScanDb();
    const urlResults = db.prepare(`
      SELECT url, status_code AS statusCode, category, title, description,
             response_time_ms AS responseTimeMs, crawled_at AS crawledAt
      FROM latest_url_results
      WHERE sitemap_url = ?
    `).all(normalizedUrl);
    const headingLinks = db.prepare(`
      SELECT page_url AS pageUrl, link_url AS linkUrl, status_code AS statusCode,
             category, anchor_text AS anchorText, checked_at AS checkedAt
      FROM latest_heading_links
      WHERE sitemap_url = ?
    `).all(normalizedUrl);
    const latestCrawl = db.prepare(`
      SELECT MAX(crawled_at) AS lastCrawl
      FROM latest_url_results
      WHERE sitemap_url = ?
    `).get(normalizedUrl);
    const latestHeading = db.prepare(`
      SELECT MAX(checked_at) AS lastHeading
      FROM latest_heading_links
      WHERE sitemap_url = ?
    `).get(normalizedUrl);
    const lastCrawl = latestCrawl && latestCrawl.lastCrawl ? Date.parse(latestCrawl.lastCrawl) : null;
    const lastHeading = latestHeading && latestHeading.lastHeading ? Date.parse(latestHeading.lastHeading) : null;
    const latestTimestamp = Math.max(
      Number.isFinite(lastCrawl) ? lastCrawl : 0,
      Number.isFinite(lastHeading) ? lastHeading : 0
    );

    res.json({
      sitemapUrl: normalizedUrl,
      scannedAt: latestTimestamp ? new Date(latestTimestamp).toISOString() : null,
      urlResults: urlResults || [],
      headingLinks: headingLinks || [],
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/scans/last", requireAuth, async (req, res, next) => {
  try {
    const { url } = req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }

    const db = initScanDb();
    const row = db.prepare(`
      SELECT r.*, s.count_2xx, s.count_3xx, s.count_404, s.count_4xx, s.count_5xx,
             s.count_timeout, s.count_other, s.score,
             d.id AS diff_id, d.previous_run_id, d.compared_count, d.unchanged_count,
             d.improved_count, d.regressed_count, d.new_error_count, d.resolved_error_count,
             d.new_404_count, d.new_4xx_count, d.new_5xx_count, d.redirect_change_count,
             d.score_delta, d.severity AS diff_severity
      FROM scan_runs r
      LEFT JOIN scan_summary s ON s.run_id = r.id
      LEFT JOIN scan_diffs d ON d.run_id = r.id
      WHERE r.sitemap_url = ?
      ORDER BY r.started_at DESC
      LIMIT 1
    `).get(normalizedUrl);

    res.json(row || null);
  } catch (error) {
    next(error);
  }
});

app.get("/api/scans/history", requireAuth, async (req, res, next) => {
  try {
    const { url, limit } = req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }

    const max = Number.isFinite(Number(limit)) ? Math.max(1, Number(limit)) : SCAN_RETENTION_COUNT;
    const db = initScanDb();
    const rows = db.prepare(`
      SELECT r.*, s.count_2xx, s.count_3xx, s.count_404, s.count_4xx, s.count_5xx,
             s.count_timeout, s.count_other, s.score,
             d.id AS diff_id, d.previous_run_id, d.compared_count, d.unchanged_count,
             d.improved_count, d.regressed_count, d.new_error_count, d.resolved_error_count,
             d.new_404_count, d.new_4xx_count, d.new_5xx_count, d.redirect_change_count,
             d.score_delta, d.severity AS diff_severity
      FROM scan_runs r
      LEFT JOIN scan_summary s ON s.run_id = r.id
      LEFT JOIN scan_diffs d ON d.run_id = r.id
      WHERE r.sitemap_url = ?
      ORDER BY r.started_at DESC
      LIMIT ?
    `).all(normalizedUrl, max);

    res.json(rows || []);
  } catch (error) {
    next(error);
  }
});

app.get("/api/scans/notifications", requireAuth, async (req, res, next) => {
  try {
    const { url, limit, unread } = req.query || {};
    const onlyUnread =
      unread === true ||
      unread === "1" ||
      unread === "true";
    const max = Number.isFinite(Number(limit))
      ? Math.min(Math.max(Number(limit), 1), 200)
      : 50;

    let normalizedUrl = "";
    if (typeof url === "string" && url.trim()) {
      normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) {
        res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
        return;
      }
    }

    const whereParts = [];
    const params = [];
    if (normalizedUrl) {
      whereParts.push("sitemap_url = ?");
      params.push(normalizedUrl);
    }
    if (onlyUnread) {
      whereParts.push("is_read = 0");
    }

    const whereSql = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    const db = initScanDb();
    const rows = db.prepare(`
      SELECT
        id,
        sitemap_url AS sitemapUrl,
        run_id AS runId,
        diff_id AS diffId,
        type,
        severity,
        title,
        message,
        payload_json AS payloadJson,
        is_read AS isRead,
        created_at AS createdAt,
        read_at AS readAt
      FROM scan_notifications
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ?
    `).all(...params, max);

    const payload = (rows || []).map((row) => {
      let parsedPayload = null;
      if (row && typeof row.payloadJson === "string" && row.payloadJson.trim()) {
        try {
          parsedPayload = JSON.parse(row.payloadJson);
        } catch (_error) {
          parsedPayload = null;
        }
      }
      return {
        id: row.id,
        sitemapUrl: row.sitemapUrl,
        runId: row.runId,
        diffId: row.diffId,
        type: row.type,
        severity: row.severity,
        title: row.title,
        message: row.message,
        payload: parsedPayload,
        isRead: Boolean(row.isRead),
        createdAt: row.createdAt,
        readAt: row.readAt || null,
      };
    });

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

app.post("/api/scans/notifications/:id/read", requireAuth, async (req, res, next) => {
  try {
    const parsedId = Number(req.params?.id);
    if (!Number.isFinite(parsedId)) {
      res.status(400).json({ message: "Gecerli bir bildirim ID gerekli." });
      return;
    }
    const readAt = new Date().toISOString();
    const db = initScanDb();
    const result = db.prepare(`
      UPDATE scan_notifications
      SET is_read = 1,
          read_at = COALESCE(read_at, ?)
      WHERE id = ?
    `).run(readAt, parsedId);
    if (!result.changes) {
      res.status(404).json({ message: "Bildirim bulunamadi." });
      return;
    }
    res.json({ ok: true, readAt });
  } catch (error) {
    next(error);
  }
});

app.post("/api/scans/notifications/read-all", requireAuth, async (req, res, next) => {
  try {
    const { sitemapUrl } = req.body || {};
    let normalizedUrl = "";
    if (typeof sitemapUrl === "string" && sitemapUrl.trim()) {
      normalizedUrl = normalizeUrl(sitemapUrl);
      if (!normalizedUrl) {
        res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
        return;
      }
    }
    const readAt = new Date().toISOString();
    const db = initScanDb();
    const result = normalizedUrl
      ? db.prepare(`
          UPDATE scan_notifications
          SET is_read = 1,
              read_at = COALESCE(read_at, ?)
          WHERE sitemap_url = ?
            AND is_read = 0
        `).run(readAt, normalizedUrl)
      : db.prepare(`
          UPDATE scan_notifications
          SET is_read = 1,
              read_at = COALESCE(read_at, ?)
          WHERE is_read = 0
        `).run(readAt);
    res.json({ ok: true, updated: Number(result.changes) || 0, readAt });
  } catch (error) {
    next(error);
  }
});

app.post("/api/link-map/jobs", requireAuth, async (req, res, next) => {
  try {
    const { sitemapUrl, maxUrls, force } = req.body || {};
    if (typeof sitemapUrl !== "string" || !sitemapUrl.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(sitemapUrl);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    try {
      await assertPublicUrl(normalizedUrl);
    } catch (error) {
      res.status(400).json({ message: error?.message || "URL engellendi." });
      return;
    }

    const safeForce = force === true;
    const runningJob = [...linkMapJobs.values()].find(
      (job) =>
        job.sitemapUrl === normalizedUrl &&
        (job.status === "queued" || job.status === "running")
    );
    if (runningJob && !safeForce) {
      res.status(202).json(sanitizeLinkMapJob(runningJob));
      return;
    }

    const job = createLinkMapJob({
      sitemapUrl: normalizedUrl,
      maxUrls,
      force: safeForce,
    });
    void runLinkMapJob(job);
    res.status(202).json(sanitizeLinkMapJob(job));
  } catch (error) {
    next(error);
  }
});

app.get("/api/link-map/jobs/:jobId", requireAuth, async (req, res, next) => {
  try {
    const jobId = String(req.params?.jobId || "").trim();
    if (!jobId) {
      res.status(400).json({ message: "Gecerli bir job ID gerekli." });
      return;
    }
    const job = linkMapJobs.get(jobId);
    if (!job) {
      res.status(404).json({ message: "Link map job bulunamadi." });
      return;
    }
    res.json(sanitizeLinkMapJob(job));
  } catch (error) {
    next(error);
  }
});

app.post("/api/link-map/jobs/:jobId/cancel", requireAuth, async (req, res, next) => {
  try {
    const jobId = String(req.params?.jobId || "").trim();
    if (!jobId) {
      res.status(400).json({ message: "Gecerli bir job ID gerekli." });
      return;
    }
    const job = linkMapJobs.get(jobId);
    if (!job) {
      res.status(404).json({ message: "Link map job bulunamadi." });
      return;
    }
    if (job.status === "complete" || job.status === "error" || job.status === "cancelled") {
      res.json(sanitizeLinkMapJob(job));
      return;
    }
    job.cancelRequested = true;
    job.updatedAt = new Date().toISOString();
    if (job.status === "queued") {
      job.status = "cancelled";
      job.error = "Job cancelled";
      job.completedAt = new Date().toISOString();
      job.updatedAt = job.completedAt;
    }
    res.json(sanitizeLinkMapJob(job));
  } catch (error) {
    next(error);
  }
});

app.post("/api/link-map/build", requireAuth, async (req, res, next) => {
  try {
    const { sitemapUrl, maxUrls, force } = req.body || {};
    if (typeof sitemapUrl !== "string" || !sitemapUrl.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(sitemapUrl);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    try {
      await assertPublicUrl(normalizedUrl);
    } catch (error) {
      res.status(400).json({ message: error?.message || "URL engellendi." });
      return;
    }

    const useForce = force === true;
    if (!useForce) {
      const existing = await readSavedLinkMap(normalizedUrl);
      if (existing) {
        res.json({ ...existing, cached: true });
        return;
      }
    }

    const payload = await buildInternalLinkMapForSitemap(normalizedUrl, { maxUrls });
    await writeSavedLinkMap(normalizedUrl, payload);
    res.json({ ...payload, cached: false });
  } catch (error) {
    next(error);
  }
});

app.get("/api/link-map/latest", requireAuth, async (req, res, next) => {
  try {
    const { url } = req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const payload = await readSavedLinkMap(normalizedUrl);
    if (!payload) {
      res.status(404).json({ message: "Kayitli link haritasi bulunamadi." });
      return;
    }
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

app.get("/api/link-map/export", requireAuth, async (req, res, next) => {
  try {
    const { url, format } = req.query || {};
    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      res.status(400).json({ message: "Gecerli bir sitemap URL'i gerekli." });
      return;
    }
    const payload = await readSavedLinkMap(normalizedUrl);
    if (!payload) {
      res.status(404).json({ message: "Kayitli link haritasi bulunamadi." });
      return;
    }

    const safeFormat = String(format || "csv").toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filenameBase = `internal-link-map-${timestamp}`;
    if (safeFormat === "json") {
      res.set("Content-Type", "application/json; charset=utf-8");
      res.set("Content-Disposition", `attachment; filename=\"${filenameBase}.json\"`);
      res.send(JSON.stringify(payload, null, 2));
      return;
    }

    const csv = buildLinkMapCsv(payload);
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename=\"${filenameBase}.csv\"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});
app.post("/api/links/status", requireAuth, async (req, res, next) => {
  try {
    const urls = normalizeLinkStatusUrls(req.body && req.body.urls);
    if (!urls.length) {
      res.json({ results: [] });
      return;
    }

    const results = await Promise.all(
      urls.map((target) =>
        withFetchSlot(() => checkHeadingLinkStatus(target))
      )
    );

    res.json({ results });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, _next) => {
  console.error("Beklenmedik sunucu hatasi:", error);
  res.status(500).json({ message: "Beklenmedik bir hata olustu." });
});

async function start() {
  await ensureDataFile();
  await ensureSettingsFile();
  await ensureCacheDir();
  await ensureCrawlErrorsDir();
  await ensureLinkMapDir();
  await loadAllowedHostsFile({ force: true });
  initializeAllowedHostsWatcher();
  let port;
  try {
    port = await choosePort(preferredPort, { strict: enforcePreferredPort });
  } catch (error) {
    console.error("Port hazirlanirken hata olustu:", error.message || error);
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`SitemapFlow http://localhost:${port} adresinde hazir.`);
    if (port !== preferredPort) {
      console.log(
        `Port ${preferredPort} kullanilamadigi icin ${port} portu secildi.`
      );
    }
  });
  serverInstance = server;
  server.on("connection", (socket) => {
    activeSockets.add(socket);
    socket.on("close", () => {
      activeSockets.delete(socket);
    });
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} artik kullanilamiyor. Lutfen farkli bir PORT degeri belirleyin.`
      );
    } else if (error.code === "EACCES") {
      console.error(
        `Port ${port} icin yeterli yetki yok. Daha yuksek numarali bir port deneyin.`
      );
    } else {
      console.error("Sunucu portunda beklenmedik hata:", error);
    }
    process.exit(1);
  });

  if (CACHE_REFRESH_INTERVAL_MS > 0) {
    refreshAllSitemaps({ force: false }).catch((error) => {
      console.warn("Cache warmup failed:", error.message || error);
    });
    refreshTimer = setInterval(() => {
      refreshAllSitemaps({ force: false }).catch((error) => {
        console.warn("Cache refresh failed:", error.message || error);
      });
    }, CACHE_REFRESH_INTERVAL_MS);
    if (refreshTimer && typeof refreshTimer.unref === "function") {
      refreshTimer.unref();
    }
  }

  if (CACHE_PURGE_INTERVAL_MS > 0 && CACHE_MAX_AGE_MS > 0) {
    purgeCache({ maxAgeMs: CACHE_MAX_AGE_MS }).catch((error) => {
      console.warn("Cache purge failed:", error.message || error);
    });
    purgeTimer = setInterval(() => {
      purgeCache({ maxAgeMs: CACHE_MAX_AGE_MS }).catch((error) => {
        console.warn("Cache purge failed:", error.message || error);
      });
    }, CACHE_PURGE_INTERVAL_MS);
    if (purgeTimer && typeof purgeTimer.unref === "function") {
      purgeTimer.unref();
    }
  }

  if (CRON_SCHEDULE) {
    cronTask = cron.schedule(CRON_SCHEDULE, () => {
      runScheduledHealthChecks().catch((error) => {
        console.warn("Scheduled health check failed:", error.message || error);
      });
      runScheduledCrawlErrors().catch((error) => {
        console.warn("Scheduled crawl errors failed:", error.message || error);
      });
    });
    console.log(`Cron schedule aktif: ${CRON_SCHEDULE}`);
  }

  // Browser cleanup
  const cleanup = async () => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    if (purgeTimer) {
      clearInterval(purgeTimer);
    }
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    if (cronTask) {
      cronTask.stop();
    }
    flushLogger();
    if (serverInstance) {
      const shutdownTimeoutMs = 10000;
      const forceTimer = setTimeout(() => {
        for (const socket of activeSockets) {
          socket.destroy();
        }
      }, shutdownTimeoutMs);
      await new Promise((resolve) => {
        serverInstance.close(() => resolve());
      });
      clearTimeout(forceTimer);
    }
    if (browserInstance && browserInstance.isConnected()) {
      console.log("Browser kapatiliyor...");
      await browserInstance.close();
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

start().catch((error) => {
  console.error("Sunucu baslatilamadi:", error);
  process.exit(1);
});













